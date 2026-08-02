import React from "react";
import { notFound } from "next/navigation";
import { Users, FileSpreadsheet, MapPin, Award, CheckCircle, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";

interface DeptData {
  name: string;
  code: string;
  hodName: string;
  hodTitle: string;
  hodEmail: string;
  hodImage: string;
  intakeSeats: string;
  established: string;
  description: string;
  labs: string[];
  faculty: { name: string; designation: string; qual: string }[];
}

const DEPARTMENTS: Record<string, DeptData> = {
  cse: {
    name: "Computer Science & Engineering",
    code: "CSE",
    hodName: "Prof. Arvind Kumar",
    hodTitle: "Associate Professor & Head (CSE)",
    hodEmail: "arvind.cse@bit.ac.in",
    hodImage: "https://placehold.co/150x150/0b4c8c/ffffff?text=Prof.+Arvind",
    intakeSeats: "180 Seats (B.Tech)",
    established: "2009",
    description: "The Department of Computer Science & Engineering prepares students for advanced engineering paths in software development, Cloud Computing, Artificial Intelligence, and Blockchain. Equipped with high-speed development platforms and specialized labs.",
    labs: [
      "AI & ML Innovation Lab (equipped with modern GPU rigs)",
      "Database Systems and Software Engineering Lab",
      "Network Security & Cyber Forensics Lab",
      "Advanced Java and Python Coding Workspace"
    ],
    faculty: [
      { name: "Prof. Arvind Kumar", designation: "Head of Department", qual: "M.Tech, Ph.D (Pursuing)" },
      { name: "Shri S. K. Srivastava", designation: "Assistant Professor", qual: "M.Tech (IIT Roorkee)" },
      { name: "Smt. Ranjana Pandey", designation: "Assistant Professor", qual: "M.Tech (KNIT Sultanpur)" },
      { name: "Shri Amit Gupta", designation: "Assistant Professor", qual: "M.Tech (CSE)" }
    ]
  },
  ece: {
    name: "Electronics & Communication Engineering",
    code: "ECE",
    hodName: "Dr. S. C. Gupta",
    hodTitle: "Professor & Head (ECE)",
    hodEmail: "scgupta.ece@bit.ac.in",
    hodImage: "https://placehold.co/150x150/0b4c8c/ffffff?text=Dr.+Gupta",
    intakeSeats: "60 Seats (B.Tech)",
    established: "2009",
    description: "The Electronics and Communication Engineering department delivers foundational knowledge in VLSI design, IoT network architectures, embedded electronics, and RF engineering. Emphasis is laid on hardware prototyping and publication output.",
    labs: [
      "VLSI Design & Cadence Tool Suite Lab",
      "Microprocessors & Embedded Systems Prototyping Lab",
      "IoT Research & Smart Sensor Systems Lab",
      "Analog & Digital Communication Lab"
    ],
    faculty: [
      { name: "Dr. S. C. Gupta", designation: "Professor & Head", qual: "Ph.D (IIT BHU)" },
      { name: "Shri Vineet Pathak", designation: "Assistant Professor", qual: "M.Tech (ECE)" },
      { name: "Smt. Shweta Rai", designation: "Assistant Professor", qual: "M.Tech (VLSI)" }
    ]
  },
  me: {
    name: "Mechanical Engineering",
    code: "ME",
    hodName: "Shri S. K. Dwivedi",
    hodTitle: "Assistant Professor & Head (ME)",
    hodEmail: "dwivedi.me@bit.ac.in",
    hodImage: "https://placehold.co/150x150/0b4c8c/ffffff?text=Shri+Dwivedi",
    intakeSeats: "60 Seats (B.Tech)",
    established: "2009",
    description: "The ME Department houses state-of-the-art workshops, fluid mechanics laboratories, CAD/CAM layout systems, and material testing machines. Our graduates are consistently placed in industrial sectors and heavy machinery plants.",
    labs: [
      "CAD/CAM Modelling & Simulation Studio",
      "Fluid Mechanics & Hydraulic Machinery Lab",
      "Internal Combustion (IC) Engines Lab",
      "Central Workshop & Foundry Workspace"
    ],
    faculty: [
      { name: "Shri S. K. Dwivedi", designation: "Head of Department", qual: "M.Tech (Thermal)" },
      { name: "Shri Rajesh Shukla", designation: "Assistant Professor", qual: "M.Tech (Machine Design)" },
      { name: "Shri Manish Mishra", designation: "Assistant Professor", qual: "M.Tech (Manufacturing)" }
    ]
  },
  ce: {
    name: "Civil Engineering",
    code: "CE",
    hodName: "Shri V. K. Singh",
    hodTitle: "Assistant Professor & Head (CE)",
    hodEmail: "vksingh.ce@bit.ac.in",
    hodImage: "https://placehold.co/150x150/0b4c8c/ffffff?text=Shri+Singh",
    intakeSeats: "60 Seats (B.Tech)",
    established: "2011",
    description: "Civil Engineering deals with the planning, design, and construction of structures. The department trains engineers to excel in soil mechanics, surveying, structural integrity, and concrete technologies.",
    labs: [
      "Concrete Testing and Construction Material Lab",
      "Soil Mechanics & Geotechnical Engineering Lab",
      "Surveying & GPS Mapping Field Office",
      "Environmental Engineering Quality Check Lab"
    ],
    faculty: [
      { name: "Shri V. K. Singh", designation: "Head of Department", qual: "M.Tech (Structural)" },
      { name: "Shri Alok Pandey", designation: "Assistant Professor", qual: "M.Tech (CE)" },
      { name: "Shri Sandeep Yadav", designation: "Assistant Professor", qual: "M.Tech (Geotech)" }
    ]
  },
  ash: {
    name: "Applied Sciences & Humanities",
    code: "ASH",
    hodName: "Dr. Anita Roy",
    hodTitle: "Associate Professor & Head (ASH)",
    hodEmail: "anita.roy@bit.ac.in",
    hodImage: "https://placehold.co/150x150/0b4c8c/ffffff?text=Dr.+Anita",
    intakeSeats: "First-Year Support Desk",
    established: "2009",
    description: "Applied Sciences & Humanities department focuses on Physics, Chemistry, Mathematics, and Professional Communication skills for all first-year B.Tech engineering branches under AKTU curriculum. It establishes strong fundamental concepts.",
    labs: [
      "Engineering Physics Experimental Lab",
      "Engineering Chemistry Experimental Lab",
      "Language Communication & Personality Soft-Skills Lab"
    ],
    faculty: [
      { name: "Dr. Anita Roy", designation: "Head & Physics Head", qual: "Ph.D (Physics)" },
      { name: "Dr. P. K. Singh", designation: "Assistant Professor (Maths)", qual: "Ph.D (Applied Mathematics)" },
      { name: "Smt. Kiran Mishra", designation: "Assistant Professor (English)", qual: "M.A, M.Phil (English)" }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { dept: "cse" },
    { dept: "ece" },
    { dept: "me" },
    { dept: "ce" },
    { dept: "ash" }
  ];
}

export const dynamic = "force-dynamic";

export default async function DepartmentPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = await params;
  const data = DEPARTMENTS[dept.toLowerCase()];
  
  if (!data) notFound();

  const user = await getCurrentUser();

  return (
    <>
      <Header user={user} />

      {/* Breadcrumb section */}
      <div className="w-full bg-slate-100 border-b border-slate-200 py-3 px-4 md:px-8 text-xs font-semibold text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-bit-blue">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Departments</span>
          <span>/</span>
          <span className="text-bit-red">{data.code}</span>
        </div>
      </div>

      {/* Dept Intro Block */}
      <section className="bg-white py-12 px-4 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Main Info */}
          <div className="lg:w-2/3">
            <span className="text-xs font-bold text-bit-red uppercase tracking-widest bg-bit-red-light px-2.5 py-1 rounded">
              Academic Branch Code: {data.code}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-bit-blue mt-3">
              Department of {data.name}
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-4">
              {data.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
                <Users className="w-5 h-5 text-bit-blue" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Student Intake</span>
                  <span className="text-xs font-bold text-slate-700">{data.intakeSeats}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-bit-blue" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Established In</span>
                  <span className="text-xs font-bold text-slate-700">{data.established}</span>
                </div>
              </div>
            </div>

            {/* Labs */}
            <div className="mt-8">
              <h2 className="font-serif text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                Advanced Laboratories & Workspaces
              </h2>
              <div className="flex flex-col gap-3">
                {data.labs.map((lab, i) => (
                  <div key={i} className="flex gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-bit-blue shrink-0 mt-0.5" />
                    <span>{lab}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HOD Profile Box */}
          <div className="lg:w-1/3 bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-slate-300 shadow bg-slate-100 flex items-center justify-center">
              <img 
                src={data.hodImage} 
                alt={data.hodName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg mt-4 leading-tight">
              {data.hodName}
            </h3>
            <span className="text-xs text-slate-500 font-medium block mt-1">
              {data.hodTitle}
            </span>
            <div className="h-px bg-slate-200 w-full my-4"></div>
            <div className="text-xs text-slate-600 space-y-1">
              <span className="block font-bold text-[10px] text-slate-400 uppercase">HOD Email Contact</span>
              <span className="block text-bit-blue underline select-all font-mono">{data.hodEmail}</span>
              <span className="block text-slate-400 italic text-[10px] mt-4">Available for academic queries during office hours.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty list */}
      <section className="py-16 px-4 md:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-bold text-bit-red uppercase tracking-widest">
              Branch Roster
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-bit-blue mt-1">
              Dedicated Faculty & Instructors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.faculty.map((member, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start gap-4"
              >
                <div className="bg-bit-blue/10 text-bit-blue p-2.5 rounded shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-slate-800 text-base leading-tight">
                    {member.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5">
                    {member.designation}
                  </span>
                  <span className="text-xs text-slate-400 mt-2 font-medium">
                    Qual: {member.qual}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Chatbot />
      <Footer />
    </>
  );
}
