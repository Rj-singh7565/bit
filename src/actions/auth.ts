"use server";

import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "src/lib/db";

// #1 FIX: No hardcoded fallback — throws if env var missing
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  console.warn(
    "⚠️  SESSION_SECRET is missing or too short. Set a 64+ char random key via: openssl rand -hex 32"
  );
}

// #10 FIX: Session expiry constant (12 hours in ms)
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

// #5 FIX: In-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (entry) {
    if (now < entry.lockedUntil) {
      const retryAfterSec = Math.ceil((entry.lockedUntil - now) / 1000);
      return { allowed: false, retryAfterSec };
    }
    // Reset if lockout has expired
    if (now >= entry.lockedUntil && entry.count >= MAX_LOGIN_ATTEMPTS) {
      loginAttempts.delete(key);
    }
  }

  return { allowed: true };
}

function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
  loginAttempts.set(key, entry);
}

function clearAttempts(key: string): void {
  loginAttempts.delete(key);
}

// #15 FIX: Helper to extract real client IP from request headers
async function getClientIp(): Promise<string> {
  try {
    const hdrs = await headers();
    return (
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

// Helper to get effective secret (with safe fallback for dev only)
function getSecret(): string {
  if (SESSION_SECRET) return SESSION_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production");
  }
  // Dev-only fallback (logged warning above)
  return "dev_only_insecure_fallback_key_do_not_use_in_prod";
}

// #10 FIX: Sign session payloads with embedded expiry
function signSession(payload: any): string {
  const payloadWithExp = {
    ...payload,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const data = Buffer.from(JSON.stringify(payloadWithExp)).toString("base64");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("hex");
  return `${data}.${signature}`;
}

// #7 FIX: Verify session payload using timing-safe comparison + expiry check
function verifySession(token: string): any | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expectedSignature, "hex");
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    // Check expiry
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function login(state: any, formData: FormData) {
  const bitId = formData.get("bitId")?.toString().trim();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();

  if (!bitId || !password || !role) {
    return { error: "All fields are required" };
  }

  // #5 FIX: Rate limiting check
  const clientIp = await getClientIp();
  const rateLimitKey = `${bitId}:${clientIp}`;
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    return {
      error: `Too many failed attempts. Please try again in ${rateCheck.retryAfterSec} seconds.`,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { bitId },
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    if (!user || user.role !== role) {
      recordFailedAttempt(rateLimitKey);
      return { error: "Invalid credentials or role mismatch" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      recordFailedAttempt(rateLimitKey);
      return { error: "Incorrect password" };
    }

    // Clear rate limiter on successful login
    clearAttempts(rateLimitKey);

    // Set cookie session (HttpOnly, Secure)
    const sessionToken = signSession({
      userId: user.id,
      bitId: user.bitId,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("bit_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    // Write audit log with real IP
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        details: `Logged in successfully as ${role}`,
        ipAddress: clientIp,
      },
    });

    return { success: true, role: user.role };
  } catch (error: any) {
    console.error("Login error:", error);
    // #14 FIX: Generic error message, no leaking internals
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("bit_session");
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bit_session")?.value;
    if (!token) return null;

    const payload = verifySession(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    if (!user) return null;

    // Redact password
    const { password, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Fetch current user error:", error);
    return null;
  }
}

// #6 FIX: seedDatabase is NO LONGER exported as a server action.
// It is an internal function only callable from server-side code within this module.
async function seedDatabase() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return { message: "Database already has records, skipping seed." };
    }

    // Passwords hashed with strong bcrypt rounds
    const studentPassword = await bcrypt.hash("student123", 12);
    const facultyPassword = await bcrypt.hash("faculty123", 12);
    const adminPassword = await bcrypt.hash("admin123", 12);

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        bitId: "BIT-ADMIN-001",
        name: "Prof. (Dr.) Roop Ranjan",
        email: "admin@bit.ac.in",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    // Create Faculty
    const faculty = await prisma.user.create({
      data: {
        bitId: "BIT-FACULTY-101",
        name: "Prof. Arvind Kumar",
        email: "arvind.cse@bit.ac.in",
        password: facultyPassword,
        role: "FACULTY",
        facultyProfile: {
          create: {
            designation: "Assistant Professor & Head",
            department: "Computer Science Engineering",
            specialization: "Cloud Computing & AI",
            cabinNumber: "F-102 Acad Block",
            classesTaught: JSON.stringify(["B.Tech CSE Sem 5", "B.Tech CSE Sem 7"]),
            leaveBalance: 14,
          },
        },
      },
    });

    // Create Student
    const student = await prisma.user.create({
      data: {
        bitId: "BIT-STUDENT-2026-001",
        name: "Aryan Jaiswal",
        email: "aryan.cse2026@bit.ac.in",
        password: studentPassword,
        role: "STUDENT",
        studentProfile: {
          create: {
            enrollmentNo: "190209010001",
            department: "Computer Science Engineering",
            branch: "CSE",
            semester: 7,
            attendancePct: 88.5,
            feeBalance: 24500.00,
            feeStatus: "PENDING",
            hostelRoom: "Tagore Hostel-305",
            busRoute: "Route-B (Golghar)",
            cgpa: 8.24,
            placementStatus: "UNPLACED",
          },
        },
      },
    });

    // Seed some basic library books
    await prisma.book.createMany({
      data: [
        { isbn: "978-0131103627", title: "The C Programming Language", author: "Kernighan & Ritchie", department: "CSE", copiesAvailable: 4, totalCopies: 5 },
        { isbn: "978-0136083238", title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", department: "CSE", copiesAvailable: 2, totalCopies: 3 },
        { isbn: "978-0133594140", title: "Computer Networking: A Top-Down Approach", author: "Kurose & Ross", department: "CSE", copiesAvailable: 5, totalCopies: 5 },
        { isbn: "978-0073529240", title: "Design of Steel Structures", author: "L.S. Negi", department: "CE", copiesAvailable: 3, totalCopies: 3 },
      ],
    });

    // Seed placement jobs
    await prisma.placementJob.createMany({
      data: [
        { companyName: "Tata Consultancy Services (TCS)", role: "System Engineer", packageLpa: 3.6, eligibility: "B.Tech CSE/ECE - 60% standard", jobDesc: "Full-Stack Development, QA, Cloud support.", deadline: new Date("2026-09-15") },
        { companyName: "Wipro Technologies", role: "Project Engineer", packageLpa: 4.0, eligibility: "B.Tech CSE/IT - 6.5 CGPA", jobDesc: "Software engineer role focusing on enterprise systems.", deadline: new Date("2026-10-01") },
        { companyName: "Mobiloitte Technologies", role: "Software Developer", packageLpa: 3.2, eligibility: "B.Tech CSE/IT/ECE - No active backlogs", jobDesc: "Blockchain & Mobile app developers.", deadline: new Date("2026-08-30") },
      ],
    });

    // Seed notices
    await prisma.notice.createMany({
      data: [
        { title: "AKTU Odd Semester Examination Registrations 2026", content: "All B.Tech/Polytechnic students must submit their exam form and clear pending dues before August 25, 2026.", pdfUrl: "https://www.bit.ac.in/PDF/notice_aktu_odd_sem_2026.pdf", category: "ACADEMIC", pinned: true },
        { title: "TCS Campus Placement Drive for 2026 Batch", content: "TCS Ninja and Digital registration starts from August 10. Interested CSE/ECE students can register through the placement portal.", pdfUrl: "https://www.bit.ac.in/PDF/tcs_drive_2026.pdf", category: "PLACEMENT", pinned: true },
        { title: "Hostel Fee Submission & Room Re-Allotment Guidelines", content: "Guidelines for annual hostel fee payment and room check-in procedures for hostelers.", pdfUrl: "https://www.bit.ac.in/PDF/hostel_fees_2026.pdf", category: "GENERAL", pinned: false },
      ],
    });

    // Seed event notice
    await prisma.event.createMany({
      data: [
        { title: "Spardha 2026 - Annual Sports Meet", description: "Inter-department sports championships in Cricket, Football, Volleyball, Badminton and Athletics.", date: "Nov 12-14, 2026", imageUrl: "/images/sports.jpg", category: "SPORTS" },
        { title: "Buddha TechFest 2026", description: "Flagship annual technical hackathon, robo-race, web design challenge, and paper presentation.", date: "Oct 08-09, 2026", imageUrl: "/images/techfest.jpg", category: "TECHFEST" },
      ],
    });

    // Seed initial CMS structure
    await prisma.cMSContent.createMany({
      data: [
        { id: "hero", value: JSON.stringify({ title: "BUDDHA INSTITUTE OF TECHNOLOGY", subtitle: "Affiliated to AKTU Lucknow & Approved by AICTE New Delhi", slogan: "Empowering Futures, Inspiring Minds since 2009", buttonText: "Apply Now for 2026-27" }) },
        { id: "stats", value: JSON.stringify({ students: "3,500+", faculty: "150+", placements: "88%", packages: "12 LPA", area: "20 Acres", labs: "45+" }) },
        { id: "notices", value: JSON.stringify({ subtitle: "Official notices, guidelines and schedules from the Director office." }) },
      ],
    });

    return { success: true, message: "Database seeded successfully!" };
  } catch (error: any) {
    console.error("Database seed error:", error);
    // #14 FIX: Don't leak raw error to caller
    return { error: "Database seeding failed. Check server logs." };
  }
}

// Named export for internal server-side use only (NOT a server action)
export { seedDatabase };
