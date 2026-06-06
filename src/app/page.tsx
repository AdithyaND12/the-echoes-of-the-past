'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`2007/11/14 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-mono">
      {/* Dark Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-archive-black/50 backdrop-blur-[3px] z-0" />

      {/* TV Static Overlay */}
      <div className="pointer-events-none absolute inset-0 z-40 opacity-[0.06] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* HUD Elements */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-archive-green animate-pulse shadow-[0_0_10px_#7CFF7C]" />
        <span className="text-archive-green text-xs font-bold uppercase tracking-widest shadow-archive-green drop-shadow-[0_0_5px_rgba(124,255,124,0.5)]">Archive Status: Online</span>
      </div>
      <div className="absolute bottom-6 right-6 md:top-6 md:bottom-auto md:right-6 z-20">
        <span className="text-archive-white/80 text-sm md:text-lg uppercase font-mono tracking-widest drop-shadow-md">PLAY &#9654; {time}</span>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl p-8 md:p-16 rounded-[12px] bg-archive-black/60 backdrop-blur-md border border-archive-amber/20 shadow-[0_0_50px_rgba(17,17,17,0.8)] flex flex-col items-center"
      >
        <div className="flex flex-col items-center w-full">
          {/* Title with flickering cursor */}
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-archive-white mb-6 text-center drop-shadow-lg">
            The Echoes <br /> 
            <span className="text-archive-amber drop-shadow-[0_0_8px_rgba(200,155,99,0.4)]">Of The Past</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-[0.4em] h-[0.9em] bg-archive-amber ml-3 align-baseline shadow-[0_0_10px_#C89B63]"
            />
          </h1>

          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-archive-amber/50 to-transparent mb-8" />
          
          <p className="text-sm md:text-base text-archive-white/70 mb-12 font-mono leading-relaxed max-w-lg text-center tracking-wide">
            Reclaim lost memories by identifying the familiar sounds that defined a generation.
          </p>
          
          {/* Frosted Glass Inputs */}
          <div className="w-full max-w-md flex flex-col gap-6 mb-12">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-archive-amber uppercase tracking-[0.2em] ml-1">Subject Designation</label>
              <input 
                type="text" 
                placeholder="Enter ID or Alias..." 
                className="w-full bg-white/5 border border-white/10 rounded-[12px] px-5 py-4 text-archive-white placeholder:text-archive-white/30 focus:outline-none focus:border-archive-amber/60 focus:bg-white/10 focus:ring-1 focus:ring-archive-amber/30 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col items-center w-full max-w-md">
            <Link href="/join" className="w-full group">
              <button className="relative w-full py-5 bg-archive-amber/10 border border-archive-amber text-archive-amber uppercase tracking-[0.3em] font-bold rounded-[12px] overflow-hidden transition-all duration-300 hover:text-archive-black hover:shadow-[0_0_30px_rgba(200,155,99,0.6)] active:scale-[0.98] active:bg-archive-amber/80">
                <span className="relative z-10">Access Archives</span>
                <div className="absolute inset-0 bg-archive-amber w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />
              </button>
            </Link>

            {/* Loading/Progress Animation */}
            <div className="w-full h-1 bg-archive-black/80 mt-8 rounded-full overflow-hidden border border-white/5 relative">
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-1/3 bg-archive-green/60 shadow-[0_0_10px_#7CFF7C] rounded-full"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
