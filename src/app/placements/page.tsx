import React from "react";
import Link from "next/link";
import { Award, Briefcase, Calendar, CheckCircle2, ChevronRight, HelpCircle, GraduationCap } from "lucide-react";
import { prisma } from "src/lib/db";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";

export const dynamic = "force-dynamic";

export default async function PlacementsPage() {
  const user = await getCurrentUser();
  const jobs = await prisma.placementJob.findMany({
    orderBy: { deadline: "asc" }
  });

  const placementStats = [
    { label: "Overall Placement Rate", value: "88%" },
    { label: "Highest Package (2025 Batch)", value: "12.0 LPA" },
    { label: "Average CTC Offered", value: "3.8 LPA" },
    { label: "Total Recruiter Partners", value: "200+" },
    { label: "Eligible Students Placed", value: "340+ Candidates" }
  ];

  return (
    <>
      <Header user={user} />
      
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-bit-red relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-bit-red-light uppercase tracking-widest bg-bit-red/20 px-3 py-1 rounded-full">
            Training & Placement Cell
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide mt-3">
            Placement Statistics & Recruitment Drives
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Empowering students with industry readiness, technical expertise, and career avenues in leading Indian and global companies.
          </p>
        </div>
      </section>

      {/* Stats Board */}
      <section className="py-12 bg-bit-blue text-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {placementStats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-md backdrop-blur-sm shadow hover:bg-white/10 transition">
              <span className="font-serif text-2xl md:text-3xl font-extrabold block text-bit-red-light">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-2 block leading-snug">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Jobs & Openings Listing */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-bold text-bit-red uppercase tracking-widest">
              Live Recruitment
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-bit-blue mt-1">
              Active Corporate Drives (2026 Batch)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-bit-blue bg-bit-blue-light px-2.5 py-0.5 rounded">
                      ₹{job.packageLpa} LPA Package
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Deadline: {new Date(job.deadline).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mt-3 leading-snug">
                    {job.companyName}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">
                    Role: {job.role}
                  </p>
                  
                  <div className="h-px bg-slate-100 my-3"></div>
                  
                  <p className="text-slate-600 text-xs leading-relaxed mt-2 line-clamp-3">
                    {job.jobDesc}
                  </p>

                  <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Eligibility Criteria:</span>
                    <span className="bg-slate-100 px-2 py-1 rounded self-start mt-0.5 font-medium">
                      {job.eligibility}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {user ? (
                    <Link 
                      href="/dashboard/student"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-bit-blue hover:bg-bit-blue-dark text-white py-2 rounded text-xs font-bold shadow transition"
                    >
                      Apply via Student Portal <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link 
                      href="/login"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded text-xs font-bold transition"
                    >
                      Login to Apply <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Cell Desk */}
      <section className="py-16 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-xs font-bold text-bit-red uppercase tracking-widest">
              Training and Placement Cell
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-bit-blue mt-1">
              Fostering Professional Competence
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-4 leading-relaxed">
              The Training & Placement (T&P) Cell at Buddha Institute of Technology acts as a vital bridge between students and recruiters. T&P conducts year-round personality development, technical training workshops, mock interviews, and coding tests.
            </p>
            
            <div className="flex flex-col gap-3 mt-6 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-bit-blue shrink-0" />
                <span>Pre-Placement Training programs in Aptitude & Soft Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-bit-blue shrink-0" />
                <span>Coding practice sessions for TCS Ninja, Wipro, and HCL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-bit-blue shrink-0" />
                <span>Mandatory Summer Industrial Internships in core branches</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-center">
            <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide">
              Hiring Queries & Industry Contact
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For campus placements schedules, recruiter queries, or technical collaborations, please write or call the Placement Coordinator:
            </p>
            <div className="mt-4 flex flex-col gap-3 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Placement HOD</span>
                <span className="text-slate-800 text-sm">Shri Rahul Singh</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                <span className="text-bit-blue underline">placements@bit.ac.in, rahul.singh@bit.ac.in</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Phone</span>
                <span className="text-slate-800">+91-9935100263</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
      <Footer />
    </>
  );
}
