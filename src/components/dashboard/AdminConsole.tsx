"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, Users, ShieldAlert, LineChart, FileText, 
  Save, Plus, Database, AlertCircle, Trash, CheckCircle 
} from "lucide-react";
import { updateCMSContent } from "src/actions/cms";
import { logout } from "src/actions/auth";

interface AdminConsoleProps {
  adminUser: any;
  heroData: any;
  statsData: any;
  usersList: any[];
  auditLogs: any[];
}

export default function AdminConsole({
  adminUser,
  heroData,
  statsData,
  usersList,
  auditLogs
}: AdminConsoleProps) {
  const [activeTab, setActiveTab] = useState<"cms" | "users" | "logs" | "analytics">("cms");
  
  // CMS fields
  const [heroTitle, setHeroTitle] = useState(heroData.title || "");
  const [heroSubtitle, setHeroSubtitle] = useState(heroData.subtitle || "");
  const [heroSlogan, setHeroSlogan] = useState(heroData.slogan || "");
  const [heroButton, setHeroButton] = useState(heroData.buttonText || "");

  const [statStudents, setStatStudents] = useState(statsData.students || "");
  const [statFaculty, setStatFaculty] = useState(statsData.faculty || "");
  const [statPlacements, setStatPlacements] = useState(statsData.placements || "");
  const [statPackages, setStatPackages] = useState(statsData.packages || "");

  // Audit Search
  const [searchLog, setSearchLog] = useState("");

  // Status message
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleSaveCMS = () => {
    setMsg(null);
    startTransition(async () => {
      // Save Hero content
      const heroVal = { title: heroTitle, subtitle: heroSubtitle, slogan: heroSlogan, buttonText: heroButton };
      const resHero = await updateCMSContent("hero", heroVal);

      // Save Stats content
      const statsVal = { ...statsData, students: statStudents, faculty: statFaculty, placements: statPlacements, packages: statPackages };
      const resStats = await updateCMSContent("stats", statsVal);

      if (resHero?.error || resStats?.error) {
        setMsg({ type: "error", text: resHero?.error || resStats?.error || "Error saving CMS content." });
      } else {
        setMsg({ type: "success", text: "CMS configuration saved successfully! Website content is updated." });
      }
    });
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.details.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 md:px-8">
      
      {/* Sidebar Navigation - Left Column */}
      <div className="md:col-span-1 flex flex-col gap-4 no-print">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-bit-blue text-white flex items-center justify-center font-serif font-bold text-2xl border border-bit-blue/20 shadow">
            A
          </div>
          <h2 className="font-serif font-bold text-slate-800 text-lg mt-3 leading-tight">{adminUser.name}</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            System Administrator
          </span>
          <span className="text-xs text-slate-500 font-semibold mt-1">
            Office of the Director
          </span>
          
          <div className="h-px bg-slate-100 w-full my-4"></div>
          
          <div className="w-full space-y-2 text-left text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Admin Role:</span>
              <span className="text-bit-red font-bold">Root Admin</span>
            </div>
            <div className="flex justify-between">
              <span>Security Log:</span>
              <span className="text-green-600">SSL Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Database Size:</span>
              <span className="text-bit-blue">SQLite Dev Local</span>
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
            onClick={() => { setActiveTab("cms"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "cms" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Settings className="w-4.5 h-4.5" /> CMS Editor
          </button>

          <button
            onClick={() => { setActiveTab("users"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "users" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Users className="w-4.5 h-4.5" /> ERP Roster
          </button>

          <button
            onClick={() => { setActiveTab("logs"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "logs" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <ShieldAlert className="w-4.5 h-4.5" /> Security Logs
          </button>

          <button
            onClick={() => { setActiveTab("analytics"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "analytics" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <LineChart className="w-4.5 h-4.5" /> ERP Analytics
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
            <CheckCircle className="w-4.5 h-4.5" />
            {msg.text}
          </div>
        )}

        {/* 1. CMS EDITOR TAB */}
        {activeTab === "cms" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              CMS Website Section Editor
            </h2>

            <div className="flex flex-col gap-6 text-xs text-slate-700 font-semibold">
              
              {/* Hero Banner CMS */}
              <div className="border border-slate-200 rounded p-4 bg-slate-50/50 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1">Hero Banner Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Banner Title</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Banner Subtitle</label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-500 uppercase mb-1">Banner Slogan</label>
                    <input
                      type="text"
                      value={heroSlogan}
                      onChange={(e) => setHeroSlogan(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Apply Button Text</label>
                    <input
                      type="text"
                      value={heroButton}
                      onChange={(e) => setHeroButton(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics CMS */}
              <div className="border border-slate-200 rounded p-4 bg-slate-50/50 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1">Website Statistics Values</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Students Stat</label>
                    <input
                      type="text"
                      value={statStudents}
                      onChange={(e) => setStatStudents(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Faculty Stat</label>
                    <input
                      type="text"
                      value={statFaculty}
                      onChange={(e) => setStatFaculty(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Placements %</label>
                    <input
                      type="text"
                      value={statPlacements}
                      onChange={(e) => setStatPlacements(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase mb-1">Highest Package</label>
                    <input
                      type="text"
                      value={statPackages}
                      onChange={(e) => setStatPackages(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveCMS}
                disabled={isPending}
                className="self-start inline-flex items-center gap-1.5 bg-bit-blue hover:bg-bit-blue-dark text-white px-5 py-2 rounded shadow transition mt-2 cursor-pointer disabled:bg-slate-300"
              >
                <Save className="w-4 h-4" /> Save CMS Changes
              </button>

            </div>
          </div>
        )}

        {/* 2. ERP ROSTER TAB */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              ERP Student and Faculty Roster
            </h2>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-100">
                <span className="font-bold text-slate-500">Active Accounts: {usersList.length} registered</span>
                <span className="text-[10px] text-slate-400">Additions managed via administrative scripts.</span>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                      <th className="p-3 border-r border-slate-200">BIT ID</th>
                      <th className="p-3 border-r border-slate-200">Full Name</th>
                      <th className="p-3 border-r border-slate-200">Email Address</th>
                      <th className="p-3 text-center font-bold">Role Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600 font-medium">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50">
                        <td className="p-3 border-r border-slate-200 font-mono font-bold text-bit-blue">{user.bitId}</td>
                        <td className="p-3 border-r border-slate-200">{user.name}</td>
                        <td className="p-3 border-r border-slate-200 font-mono select-all">{user.email}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.role === "ADMIN" 
                              ? "bg-red-100 text-red-700" 
                              : user.role === "FACULTY" 
                              ? "bg-amber-100 text-amber-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. SECURITY LOGS TAB */}
        {activeTab === "logs" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              ERP Security & Activity Audit Trail
            </h2>

            <div className="flex flex-col gap-4 text-xs text-slate-600">
              
              {/* Search bar log */}
              <div className="flex items-center border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 gap-2 mb-2">
                <Database className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs by Action (e.g. USER_LOGIN) or details..."
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-xs text-slate-800"
                />
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                      <th className="p-3 border-r border-slate-200">Date/Time</th>
                      <th className="p-3 border-r border-slate-200">Action</th>
                      <th className="p-3 border-r border-slate-200">Transaction details</th>
                      <th className="p-3 text-center">IP Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 border-r border-slate-200 font-mono text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 border-r border-slate-200">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            log.action === "USER_LOGIN" 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : log.action === "FEE_PAYMENT" 
                              ? "bg-blue-50 text-blue-700 border border-blue-200" 
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-slate-700">{log.details}</td>
                        <td className="p-3 text-center font-mono text-[10px]">{log.ipAddress}</td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">No activity trail registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. ERP ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              System Accounts & Metrics Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
              <div className="border border-slate-200 rounded p-4 bg-slate-50/50 flex flex-col text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase mb-2">Total Students</span>
                <span className="text-3xl font-extrabold text-slate-700 font-mono">1</span>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">B.Tech Enrollment active</span>
              </div>
              <div className="border border-slate-200 rounded p-4 bg-slate-50/50 flex flex-col text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase mb-2">Total Faculty</span>
                <span className="text-3xl font-extrabold text-slate-700 font-mono">1</span>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">Academic staff logged</span>
              </div>
              <div className="border border-slate-200 rounded p-4 bg-slate-50/50 flex flex-col text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase mb-2">Total System Actions</span>
                <span className="text-3xl font-extrabold text-slate-700 font-mono">{auditLogs.length}</span>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">Recorded transaction codes</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
