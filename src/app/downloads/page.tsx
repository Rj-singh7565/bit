import React from "react";
import { Download, FileText, Bookmark, Calendar, ClipboardCheck } from "lucide-react";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const user = await getCurrentUser();

  const files = [
    { title: "AKTU Odd Semester Examination Form 2026", size: "324 KB", category: "Examinations", icon: FileText, url: "https://www.bit.ac.in/PDF/notice_aktu_odd_sem_2026.pdf" },
    { title: "Anti-Ragging Compliance Affidavit Form 2026", size: "142 KB", category: "Student Welfare", icon: ClipboardCheck, url: "https://www.bit.ac.in/PDF/hostel_fees_2026.pdf" },
    { title: "BIT Placement Policy Guidelines & Criteria Brochure", size: "1.2 MB", category: "Placements", icon: Bookmark, url: "https://www.bit.ac.in/PDF/tcs_drive_2026.pdf" },
    { title: "B.Tech CSE Semester 7 Syllabus structure (AKTU)", size: "412 KB", category: "Academics", icon: Calendar, url: "https://www.bit.ac.in/PDF/syllabus_cse_7sem.pdf" },
    { title: "Hostel Fee Payment & Room Allocation Policy Guide", size: "288 KB", category: "Hostel", icon: FileText, url: "https://www.bit.ac.in/PDF/hostel_fees_2026.pdf" }
  ];

  return (
    <>
      <Header user={user} />
      
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-bit-red relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-bit-red-light uppercase tracking-widest bg-bit-red/20 px-3 py-1 rounded-full">
            Student Corner
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide mt-3">
            Academic Forms & Downloads
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Get quick access to official registration forms, syllabi structures, university mandates, and cell brochures.
          </p>
        </div>
      </section>

      {/* Files List */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-lg p-6 md:p-8">
          <div className="flex flex-col border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Circular Downloads</span>
            <h2 className="font-serif text-xl font-bold text-bit-blue mt-1">Registrar Formats</h2>
          </div>

          <div className="flex flex-col gap-4">
            {files.map((file, i) => {
              const Icon = file.icon;
              return (
                <div 
                  key={i}
                  className="p-4 border border-slate-100 bg-slate-50/50 hover:bg-bit-blue-light/10 hover:border-bit-blue/20 rounded-md transition duration-300 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-bit-blue/15 text-bit-blue p-2.5 rounded shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{file.category}</span>
                      <h3 className="font-semibold text-slate-700 text-sm md:text-base mt-0.5">{file.title}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">File Size: {file.size} &middot; PDF Format</span>
                    </div>
                  </div>
                  
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-bit-blue hover:bg-bit-blue-dark text-white px-3.5 py-2 rounded text-xs font-bold shadow transition shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Chatbot />
      <Footer />
    </>
  );
}
