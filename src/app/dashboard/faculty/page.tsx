import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "src/lib/db";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import FacultyConsole from "src/components/dashboard/FacultyConsole";
import Chatbot from "src/components/ai/Chatbot";

export const revalidate = 0; // Dynamic server component

export default async function FacultyDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "FACULTY") {
    redirect("/login");
  }

  const profile = await prisma.facultyProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded p-6 shadow-md text-center max-w-sm">
          <h2 className="font-bold text-bit-red text-lg">Faculty Profile Error</h2>
          <p className="text-xs text-slate-500 mt-2">
            Your faculty records could not be retrieved. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  // Load all students under faculty HOD department to enable grading & attendance uploads
  const studentsList = await prisma.studentProfile.findMany({
    where: { department: profile.department },
    include: { user: true },
    orderBy: { enrollmentNo: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      
      {/* Title Header */}
      <section className="bg-slate-900 text-white py-6 px-4 md:px-8 border-b-2 border-bit-red no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="text-[10px] bg-bit-red text-white uppercase tracking-widest font-bold px-2 py-0.5 rounded">
              Academic Session 2026-27
            </span>
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-wide mt-1">
              Faculty ERP Management Console
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-300">
            Welcome back, {user.name}
          </span>
        </div>
      </section>

      {/* Main dashboard content */}
      <FacultyConsole
        facultyUser={user}
        studentsList={studentsList}
      />

      <Chatbot />
      <Footer />
    </div>
  );
}
