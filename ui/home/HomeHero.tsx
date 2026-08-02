"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Award, Shield, BookOpen } from "lucide-react";

interface HeroData {
  title: string;
  subtitle: string;
  slogan: string;
  buttonText: string;
}

export default function HomeHero({ cmsData }: { cmsData: HeroData }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://www.bit.ac.in/images/slider_img1.jpg",
      fallback: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
      tagline: "Shaping Technical Excellence since 2009",
    },
    {
      image: "https://www.bit.ac.in/images/slider_img2.jpg",
      fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
      tagline: "AICTE Approved & Affiliated to AKTU Lucknow",
    },
    {
      image: "https://www.bit.ac.in/images/slider_img3.jpg",
      fallback: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80",
      tagline: "Gorakhpur's Premier Engineering Campus",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[400px] md:h-[550px] bg-slate-900 overflow-hidden no-print">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background image overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-bit-dark/95 via-bit-dark/70 to-transparent z-10" />
          <img
            src={slide.image}
            alt="BIT Gorakhpur Campus"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = slide.fallback;
            }}
          />
          
          {/* Content overlay */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-white">
                <span className="inline-flex items-center gap-1.5 bg-bit-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow animate-bounce">
                  <Award className="w-3.5 h-3.5" /> Admissions 2026 Open
                </span>
                
                <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide text-white leading-tight">
                  {cmsData.title}
                </h1>
                
                <p className="text-slate-300 text-xs md:text-sm tracking-wider font-semibold uppercase mt-2">
                  {cmsData.subtitle}
                </p>
                
                <p className="text-slate-200 text-sm md:text-lg italic mt-4 font-serif text-slate-300">
                  &ldquo;{cmsData.slogan} &ndash; {slide.tagline}&rdquo;
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link 
                    href="/admission-form"
                    className="flex items-center gap-2 bg-bit-red hover:bg-bit-red-dark text-white px-6 py-3 rounded font-bold shadow-lg hover:shadow-bit-red/20 transition-all duration-300 text-sm"
                  >
                    {cmsData.buttonText} <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <Link 
                    href="/placements"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded font-bold transition-all duration-300 text-sm backdrop-blur-sm"
                  >
                    View Placements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Nav Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-25 transition cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-25 transition cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide ? "bg-bit-red w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
