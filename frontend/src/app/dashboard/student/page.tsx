import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "src/lib/db";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import StudentConsole from "src/components/dashboard/StudentConsole";
import Chatbot from "src/components/ai/Chatbot";

export const revalidate = 0; // Dynamic server component

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    redirect("/login");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded p-6 shadow-md text-center max-w-sm">
          <h2 className="font-bold text-bit-red text-lg">ERP Initialization Pending</h2>
          <p className="text-xs text-slate-500 mt-2">
            Your student profile has not been initialized. Please contact the administrator to assign your enrollment code.
          </p>
        </div>
      </div>
    );
  }

  // Load ledger receipts
  const payments = await prisma.feePayment.findMany({
    where: { studentId: profile.id },
    orderBy: { paidAt: "desc" },
  });

  // Load subject grades
  const grades = await prisma.semesterGrade.findMany({
    where: { studentId: profile.id },
    orderBy: { subjectCode: "asc" },
  });

  // Load library book catalog
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
  });

  // Load active checked out books
  const issuedBooks = await prisma.bookIssue.findMany({
    where: { studentId: profile.id, returnDate: null },
    include: { book: true },
    orderBy: { dueDate: "asc" },
  });

  // Load placement vacancies
  const placementJobs = await prisma.placementJob.findMany({
    orderBy: { deadline: "asc" },
  });

  // Load student submitted placements applications
  const applications = await prisma.placementApplication.findMany({
    where: { studentId: profile.id },
    include: { job: true },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      
      {/* Mini Title Section */}
      <section className="bg-bit-blue text-white py-6 px-4 md:px-8 border-b-2 border-bit-red no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="text-[10px] bg-bit-red text-white uppercase tracking-widest font-bold px-2 py-0.5 rounded">
              Academic Session 2026-27
            </span>
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-wide mt-1">
              Student Self Service & ERP Dashboard
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-300">
            Welcome back, {user.name}
          </span>
        </div>
      </section>

      {/* Main interactive panel */}
      <StudentConsole
        studentUser={user}
        payments={payments}
        grades={grades}
        books={books}
        issuedBooks={issuedBooks}
        placementJobs={placementJobs}
        applications={applications}
      />

      <Chatbot />
      <Footer />
    </div>
  );
}
