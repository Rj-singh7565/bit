import React from "react";
import Link from "next/link";
import { 
  FileText, Calendar, BookOpen, UserCheck, PhoneCall, 
  MapPin, CheckCircle, ArrowRight, Download, Award
} from "lucide-react";
import { prisma } from "src/lib/db";
import { getCurrentUser, seedDatabase } from "src/actions/auth";
import { getCMSContent } from "src/actions/cms";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import HomeHero from "src/components/home/HomeHero";
import HomeStats from "src/components/home/HomeStats";
import Chatbot from "src/components/ai/Chatbot";

export const revalidate = 0; // Fresh updates on each reload

export default async function HomePage() {
  // Auto-seed database if empty so there is immediate content
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("Empty database detected. Running seed script...");
      await seedDatabase();
    }
  } catch (err) {
    console.error("Autoseed check failed:", err);
  }

  // Load user session
  const user = await getCurrentUser();

  // Load CMS Content
  const heroCms = await getCMSContent("hero", {
    title: "BUDDHA INSTITUTE OF TECHNOLOGY",
    subtitle: "Affiliated to AKTU Lucknow & Approved by AICTE New Delhi",
    slogan: "Empowering Futures, Inspiring Minds since 2009",
    buttonText: "Apply Now for 2026-27"
  });

  const statsCms = await getCMSContent("stats", {
    students: "3,500+",
    faculty: "150+",
    placements: "88%",
    packages: "12 LPA",
    area: "20 Acres",
    labs: "45+"
  });

  // Fetch notices
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  // Fetch events
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 3
  });

  const recruiters = [
    { name: "TCS", logo: "https://placehold.co/120x60/f1f5f9/0b4c8c?text=TCS" },
    { name: "Wipro", logo: "https://placehold.co/120x60/f1f5f9/0b4c8c?text=Wipro" },
    { name: "HCL Tech", logo: "https://placehold.co/120x60/f1f5f9/0b4c8c?text=HCL+Tech" },
    { name: "Cognizant", logo: "https://placehold.co/120x60/f1f5f9/0b4c8c?text=Cognizant" },
    { name: "Mobiloitte", logo: "https://placehold.co/120x60/f1f5f9/0b4c8c?text=Mobiloitte" }
  ];

  return (
    <>
      <Header user={user} />
      
      {/* Hero Section */}
      <HomeHero cmsData={heroCms} />

      {/* Quick Access Toolbar */}
      <div className="w-full bg-slate-100 border-b border-slate-200 py-4 px-4 md:px-8 z-20 relative no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm font-semibold text-slate-700">
          <Link href="/admission-form" className="flex items-center gap-1.5 hover:text-bit-blue bg-white border border-slate-200 px-4 py-2 rounded shadow-sm transition">
            <BookOpen className="w-4 h-4 text-bit-red" /> Apply Now 2026
          </Link>
          <Link href="/placements" className="flex items-center gap-1.5 hover:text-bit-blue bg-white border border-slate-200 px-4 py-2 rounded shadow-sm transition">
            <Award className="w-4 h-4 text-bit-red" /> Placements Portal
          </Link>
          <Link href="/downloads" className="flex items-center gap-1.5 hover:text-bit-blue bg-white border border-slate-200 px-4 py-2 rounded shadow-sm transition">
            <Download className="w-4 h-4 text-bit-red" /> Forms & Downloads
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 hover:text-bit-blue bg-white border border-slate-200 px-4 py-2 rounded shadow-sm transition">
            <UserCheck className="w-4 h-4 text-bit-red" /> Student ERP Portal
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-bit-blue bg-white border border-slate-200 px-4 py-2 rounded shadow-sm transition">
            <PhoneCall className="w-4 h-4 text-bit-red" /> Campus Contact Info
          </Link>
        </div>
      </div>

      {/* Stats Counter Panel */}
      <HomeStats cmsData={statsCms} />

      {/* Notice Board & Upcoming Events */}
      <section className="py-16 px-4 md:px-8 bg-slate-50 border-b border-slate-200 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Latest Notices - Left Column (Col-Span 2) */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-bit-blue" />
                <h2 className="font-serif text-2xl font-bold tracking-tight text-bit-blue">
                  Latest Notices & Registrar Circulars
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Real-Time Updates
              </span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {notices.map((notice) => (
                <div 
                  key={notice.id} 
                  className="p-4 border border-slate-100 hover:border-bit-blue/20 bg-slate-50/50 hover:bg-bit-blue-light/20 rounded-md transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {notice.pinned && (
                        <span className="bg-bit-red text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                          Pinned
                        </span>
                      )}
                      <span className="text-[10px] text-bit-blue font-bold uppercase tracking-wider bg-bit-blue-light px-2 py-0.5 rounded">
                        {notice.category}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base mt-2 hover:text-bit-blue transition">
                      {notice.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  {notice.pdfUrl && (
                    <a
                      href={notice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-bit-blue text-white px-3 py-1.5 rounded text-xs font-bold shadow hover:bg-bit-blue-dark transition shrink-0 self-start md:self-center"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Notice
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Events Board - Right Column */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4 mb-6">
              <Calendar className="w-6 h-6 text-bit-blue" />
              <h2 className="font-serif text-2xl font-bold tracking-tight text-bit-blue">
                Campus Events
              </h2>
            </div>

            <div className="flex flex-col gap-5 flex-1">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="bg-bit-red-light text-bit-red-dark flex flex-col items-center justify-center w-14 h-14 rounded font-serif shrink-0 border border-bit-red/10">
                    <span className="font-bold text-lg leading-none">
                      {event.date.split(" ")[1]?.replace(",", "") || "08"}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
                      {event.date.split(" ")[0] || "OCT"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight hover:text-bit-blue transition">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 block">
                      Category: {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/campus#sports" 
              className="mt-6 flex items-center justify-center gap-1.5 text-xs text-bit-blue font-bold hover:text-bit-red transition"
            >
              See All Activities & Sports <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Director Message */}
      <section className="py-16 px-4 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-12">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden border-2 border-slate-200 shadow-md shrink-0 bg-slate-100 flex items-center justify-center self-center">
            <img 
              src="https://www.bit.ac.in/images/bit_director_pic/bit_director_pic.png" 
              alt="Prof. (Dr.) Roop Ranjan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-bit-red uppercase tracking-widest">
              Director Message
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-bit-blue mt-1">
              Welcome to Buddha Institute of Technology
            </h2>
            <div className="text-slate-600 text-xs md:text-sm leading-relaxed mt-4 space-y-4 font-serif">
              <p>
                Welcome to Buddha Institute of Technology, GIDA, Gorakhpur — a place where knowledge, innovation, and values come together to shape the leaders of tomorrow.
              </p>
              <p>
                At our institute, we believe that education is not limited to classrooms and textbooks. True learning develops confidence, creativity, technical excellence, and a sense of responsibility towards society. Our aim is to provide students with an environment that encourages curiosity, critical thinking, and continuous growth.
              </p>
              <p>
                In today’s rapidly evolving world, the role of technical education has become more important than ever. We are committed to preparing our students not only for successful careers but also for meaningful contributions to the nation and society. With dedicated faculty members, modern infrastructure, industry-oriented learning, and a strong focus on research and innovation, we strive to create professionals who are competent, ethical, and future-ready.
              </p>
              <p>
                At Buddha Institute of Technology, we encourage students to dream big, work hard, and embrace challenges as opportunities for growth. Along with academic excellence, we emphasize discipline, leadership, teamwork, and overall personality development so that our students emerge as confident individuals capable of making a positive impact in the world.
              </p>
              <p className="italic">
                I invite aspiring students to become a part of our vibrant academic community and embark on a journey of learning, discovery, and success. Wishing you a bright and successful future.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <span className="font-bold text-slate-800 block text-base">Prof. (Dr.) Roop Ranjan</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Director, Buddha Institute of Technology, GIDA, Gorakhpur</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiters Panel */}
      <section className="py-12 bg-white px-4 md:px-8 border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Trusted by Elite Recruiters
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75">
            {recruiters.map((r, i) => (
              <img
                key={i}
                src={r.logo}
                alt={r.name}
                className="h-10 md:h-12 w-auto object-contain hover:opacity-100 transition filter grayscale hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Campus Gallery */}
      <section className="py-16 px-4 md:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold text-bit-red uppercase tracking-widest">
            Institutional Tour
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-bit-blue mt-1">
            Campus Life & Infrastructure
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-xl mx-auto">
            Discover our green academic campus, advanced electronics and VLSI research labs, smart lecture rooms, and boys & girls hostel facilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
            <div className="h-48 rounded overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <img 
                src="https://www.bit.ac.in/images/gallery/g1.jpg" 
                alt="Main Entrance" 
                className="w-full h-full object-cover hover:scale-105 transition duration-500" 
              />
            </div>
            <div className="h-48 rounded overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <img 
                src="https://www.bit.ac.in/images/gallery/g2.jpg" 
                alt="Computer Labs" 
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
            <div className="h-48 rounded overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <img 
                src="https://www.bit.ac.in/images/gallery/g3.jpg" 
                alt="Seminar Hall" 
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
            <div className="h-48 rounded overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <img 
                src="https://www.bit.ac.in/images/gallery/g4.jpg" 
                alt="VLSI Lab Research" 
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map and Office Address */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Address details */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <span className="text-xs font-bold text-bit-red uppercase tracking-widest">
              Location Desk
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-bit-blue mt-1">
              Visit Our Campus
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-4 leading-relaxed">
              Buddha Institute of Technology is situated in the industrial hub GIDA, approximately 12 kilometers from Gorakhpur Junction railway station, making it highly accessible via city transport.
            </p>
            <div className="mt-6 flex flex-col gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-bit-red" />
                <span>Sector-7, GIDA, Sahjanwa, Gorakhpur, UP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-bit-red" />
                <span>Daily Bus Routes active across Gorakhpur city</span>
              </div>
            </div>
          </div>

          {/* Simulated interactive map wrapper */}
          <div className="lg:w-2/3 h-80 rounded-lg overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4">
              <MapPin className="w-10 h-10 text-bit-red animate-bounce" />
              <h3 className="font-serif font-bold text-slate-800 text-lg mt-2">Buddha Institute of Technology</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                CL-1, Sector-7, GIDA, Gorakhpur, Uttar Pradesh 273209
              </p>
              <a 
                href="https://maps.google.com/?q=Buddha+Institute+of+Technology+Gorakhpur" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 bg-bit-blue text-white px-4 py-2 rounded text-xs font-bold shadow hover:bg-bit-blue-dark transition inline-flex items-center gap-1"
              >
                View on Google Maps <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>
        </div>
      </section>

      {/* AI Assistant Floating Widget */}
      <Chatbot />

      <Footer />
    </>
  );
}
