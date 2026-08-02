import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bit-dark text-white border-t-4 border-bit-red pt-12 pb-6 px-4 md:px-8 mt-auto no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About & Logos */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://www.bit.ac.in/images/logo.png" 
              alt="BIT Logo" 
              className="h-12 w-auto bg-white p-1 rounded object-contain"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-wide">BUDDHA INSTITUTE</span>
              <span className="font-serif font-medium text-[11px] text-bit-red-light tracking-wider">OF TECHNOLOGY</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Established in 2009 under the aegis of the Buddha Group of Institutions, BIT Gorakhpur is a premier institute delivering technical and managerial excellence in eastern Uttar Pradesh.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold">AKTU Code: 525</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold">Approved by AICTE</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-sm font-bold border-b border-slate-700 pb-2 mb-4 tracking-wider uppercase">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
            <li><Link href="/admissions" className="hover:text-white transition">Admissions 2026-27</Link></li>
            <li><Link href="/placements" className="hover:text-white transition">Placement Statistics</Link></li>
            <li><Link href="/downloads" className="hover:text-white transition">Downloads & Formats</Link></li>
            <li><Link href="/research" className="hover:text-white transition">Research & Publications</Link></li>
            <li><Link href="/campus" className="hover:text-white transition">Campus Infrastructure</Link></li>
            <li>
              <a href="https://aktu.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                AKTU University Website <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h4 className="font-serif text-sm font-bold border-b border-slate-700 pb-2 mb-4 tracking-wider uppercase">
            Engineering Branches
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
            <li><Link href="/departments/cse" className="hover:text-white transition">Computer Science & Engineering</Link></li>
            <li><Link href="/departments/ece" className="hover:text-white transition">Electronics & Communication Eng.</Link></li>
            <li><Link href="/departments/me" className="hover:text-white transition">Mechanical Engineering</Link></li>
            <li><Link href="/departments/ce" className="hover:text-white transition">Civil Engineering</Link></li>
            <li><Link href="/departments/ash" className="hover:text-white transition">Applied Sciences & Humanities</Link></li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="font-serif text-sm font-bold border-b border-slate-700 pb-2 mb-4 tracking-wider uppercase">
            Contact Details
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-slate-400">
            <li className="flex gap-2">
              <MapPin className="w-4 h-4 text-bit-red shrink-0" />
              <span>
                CL-1, Sector-7, GIDA, Sahjanwa,<br />
                Gorakhpur, Uttar Pradesh - 273209
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-bit-red" />
              <span>+91-9554559900, +91-9648999954</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-bit-red" />
              <span>director@bit.ac.in, admission@bit.ac.in</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>&copy; {currentYear} Buddha Institute of Technology. All Rights Reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
          <span>&middot;</span>
          <Link href="/terms" className="hover:text-slate-400">Terms of Use</Link>
          <span>&middot;</span>
          <Link href="/login" className="hover:text-slate-400">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
