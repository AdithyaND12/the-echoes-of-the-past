'use client';

import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Play, Search } from "lucide-react";
import { useState } from "react";

export default function WelcomePage() {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  
  // Parallax Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [2, -2]);
  const rotateY = useTransform(x, [-500, 500], [-2, 2]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  const hotspots = [
    { id: 'toy', top: '75%', left: '10%', label: 'Corrupted Toy Fragment' },
    { id: 'poster', top: '15%', left: '55%', label: 'Aged Media Artifact' },
    { id: 'bed', top: '65%', left: '80%', label: 'Resting Echo' },
  ];

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Hotspots */}
      {hotspots.map((spot) => (
        <motion.div
          key={spot.id}
          className="absolute w-24 h-24 z-20 cursor-crosshair hidden md:block"
          style={{ top: spot.top, left: spot.left }}
          onHoverStart={() => setHoveredHotspot(spot.label)}
          onHoverEnd={() => setHoveredHotspot(null)}
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-full h-full rounded-full border border-archive-amber/20 bg-archive-amber/5 flex items-center justify-center"
          >
            <div className="w-1 h-1 bg-archive-amber/40 rounded-full" />
          </motion.div>
        </motion.div>
      ))}

      {/* Hotspot Tooltip */}
      {hoveredHotspot && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="px-4 py-2 bg-archive-black/80 border border-archive-amber/40 backdrop-blur-xl rounded-lg flex items-center gap-3">
            <Search size={14} className="text-archive-amber animate-pulse" />
            <span className="text-[10px] text-archive-amber font-black uppercase tracking-[0.3em]">{hoveredHotspot} Detected</span>
          </div>
        </motion.div>
      )}

      {/* Main Content with Parallax */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl p-8 md:p-16 rounded-[24px] bg-archive-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col items-center"
      >
        {/* Cinematic Title Section */}
        <div className="flex flex-col items-center w-full mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[10px] text-archive-amber/60 font-black uppercase tracking-[0.6em] mb-6 flex items-center gap-4"
          >
            <div className="h-px w-8 bg-archive-amber/20" />
            Archive Access Protocol
            <div className="h-px w-8 bg-archive-amber/20" />
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-[-0.05em] text-archive-white text-center leading-[0.9] perspective-1000">
            <span className="opacity-40 block text-lg tracking-[0.4em] mb-4 font-mono">The</span>
            <span className="relative inline-block animate-[glitch_5s_infinite] select-none">
              ECHOES
              <span className="absolute inset-0 text-red-500/20 translate-x-[1px] -z-10">ECHOES</span>
              <span className="absolute inset-0 text-blue-500/20 -translate-x-[1px] -z-10">ECHOES</span>
            </span>
            <br /> 
            <span className="text-archive-amber drop-shadow-[0_0_15px_rgba(212,168,112,0.4)] tracking-[0.1em] font-mono text-2xl md:text-4xl">
              OF THE PAST
            </span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="inline-block w-[0.15em] h-[0.8em] bg-archive-amber ml-4 align-baseline shadow-[0_0_15px_#D4A870]"
            />
          </h1>
        </div>

        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-archive-amber/30 to-transparent mb-10" />
        
        <p className="text-xs md:text-sm text-archive-white/50 mb-16 font-mono leading-relaxed max-w-sm text-center tracking-widest uppercase italic">
          Calibrate the simulation by identifying the sensory signals that defined a generation.
        </p>
        
        {/* Premium CTA */}
        <div className="flex flex-col items-center w-full max-w-xs">
          <Link href="/join" className="w-full group perspective-1000">
            <motion.button 
              whileHover={{ scale: 1.02, translateZ: 20 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-5 bg-archive-amber/5 border border-archive-amber/40 text-archive-amber uppercase tracking-[0.5em] font-black rounded-xl overflow-hidden transition-all duration-500 hover:border-archive-amber hover:shadow-[0_0_40px_rgba(212,168,112,0.3)] text-xs flex items-center justify-center gap-4"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play size={14} fill="currentColor" className="ml-1" />
                Access Memories
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-archive-amber/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </Link>

          {/* Loading Indicator */}
          <div className="w-full h-[2px] bg-white/5 mt-12 rounded-full overflow-hidden relative border border-white/5">
            <motion.div 
              animate={{ 
                left: ["-100%", "200%"],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-archive-green/40 to-transparent"
            />
          </div>
          <div className="mt-4 text-[8px] text-archive-white/20 font-mono uppercase tracking-[0.4em]">
            Syncing Archive Streams...
          </div>
        </div>
      </motion.div>

      {/* Bottom HUD */}
      <div className="fixed bottom-8 left-8 hidden md:block z-50">
        <div className="font-mono text-[8px] text-archive-white/30 uppercase tracking-[0.5em] space-y-1">
          <div>Sector: Residential_04</div>
          <div>Depth: 0.042m</div>
        </div>
      </div>
    </div>
  );
}
