'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Terminal from '@/components/Terminal';
import { ShieldCheck, Trophy, Clock, History, ScrollText } from 'lucide-react';

export default function SuccessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('teamToken');
      if (!token) {
        router.push('/join');
        return;
      }

      try {
        const res = await fetch('/api/game/complete', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();

        if (res.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to retrieve archive data');
          setTimeout(() => router.push('/play'), 2000);
        }
      } catch (err) {
        console.error(err);
        setError('Communication failure with central archive.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const formatTime = (seconds: number) => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-mono tracking-widest uppercase italic"
        >
          &gt; Verifying restoration...
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Terminal title="ACCESS_RESTRICTED" className="max-w-md border-error paper-texture">
          <div className="text-error font-mono text-center p-6">
            <ScrollText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4 font-bold italic underline">Notice: {error || 'Archive incomplete'}</p>
            <p className="text-[10px] opacity-70 uppercase tracking-widest">Returning to active session...</p>
          </div>
        </Terminal>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-20 left-10 opacity-5 -rotate-12 hidden lg:block">
        <ScrollText size={250} />
      </div>

      <Terminal className="max-w-xl text-center paper-texture">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 flex justify-center"
        >
          <div className="p-5 rounded-full bg-success/5 border-2 border-success shadow-lg">
            <ShieldCheck size={56} className="text-success" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-bold mb-3 font-serif uppercase tracking-tighter"
        >
          Restoration Complete
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-primary/70 font-mono text-sm mb-12 italic border-y border-primary/10 py-2 inline-block px-8"
        >
          &quot;The past is no longer silent. Every echo has found its home.&quot;
        </motion.p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-5 bg-white/40 border-2 border-primary/10 rounded-sm text-left shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-primary/40 text-[9px] uppercase tracking-widest font-bold mb-2">
              <Clock size={12} /> Sync Duration
            </div>
            <div className="text-2xl font-bold font-serif italic">{formatTime(data?.timeTaken)}</div>
            <div className="absolute -bottom-2 -right-2 opacity-5"><History size={60} /></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="p-5 bg-white/40 border-2 border-primary/10 rounded-sm text-left shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-primary/40 text-[9px] uppercase tracking-widest font-bold mb-2">
              <Trophy size={12} /> Archive Status
            </div>
            <div className="text-2xl font-bold text-success font-serif italic uppercase">Restored</div>
            <div className="absolute -bottom-2 -right-2 opacity-5"><ScrollText size={60} /></div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="p-8 border-2 border-dashed border-primary/20 bg-primary/5 relative overflow-hidden group mb-12"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/40 mb-4">Unique Completion Hash</div>
          <div className="text-3xl md:text-4xl font-mono font-bold tracking-[0.2em] text-primary select-all">
            {data?.completionCode || 'N/A'}
          </div>
          <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-100 transition-opacity">
            <ScrollText size={24} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button 
            onClick={() => router.push('/leaderboard')}
            className="w-full md:w-auto px-10 py-4 bg-primary text-white hover:bg-white hover:text-primary border-2 border-primary transition-all font-bold font-mono uppercase tracking-widest text-xs shadow-xl"
          >
            View Rankings
          </button>
          <button 
            onClick={() => router.push('/')}
            className="text-primary/40 hover:text-primary transition-all text-xs font-mono uppercase tracking-[0.2em] font-bold border-b border-transparent hover:border-primary/20"
          >
            Exit Archives
          </button>
        </motion.div>
      </Terminal>
    </div>
  );
}
