"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, UserCheck, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import Link from "next/link";
import { login } from "src/actions/auth";

export default function LoginPage() {
  const [role, setRole] = useState<"STUDENT" | "FACULTY" | "ADMIN">("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    startTransition(async () => {
      const res = await login(null, formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        router.push(`/dashboard/${role.toLowerCase()}`);
      }
    });
  };

  const testCredentials = {
    STUDENT: { id: "BIT-STUDENT-2026-001", pass: "student123" },
    FACULTY: { id: "BIT-FACULTY-101", pass: "faculty123" },
    ADMIN: { id: "BIT-ADMIN-001", pass: "admin123" }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between no-print">
      {/* Mini top bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-6 flex justify-between items-center shadow-xs">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-bit-blue transition">
          <ArrowLeft className="w-4 h-4" /> Back to Main Site
        </Link>
        <span className="text-xs font-bold text-slate-400">BIT Gorakhpur ERP Portal</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
          
          {/* Brand header */}
          <div className="bg-bit-blue text-white p-6 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
            <img 
              src="https://www.bit.ac.in/images/logo.png" 
              alt="BIT Logo" 
              className="h-14 w-auto mx-auto bg-white p-1 rounded-md mb-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/100x100/ffffff/0b4c8c?text=BIT";
              }}
            />
            <h1 className="font-serif font-bold text-xl uppercase tracking-wider">BIT ERP Login Desk</h1>
            <p className="text-xs text-slate-200 mt-1">Access your grades, schedules, fee structure and notices</p>
          </div>

          {/* Role selector Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-100/50">
            <button
              onClick={() => { setRole("STUDENT"); setError(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
                role === "STUDENT" 
                  ? "border-bit-red text-bit-blue bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => { setRole("FACULTY"); setError(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
                role === "FACULTY" 
                  ? "border-bit-red text-bit-blue bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => { setRole("ADMIN"); setError(null); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
                role === "ADMIN" 
                  ? "border-bit-red text-bit-blue bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                BIT ID Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="bitId"
                  placeholder={`e.g. ${testCredentials[role].id}`}
                  className="w-full border border-slate-200 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Secure Account Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full border border-slate-200 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-bit-blue"
                  required
                />
              </div>
            </div>

            {/* OTP Future note */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold cursor-not-allowed">
                Future Support: Request OTP?
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-bit-blue hover:bg-bit-blue-dark text-white py-2.5 rounded font-bold transition text-sm shadow hover:shadow-bit-blue/20 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
            >
              <KeyRound className="w-4.5 h-4.5" />
              {isPending ? "Verifying Credentials..." : "Authenticate Session"}
            </button>

            {/* Demo Testing Box */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-bit-red" /> Demo Sandbox Credentials:
              </span>
              <div className="mt-1.5 text-xs text-slate-600 space-y-1 font-mono">
                <div>ID: <span className="font-bold text-bit-blue">{testCredentials[role].id}</span></div>
                <div>Pass: <span className="font-bold text-bit-red">{testCredentials[role].pass}</span></div>
              </div>
            </div>
          </form>

        </div>
      </div>

      {/* Mini bottom footer */}
      <div className="bg-white border-t border-slate-200 py-3 text-center text-[10px] text-slate-400">
        &copy; {new Date().getFullYear()} Buddha Institute of Technology (BIT). Security protocol SSL Active.
      </div>
    </div>
  );
}
