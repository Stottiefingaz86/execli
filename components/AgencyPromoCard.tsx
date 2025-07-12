"use client";
import React from 'react';
import { Wand2 } from 'lucide-react';

export default function AgencyPromoCard() {
  return (
    <div className="relative bg-white/8 border border-white/15 rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8 py-4 md:py-6 backdrop-blur-2xl w-full max-w-7xl mx-auto flex flex-col gap-2 md:gap-3 items-center md:items-start text-center md:text-left overflow-hidden" style={{minHeight: '1px'}}>
      {/* Glassmorphic glare overlay */}
      <div className="absolute -top-8 -left-8 w-2/3 h-1/2 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-2xl opacity-15 rotate-[-8deg] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tr from-white/10 to-transparent opacity-10 rounded-2xl pointer-events-none z-0" />
      {/* Tagline and Icon */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 w-full mb-1 md:mb-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] rounded-full flex items-center justify-center shadow-md">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#86EFF5] bg-[#232b4d]/60 px-3 py-1 rounded-full">New! Agency Services</span>
        </div>
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center md:items-start w-full">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-1 leading-tight">Execli Studio: Agency Services</h3>
        <p className="text-[#E0E6F7] text-sm md:text-base font-normal leading-snug mb-2 max-w-2xl">
          <span className="font-semibold text-white">Unlock your brand’s full potential.</span> Our in-house experts help you grow your review ratings, craft winning strategies, respond to negative feedback the right way, and improve your product based on real Voice of Customer insights—all with a hands-on, human approach.
        </p>
        <a href="/agency" className="inline-block border border-[#86EFF5] text-[#86EFF5] px-4 py-1.5 rounded-md font-medium shadow-none hover:bg-[#86EFF5]/10 hover:text-white transition-all duration-150 text-sm mt-1">
          Contact Execli Studio
        </a>
      </div>
    </div>
  );
} 