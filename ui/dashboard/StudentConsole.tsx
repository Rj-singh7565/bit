"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  User, BookOpen, CreditCard, Library, Briefcase, Calendar, 
  MapPin, CheckCircle, Clock, AlertTriangle, FileText, Download, 
  Search, Upload, ArrowRight, ShieldCheck, Sparkles 
} from "lucide-react";
import { payFees, applyForJob, issueLibraryBook, returnLibraryBook } from "src/actions/erp";
import { logout } from "src/actions/auth";

interface StudentConsoleProps {
  studentUser: any;
  payments: any[];
  grades: any[];
  books: any[];
  issuedBooks: any[];
  placementJobs: any[];
  applications: any[];
}

export default function StudentConsole({
  studentUser,
  payments,
  grades,
  books,
  issuedBooks,
  placementJobs,
  applications
}: StudentConsoleProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "grades" | "fees" | "library" | "placements" | "timetable">("overview");
  const [payAmount, setPayAmount] = useState("");
  const [payCategory, setPayCategory] = useState("Tuition Fee");
  const [payMethod, setPayMethod] = useState("UPI / QR Code");
  const [searchBook, setSearchBook] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Placement ML Predictor states
  const [predInternships, setPredInternships] = useState("0");
  const [predBacklogs, setPredBacklogs] = useState("0");
  const [predProb, setPredProb] = useState<number | null>(null);
  const [predStatus, setPredStatus] = useState<string | null>(null);
  const [predRecs, setPredRecs] = useState<string[] | null>(null);
  const [predSource, setPredSource] = useState("");

  const handlePredictPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const internships = parseInt(predInternships) || 0;
    const backlogs = parseInt(predBacklogs) || 0;
    const cgpa = profile.cgpa || 0;
    const attendance = profile.attendancePct || 0;

    startTransition(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        const response = await fetch("http://127.0.0.1:8000/api/ml/predict-placement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cgpa,
            attendance,
            backlogs,
            internships
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setPredProb(data.probability);
          setPredStatus(data.status);
          setPredRecs(data.recommendations);
          setPredSource("Python FastAPI Server Model");
          return;
        }
      } catch (err) {
        console.log("FastAPI backend offline, running local JS classifier...");
      }

      // JS Local Fallback Classifier
      let score = 0;
      if (cgpa >= 8.5) score += 45;
      else if (cgpa >= 7.5) score += 35;
      else if (cgpa >= 6.5) score += 25;
      else score += 10;

      if (attendance >= 85) score += 15;
      else if (attendance >= 75) score += 10;
      else score += 2;

      if (internships >= 2) score += 25;
      else if (internships == 1) score += 15;
      else score += 5;

      score -= (backlogs * 15);
      const prob = Math.max(5, Math.min(99, score));
      
      setPredProb(prob);
      setPredStatus(prob >= 80 ? "HIGHLY_LIKELY" : prob >= 60 ? "PROBABLE" : "UNLIKELY");
      
      const recs = [];
      if (cgpa < 7.5) recs.push("Strive to get CGPA above 7.5 to open eligibility.");
      if (attendance < 75) recs.push("Attendance is below AKTU 75% limit.");
      if (internships < 1) recs.push("Complete at least one summer industrial project.");
      if (backlogs > 0) recs.push(`Clear active backlogs (${backlogs}) immediately.`);
      if (recs.length === 0) recs.push("Maintain current academic records. Ready for placement drives!");
      setPredRecs(recs);
      setPredSource("Local JS Fallback Model");
    });
  };

  const profile = studentUser.studentProfile;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) {
      setMsg({ type: "error", text: "Please enter a valid payment amount." });
      return;
    }

    startTransition(async () => {
      const res = await payFees(profile.id, amt, payCategory, payMethod);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else if (res?.success) {
        setMsg({ type: "success", text: `Success! Paid ₹${amt} for ${payCategory}. Txn: ${res.payment?.transactionId}` });
        setPayAmount("");
      }
    });
  };

  const handleApply = (jobId: string) => {
    setMsg(null);
    if (!resumeUrl.trim()) {
      setMsg({ type: "error", text: "Please provide a valid resume URL/Filename." });
      return;
    }

    startTransition(async () => {
      const res = await applyForJob(profile.id, jobId, resumeUrl);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else if (res?.success) {
        setMsg({ type: "success", text: "Application submitted successfully to corporate cell!" });
        setResumeUrl("");
      }
    });
  };

  const handleBorrow = (bookId: string) => {
    setMsg(null);
    startTransition(async () => {
      const res = await issueLibraryBook(profile.id, bookId);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else if (res?.success) {
        setMsg({ type: "success", text: "Book checked out successfully! Return within 14 days." });
      }
    });
  };

  const handleReturn = (issueId: string) => {
    setMsg(null);
    startTransition(async () => {
      const res = await returnLibraryBook(issueId);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else if (res?.success) {
        setMsg({ type: "success", text: `Book returned successfully! Late fine paid: ₹${res.fineCharged}` });
      }
    });
  };

  // Filter library books
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchBook.toLowerCase()) ||
    b.author.toLowerCase().includes(searchBook.toLowerCase()) ||
    b.department.toLowerCase().includes(searchBook.toLowerCase())
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 md:px-8">
      
      {/* Sidebar Navigation - Left Column */}
      <div className="md:col-span-1 flex flex-col gap-4 no-print">
        {/* Profile overview mini card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-bit-blue/10 text-bit-blue flex items-center justify-center font-serif font-bold text-2xl border border-bit-blue/20 shadow">
            {studentUser.name[0]}
          </div>
          <h2 className="font-serif font-bold text-slate-800 text-lg mt-3 leading-tight">{studentUser.name}</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Enrollment No: {profile.enrollmentNo}
          </span>
          <span className="text-xs text-bit-blue font-semibold mt-1">
            B.Tech {profile.branch} (Sem {profile.semester})
          </span>
          
          <div className="h-px bg-slate-100 w-full my-4"></div>
          
          <div className="w-full space-y-2 text-left text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Attendance:</span>
              <span className={profile.attendancePct >= 75 ? "text-green-600" : "text-bit-red"}>
                {profile.attendancePct}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Hostel:</span>
              <span>{profile.hostelRoom || "Day Scholar"}</span>
            </div>
            <div className="flex justify-between">
              <span>Current GPA:</span>
              <span className="text-bit-blue">{profile.cgpa}</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded mt-5 transition cursor-pointer"
          >
            Sign Out Session
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
          <button
            onClick={() => { setActiveTab("overview"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "overview" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <User className="w-4.5 h-4.5" /> General Overview
          </button>

          <button
            onClick={() => { setActiveTab("grades"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "grades" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" /> Semester Grades
          </button>

          <button
            onClick={() => { setActiveTab("fees"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "fees" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <CreditCard className="w-4.5 h-4.5" /> Fees Ledger & Pay
          </button>

          <button
            onClick={() => { setActiveTab("library"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "library" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Library className="w-4.5 h-4.5" /> Digital Library
          </button>

          <button
            onClick={() => { setActiveTab("placements"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "placements" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Briefcase className="w-4.5 h-4.5" /> Placements Cell
          </button>

          <button
            onClick={() => { setActiveTab("timetable"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "timetable" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Calendar className="w-4.5 h-4.5" /> Class Schedule
          </button>
        </div>
      </div>

      {/* Main Panel Content - Right 3 Columns */}
      <div className="md:col-span-3 flex flex-col gap-6">
        
        {/* Alerts & Messages notifications */}
        {msg && (
          <div className={`p-4 border rounded text-xs font-semibold flex items-center gap-2 ${
            msg.type === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <AlertTriangle className="w-4.5 h-4.5" />
            {msg.text}
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              General Overview & Profile Desk
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance warning / status */}
              <div className="border border-slate-100 p-4 rounded bg-slate-50/50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">AKTU Attendance Status</span>
                <span className={`text-2xl font-bold font-mono mt-1.5 ${profile.attendancePct >= 75 ? "text-green-600" : "text-bit-red"}`}>
                  {profile.attendancePct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">
                  {profile.attendancePct >= 75 
                    ? "✓ Satisfies the AKTU 75% minimum classroom guidelines." 
                    : "⚠ Shortage! Below 75% will block exam hall permit."}
                </span>
              </div>

              {/* Fee Outstanding */}
              <div className="border border-slate-100 p-4 rounded bg-slate-50/50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Balance</span>
                <span className="text-2xl font-bold font-mono mt-1.5 text-slate-700">
                  ₹{profile.feeBalance.toLocaleString("en-IN")}
                </span>
                <span className={`text-[10px] font-bold mt-2.5 uppercase tracking-wider self-start px-2 py-0.5 rounded ${
                  profile.feeStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-bit-red-light text-bit-red-dark"
                }`}>
                  Status: {profile.feeStatus}
                </span>
              </div>

              {/* Room allocation */}
              <div className="border border-slate-100 p-4 rounded bg-slate-50/50 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Campus Facilities</span>
                <span className="text-base font-bold text-slate-700 mt-2">
                  {profile.hostelRoom ? `Room: ${profile.hostelRoom}` : "Day Scholar Seat"}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Bus Route: {profile.busRoute || "Not registered"}
                </span>
              </div>
            </div>

            {/* Assignments desk */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="font-serif font-bold text-slate-800 text-base mb-4 uppercase tracking-wider">
                Pending Faculty Assignments
              </h3>
              <div className="border border-slate-200 rounded divide-y divide-slate-100 text-xs">
                <div className="p-3.5 flex justify-between items-center bg-slate-50/20">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">Compiler Design - LL(1) Parser program</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Assigned by: Prof. Arvind Kumar &middot; Due: August 25, 2026</span>
                  </div>
                  <span className="bg-bit-red-light text-bit-red-dark px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                    Pending
                  </span>
                </div>
                <div className="p-3.5 flex justify-between items-center bg-slate-50/20">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">VLSI CMOS Layout circuit constraints sheet</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Assigned by: Dr. S. C. Gupta &middot; Due: August 30, 2026</span>
                  </div>
                  <span className="bg-bit-red-light text-bit-red-dark px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GRADES TAB */}
        {activeTab === "grades" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Semester Results & Internal Marks
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="bg-slate-50 p-4 rounded border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Degree Path: B.Tech (CSE)</span>
                <span>Current Semester: Sem 7</span>
                <span className="bg-bit-blue text-white px-2 py-0.5 rounded text-[10px]">Active Track</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3 border-r border-slate-200">Subject Code</th>
                      <th className="p-3 border-r border-slate-200">Subject Name</th>
                      <th className="p-3 border-r border-slate-200 text-center">Internal (Sessional)</th>
                      <th className="p-3 border-r border-slate-200 text-center">External (Board)</th>
                      <th className="p-3 text-center">Final Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-600">
                    {grades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-slate-50/50">
                        <td className="p-3 border-r border-slate-200 font-bold font-mono text-bit-blue">{grade.subjectCode}</td>
                        <td className="p-3 border-r border-slate-200">{grade.subjectName}</td>
                        <td className="p-3 border-r border-slate-200 text-center font-mono">{grade.internalMarks} / 50</td>
                        <td className="p-3 border-r border-slate-200 text-center font-mono">{grade.externalMarks || "--"} / 100</td>
                        <td className="p-3 text-center font-bold text-bit-red">{grade.grade}</td>
                      </tr>
                    ))}
                    {grades.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">No semester grade listings found in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. FEES TAB */}
        {activeTab === "fees" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Accounts Ledger & Online Payment Desk
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment history list */}
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Transaction History</h3>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 text-xs">
                  {payments.map((p) => (
                    <div key={p.id} className="p-3 border border-slate-100 rounded bg-slate-50/50 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{p.category}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Txn ID: {p.transactionId}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(p.paidAt).toLocaleDateString("en-IN")} via {p.paymentMethod}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="font-bold text-green-600">₹{p.amount}</span>
                        <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">PAID</span>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <div className="text-center py-8 text-slate-400">No payment receipts found in ledger.</div>
                  )}
                </div>
              </div>

              {/* Pay Online Form */}
              <div className="bg-slate-50 border border-slate-200 rounded p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-bit-red" /> Secure Online Payout Gateway
                </h3>
                
                <form onSubmit={handlePayment} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fee Category</label>
                    <select
                      value={payCategory}
                      onChange={(e) => setPayCategory(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-bit-blue"
                    >
                      <option>Tuition Fee</option>
                      <option>Hostel Fee</option>
                      <option>Library Fee</option>
                      <option>Exam Fee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-bit-blue"
                    >
                      <option>UPI / QR Code</option>
                      <option>Net Banking</option>
                      <option>Credit Card / Debit Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount to Pay (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-bit-blue font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-bit-blue hover:bg-bit-blue-dark text-white text-xs font-bold py-2 rounded shadow transition mt-3 cursor-pointer disabled:bg-slate-300"
                  >
                    {isPending ? "Connecting Gateway..." : "Initiate Online Payment"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 4. DIGITAL LIBRARY TAB */}
        {activeTab === "library" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Central Digital Library Access
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Issued books tracking */}
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Issued Books & Checkouts</h3>
                <div className="flex flex-col gap-3 text-xs">
                  {issuedBooks.map((issue) => (
                    <div key={issue.id} className="p-3 border border-slate-100 rounded bg-slate-50/50 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{issue.book.title}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Author: {issue.book.author}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Due Date: {new Date(issue.dueDate).toLocaleDateString("en-IN")}
                        </span>
                        {issue.fineAmount > 0 && (
                          <span className="text-[9px] font-bold text-bit-red mt-1">Pending Fine: ₹{issue.fineAmount}</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleReturn(issue.id)}
                        disabled={isPending}
                        className="bg-bit-red hover:bg-bit-red-dark text-white px-2.5 py-1 rounded text-[10px] font-bold shadow transition shrink-0 cursor-pointer disabled:bg-slate-300"
                      >
                        Return Book
                      </button>
                    </div>
                  ))}
                  {issuedBooks.length === 0 && (
                    <div className="text-center py-8 text-slate-400">No active books checkout registered.</div>
                  )}
                </div>
              </div>

              {/* Books bookshelf search */}
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Search Books Library Catalogue</h3>
                
                {/* Search query */}
                <div className="flex items-center border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 gap-2 mb-4">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Title, Author, or Department..."
                    value={searchBook}
                    onChange={(e) => setSearchBook(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 text-xs">
                  {filteredBooks.map((b) => (
                    <div key={b.id} className="p-3 border border-slate-100 rounded bg-white flex justify-between items-center hover:bg-slate-50 transition">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{b.title}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">By {b.author} &middot; Dept: {b.department}</span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-1">Copies Available: {b.copiesAvailable} / {b.totalCopies}</span>
                      </div>
                      
                      <button
                        onClick={() => handleBorrow(b.id)}
                        disabled={isPending || b.copiesAvailable <= 0}
                        className="bg-bit-blue hover:bg-bit-blue-dark text-white px-2.5 py-1 rounded text-[10px] font-bold shadow transition shrink-0 cursor-pointer disabled:bg-slate-300"
                      >
                        Borrow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PLACEMENTS TAB */}
        {activeTab === "placements" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Placement Cell & Applications Portal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Job opportunities list */}
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Corporate Postings</h3>
                <div className="flex flex-col gap-4 text-xs max-h-[350px] overflow-y-auto pr-2">
                  {placementJobs.map((job) => {
                    const alreadyApplied = applications.some(a => a.jobId === job.id);
                    return (
                      <div key={job.id} className="p-4 border border-slate-100 rounded bg-slate-50/50 flex flex-col justify-between hover:border-slate-200 transition">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-800 text-sm leading-none">{job.companyName}</span>
                            <span className="text-[10px] bg-bit-blue-light text-bit-blue font-bold px-1.5 py-0.5 rounded">₹{job.packageLpa} LPA</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Role: {job.role}</span>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-1.5">Eligibility: {job.eligibility}</span>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                          <input
                            type="text"
                            placeholder="Resume File Link (e.g. resume.pdf)"
                            disabled={alreadyApplied}
                            value={alreadyApplied ? "Applied" : resumeUrl}
                            onChange={(e) => setResumeUrl(e.target.value)}
                            className="flex-1 border border-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none"
                          />
                          <button
                            onClick={() => handleApply(job.id)}
                            disabled={isPending || alreadyApplied}
                            className={`px-3 py-1 rounded text-[10px] font-bold shadow transition shrink-0 cursor-pointer ${
                              alreadyApplied 
                                ? "bg-green-100 text-green-700 border border-green-200" 
                                : "bg-bit-red hover:bg-bit-red-dark text-white disabled:bg-slate-300"
                            }`}
                          >
                            {alreadyApplied ? "Applied" : "Apply"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Tracking */}
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Submitted Resumes & Status</h3>
                <div className="flex flex-col gap-3 text-xs">
                  {applications.map((app) => (
                    <div key={app.id} className="p-3.5 border border-slate-100 rounded bg-white flex justify-between items-center shadow-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{app.job.companyName}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Role: {app.job.role}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-mono">Resume: {app.resumeUrl}</span>
                      </div>
                      
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        app.status === "OFFERED" 
                          ? "bg-green-50 border-green-200 text-green-700 animate-pulse" 
                          : app.status === "APPLIED" 
                          ? "bg-blue-50 border-blue-200 text-blue-700" 
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-8 text-slate-400">No submitted placement applications tracked.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Placement Predictor ML Block */}
            <div className="mt-8 border-t border-slate-150 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-bit-red" />
                Placement Probability Calculator (FastAPI ML Model)
              </h3>
              
              <form onSubmit={handlePredictPlacement} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-700 bg-slate-50 p-4 border border-slate-200 rounded-md">
                <div>
                  <label className="block text-slate-500 uppercase mb-1">Completed Internships</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={predInternships}
                    onChange={(e) => setPredInternships(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={predBacklogs}
                    onChange={(e) => setPredBacklogs(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-bit-blue hover:bg-bit-blue-dark text-white px-4 py-2 rounded text-xs font-bold shadow transition cursor-pointer"
                  >
                    Run Prediction Model
                  </button>
                </div>

                {predProb !== null && (
                  <div className="md:col-span-3 mt-3 border-t border-slate-200 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Placement Probability:</span>
                      <span className={`text-base font-extrabold font-mono ${predProb >= 85 ? "text-green-600" : predProb >= 65 ? "text-bit-blue" : "text-bit-red"}`}>
                        {predProb}%
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        predStatus === "HIGHLY_LIKELY" 
                          ? "bg-green-100 text-green-700" 
                          : predStatus === "PROBABLE" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {predStatus}
                      </span>
                    </div>

                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-slate-400">Processed via:</span>
                      <span className="text-[10px] text-bit-blue font-bold">{predSource}</span>
                    </div>

                    {predRecs && predRecs.length > 0 && (
                      <div className="md:col-span-3 mt-2 bg-white border border-slate-100 p-3 rounded">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Academic Recommendations:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] font-normal">
                          {predRecs.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

          </div>
        )}

        {/* 6. TIMETABLE TAB */}
        {activeTab === "timetable" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Engineering Lecture Class Timetable
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200">Day</th>
                    <th className="p-3 border-r border-slate-200 text-center">9:00 - 10:00 AM</th>
                    <th className="p-3 border-r border-slate-200 text-center">10:00 - 11:00 AM</th>
                    <th className="p-3 border-r border-slate-200 text-center">11:15 - 12:15 PM</th>
                    <th className="p-3 border-r border-slate-200 text-center">12:15 - 1:15 PM</th>
                    <th className="p-3 border-r border-slate-200 text-center">2:00 - 3:00 PM</th>
                    <th className="p-3 text-center">3:00 - 4:00 PM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600 font-medium text-center">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 bg-slate-50 font-bold text-slate-700 text-left">Monday</td>
                    <td className="p-3 border-r border-slate-200">Compiler Design (KCS-702)</td>
                    <td className="p-3 border-r border-slate-200">VLSI Design (KEC-701)</td>
                    <td className="p-3 border-r border-slate-200 font-bold text-slate-400 bg-slate-50/30">Library Hour</td>
                    <td className="p-3 border-r border-slate-200">Machine Learning (KCS-703)</td>
                    <td colSpan={2} className="p-3 font-bold text-bit-blue bg-bit-blue/5">Software Engineering Lab (G-B)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 bg-slate-50 font-bold text-slate-700 text-left">Tuesday</td>
                    <td className="p-3 border-r border-slate-200">Compiler Design (KCS-702)</td>
                    <td className="p-3 border-r border-slate-200">VLSI Design (KEC-701)</td>
                    <td className="p-3 border-r border-slate-200">Distributed Systems (KCS-071)</td>
                    <td className="p-3 border-r border-slate-200">Machine Learning (KCS-703)</td>
                    <td className="p-3 border-r border-slate-200">Professional Ethics</td>
                    <td className="p-3">Placement Aptitude Class</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 bg-slate-50 font-bold text-slate-700 text-left">Wednesday</td>
                    <td className="p-3 border-r border-slate-200">Distributed Systems (KCS-071)</td>
                    <td className="p-3 border-r border-slate-200">VLSI Design (KEC-701)</td>
                    <td className="p-3 border-r border-slate-200">Compiler Design (KCS-702)</td>
                    <td className="p-3 border-r border-slate-200">Machine Learning (KCS-703)</td>
                    <td colSpan={2} className="p-3 font-bold text-bit-red bg-bit-red/5">Hardware & VLSI Design Lab (G-A)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 bg-slate-50 font-bold text-slate-700 text-left">Thursday</td>
                    <td className="p-3 border-r border-slate-200">Compiler Design (KCS-702)</td>
                    <td className="p-3 border-r border-slate-200">Distributed Systems (KCS-071)</td>
                    <td className="p-3 border-r border-slate-200 font-bold text-slate-400 bg-slate-50/30">Library Hour</td>
                    <td className="p-3 border-r border-slate-200">Machine Learning (KCS-703)</td>
                    <td className="p-3 border-r border-slate-200">Professional Ethics</td>
                    <td className="p-3">Career Counseling</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 bg-slate-50 font-bold text-slate-700 text-left">Friday</td>
                    <td colSpan={2} className="p-3 font-bold text-slate-400 bg-slate-100/50">Minor Design Project (Presentation)</td>
                    <td className="p-3 border-r border-slate-200">Distributed Systems (KCS-071)</td>
                    <td className="p-3 border-r border-slate-200 font-bold text-slate-400 bg-slate-50/30">Tutorial Hour</td>
                    <td className="p-3 border-r border-slate-200">General Seminar</td>
                    <td className="p-3">Extracurricular Activity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
