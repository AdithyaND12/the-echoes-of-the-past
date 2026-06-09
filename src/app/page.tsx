'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* 
        TV touch point area.
        To refine positioning: Temporarily add 'border-2 border-red-500' to motion.div class.
      */}
      <Link href="/join" className="absolute inset-0 z-50">
        <motion.div 
          className="w-full h-full cursor-pointer transition-all"
          whileTap={{ scale: 0.98 }}
          title="Enter Archive"
          style={{
            position: 'absolute',
            top: '40%',    
            left: '24.5%', 
            width: '16.5%',
            height: '24.5%'
          }}
        />
      </Link>
    </div>
  );
}

