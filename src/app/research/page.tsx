import React from "react";
import { BookOpen, Award, FileText, ChevronRight, GraduationCap } from "lucide-react";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const user = await getCurrentUser();

  const papers = [
    { title: "Deep Learning Approaches for Dynamic Grid Load Allocation in Smart Grids", authors: "Arvind Kumar, S. K. Srivastava", journal: "IEEE Transactions on Smart Grid, 2025", link: "#" },
    { title: "An Ultra-low Power VLSI Architecture for Real-Time Electrocardiogram (ECG) Detection", authors: "Dr. S. C. Gupta, Vineet Pathak", journal: "Journal of Low Power Electronics and Applications, 2024", link: "#" },
    { title: "Comparative Thermal Optimization of Double Pass Solar Air Heaters using Artificial Roughness", authors: "S. K. Dwivedi, Rajesh Shukla", journal: "Elsevier Renewable Energy Letters, 2025", link: "#" },
    { title: "Numerical Stability Modeling of Excavation Slopes in GIDA Clay Formations", authors: "V. K. Singh, Sandeep Yadav", journal: "Indian Geotechnical Journal, 2024", link: "#" }
  ];

  return (
    <>
      <Header user={user} />

      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-bit-red relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-bit-red-light uppercase tracking-widest bg-bit-red/20 px-3 py-1 rounded-full">
            Academic Innovations
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide mt-3">
            Research & Faculty Publications
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Fostering research minds through IEEE journals, international seminars, hardware patents, and academic publications.
          </p>
        </div>
      </section>

      {/* Research summary card */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-4 uppercase tracking-wide">
              Research Facilities and Patents
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Buddha Institute of Technology maintains collaborative research projects with premier institutes like IIT Kanpur and MMMUT Gorakhpur. Faculty researchers are supported with departmental research grants, VLSI EDA license simulators, and dedicated IoT workspaces.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Recent Journals & Conference Publications
            </h2>
            
            <div className="flex flex-col gap-6">
              {papers.map((paper, i) => (
                <div key={i} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="bg-bit-blue/10 text-bit-blue p-2.5 rounded shrink-0 self-start">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                      {paper.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 mt-1">
                      Authors: {paper.authors}
                    </span>
                    <span className="text-xs text-slate-400 italic mt-0.5">
                      Published in: {paper.journal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Chatbot />
      <Footer />
    </>
  );
}
