import React from "react";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <>
      <Header user={user} />

      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-bit-red relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-bit-red-light uppercase tracking-widest bg-bit-red/20 px-3 py-1 rounded-full">
            Connect With Us
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide mt-3">
            Contact Administration & Inquiry
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Get in touch with our admissions helpdesk, office of the director, or placement cell representatives.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick info cards */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-bit-blue/10 text-bit-blue p-2.5 rounded">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-base">Campus Location</h3>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                CL-1, Sector-7, GIDA, Sahjanwa, Gorakhpur, Uttar Pradesh - 273209
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-bit-blue/10 text-bit-blue p-2.5 rounded">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-base">Call Helpdesk</h3>
              </div>
              <div className="text-xs text-slate-500 mt-3 space-y-1.5 font-semibold">
                <span className="block">Admissions: +91-9839626262</span>
                <span className="block">Administration: +91-9935100263</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-bit-blue/10 text-bit-blue p-2.5 rounded">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-base">Email Relations</h3>
              </div>
              <div className="text-xs text-slate-500 mt-3 space-y-1.5 font-semibold">
                <span className="block">Director Office: director@bit.ac.in</span>
                <span className="block">Admissions Help: admission@bit.ac.in</span>
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Online Admission Inquiry Form (Session 2026-27)
            </h2>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aryan Jaiswal"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parent Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shri Rajesh Jaiswal"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9999988888"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. student@gmail.com"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Interested B.Tech Branch</label>
                <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue bg-white">
                  <option>Computer Science & Engineering (CSE)</option>
                  <option>CSE - Artificial Intelligence & ML</option>
                  <option>CSE - Data Science</option>
                  <option>Electronics & Communication Eng (ECE)</option>
                  <option>Mechanical Engineering (ME)</option>
                  <option>Civil Engineering (CE)</option>
                  <option>Polytechnic Diploma Programs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">JEE Main / JEECUP Rank (If applicable)</label>
                <input
                  type="text"
                  placeholder="e.g. CRL 45000"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Additional Queries / Messages</label>
                <textarea
                  rows={4}
                  placeholder="Ask about hostel vacancies, fee installments, list of direct admissions quotas..."
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-bit-blue resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center gap-2 bg-bit-blue hover:bg-bit-blue-dark text-white px-6 py-2.5 rounded text-sm font-bold shadow-md transition"
                >
                  Submit Inquiry Form <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      <Chatbot />
      <Footer />
    </>
  );
}
