"use server";

import { prisma } from "src/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { getCurrentUser } from "src/actions/auth";

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

// --- STUDENT ACTIONS ---

// #3 FIX: Every action now verifies session + ownership
export async function payFees(studentId: string, amount: number, category: string, paymentMethod: string) {
  // Auth check
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Unauthorized: You must be logged in as a student." };
  }
  if (user.studentProfile?.id !== studentId) {
    return { error: "Access denied: You can only pay your own fees." };
  }

  if (!studentId || amount <= 0 || !category) {
    return { error: "Invalid payment details" };
  }

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!student) return { error: "Student profile not found" };

    // #11 FIX: Cryptographically secure transaction ID
    const transactionId = "TXN-" + crypto.randomUUID().replace(/-/g, "").substring(0, 12).toUpperCase();

    // Create Payment Record
    const payment = await prisma.feePayment.create({
      data: {
        studentId,
        amount,
        category,
        status: "PAID",
        transactionId,
        paymentMethod,
        receiptUrl: `/receipts/${transactionId}.pdf`,
      },
    });

    // Update student balance
    const newBalance = Math.max(0, student.feeBalance - amount);
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        feeBalance: newBalance,
        feeStatus: newBalance === 0 ? "PAID" : "PENDING",
      },
    });

    // Create Audit Log with real IP
    const clientIp = await getClientIp();
    await prisma.auditLog.create({
      data: {
        userId: student.userId,
        action: "FEE_PAYMENT",
        details: `Paid ₹${amount} for ${category}. Txn ID: ${transactionId}`,
        ipAddress: clientIp,
      },
    });

    revalidatePath("/dashboard/student");
    return { success: true, payment };
  } catch (error: any) {
    console.error("Payment error:", error);
    // #14 FIX: Generic error message
    return { error: "Payment processing failed. Please try again." };
  }
}

export async function applyForJob(studentId: string, jobId: string, resumeUrl: string) {
  // Auth check
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Unauthorized: You must be logged in as a student." };
  }
  if (user.studentProfile?.id !== studentId) {
    return { error: "Access denied: You can only apply with your own profile." };
  }

  if (!studentId || !jobId || !resumeUrl) {
    return { error: "All application inputs are required" };
  }

  try {
    // Check if already applied
    const existing = await prisma.placementApplication.findFirst({
      where: { jobId, studentId },
    });

    if (existing) return { error: "You have already applied to this company" };

    const application = await prisma.placementApplication.create({
      data: {
        jobId,
        studentId,
        status: "APPLIED",
        resumeUrl,
      },
    });

    // Update student profile status
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: { placementStatus: "APPLIED" },
    });

    // Audit log with real IP
    const clientIp = await getClientIp();
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PLACEMENT_APPLICATION",
        details: `Applied for Job ID: ${jobId}`,
        ipAddress: clientIp,
      },
    });

    revalidatePath("/dashboard/student");
    return { success: true, application };
  } catch (error: any) {
    console.error("Job application error:", error);
    return { error: "Application submission failed. Please try again." };
  }
}

export async function issueLibraryBook(studentId: string, bookId: string) {
  // Auth check
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Unauthorized: You must be logged in as a student." };
  }
  if (user.studentProfile?.id !== studentId) {
    return { error: "Access denied: You can only check out books for yourself." };
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.copiesAvailable <= 0) {
      return { error: "Book is currently unavailable" };
    }

    // Check if already issued
    const activeIssue = await prisma.bookIssue.findFirst({
      where: { bookId, studentId, returnDate: null },
    });
    if (activeIssue) {
      return { error: "You have already checked out this book" };
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days standard check-out

    const issue = await prisma.bookIssue.create({
      data: {
        bookId,
        studentId,
        dueDate,
      },
    });

    // Decrement availability
    await prisma.book.update({
      where: { id: bookId },
      data: { copiesAvailable: book.copiesAvailable - 1 },
    });

    revalidatePath("/dashboard/student");
    return { success: true, issue };
  } catch (error: any) {
    console.error("Library checkout error:", error);
    return { error: "Library checkout failed. Please try again." };
  }
}

export async function returnLibraryBook(issueId: string) {
  // Auth check — student returning their own book
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    return { error: "Unauthorized: You must be logged in as a student." };
  }

  try {
    const issue = await prisma.bookIssue.findUnique({ where: { id: issueId } });
    if (!issue || issue.returnDate) {
      return { error: "Active checkout not found" };
    }

    // Verify ownership: the issue must belong to this student
    if (issue.studentId !== user.studentProfile?.id) {
      return { error: "Access denied: This checkout does not belong to you." };
    }

    // Calculate fine (e.g. ₹5 per day late)
    const today = new Date();
    let fine = 0;
    if (today > new Date(issue.dueDate)) {
      const diffTime = Math.abs(today.getTime() - new Date(issue.dueDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 5;
    }

    // Update issue
    await prisma.bookIssue.update({
      where: { id: issueId },
      data: {
        returnDate: today,
        fineAmount: fine,
      },
    });

    // Increment book copies
    await prisma.book.update({
      where: { id: issue.bookId },
      data: { copiesAvailable: { increment: 1 } },
    });

    revalidatePath("/dashboard/student");
    return { success: true, fineCharged: fine };
  } catch (error: any) {
    console.error("Book return error:", error);
    return { error: "Book return failed. Please try again." };
  }
}


// --- FACULTY ACTIONS ---

export async function recordAttendance(facultyId: string, department: string, semester: number, subjectName: string, attendanceData: { studentId: string; present: boolean }[]) {
  // Auth check — only FACULTY can record attendance
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") {
    return { error: "Unauthorized: Only faculty members can record attendance." };
  }
  if (user.facultyProfile?.id !== facultyId) {
    return { error: "Access denied: Faculty ID mismatch." };
  }

  try {
    const faculty = await prisma.facultyProfile.findUnique({ where: { id: facultyId } });
    if (!faculty) return { error: "Faculty profile not found" };

    // Simulate updating student attendance percentages
    for (const record of attendanceData) {
      const student = await prisma.studentProfile.findUnique({ where: { id: record.studentId } });
      if (student) {
        // Adjust attendance percentage slightly
        const currentAtt = student.attendancePct;
        const newAtt = record.present 
          ? Math.min(100, currentAtt + 0.5) 
          : Math.max(0, currentAtt - 0.75);

        await prisma.studentProfile.update({
          where: { id: record.studentId },
          data: { attendancePct: parseFloat(newAtt.toFixed(2)) },
        });
      }
    }

    const clientIp = await getClientIp();
    await prisma.auditLog.create({
      data: {
        userId: faculty.userId,
        action: "ATTENDANCE_RECORDED",
        details: `Recorded attendance for ${subjectName} (Sem ${semester}) - ${attendanceData.length} students.`,
        ipAddress: clientIp,
      },
    });

    revalidatePath("/dashboard/faculty");
    return { success: true };
  } catch (error: any) {
    console.error("Attendance recording error:", error);
    return { error: "Attendance recording failed. Please try again." };
  }
}

export async function uploadInternalMarks(facultyId: string, studentId: string, subjectCode: string, subjectName: string, marks: number, semester: number) {
  // Auth check — only FACULTY can upload marks
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") {
    return { error: "Unauthorized: Only faculty members can upload marks." };
  }
  if (user.facultyProfile?.id !== facultyId) {
    return { error: "Access denied: Faculty ID mismatch." };
  }

  try {
    const faculty = await prisma.facultyProfile.findUnique({ where: { id: facultyId } });
    if (!faculty) return { error: "Faculty profile not found" };

    // Check if grade already exists
    const existing = await prisma.semesterGrade.findFirst({
      where: { studentId, subjectCode, semester },
    });

    if (existing) {
      await prisma.semesterGrade.update({
        where: { id: existing.id },
        data: {
          internalMarks: marks,
          totalMarks: marks + (existing.externalMarks || 0),
        },
      });
    } else {
      // Calculate grade code
      const grade = marks >= 45 ? "A+" : marks >= 40 ? "A" : marks >= 35 ? "B" : "C";
      await prisma.semesterGrade.create({
        data: {
          studentId,
          semester,
          subjectCode,
          subjectName,
          internalMarks: marks,
          externalMarks: 50, // simulated board marks
          totalMarks: marks + 50,
          grade,
        },
      });
    }

    revalidatePath("/dashboard/faculty");
    return { success: true };
  } catch (error: any) {
    console.error("Upload internal marks error:", error);
    return { error: "Marks upload failed. Please try again." };
  }
}
