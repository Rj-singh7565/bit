"use server";

import { prisma } from "src/lib/db";
import { headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// #4 FIX: Allowed MIME types for marksheet uploads
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".pdf"]);
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB server-side enforcement

// #15 FIX: Helper to extract real client IP
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

// #4 FIX: Validate file type using both MIME type and extension
function validateUploadedFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File "${file.name}" exceeds the 2MB size limit.` };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { valid: false, error: `File "${file.name}" has an unsupported type (${file.type}). Only JPG, PNG, and PDF are allowed.` };
  }

  // Check extension
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File "${file.name}" has an unsupported extension (${ext}). Only .jpg, .jpeg, .png, .pdf are allowed.` };
  }

  return { valid: true };
}

export async function submitAdmissionForm(formData: FormData) {
  try {
    const course = formData.get("course") as string;
    const fullName = formData.get("full_name") as string;
    const gender = formData.get("gender") as string;
    const fatherName = formData.get("father_name") as string;
    const dob = formData.get("dob") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const marks10 = formData.get("marks_10") as string;
    const marks12 = formData.get("marks_12") as string;

    if (!course || !fullName || !gender || !fatherName || !dob || !email || !phone || !marks10 || !marks12) {
      return { error: "Please fill in all required fields." };
    }

    // Basic input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Please provide a valid email address." };
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return { error: "Please provide a valid 10-digit Indian phone number." };
    }

    const marksheet10 = formData.get("marksheet_10") as File | null;
    const marksheet12 = formData.get("marksheet_12") as File | null;

    // #4 FIX: Validate files server-side before saving
    if (!marksheet10 || marksheet10.size === 0) {
      return { error: "10th Marksheet is required." };
    }
    const validation10 = validateUploadedFile(marksheet10);
    if (!validation10.valid) {
      return { error: validation10.error };
    }

    if (!marksheet12 || marksheet12.size === 0) {
      return { error: "12th Marksheet is required." };
    }
    const validation12 = validateUploadedFile(marksheet12);
    if (!validation12.valid) {
      return { error: validation12.error };
    }

    // #4 FIX: Store uploads in a private directory (not public/)
    // Files are served through an authenticated API route if needed
    const uploadDir = path.join(process.cwd(), "private_uploads", "admissions");
    await fs.mkdir(uploadDir, { recursive: true });

    let marksheet10Path = "";
    let marksheet12Path = "";

    // Save 10th marksheet with a randomized filename to prevent enumeration
    const bytes10 = await marksheet10.arrayBuffer();
    const buffer10 = Buffer.from(bytes10);
    const ext10 = path.extname(marksheet10.name).toLowerCase();
    const filename10 = `10th-${crypto.randomUUID()}${ext10}`;
    const filepath10 = path.join(uploadDir, filename10);
    await fs.writeFile(filepath10, buffer10);
    marksheet10Path = `private_uploads/admissions/${filename10}`;

    // Save 12th marksheet
    const bytes12 = await marksheet12.arrayBuffer();
    const buffer12 = Buffer.from(bytes12);
    const ext12 = path.extname(marksheet12.name).toLowerCase();
    const filename12 = `12th-${crypto.randomUUID()}${ext12}`;
    const filepath12 = path.join(uploadDir, filename12);
    await fs.writeFile(filepath12, buffer12);
    marksheet12Path = `private_uploads/admissions/${filename12}`;

    // #12 FIX: Generate cryptographically secure reference numbers
    const applicationNo = `BIT-2026-ADM-${crypto.randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase()}`;
    const transactionId = `TXN-${crypto.randomUUID().replace(/-/g, "").substring(0, 12).toUpperCase()}`;
    
    // Determine fee amount
    const diplomaOrArts = ["B.A.", "B.Com", "BJMC", "BCA", "BBA", "D.opt", "D.XRT", "D.pharma", "B.Sc (Biology)", "B.Sc (Math)", "Electrician", "Fitter", "B.A. LLB", "L.L.B."];
    const isDiplomaStream = course.toLowerCase().startsWith("diploma");
    const isFee500 = diplomaOrArts.includes(course) || isDiplomaStream;
    const feeAmount = isFee500 ? 500 : 1000;

    // Log this submission to the AuditLog database
    const clientIp = await getClientIp();
    await prisma.auditLog.create({
      data: {
        action: "ADMISSION_FORM_SUBMISSION",
        details: JSON.stringify({
          applicationNo,
          transactionId,
          course,
          fee: feeAmount,
          fullName,
          email,
          // Phone intentionally omitted from log to reduce PII exposure
          marksheet10Path,
          marksheet12Path,
          submittedAt: new Date().toISOString()
        }),
        ipAddress: clientIp
      }
    });

    return {
      success: true,
      applicationNo,
      transactionId,
      fee: feeAmount,
      course,
      fullName,
      fatherName,
      email,
      phone,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };
  } catch (error: any) {
    console.error("Admission submission error:", error);
    // #14 FIX: Generic error message
    return { error: "Something went wrong while submitting the application. Please try again." };
  }
}
