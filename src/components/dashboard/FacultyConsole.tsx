"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Award, BookOpen, FileText, ClipboardCheck, PieChart, 
  Settings, AlertCircle, Save, Calendar, Check, X, ShieldAlert 
} from "lucide-react";
import { recordAttendance, uploadInternalMarks } from "src/actions/erp";
import { logout } from "src/actions/auth";

interface FacultyConsoleProps {
  facultyUser: any;
  studentsList: any[];
}

export default function FacultyConsole({ facultyUser, studentsList }: FacultyConsoleProps) {
  const [activeTab, setActiveTab] = useState<"attendance" | "marks" | "notes" | "leave" | "analytics">("attendance");
  const [subject, setSubject] = useState("Compiler Design (KCS-702)");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, boolean>>(
    studentsList.reduce((acc, student) => ({ ...acc, [student.id]: true }), {})
  );
  
  // Internal marks fields
  const [selectedStudent, setSelectedStudent] = useState(studentsList[0]?.id || "");
  const [subjectCode, setSubjectCode] = useState("KCS-702");
  const [subjectName, setSubjectName] = useState("Compiler Design");
  const [marks, setMarks] = useState("42");
  const [semester, setSemester] = useState("7");

  // Notes state
  const [notesTitle, setNotesTitle] = useState("");
  const [notesCategory, setNotesCategory] = useState("Lecture Slide");
  
  // Status message
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const profile = facultyUser.facultyProfile;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleRecordAttendance = () => {
    setMsg(null);
    const data = Object.entries(attendanceRecords).map(([studentId, present]) => ({
      studentId,
      present
    }));

    startTransition(async () => {
      const res = await recordAttendance(profile.id, profile.department, 7, subject, data);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else if (res?.success) {
        setMsg({ type: "success", text: `Success! Attendance logged for ${data.length} students in ${subject}.` });
      }
    });
  };

  const handleUploadMarks = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const numMarks = parseFloat(marks);
    const numSem = parseInt(semester);
    if (!selectedStudent || isNaN(numMarks) || numMarks < 0 || numMarks > 50) {
      setMsg({ type: "error", text: "Please enter valid marks (0 - 50 max sessional)." });
      return;
    }

    startTransition(async () => {
      const res = await uploadInternalMarks(profile.id, selectedStudent, subjectCode, subjectName, numMarks, numSem);
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else if (res?.success) {
        setMsg({ type: "success", text: `Internal marks successfully uploaded for selected student!` });
      }
    });
  };

  const handleUploadNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!notesTitle.trim()) {
      setMsg({ type: "error", text: "Please enter a valid notes title." });
      return;
    }
    setMsg({ type: "success", text: `Material uploaded: '${notesTitle}' (${notesCategory}) added to student downloads panel.` });
    setNotesTitle("");
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8 py-8 px-4 md:px-8">
      
      {/* Sidebar Navigation - Left Column */}
      <div className="md:col-span-1 flex flex-col gap-4 no-print">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-bit-red/10 text-bit-red flex items-center justify-center font-serif font-bold text-2xl border border-bit-red/20 shadow">
            {facultyUser.name[0]}
          </div>
          <h2 className="font-serif font-bold text-slate-800 text-lg mt-3 leading-tight">{facultyUser.name}</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Faculty Code: {facultyUser.bitId}
          </span>
          <span className="text-xs text-bit-red font-semibold mt-1">
            {profile.designation}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {profile.department}
          </span>
          
          <div className="h-px bg-slate-100 w-full my-4"></div>
          
          <div className="w-full space-y-2 text-left text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Cabin Office:</span>
              <span>{profile.cabinNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Leave Balance:</span>
              <span className="text-green-600">{profile.leaveBalance} Days</span>
            </div>
            <div className="flex justify-between">
              <span>Specialization:</span>
              <span className="text-bit-blue truncate max-w-[120px]">{profile.specialization}</span>
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
            onClick={() => { setActiveTab("attendance"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "attendance" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <ClipboardCheck className="w-4.5 h-4.5" /> Log Attendance
          </button>

          <button
            onClick={() => { setActiveTab("marks"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "marks" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Award className="w-4.5 h-4.5" /> Upload Marks
          </button>

          <button
            onClick={() => { setActiveTab("notes"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "notes" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <FileText className="w-4.5 h-4.5" /> Lecture Notes
          </button>

          <button
            onClick={() => { setActiveTab("leave"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "leave" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <Calendar className="w-4.5 h-4.5" /> Leave Request
          </button>

          <button
            onClick={() => { setActiveTab("analytics"); setMsg(null); }}
            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-l-4 transition ${
              activeTab === "analytics" 
                ? "border-bit-red text-bit-blue bg-slate-50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <PieChart className="w-4.5 h-4.5" /> Student Analytics
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
            <AlertCircle className="w-4.5 h-4.5" />
            {msg.text}
          </div>
        )}

        {/* 1. LOG ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide flex items-center justify-between">
              <span>Daily Class Attendance Logging</span>
              <span className="text-xs text-slate-400 font-sans tracking-normal capitalize normal-case font-medium">Class: B.Tech Sem 7</span>
            </h2>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Subject Lecture</label>
                  <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-bit-blue"
                  >
                    <option>Compiler Design (KCS-702)</option>
                    <option>Distributed Systems (KCS-071)</option>
                    <option>Minor Project Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Lecture Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none"
                    disabled
                  />
                </div>
              </div>

              {/* Students grid checkoff */}
              <div className="border border-slate-200 rounded overflow-hidden mt-4">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                      <th className="p-3 border-r border-slate-200">Enrollment No</th>
                      <th className="p-3 border-r border-slate-200">Student Name</th>
                      <th className="p-3 border-r border-slate-200 text-center">Class Status</th>
                      <th className="p-3 text-center">Action Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-600">
                    {studentsList.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="p-3 border-r border-slate-200 font-mono font-bold text-bit-blue">{student.enrollmentNo}</td>
                        <td className="p-3 border-r border-slate-200">{student.user.name}</td>
                        <td className="p-3 border-r border-slate-200 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            attendanceRecords[student.id] 
                              ? "bg-green-100 text-green-700" 
                              : "bg-bit-red-light text-bit-red-dark"
                          }`}>
                            {attendanceRecords[student.id] ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleAttendance(student.id)}
                            className={`p-1.5 rounded transition cursor-pointer text-xs font-bold ${
                              attendanceRecords[student.id] 
                                ? "bg-bit-red-light text-bit-red hover:bg-bit-red-light/75" 
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {attendanceRecords[student.id] ? "Mark Absent" : "Mark Present"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleRecordAttendance}
                disabled={isPending}
                className="self-end inline-flex items-center gap-1.5 bg-bit-blue hover:bg-bit-blue-dark text-white px-5 py-2 rounded text-xs font-bold shadow transition mt-4 cursor-pointer disabled:bg-slate-300"
              >
                <Save className="w-4 h-4" /> Save Attendance Log
              </button>
            </div>
          </div>
        )}

        {/* 2. UPLOAD MARKS TAB */}
        {activeTab === "marks" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Log Student Sessional / Internal Exam Marks
            </h2>

            <form onSubmit={handleUploadMarks} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none"
                >
                  {studentsList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.user.name} ({s.enrollmentNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Semester Cycle</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Subject Code</label>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-bit-blue"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-bit-blue"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Sessional Marks Awarded (Max 50)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-bit-blue font-mono"
                  required
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 bg-bit-blue hover:bg-bit-blue-dark text-white px-5 py-2.5 rounded text-xs font-bold shadow transition cursor-pointer disabled:bg-slate-300"
                >
                  <Save className="w-4.5 h-4.5" /> Submit Marks Grid
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. LECTURE NOTES TAB */}
        {activeTab === "notes" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Upload Lectures slides & Syllabus notes
            </h2>

            <form onSubmit={handleUploadNotes} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Material Title</label>
                <input
                  type="text"
                  placeholder="e.g. LL(1) Parser Grammar Notes"
                  value={notesTitle}
                  onChange={(e) => setNotesTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Category</label>
                <select
                  value={notesCategory}
                  onChange={(e) => setNotesCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none"
                >
                  <option>Lecture Slide</option>
                  <option>Lab Manual Copy</option>
                  <option>Sessional Question Paper</option>
                  <option>Syllabus Outline</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-500 uppercase mb-1">Choose File (Simulated)</label>
                <div className="border-2 border-dashed border-slate-200 rounded p-6 text-center text-slate-400 bg-slate-50/50 flex flex-col items-center justify-center">
                  <FileText className="w-8 h-8 mb-2 text-slate-300" />
                  <span>Drag & Drop files or click to browse</span>
                  <span className="text-[10px] text-slate-400 mt-1">PDF, ZIP, PPTX formats up to 10MB</span>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-bit-blue hover:bg-bit-blue-dark text-white px-5 py-2.5 rounded text-xs font-bold shadow transition cursor-pointer"
                >
                  <Save className="w-4.5 h-4.5" /> Publish Materials
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. LEAVE REQUEST TAB */}
        {activeTab === "leave" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Faculty Leave Application desk
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Leave Balance</span>
                <span className="text-2xl font-bold text-green-600 font-mono mt-1">{profile.leaveBalance} Days</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Availed Leaves</span>
                <span className="text-2xl font-bold text-slate-700 font-mono mt-1">4 Days</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Approved Leaves</span>
                <span className="text-2xl font-bold text-slate-700 font-mono mt-1">4 Days</span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setMsg({ type: "success", text: "Leave request submitted to HOD & Director office for verification." }); }} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Leave Start Date</label>
                <input type="date" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" required />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Leave End Date</label>
                <input type="date" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" required />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-500 uppercase mb-1">Reason for Leave Request</label>
                <textarea rows={3} placeholder="Provide explanation..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none resize-none" required></textarea>
              </div>
              <div className="md:col-span-2 mt-2">
                <button type="submit" className="bg-bit-blue hover:bg-bit-blue-dark text-white px-5 py-2 rounded text-xs font-bold shadow transition cursor-pointer">
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. STUDENT ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-bit-blue border-b border-slate-200 pb-3 mb-6 uppercase tracking-wide">
              Student Class Performance Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Attendance Metrics (Average: 88%)</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Above 75% Attendance (Eligible)</span>
                      <span>100% of students</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Below 75% Attendance (Shortage risk)</span>
                      <span>0% of students</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-bit-red h-full rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Grades distribution (Average: 8.24 CGPA)</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Excellent (A+ Grade / Above 8.0 CGPA)</span>
                      <span>100% of candidates</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-bit-blue h-full rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
