import React from "react";
import { BookOpen, FileText, CheckCircle, HelpCircle, ArrowRight, Table } from "lucide-react";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";

export const dynamic = "force-dynamic";

export default async function AdmissionsPage() {
  const user = await getCurrentUser();

  const seatIntake = [
    { branch: "Computer Science & Engineering (B.Tech)", code: "CSE", duration: "4 Years", seats: "180 Seats" },
    { branch: "Electronics & Communication Eng. (B.Tech)", code: "ECE", duration: "4 Years", seats: "60 Seats" },
    { branch: "Mechanical Engineering (B.Tech)", code: "ME", duration: "4 Years", seats: "60 Seats" },
    { branch: "Civil Engineering (B.Tech)", code: "CE", duration: "4 Years", seats: "60 Seats" },
    { branch: "Polytechnic Diploma in Mechanical (Prod)", code: "DME", duration: "3 Years", seats: "60 Seats" },
    { branch: "Polytechnic Diploma in Civil Engineering", code: "DCE", duration: "3 Years", seats: "60 Seats" }
  ];

  return (
    <>
      <Header user={user} />
      
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-bit-red relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-bit-red-light uppercase tracking-widest bg-bit-red/20 px-3 py-1 rounded-full">
            Admissions Session 2026-27
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide mt-3">
            Admission Guidelines & Fee Structures
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Find details regarding branch allocations, seat intake capacity, official academic fees, and admission criteria.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Seat details + Eligibility - Col Span 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Eligibility */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-4 uppercase tracking-wide">
                Admissions Eligibility (AKTU Guidelines)
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                <p>
                  Admissions to B.Tech First Year programs are conducted through UPTAC (Uttar Pradesh Technical Admission Counselling) based on JEE Main CRL rankings.
                </p>
                <div className="space-y-3 font-medium text-slate-700 mt-4">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-bit-blue shrink-0 mt-0.5" />
                    <span>Candidates must have passed 10+2 Intermediate from UP board or equivalent with Physics and Mathematics as compulsory subjects along with Chemistry/Computer Science/Bio-Tech.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-bit-blue shrink-0 mt-0.5" />
                    <span>Obtained at least 45% marks (40% in case of candidates belonging to reserved SC/ST categories) in the above subjects taken together.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-bit-blue shrink-0 mt-0.5" />
                    <span>Direct admission (Lateral Entry to 2nd year B.Tech) is available for Diploma holders or B.Sc graduates who have cleared 10+2 with Mathematics.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Intake Table */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
                Academic Programs & Seat Intake Capacity
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <th className="p-3 border-r border-slate-200">Course / Branch Name</th>
                      <th className="p-3 border-r border-slate-200 text-center">Branch Code</th>
                      <th className="p-3 border-r border-slate-200 text-center">Course Duration</th>
                      <th className="p-3 text-center">Annual Intake</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-600">
                    {seatIntake.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 border-r border-slate-200 font-bold text-slate-800">{item.branch}</td>
                        <td className="p-3 border-r border-slate-200 text-center font-mono">{item.code}</td>
                        <td className="p-3 border-r border-slate-200 text-center">{item.duration}</td>
                        <td className="p-3 text-center font-bold text-bit-blue">{item.seats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Fee details - Col Span 1 */}
          <div className="flex flex-col gap-6">
            
            {/* Fee Card */}
            <div id="fees" className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-bit-blue border-b border-slate-200 pb-3 mb-4 uppercase tracking-wide">
                Annual Fee Details (2026-27)
              </h2>
              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">B.Tech Tuition Fee:</span>
                  <span className="font-mono text-slate-800">₹82,500 / Yr</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Hostel Boarding & Mess:</span>
                  <span className="font-mono text-slate-800">₹55,000 / Yr</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Hostel Security (Refundable):</span>
                  <span className="font-mono text-slate-800">₹5,000</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Bus Transport (Optional):</span>
                  <span className="font-mono text-slate-800">₹12,000 / Yr</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">University Exam Fee:</span>
                  <span className="font-mono text-slate-800">₹7,500 / Yr</span>
                </div>
                
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-500 leading-relaxed font-normal text-[11px] mt-4">
                  Note: Fees are subject to revision as per state government fee regulatory committee guidelines. Online payments can be processed through the student dashboard.
                </div>
              </div>
            </div>

            {/* Scholarship Card */}
            <div id="scholarships" className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-bit-blue border-b border-slate-200 pb-3 mb-4 uppercase tracking-wide">
                UP Government Scholarships
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eligible students (General, OBC, SC, ST, and Minorities) whose family annual income meets social welfare department standards can apply for fee-reimbursement scholarships online.
              </p>
              <div className="mt-4 text-xs font-semibold text-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-bit-blue shrink-0" />
                  <span>UP Post-Matric Scholarship desk support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-bit-blue shrink-0" />
                  <span>Assistance in bank documentation for education loans</span>
                </div>
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
