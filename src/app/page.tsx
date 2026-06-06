'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-20 px-4">
      
      {/* Scattered Real Nostalgic Images */}
      {/* Vintage Cassette */}
      <motion.div 
        animate={{ rotate: [-5, -2, -5], y: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[5%] opacity-40 hidden lg:block w-64 h-48"
      >
        <img 
          src="https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=800&auto=format&fit=crop" 
          alt="Vintage Cassette"
          className="w-full h-full object-contain drop-shadow-2xl grayscale-[0.2]"
        />
        <div className="text-[10px] font-bold mt-2 font-mono uppercase text-primary/40 text-center">Magnetic Archive #04</div>
      </motion.div>

      {/* School Stationery / Sketch Pens */}
      <motion.div 
        animate={{ rotate: [10, 15, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-[8%] opacity-30 hidden lg:block w-48 h-64"
      >
        <img 
          src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop" 
          alt="Stationery"
          className="w-full h-full object-contain drop-shadow-xl"
        />
        <div className="text-[10px] font-bold mt-2 font-mono uppercase text-primary/40 text-right">Classroom Tools</div>
      </motion.div>

      {/* Old TV (2000s era) */}
      <div className="absolute bottom-10 right-[3%] opacity-20 hidden lg:block rotate-[-8deg] w-80 h-60">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" 
          alt="Vintage TV"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        <div className="text-[10px] font-bold mt-2 font-mono uppercase text-primary/40 text-center">Standard Definition</div>
      </div>

      {/* Polaroid / Album */}
      <div className="absolute bottom-20 left-[5%] opacity-40 hidden lg:block rotate-[12deg] w-56 h-72">
        <div className="polaroid-frame p-3 pb-12 rotate-[-5deg]">
          <img 
            src="https://images.unsplash.com/photo-1526285849717-482456cd7436?q=80&w=800&auto=format&fit=crop" 
            alt="Old Photo"
            className="w-full h-48 object-cover sepia-[0.3]"
          />
          <div className="mt-4 font-serif italic text-xs text-primary/60 text-center">Summer Memories</div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <div className="terminal-container p-8 md:p-20 paper-texture sketch-border relative bg-white/90 shadow-2xl">
          {/* Real Washi Tape Texture Effect */}
          <div className="absolute -top-4 left-1/4 w-32 h-10 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] bg-accent/30 border-x-2 border-dashed border-black/10 rotate-2 mix-blend-multiply" />
          
          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-8xl font-bold font-serif uppercase tracking-tighter mb-6 text-center leading-none text-primary">
              The Echoes <br /> 
              <span className="text-accent underline decoration-primary/20">of the Past</span>
            </h1>

            <div className="w-32 h-0.5 bg-primary/10 mb-10" />
            
            <p className="text-xl md:text-3xl text-primary/80 mb-14 italic font-serif leading-relaxed max-w-2xl text-center px-4">
              &quot;Reclaim lost memories by identifying the familiar sounds that defined a generation.&quot;
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-10 w-full justify-center">
              <Link href="/join" className="w-full sm:w-auto">
                <button className="w-full px-20 py-6 bg-primary text-white hover:bg-white hover:text-primary border-2 border-primary transition-all duration-500 font-bold text-2xl uppercase tracking-[0.3em] shadow-[12px_12px_0px_rgba(67,52,34,0.15)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer">
                  Start Restoration
                </button>
              </Link>
            </div>

            <div className="mt-12">
              <Link href="/leaderboard" className="text-primary/40 hover:text-primary transition-all text-[11px] font-mono uppercase tracking-[0.5em] font-black border-b border-primary/10 pb-1">
                Hall of Echoes
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Textures */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asie-textured.png')]" />
    </div>
  );
}
