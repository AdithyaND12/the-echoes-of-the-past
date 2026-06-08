'use client';

import { useState, useEffect } from "react";

export default function GlobalOverlays() {
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
    <>
      {/* Dark Glassmorphism Overlay */}
      <div className="fixed inset-0 bg-archive-black/30 backdrop-blur-[1px] z-[-1]" />
      
      {/* Radial Spotlight */}
      <div className="fixed inset-0 radial-spotlight pointer-events-none z-[-1]" />

      {/* TV Static & Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.08] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      {/* Moving Scanline */}
      <div className="vhs-scanline" />

      {/* HUD Elements */}
      <div className="fixed top-8 left-8 z-[45] space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-archive-green shadow-[0_0_10px_#7CFF7C]" />
          <span className="text-archive-green text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-[0_0_5px_rgba(124,255,124,0.5)]">Archive Status: Online</span>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-[pulse-red_1.5s_infinite]" />
          <span className="text-red-600/80 text-[10px] font-black uppercase tracking-[0.3em]">REC</span>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 md:top-8 md:bottom-auto md:right-8 z-[45] text-right">
        <div className="text-archive-white/80 text-lg md:text-xl font-mono tracking-[0.2em] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] flex items-center gap-3 justify-end">
          <span className="text-xs opacity-50 font-black">PLAY &#9654;</span>
          <span className="tabular-nums">{time}</span>
        </div>
        <div className="text-[10px] text-archive-white/20 font-mono mt-1 tracking-widest uppercase">SP Mode [02:30:00]</div>
      </div>
    </>
  );
}
