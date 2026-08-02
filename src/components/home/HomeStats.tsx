"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Users, ShieldAlert, Award, FileSpreadsheet, Map } from "lucide-react";

interface StatsData {
  students: string;
  faculty: string;
  placements: string;
  packages: string;
  area: string;
  labs: string;
}

export default function HomeStats({ cmsData }: { cmsData: StatsData }) {
  // Safe parsing values for simple counter animations
  const statsList = [
    {
      icon: Users,
      label: "Enrolled Students",
      target: 3500,
      suffix: "+",
      text: cmsData.students
    },
    {
      icon: GraduationCap,
      label: "Expert Faculty Members",
      target: 150,
      suffix: "+",
      text: cmsData.faculty
    },
    {
      icon: Award,
      label: "Placement Rate",
      target: 88,
      suffix: "%",
      text: cmsData.placements
    },
    {
      icon: FileSpreadsheet,
      label: "Highest Salary Package",
      target: 12,
      suffix: " LPA",
      text: cmsData.packages
    },
    {
      icon: Map,
      label: "Campus Size",
      target: 20,
      suffix: " Acres",
      text: cmsData.area
    },
    {
      icon: ShieldAlert,
      label: "Hi-Tech Laboratories",
      target: 45,
      suffix: "+",
      text: cmsData.labs
    }
  ];

  return (
    <section className="w-full bg-bit-blue py-12 px-4 md:px-8 text-white relative z-20 no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4 text-center">
        {statsList.map((stat, index) => {
          const IconComp = stat.icon;
          return (
            <div 
              key={index} 
              className="flex flex-col items-center p-3 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm shadow hover:bg-white/10 transition duration-300"
            >
              <div className="bg-white/10 p-2.5 rounded-full mb-3">
                <IconComp className="w-6 h-6 text-bit-red-light" />
              </div>
              <span className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-white block">
                {stat.text}
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300 mt-1">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
