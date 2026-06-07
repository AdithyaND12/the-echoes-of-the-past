'use client';

import React from 'react';

interface TerminalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Terminal({ title, children, className = '' }: TerminalProps) {
  return (
    <div className={`bg-archive-black border border-archive-amber/30 rounded-[8px] shadow-[0_0_20px_rgba(200,155,99,0.1)] ${className}`}>
      <div className="bg-archive-amber/5 px-4 py-2 border-b border-archive-amber/20 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-archive-amber/70 font-mono">
          {title}
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-archive-amber/30" />
          <div className="w-2 h-2 rounded-full bg-archive-amber/30" />
          <div className="w-2 h-2 rounded-full bg-archive-amber/30" />
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
