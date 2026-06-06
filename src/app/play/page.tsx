'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '@/components/Terminal';
import AudioPlayer from '@/components/AudioPlayer';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PlayPage() {
  const [puzzle, setPuzzle] = useState<any>(null);
  const [noPuzzles, setNoPuzzles] = useState(false);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' });
  const [hints, setHints] = useState<{ h1: string | null, h2: string | null }>({ h1: null, h2: null });
  const router = useRouter();

  const fetchPuzzle = async () => {
    const token = localStorage.getItem('teamToken');
    if (!token) {
      router.push('/join');
      return;
    }

    try {
      const res = await fetch('/api/game/puzzle', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        if (data.isCompleted) {
          router.push('/success');
        } else if (data.noPuzzles) {
          setNoPuzzles(true);
        } else {
          setPuzzle(data.puzzle);
          setHints({ h1: data.puzzle.hint1, h2: data.puzzle.hint2 });
        }
      } else {
        localStorage.removeItem('teamToken');
        router.push('/join');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || submitting) return;

    setSubmitting(true);
    setStatus({ type: 'none', message: '' });

    try {
      const token = localStorage.getItem('teamToken');
      const res = await fetch('/api/game/validate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answer }),
      });

      const data = await res.json();

      if (data.correct) {
        setStatus({ type: 'success', message: 'Verification successful. Memory restored.' });
        setAnswer('');
        setTimeout(() => {
          setStatus({ type: 'none', message: '' });
          if (data.isCompleted) {
            router.push('/success');
          } else {
            fetchPuzzle();
          }
        }, 2000);
      } else {
        setStatus({ type: 'error', message: 'Identification failed. Try again.' });
        setPuzzle((prev: any) => ({ ...prev, attempts: data.attempts }));
        setHints({ h1: data.hint1, h2: data.hint2 });
        setTimeout(() => setStatus({ type: 'none', message: '' }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection lost. Retrying...' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary font-mono tracking-widest uppercase italic animate-pulse">
          Searching Archives...
        </div>
      </div>
    );
  }

  if (noPuzzles) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Terminal title="ARCHIVE_EMPTY" className="max-w-md paper-texture">
          <div className="text-center py-6">
            <h2 className="text-xl font-bold mb-4 font-serif uppercase tracking-widest">No Records Found</h2>
            <p className="text-sm opacity-70 font-mono mb-8 italic">
              Please contact the archivist to add audio fragments to the collection.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-md"
            >
              Return Home
            </button>
          </div>
        </Terminal>
      </div>
    );
  }

  if (!puzzle) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 relative">
      
      {/* Decorative Scrapbook Elements */}
      <div className="absolute top-10 right-[5%] opacity-30 rotate-12 hidden xl:block w-48 h-48">
        <img 
          src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop" 
          alt="Crayons"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="absolute bottom-10 left-[5%] opacity-30 rotate-[-10deg] hidden xl:block w-56 h-56">
        <img 
          src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=800&auto=format&fit=crop" 
          alt="School Notebook"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Game Screen inside a "TV Frame" */}
      <div className="w-full max-w-4xl relative z-10">
        <div className="tv-frame">
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden p-6 md:p-12 border-4 border-[#2a2a2a] relative">
            
            {/* HUD */}
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold">Tape Identification</h3>
                <div className="text-2xl font-bold font-mono text-white/70">
                  RE_SESSION_0{puzzle.nodeIndex}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold">Sync Progress</div>
                <div className="text-xl font-bold text-accent italic">
                  {Math.max(0, 100 - (puzzle.attempts * 10))}% AUTO
                </div>
              </div>
            </div>

            {/* Core Interaction */}
            <div className="space-y-12">
              <AudioPlayer src={puzzle.audioUrl} />

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative">
                  <label className="block text-[11px] uppercase tracking-[0.4em] font-bold mb-5 text-white/30">
                    Archive Data Restoration Input
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={submitting || status.type === 'success'}
                    className="w-full bg-black/30 border-b-2 border-white/10 p-4 text-3xl text-white focus:outline-none focus:border-accent transition-all font-mono placeholder:text-white/5 shadow-inner"
                    placeholder="ENTER RESPONSE..."
                  />
                  
                  <AnimatePresence>
                    {status.type !== 'none' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-8 p-5 border-l-4 flex items-center gap-5 font-mono text-sm uppercase tracking-widest ${
                          status.type === 'success' ? 'border-success text-success bg-success/5' : 'border-error text-error bg-error/5'
                        }`}
                      >
                        {status.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span className="font-bold italic">
                          {status.message}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !answer.trim() || status.type === 'success'}
                  className="w-full py-6 bg-accent text-primary hover:scale-[1.02] transition-all font-black tracking-[0.4em] uppercase text-sm disabled:opacity-30 shadow-[0_8px_20px_rgba(212,163,115,0.3)] rounded-sm"
                >
                  {submitting ? "Processing Data..." : "Restore Segment"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Hints as Post-it notes below */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`post-it min-h-[160px] flex flex-col transition-all duration-1000 ${
              hints.h1 ? 'opacity-100 scale-100' : 'opacity-10 scale-95 blur-sm'
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary/30 border-b border-primary/5 pb-2 italic">Observation Log I</div>
            <div className="font-serif text-lg italic text-primary/80 leading-relaxed">
              &quot;{hints.h1 ? hints.h1 : "Insufficient data to decode primary frequency..."}&quot;
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`post-it min-h-[160px] flex flex-col bg-[#E9EDC9] transition-all duration-1000 ${
              hints.h2 ? 'opacity-100 scale-100 rotate-[-1deg]' : 'opacity-10 scale-95 blur-sm'
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary/30 border-b border-primary/5 pb-2 italic">Observation Log II</div>
            <div className="font-serif text-lg italic text-primary/80 leading-relaxed">
              &quot;{hints.h2 ? hints.h2 : "Signal noise remains too high for secondary analysis..."}&quot;
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-20 text-[10px] text-primary/30 font-black font-mono flex gap-16 uppercase tracking-[0.4em]">
        <span>ARCHIVE_ID: {localStorage.getItem('teamId')}</span>
        <span>SEGMENT_ATTEMPTS: {puzzle.attempts}</span>
      </div>
    </div>
  );
}
