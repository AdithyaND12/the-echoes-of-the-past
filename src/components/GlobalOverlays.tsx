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
      <div className="fixed inset-0 bg-archive-black/20 backdrop-blur-[2px] z-[-1]" />

      {/* TV Static Overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* HUD Elements */}
      <div className="fixed top-6 left-6 z-[45] flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-archive-green animate-pulse shadow-[0_0_10px_#7CFF7C]" />
        <span className="text-archive-green text-xs font-bold uppercase tracking-widest shadow-archive-green drop-shadow-[0_0_5px_rgba(124,255,124,0.5)]">Archive Status: Online</span>
      </div>
      <div className="fixed bottom-6 right-6 md:top-6 md:bottom-auto md:right-6 z-[45]">
        <span className="text-archive-white/80 text-sm md:text-lg uppercase font-mono tracking-widest drop-shadow-md">PLAY &#9654; {time}</span>
      </div>
    </>
  );
}
