'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TerminalProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function Terminal({ children, className, title }: TerminalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("terminal-container glow-border w-full max-w-2xl mx-auto", className)}
    >
      {title && (
        <div className="border-b border-primary/30 p-2 bg-primary/10 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-primary/70">{title}</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
          </div>
        </div>
      )}
      <div className="p-6 md:p-8">
        {children}
      </div>
    </motion.div>
  );
}
