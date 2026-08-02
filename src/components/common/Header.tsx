"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, User, Phone, Mail, GraduationCap } from "lucide-react";
import SearchOverlay from "./SearchOverlay"; // Trigger TS reload

interface HeaderProps {
  user?: any;
}

export default function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMegaMenu = (menu: string) => {
    if (activeMegaMenu === menu) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menu);
    }
  };

  const menuItems = {
    departments: [
      { name: "Computer Science & Engineering", href: "/departments/cse" },
      { name: "Electronics & Communication Eng.", href: "/departments/ece" },
      { name: "Mechanical Engineering", href: "/departments/me" },
      { name: "Civil Engineering", href: "/departments/ce" },
      { name: "Applied Sciences & Humanities", href: "/departments/ash" }
    ],
    academics: [
      { name: "B.Tech Programs", href: "/academics/btech" },
      { name: "M.Tech Programs", href: "/academics/mtech" },
      { name: "Polytechnic / Diploma", href: "/academics/diploma" },
      { name: "Academic Calendar", href: "/academics/calendar" },
      { name: "Syllabus Structure", href: "/academics/syllabus" },
      { name: "Downloads & Forms", href: "/downloads" }
    ],
    admissions: [
      { name: "Admission Procedure", href: "/admissions" },
      { name: "Fee Structure", href: "/admissions#fees" },
      { name: "Scholarships Details", href: "/admissions#scholarships" },
      { name: "Online Admission Form", href: "/admission-form" },
      { name: "Online Inquiry", href: "/contact#inquiry" }
    ],
    campus: [
      { name: "Tagore Hostel (Boys)", href: "/campus#hostels" },
      { name: "Sarla Devi Hostel (Girls)", href: "/campus#hostels" },
      { name: "Central Library", href: "/campus#library" },
      { name: "Sports Facilities & Spardha", href: "/campus#sports" },
      { name: "Transport & Routes", href: "/campus#transport" }
    ],
    placements: [
      { name: "Placement Highlights", href: "/placements" },
      { name: "Our Top Recruiters", href: "/placements#recruiters" },
      { name: "Training & Placement Cell", href: "/placements#cell" },
      { name: "Student Registrations", href: "/login" }
    ]
  };

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 z-50 sticky top-0 no-print">
        {/* Top bar info */}
        <div className="w-full bg-bit-blue text-white text-xs py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Phone className="w-3.5 h-3.5" /> +91-9554559900, +91-9648999954
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Mail className="w-3.5 h-3.5" /> director@bit.ac.in
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-90">Affiliated to AKTU College Code: 525</span>
            <div className="h-3 w-px bg-white/30 hidden md:block"></div>
            <Link href="/downloads" className="underline hover:text-bit-red-light">Downloads</Link>
            <Link href="/contact" className="underline hover:text-bit-red-light">Contact Us</Link>
          </div>
        </div>

        {/* Main Logo & Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="https://www.bit.ac.in/images/logo.png" 
              alt="BIT Logo" 
              className="h-12 w-auto md:h-14 object-contain"
              onError={(e) => {
                // Fallback image source path
                (e.target as HTMLImageElement).src = "https://placehold.co/150x50/0b4c8c/ffffff?text=BIT+Gorakhpur";
              }}
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base md:text-xl text-bit-blue tracking-wide leading-none">
                BUDDHA INSTITUTE
              </span>
              <span className="font-serif font-semibold text-xs md:text-sm text-bit-red tracking-wider mt-0.5">
                OF TECHNOLOGY, GORAKHPUR
              </span>
              <span className="text-[9px] text-slate-500 font-sans tracking-widest uppercase">
                Approved by AICTE | Affiliated to AKTU
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button 
                onClick={() => toggleMegaMenu("departments")}
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-bit-blue py-2"
              >
                Departments <ChevronDown className="w-4 h-4" />
              </button>
              {activeMegaMenu === "departments" && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 shadow-xl rounded-md py-2 z-50">
                  {menuItems.departments.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setActiveMegaMenu(null)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-bit-blue transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative group">
              <button 
                onClick={() => toggleMegaMenu("academics")}
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-bit-blue py-2"
              >
                Academics <ChevronDown className="w-4 h-4" />
              </button>
              {activeMegaMenu === "academics" && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-md py-2 z-50">
                  {menuItems.academics.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setActiveMegaMenu(null)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-bit-blue transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative group">
              <button 
                onClick={() => toggleMegaMenu("admissions")}
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-bit-blue py-2"
              >
                Admissions <ChevronDown className="w-4 h-4" />
              </button>
              {activeMegaMenu === "admissions" && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-md py-2 z-50">
                  {menuItems.admissions.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setActiveMegaMenu(null)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-bit-blue transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative group">
              <button 
                onClick={() => toggleMegaMenu("campus")}
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-bit-blue py-2"
              >
                Campus Life <ChevronDown className="w-4 h-4" />
              </button>
              {activeMegaMenu === "campus" && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-md py-2 z-50">
                  {menuItems.campus.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setActiveMegaMenu(null)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-bit-blue transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/placements" className="text-sm font-semibold text-slate-700 hover:text-bit-blue">
              Placements
            </Link>

            <Link href="/research" className="text-sm font-semibold text-slate-700 hover:text-bit-blue">
              Research
            </Link>

            {/* Icons Actions */}
            <div className="flex items-center gap-4 ml-4">
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-slate-500 hover:text-bit-blue cursor-pointer"
                title="Search Site"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {user ? (
                <Link 
                  href={`/dashboard/${user.role.toLowerCase()}`}
                  className="flex items-center gap-1.5 bg-bit-blue text-white px-4 py-1.5 rounded text-sm font-bold shadow hover:bg-bit-blue-dark transition"
                >
                  <User className="w-4 h-4" /> ERP Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-1.5 bg-bit-red text-white px-4 py-1.5 rounded text-sm font-bold shadow hover:bg-bit-red-dark transition"
                >
                  <GraduationCap className="w-4 h-4" /> Portal Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-slate-500 hover:text-bit-blue"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-bit-blue"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white w-full py-4 px-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            {/* Login options */}
            {user ? (
              <Link 
                href={`/dashboard/${user.role.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-bit-blue text-white py-2 rounded text-sm font-bold shadow"
              >
                <User className="w-4.5 h-4.5" /> ERP Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-bit-red text-white py-2 rounded text-sm font-bold shadow"
              >
                <GraduationCap className="w-4.5 h-4.5" /> Portal Login
              </Link>
            )}

            <div className="h-px bg-slate-100"></div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admissions</span>
              <Link href="/admissions" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1 hover:text-bit-blue">Admission Guidelines</Link>
              <Link href="/admission-form" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1 hover:text-bit-blue font-bold text-bit-red">Online Admission Form</Link>
            </div>

            <div className="h-px bg-slate-100"></div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Portals</span>
              <Link href="/placements" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1 hover:text-bit-blue">Placements</Link>
              <Link href="/research" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1 hover:text-bit-blue">Research & Papers</Link>
              <Link href="/downloads" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-1 hover:text-bit-blue">Downloads</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departments</span>
              {menuItems.departments.map(d => (
                <Link key={d.name} href={d.href} onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-600 pl-2 py-0.5 hover:text-bit-blue">{d.name}</Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Services</span>
              {menuItems.campus.map(c => (
                <Link key={c.name} href={c.href} onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-600 pl-2 py-0.5 hover:text-bit-blue">{c.name}</Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Global search overlay modal */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
