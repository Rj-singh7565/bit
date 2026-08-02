import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "src/lib/db";
import { getCurrentUser } from "src/actions/auth";
import { getCMSContent } from "src/actions/cms";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import AdminConsole from "src/components/dashboard/AdminConsole";
import Chatbot from "src/components/ai/Chatbot";

export const revalidate = 0; // Dynamic server component

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Load CMS elements
  const heroData = await getCMSContent("hero", {
    title: "BUDDHA INSTITUTE OF TECHNOLOGY",
    subtitle: "Affiliated to AKTU Lucknow & Approved by AICTE New Delhi",
    slogan: "Empowering Futures, Inspiring Minds since 2009",
    buttonText: "Apply Now for 2026-27"
  });

  const statsData = await getCMSContent("stats", {
    students: "3,500+",
    faculty: "150+",
    placements: "88%",
    packages: "12 LPA",
    area: "20 Acres",
    labs: "45+"
  });

  // Load all user roster
  const usersList = await prisma.user.findMany({
    orderBy: { role: "asc" }
  });

  // Load security/system audit logs
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      
      {/* Title Header */}
      <section className="bg-slate-900 text-white py-6 px-4 md:px-8 border-b-2 border-bit-red no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="text-[10px] bg-bit-red text-white uppercase tracking-widest font-bold px-2 py-0.5 rounded">
              Director Office Access
            </span>
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-wide mt-1">
              Admin Portal & CMS Manager Desk
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-300">
            System Administrator: {user.name}
          </span>
        </div>
      </section>

      {/* Main admin dashboard workspace */}
      <AdminConsole
        adminUser={user}
        heroData={heroData}
        statsData={statsData}
        usersList={usersList}
        auditLogs={auditLogs}
      />

      <Chatbot />
      <Footer />
    </div>
  );
}
