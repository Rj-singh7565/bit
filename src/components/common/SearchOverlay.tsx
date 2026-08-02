"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, FileText, Calendar, Users, Bookmark } from "lucide-react";

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    category: string;
    title: string;
    href: string;
    icon: any;
  }[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Mock index for instant search feedback
  const searchIndex = [
    { category: "Department", title: "Computer Science & Engineering (CSE)", href: "/departments/cse", icon: Users },
    { category: "Department", title: "Electronics & Communication Engineering (ECE)", href: "/departments/ece", icon: Users },
    { category: "Department", title: "Civil Engineering (CE)", href: "/departments/ce", icon: Users },
    { category: "Department", title: "Mechanical Engineering (ME)", href: "/departments/me", icon: Users },
    { category: "Department", title: "Applied Sciences & Humanities", href: "/departments/ash", icon: Users },
    
    { category: "Notice", title: "AKTU Odd Semester Examination Registrations 2026", href: "/#notices", icon: FileText },
    { category: "Notice", title: "TCS Campus Placement Drive for 2026 Batch", href: "/#notices", icon: FileText },
    { category: "Notice", title: "Hostel Fee Submission & Room Re-Allotment Guidelines", href: "/#notices", icon: FileText },
    
    { category: "Event", title: "Spardha 2026 - Annual Sports Meet", href: "/#events", icon: Calendar },
    { category: "Event", title: "Buddha TechFest 2026 Hackathon", href: "/#events", icon: Calendar },

    { category: "Faculty", title: "Prof. Arvind Kumar (HOD, Computer Science)", href: "/departments/cse#faculty", icon: Users },
    { category: "Faculty", title: "Dr. S. C. Gupta (Professor, ECE)", href: "/departments/ece#faculty", icon: Users },

    { category: "Downloads", title: "AKTU Exam Registration Form 2026 (PDF)", href: "/downloads", icon: Bookmark },
    { category: "Downloads", title: "BIT Placement Policy Guidelines Brochure", href: "/downloads", icon: Bookmark },
    { category: "Downloads", title: "Anti-Ragging Affadavit Registration Form", href: "/downloads", icon: Bookmark }
  ];

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const filtered = searchIndex.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col justify-start pt-24 px-4 md:px-8 no-print">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search bar input */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Faculty, Departments, Notices, Research, Events, Downloads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-800 focus:outline-none placeholder-slate-400 text-base py-1"
          />
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results panel */}
        <div className="p-4 max-h-[50vh] overflow-y-auto bg-slate-50">
          {query.trim().length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              Type at least 2 characters to start searching the portal database...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              No results found matching &quot;<span className="font-semibold">{query}</span>&quot;
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Matching Results ({results.length})
              </span>
              {results.map((item, index) => {
                const IconComp = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 bg-white hover:bg-bit-blue-light border border-slate-100 hover:border-bit-blue/20 p-3 rounded-md transition group"
                  >
                    <div className="bg-slate-100 group-hover:bg-white text-slate-500 group-hover:text-bit-blue p-2 rounded">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-bit-blue transition">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex justify-between items-center text-[11px] text-slate-500">
          <span>Search indexing is active</span>
          <span>Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono shadow-sm">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
