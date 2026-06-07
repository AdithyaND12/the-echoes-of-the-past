'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl p-6 md:p-12 rounded-[12px] bg-archive-black/60 backdrop-blur-md border border-archive-amber/20 shadow-[0_0_50px_rgba(17,17,17,0.8)] flex flex-col items-center"
      >
        <div className="flex flex-col items-center w-full">
          {/* Title with flickering cursor */}
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-archive-white mb-4 text-center drop-shadow-lg">
            The Echoes <br /> 
            <span className="text-archive-amber drop-shadow-[0_0_8px_rgba(200,155,99,0.4)]">Of The Past</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-[0.4em] h-[0.9em] bg-archive-amber ml-2 align-baseline shadow-[0_0_10px_#C89B63]"
            />
          </h1>

          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-archive-amber/50 to-transparent mb-6" />
          
          <p className="text-xs md:text-sm text-archive-white/70 mb-8 font-mono leading-relaxed max-w-md text-center tracking-wide">
            Reclaim lost memories by identifying the familiar sounds that defined a generation.
          </p>
          
          {/* Frosted Glass Inputs */}
          <div className="w-full max-w-[280px] flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-archive-amber uppercase tracking-[0.2em] ml-1">Subject Designation</label>
              <input 
                type="text" 
                placeholder="Enter ID or Alias..." 
                className="w-full bg-white/5 border border-white/10 rounded-[12px] px-4 py-2 text-archive-white placeholder:text-archive-white/30 focus:outline-none focus:border-archive-amber/60 focus:bg-white/10 focus:ring-1 focus:ring-archive-amber/30 transition-all duration-300 backdrop-blur-sm text-sm"
              />
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col items-center w-full max-w-[280px]">
            <Link href="/join" className="w-full group">
              <button className="relative w-full py-4 bg-archive-amber/10 border border-archive-amber text-archive-amber uppercase tracking-[0.3em] font-bold rounded-[12px] overflow-hidden transition-all duration-300 hover:text-archive-black hover:shadow-[0_0_30px_rgba(200,155,99,0.6)] active:scale-[0.98] active:bg-archive-amber/80 text-sm">
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
