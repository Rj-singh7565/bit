"use client";

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  FileText, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  QrCode, 
  Printer, 
  ArrowLeft, 
  Check, 
  Loader2 
} from "lucide-react";
import { submitAdmissionForm } from "src/actions/admissions";

const COURSES = [
  {
    category: "Commerce / Arts",
    items: [
      { name: "B.A.", fee: 500 },
      { name: "B.Com", fee: 500 },
      { name: "BJMC", fee: 500 }
    ]
  },
  {
    category: "Computer Application",
    items: [
      { name: "BCA", fee: 500 },
      { name: "MCA", fee: 1000 }
    ]
  },
  {
    category: "Diploma",
    items: [
      { name: "DIPLOMA IN CE", fee: 500 },
      { name: "DIPLOMA IN CSE", fee: 500 },
      { name: "DIPLOMA IN EE", fee: 500 },
      { name: "DIPLOMA IN ME (AUTO Engg.)", fee: 500 },
      { name: "DIPLOMA IN ME (AUTO)", fee: 500 },
      { name: "DIPLOMA IN ME (Prod. Engg.)", fee: 500 },
      { name: "DIPLOMA IN ME (Prod.)", fee: 500 }
    ]
  },
  {
    category: "Engineering",
    items: [
      { name: "B.TECH CE", fee: 1000 },
      { name: "B.TECH CS", fee: 1000 },
      { name: "B.TECH CSE", fee: 1000 },
      { name: "B.TECH CSE (AI-ML)", fee: 1000 },
      { name: "B.TECH CSE (DATA SCIENCE)", fee: 1000 },
      { name: "B.TECH E.E (VLSI)", fee: 1000 },
      { name: "B.TECH ECE", fee: 1000 },
      { name: "B.TECH IT", fee: 1000 },
      { name: "B.TECH M.E.", fee: 1000 },
      { name: "M.TECH CSE", fee: 1000 },
      { name: "M.TECH ECE", fee: 1000 },
      { name: "M.TECH ECE (VLSI)", fee: 1000 }
    ]
  },
  {
    category: "Hotel Management",
    items: [
      { name: "B.H.M.C.T", fee: 1000 }
    ]
  },
  {
    category: "ITI",
    items: [
      { name: "Electrician", fee: 500 },
      { name: "Fitter", fee: 500 }
    ]
  },
  {
    category: "LAW",
    items: [
      { name: "B.A. LLB", fee: 500 },
      { name: "L.L.B.", fee: 500 }
    ]
  },
  {
    category: "Management",
    items: [
      { name: "BBA", fee: 500 },
      { name: "MBA", fee: 1000 }
    ]
  },
  {
    category: "Paramedical",
    items: [
      { name: "D.opt", fee: 500 },
      { name: "D.XRT", fee: 500 }
    ]
  },
  {
    category: "Pharmacy",
    items: [
      { name: "B.Pharma", fee: 1000 },
      { name: "D.pharma", fee: 500 }
    ]
  },
  {
    category: "Science",
    items: [
      { name: "B.Sc (Biology)", fee: 500 },
      { name: "B.Sc (Math)", fee: 500 }
    ]
  }
];

export default function AdmissionFormClient() {
  // Form State
  const [course, setCourse] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marks10, setMarks10] = useState("");
  const [marks12, setMarks12] = useState("");
  
  // File Upload State
  const [file10, setFile10] = useState<File | null>(null);
  const [file12, setFile12] = useState<File | null>(null);
  const [preview10, setPreview10] = useState<string | null>(null);
  const [preview12, setPreview12] = useState<string | null>(null);

  // Flow State
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD">("UPI");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Card details state (for card payment simulation)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Get current selected course fee
  const selectedCourseItem = COURSES.flatMap(c => c.items).find(i => i.name === course);
  const feeAmount = selectedCourseItem ? selectedCourseItem.fee : 0;

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview10) URL.revokeObjectURL(preview10);
      if (preview12) URL.revokeObjectURL(preview12);
    };
  }, [preview10, preview12]);

  // Stepper calculations
  const isStep1Done = !!course;
  const isStep2Done = !!fullName && !!gender && !!fatherName && !!dob && !!email && !!phone;
  const isStep3Done = !!marks10 && !!marks12 && !!file10 && !!file12;

  // Form input change handlers for files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, step: 10 | 12) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please upload a smaller file.");
      return;
    }

    if (step === 10) {
      setFile10(file);
      if (file.type.startsWith("image/")) {
        setPreview10(URL.createObjectURL(file));
      } else {
        setPreview10(null);
      }
    } else {
      setFile12(file);
      if (file.type.startsWith("image/")) {
        setPreview12(URL.createObjectURL(file));
      } else {
        setPreview12(null);
      }
    }
  };

  // Submit button handler (triggers payment simulation modal)
  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = [];

    if (!course) newErrors.push("Please select a Course.");
    if (!fullName) newErrors.push("Full Name is required.");
    if (!gender) newErrors.push("Gender selection is required.");
    if (!fatherName) newErrors.push("Father's Name is required.");
    if (!dob) newErrors.push("Date of Birth is required.");
    if (!email) newErrors.push("Email address is required.");
    if (!phone || phone.length !== 10) newErrors.push("Enter a valid 10-digit Phone Number.");
    if (!marks10) newErrors.push("10th Marks/Percentage is required.");
    if (!marks12) newErrors.push("12th Marks/Percentage is required.");
    if (!file10) newErrors.push("Please upload your 10th Marksheet.");
    if (!file12) newErrors.push("Please upload your 12th Marksheet.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors([]);
    setShowPaymentModal(true);
  };

  // Triggers payment success and submits file and data to backend
  const handlePaymentSuccess = async () => {
    setPaymentProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("course", course);
      formData.append("full_name", fullName);
      formData.append("gender", gender);
      formData.append("father_name", fatherName);
      formData.append("dob", dob);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("marks_10", marks10);
      formData.append("marks_12", marks12);
      if (file10) formData.append("marksheet_10", file10);
      if (file12) formData.append("marksheet_12", file12);

      const response = await submitAdmissionForm(formData);

      if (response.error) {
        setErrors([response.error]);
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSuccessData(response);
        setShowPaymentModal(false);
        setPaymentProcessing(false);
      }
    } catch (err) {
      setErrors(["An unexpected error occurred during submission. Please try again."]);
      setShowPaymentModal(false);
      setPaymentProcessing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Card input formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(val);
    }
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + "/" + val.substring(2);
    }
    setCardExpiry(val);
  };

  if (successData) {
    // Beautiful Printable Receipt View
    return (
      <div className="max-w-3xl mx-auto my-12 px-4 animate-fade-in no-print">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden print-card">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-bit-blue to-bit-blue-dark p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-amber-500">
            <div className="flex items-center gap-4">
              <img src="https://www.bit.ac.in/images/bit.png" alt="BIT Logo" className="h-16 w-auto object-contain bg-white/10 p-2 rounded-lg" onError={(e)=>{e.currentTarget.style.display='none'}}/>
              <div>
                <h2 className="font-serif text-xl font-bold tracking-wide uppercase leading-tight">Buddha Institute</h2>
                <p className="text-[10px] text-amber-400 font-semibold tracking-wider leading-none uppercase mt-0.5">Approved by AICTE | Affiliated to AKTU (525)</p>
                <p className="text-xs text-slate-200 mt-1">Gorakhpur, Uttar Pradesh, India</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                Payment Successful
              </span>
              <p className="text-[10px] text-slate-300 mt-2">Ref: {successData.applicationNo}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3 shadow-inner">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h1 className="text-2xl font-serif font-extrabold text-slate-800 tracking-wide uppercase">Admission Form Registered</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-md">Your online admission inquiry has been logged. Below is your official application summary and payment details.</p>
            </div>

            {/* Form Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Application Reference</span>
                <span className="text-sm font-semibold text-slate-800">{successData.applicationNo}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Selected Course</span>
                <span className="text-sm font-semibold text-bit-blue uppercase">{successData.course}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Student Full Name</span>
                <span className="text-sm font-semibold text-slate-800">{successData.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Father's Name</span>
                <span className="text-sm font-semibold text-slate-800">{successData.fatherName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contact Info</span>
                <span className="text-sm font-semibold text-slate-800">{successData.phone} | {successData.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Submission Date</span>
                <span className="text-sm font-semibold text-slate-800">{successData.date}</span>
              </div>
            </div>

            {/* Financial Details Table */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 mb-8">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Transaction Summary</h3>
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Application Inquiry processing fee:</span>
                  <span className="font-mono text-slate-800">₹{successData.fee}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST & SGST (0%):</span>
                  <span className="font-mono text-slate-800">₹0.00</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-800">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-bit-blue text-sm">₹{successData.fee}.00</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between text-[10px] text-slate-500 font-medium">
                <span>Transaction Ref: {successData.transactionId}</span>
                <span>Payment Mode: Online (Secure Gateway)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-lg text-sm transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              
              <button 
                onClick={() => {
                  setCourse("");
                  setFullName("");
                  setGender("");
                  setFatherName("");
                  setDob("");
                  setEmail("");
                  setPhone("");
                  setMarks10("");
                  setMarks12("");
                  setFile10(null);
                  setFile12(null);
                  setPreview10(null);
                  setPreview12(null);
                  setSuccessData(null);
                }}
                className="flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold py-3 px-6 rounded-lg text-sm transition shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Register Another Application
              </button>
            </div>
            
            <div className="mt-8 text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase leading-none">
              Buddha Institute of Technology, Gorakhpur, UP-273209
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f3f6fa] py-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Info & Stepper */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-gradient-to-br from-[#0f2e60] to-[#1e4d92] text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-xl">
              <div>
                {/* Brand */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <GraduationCap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block leading-none">Your Future, Our Commitment</span>
                    <span className="text-xs font-semibold text-slate-200 mt-1 block">College Code: 525</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl font-extrabold tracking-wide uppercase leading-tight text-white mb-3">
                  Online Admission Portal
                </h1>
                
                <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed mb-8">
                  Apply to your dream course in a few simple steps and take the first step towards a brighter academic future.
                </p>

                {/* Progress Stepper */}
                <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                  
                  {/* Step 1 */}
                  <div className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition border ${
                      isStep1Done ? "bg-amber-400 text-slate-900 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "bg-slate-900/60 text-slate-400 border-slate-700"
                    }`}>
                      {isStep1Done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "1"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Choose Your Course</h3>
                      <p className="text-[11px] text-slate-300">Select your preferred stream and specialized course branch.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition border ${
                      isStep2Done ? "bg-amber-400 text-slate-900 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "bg-slate-900/60 text-slate-400 border-slate-700"
                    }`}>
                      {isStep2Done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "2"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Personal Information</h3>
                      <p className="text-[11px] text-slate-300">Provide basic demographic and contact details accurately.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition border ${
                      isStep3Done ? "bg-amber-400 text-slate-900 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "bg-slate-900/60 text-slate-400 border-slate-700"
                    }`}>
                      {isStep3Done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "3"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Academic Verification</h3>
                      <p className="text-[11px] text-slate-300">Enter percentage grades and upload marksheets for verification.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition border ${
                      showPaymentModal || successData ? "bg-amber-400 text-slate-900 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "bg-slate-900/60 text-slate-400 border-slate-700"
                    }`}>
                      "4"
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Secure Payment</h3>
                      <p className="text-[11px] text-slate-300">Verify details and process the online inquiry application fee.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-3 mt-10">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                  <FileText className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200">Easy Application</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                  <ShieldCheck className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200">100% Encrypted</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200">Fast Verification</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                  <User className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200">2026-27 Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-200">
              
              {/* Header Ribbon */}
              <div className="bg-gradient-to-r from-bit-blue to-bit-blue-dark py-6 px-8 text-center text-white border-b-4 border-amber-400">
                <h2 className="font-serif text-lg md:text-xl font-bold uppercase tracking-wider">Admissions Open</h2>
                <span className="inline-block bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1 rounded-full uppercase mt-1">
                  Academic Session 2026-27
                </span>
              </div>

              {/* Form Content Wrapper */}
              <form onSubmit={handleInitiateSubmit} className="p-6 md:p-8 flex flex-col justify-between flex-grow gap-8">
                
                <div className="space-y-8">
                  {/* Error Notification */}
                  {errors.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-800">Please correct the following errors:</h4>
                        <ul className="list-disc list-inside text-xs text-red-700 mt-1 space-y-0.5">
                          {errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Section 1: Course Selection */}
                  <div>
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-bit-blue text-white flex items-center justify-center text-xs font-bold">1</span>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Course Selection</h2>
                    </div>

                    <div>
                      <label htmlFor="course" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Select Course / Stream <span className="text-red-500">*</span></label>
                      <select 
                        id="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                        required
                      >
                        <option value="" disabled>-- Select Course --</option>
                        {COURSES.map((group) => (
                          <optgroup key={group.category} label={group.category}>
                            {group.items.map((item) => (
                              <option key={item.name} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Section 2: Personal Information */}
                  <div>
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-bit-blue text-white flex items-center justify-center text-xs font-bold">2</span>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="full_name" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="full_name"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Gender <span className="text-red-500">*</span></label>
                        <select 
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        >
                          <option value="" disabled>-- Select Gender --</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="father_name" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Father's Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="father_name"
                          placeholder="Enter father's name"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="dob" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Date of Birth <span className="text-red-500">*</span></label>
                        <input 
                          type="date" 
                          id="dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
                        <input 
                          type="email" 
                          id="email"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Phone / WhatsApp Number <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 text-sm font-semibold select-none border-r border-slate-300 pr-2">+91</span>
                          <input 
                            type="tel" 
                            id="phone"
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            pattern="[0-9]{10}"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-14 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Academic Verification */}
                  <div>
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-bit-blue text-white flex items-center justify-center text-xs font-bold">3</span>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Academic Verification</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="marks_10" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">10th Marks / Percentage <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="marks_10"
                          placeholder="e.g. 85%"
                          value={marks10}
                          onChange={(e) => setMarks10(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="marks_12" className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">12th Marks / Percentage <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="marks_12"
                          placeholder="e.g. 82%"
                          value={marks12}
                          onChange={(e) => setMarks12(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-bit-blue/20 focus:border-bit-blue font-medium transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* 10th File Upload */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Upload 10th Marksheet <span className="text-red-500">*</span></label>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                          file10 ? "border-emerald-500 bg-emerald-50/20" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                        }`}>
                          <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 10)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            required={!file10}
                          />
                          <div className="flex flex-col items-center justify-center">
                            {preview10 ? (
                              <img src={preview10} alt="10th preview" className="h-14 w-auto object-contain rounded border border-slate-200 mb-2" />
                            ) : file10?.type === "application/pdf" ? (
                              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-2 font-bold text-[10px]">PDF</div>
                            ) : (
                              <Upload className="w-7 h-7 text-slate-400 mb-2" />
                            )}
                            
                            <span className={`text-xs font-bold block ${file10 ? "text-emerald-700" : "text-bit-blue"}`}>
                              {file10 ? (file10.name.length > 22 ? file10.name.substring(0, 19) + "..." : file10.name) : "Upload File"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 block">PDF, JPG, PNG (Max 2MB)</span>
                          </div>
                        </div>
                      </div>

                      {/* 12th File Upload */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">Upload 12th Marksheet <span className="text-red-500">*</span></label>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                          file12 ? "border-emerald-500 bg-emerald-50/20" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                        }`}>
                          <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 12)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            required={!file12}
                          />
                          <div className="flex flex-col items-center justify-center">
                            {preview12 ? (
                              <img src={preview12} alt="12th preview" className="h-14 w-auto object-contain rounded border border-slate-200 mb-2" />
                            ) : file12?.type === "application/pdf" ? (
                              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-2 font-bold text-[10px]">PDF</div>
                            ) : (
                              <Upload className="w-7 h-7 text-slate-400 mb-2" />
                            )}
                            
                            <span className={`text-xs font-bold block ${file12 ? "text-emerald-700" : "text-bit-blue"}`}>
                              {file12 ? (file12.name.length > 22 ? file12.name.substring(0, 19) + "..." : file12.name) : "Upload File"}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 block">PDF, JPG, PNG (Max 2MB)</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Section 4: Summary & Submission */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col gap-3 font-semibold text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Selected Course:</span>
                        <span className="text-slate-800 uppercase">{course || "None"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Application Fee:</span>
                        <span className="text-slate-800 font-mono text-sm">₹{feeAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span className="text-emerald-600">FREE</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-bold text-slate-800">
                        <span>Total Due:</span>
                        <span className="text-bit-blue font-mono text-base">₹{feeAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-bit-blue to-bit-blue-dark hover:from-bit-blue-dark hover:to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base uppercase tracking-wider"
                  >
                    <Lock className="w-4 h-4 text-amber-400" /> Pay Now & Submit Application
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold mt-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure 256-bit SSL encrypted connection.
                  </div>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Simulated Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b-2 border-amber-400 shrink-0">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base uppercase tracking-wider">Payment Gateway</h3>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Payment Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Fee</span>
                  <span className="text-xs font-semibold text-slate-600 block truncate max-w-[200px]">{course}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount</span>
                  <span className="text-lg font-mono font-extrabold text-bit-blue">₹{feeAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("UPI")}
                  className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "UPI" 
                      ? "border-bit-blue bg-bit-blue-light/35 text-bit-blue" 
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                  disabled={paymentProcessing}
                >
                  <QrCode className="w-4 h-4" /> UPI QR Code
                </button>
                <button
                  onClick={() => setPaymentMethod("CARD")}
                  className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "CARD" 
                      ? "border-bit-blue bg-bit-blue-light/35 text-bit-blue" 
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                  disabled={paymentProcessing}
                >
                  <CreditCard className="w-4 h-4" /> Debit/Credit Card
                </button>
              </div>

              {/* Method Detail UI */}
              {paymentMethod === "UPI" ? (
                // UPI Simulated Interface
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative p-3 bg-white border border-slate-200 rounded-2xl shadow-md w-48 h-48 flex items-center justify-center overflow-hidden">
                    {/* Simulated SVG QR Code */}
                    <svg className="w-44 h-44 text-slate-800" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <path d="M5 5 h20 v20 h-20 z M5 10 h10 M10 5 v10 M20 20 h5 M5 25 h5" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M75 5 h20 v20 h-20 z M75 10 h10 M80 5 v10 M90 20 h5 M75 25 h5" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M5 75 h20 v20 h-20 z M5 80 h10 M10 75 v10 M20 90 h5 M5 95 h5" stroke="currentColor" strokeWidth="2" fill="none" />
                      {/* Random QR clusters */}
                      <path d="M35 15 h10 v5 h-10 z M55 10 h5 v15 h-5 z M45 35 h20 v10 h-20 z M30 55 h10 v15 h-10 z M65 55 h15 v20 h-15 z M45 65 h10 v10 h-10 z M75 80 h15 v10 h-15 z" fill="currentColor" />
                      <rect x="42" y="42" width="16" height="16" rx="3" fill="#0b4c8c" />
                      <path d="M47 47 l3 3 l5 -5" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                    
                    {/* QR scanning laser line animation */}
                    <div className="absolute inset-x-0 top-3 h-0.5 bg-amber-400 opacity-60 shadow-[0_0_8px_#ffc107] animate-[ping_2s_infinite]" style={{ animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block">UPI ID: admission@bit</span>
                    <p className="text-[10px] text-slate-400 mt-1 px-4 leading-normal">Scan the QR code with any UPI app (GPay, PhonePe, BHIM) or click below to simulate instant payment verification.</p>
                  </div>
                  
                  <button
                    onClick={handlePaymentSuccess}
                    disabled={paymentProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm uppercase tracking-wide"
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment...
                      </>
                    ) : (
                      "Simulate Successful Payment"
                    )}
                  </button>
                </div>
              ) : (
                // Sleek Card Simulated Interface
                <div className="space-y-4">
                  {/* Digital Card Preview */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between aspect-[1.586] select-none h-44 w-full">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-6 bg-amber-400/20 border border-amber-400/30 rounded-md flex items-center justify-center font-bold text-[8px] tracking-widest text-amber-400 uppercase">Chip</div>
                      <span className="text-xs font-serif font-extrabold italic tracking-wider text-slate-400">VISA / RUPAY</span>
                    </div>
                    <div className="font-mono text-sm tracking-widest text-slate-100 my-4 text-center">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase leading-none">Card Holder</span>
                        <span className="font-medium truncate max-w-[150px] inline-block">{cardName.toUpperCase() || "NAME SURNAME"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 block uppercase leading-none">Expires</span>
                        <span className="font-mono font-medium">{cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <input 
                        type="text" 
                        placeholder="CARDHOLDER NAME" 
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.slice(0, 22))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-bit-blue transition text-slate-800 uppercase"
                        disabled={paymentProcessing}
                        required
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="CARD NUMBER" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-bit-blue transition text-slate-800"
                        disabled={paymentProcessing}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-bit-blue transition text-slate-800 text-center"
                        disabled={paymentProcessing}
                        required
                      />
                      <input 
                        type="password" 
                        placeholder="CVV" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-bit-blue transition text-slate-800 text-center"
                        disabled={paymentProcessing}
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentSuccess}
                    disabled={paymentProcessing || !cardName || cardNumber.length < 15 || cardExpiry.length < 5 || cardCvv.length < 3}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm uppercase tracking-wide mt-2"
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing Transaction...
                      </>
                    ) : (
                      `Pay ₹${feeAmount}`
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
