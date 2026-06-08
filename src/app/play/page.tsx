'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '@/components/Terminal';
import WordleGuesser from '@/components/WordleGuesser';
import { CheckCircle, XCircle, Key, Headphones, Database, ChevronRight } from 'lucide-react';

export default function PlayPage() {
  const [puzzle, setPuzzle] = useState<any>(null);
  const [noPuzzles, setNoPuzzles] = useState(false);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' });
  const [hints, setHints] = useState<{ h1: string | null, h2: string | null }>({ h1: null, h2: null });
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([]);
  const [showWordle, setShowWordle] = useState(false);
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

      console.log('fetchPuzzle data:', data);

      if (res.ok) {
        if (data.allSongsSolved || data.message === 'Simulation Calibration Complete') {
          // All songs finished, but wordle not solved yet
          setPuzzle({ allSongsDone: true, attempts: 0 });
          setCollectedLetters(data.collectedLetters || []);
          setJumbledLetters(data.jumbledLetters || []);
        } else if (data.noPuzzles) {
          setNoPuzzles(true);
        } else if (data.isCompleted) {
          console.log('Puzzle completed, redirecting to /success');
          router.push('/success');
        } else {
          setPuzzle(data.puzzle);
          setHints({ h1: data.puzzle.hint1, h2: data.puzzle.hint2 });
          setCollectedLetters(data.collectedLetters || []);
          setJumbledLetters(data.jumbledLetters || []);
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
    const timer = setTimeout(() => fetchPuzzle(), 0);
    return () => clearTimeout(timer);
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
        if (data.letter && !collectedLetters.includes(data.letter)) {
          setCollectedLetters(prev => [...prev, data.letter]);
        }
        setTimeout(() => {
          setStatus({ type: 'none', message: '' });
          if (data.isCompleted) {
            setShowWordle(true);
            setPuzzle((prev: any) => ({ ...prev, allSongsDone: true }));
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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Game Screen - 2007 Software Style */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Mode Switcher - Folder Tabs Style */}
        <div className="flex gap-1 ml-2">
          <button 
            onClick={() => setShowWordle(false)}
            className={`px-8 py-2 rounded-t-xl transition-all font-black text-[10px] uppercase tracking-widest border-t-2 border-x-2 folder-tab ${
              !showWordle 
                ? 'bg-[#EFEBE9] border-[#F5E6D3] text-[#3A6EA5] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-20' 
                : 'bg-[#D7CCC8] border-[#A1887F] text-[#8D6E63] hover:text-[#5D4037] mt-1 opacity-80 z-10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Headphones size={14} strokeWidth={3} /> AUDIO_ANALYSIS
            </div>
          </button>
          <button 
            onClick={() => setShowWordle(true)}
            className={`px-8 py-2 rounded-t-xl transition-all font-black text-[10px] uppercase tracking-widest border-t-2 border-x-2 folder-tab ${
              showWordle 
                ? 'bg-[#EFEBE9] border-[#F5E6D3] text-[#3A6EA5] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-20' 
                : 'bg-[#D7CCC8] border-[#A1887F] text-[#8D6E63] hover:text-[#5D4037] mt-1 opacity-80 z-10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key size={14} strokeWidth={3} /> MASTER_OVERRIDE
            </div>
          </button>
        </div>

        <motion.div
          key={showWordle ? 'wordle' : 'audio'}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {!showWordle ? (
            <div className="win-bevel paper-texture p-6 md:p-10 shadow-2xl">
              {puzzle.allSongsDone ? (
                <div className="text-center py-12 space-y-8 bg-[#EFEBE9]/50 border-2 border-dashed border-[#D7CCC8] p-8 shadow-inner">
                  <div className="flex justify-center">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="p-6 rounded-full bg-[#E8F5E9] border-4 border-[#2E7D32] shadow-xl"
                    >
                      <CheckCircle className="text-[#2E7D32]" size={56} />
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black text-[#3E2723] uppercase tracking-tighter italic">Archive Recovered</h2>
                    <p className="text-[#8D6E63] font-mono text-[11px] uppercase tracking-[0.3em] bg-white/40 py-3 border-y border-[#D7CCC8] font-bold">
                      [STATUS]: Calibration Complete. Signal Stabilized.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowWordle(true)}
                    className="glossy-button px-16 py-5 bg-[#3A6EA5] text-[#F5E6D3] font-black uppercase tracking-[0.3em] text-xs rounded-xl shadow-xl"
                  >
                    INITIATE MASTER OVERRIDE
                  </button>
                </div>
              ) : (
                <>
                  {/* System Header */}
                  <div className="flex justify-between items-center mb-8 border-b-2 border-[#D7CCC8] pb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-[#3A6EA5] rounded-xl flex items-center justify-center shadow-xl border-2 border-[#F5E6D3]/30">
                        <Database className="text-[#F5E6D3]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-[#3A6EA5] text-[10px] uppercase tracking-[0.3em] font-black italic">RECOVERY_SESSION</h3>
                        <div className="text-2xl font-black font-sans text-[#3E2723] italic tracking-tight">
                          FRAGMENT_0{puzzle.nodeIndex}.WAV
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden md:block opacity-60">
                      <div className="text-[10px] font-mono text-[#5D4037] uppercase font-bold">Bitrate: 128kbps</div>
                      <div className="text-[10px] font-mono text-[#5D4037] uppercase font-bold">Source: 2007_MEDIA</div>
                    </div>
                  </div>

                  {/* Core Interaction */}
                  <div className="space-y-12">
                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="relative bg-[#EFEBE9]/60 p-8 border-2 border-[#D7CCC8] shadow-inner rounded-xl">
                        <label className="block text-[11px] uppercase tracking-[0.3em] font-black mb-6 text-[#3A6EA5] italic">
                          &gt; Input Recovery Sequence:
                        </label>
                        <input
                          type="text"
                          autoFocus
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          disabled={submitting || status.type === 'success'}
                          className="w-full bg-[#F5F1ED] border-2 border-[#A1887F] p-5 text-3xl text-[#3E2723] focus:outline-none focus:border-[#3A6EA5] focus:bg-white transition-all font-mono font-bold placeholder:text-[#D7CCC8]/50 shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)] rounded-lg"
                          placeholder="Waiting for input..."
                        />
                        
                        <AnimatePresence>
                          {status.type !== 'none' && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className={`mt-8 p-5 border-2 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] shadow-xl font-bold ${
                                status.type === 'success' 
                                  ? 'border-[#2E7D32] text-[#1B5E20] bg-[#E8F5E9]' 
                                  : 'border-[#B71C1C] text-[#C62828] bg-[#FFEBEE]'
                              }`}
                            >
                              {status.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                              <span>
                                {status.message}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex justify-center pt-2">
                        <button
                          type="submit"
                          disabled={submitting || !answer.trim() || status.type === 'success'}
                          className="glossy-button w-full max-w-sm py-6 bg-[#3A6EA5] text-[#F5E6D3] uppercase tracking-[0.4em] font-black rounded-2xl text-sm disabled:opacity-50 disabled:grayscale transition-all shadow-2xl"
                        >
                          {submitting ? "PROCESSING_DATA..." : "RESTORE SEGMENT"}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          ) : (
            <WordleGuesser 
              collectedLetters={collectedLetters} 
              jumbledLetters={jumbledLetters}
              onSuccess={() => router.push('/success')} 
            />
          )}
        </motion.div>

        {/* Hints - Aged Post-it Notes Style */}
        {!showWordle && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: -2 }}
              className={`p-6 bg-[#FFFFE1] border-2 border-[#E6DB55] shadow-xl transition-all duration-1000 relative overflow-hidden ${
                hints.h1 ? 'opacity-100' : 'opacity-40 blur-[2px]'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-4 bg-[#E6DB55]/30" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-[#8B8000] border-b border-[#E6DB55]/50 pb-2 italic flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E6DB55] shadow-sm" /> Observation_Log_01
              </div>
              <div className="font-mono text-xs text-[#5D4037] leading-relaxed font-bold italic">
                {hints.h1 ? `"${hints.h1}"` : "Decrypting primary signal..."}
              </div>
              <div className="absolute bottom-2 right-2 opacity-10 text-[8px] font-mono font-black uppercase">Frag_0{puzzle.nodeIndex}</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, rotate: 5 }}
              animate={{ opacity: 1, rotate: 2 }}
              transition={{ delay: 0.2 }}
              className={`p-6 bg-[#FFFFE1] border-2 border-[#E6DB55] shadow-xl transition-all duration-1000 relative overflow-hidden ${
                hints.h2 ? 'opacity-100' : 'opacity-40 blur-[2px]'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-4 bg-[#E6DB55]/30" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-[#8B8000] border-b border-[#E6DB55]/50 pb-2 italic flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E6DB55] shadow-sm" /> Observation_Log_02
              </div>
              <div className="font-mono text-xs text-[#5D4037] leading-relaxed font-bold italic">
                {hints.h2 ? `"${hints.h2}"` : "Awaiting secondary calibration..."}
              </div>
              <div className="absolute bottom-2 right-2 opacity-10 text-[8px] font-mono font-black uppercase">Frag_0{puzzle.nodeIndex}</div>
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="mt-16 mb-20 text-[10px] text-[#8D6E63] font-black font-mono flex flex-wrap justify-center gap-10 md:gap-20 uppercase tracking-[0.3em] relative z-10 bg-white/40 px-10 py-3 rounded-full backdrop-blur-md border-2 border-[#D7CCC8] shadow-xl italic">
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3A6EA5]" /> ID: <span className="text-[#3A6EA5]">{localStorage.getItem('teamId') || 'UNKNOWN'}</span></span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#C62828]" /> ATTEMPTS: <span className="text-[#C62828]">{puzzle.attempts}</span></span>
        <span className="hidden md:flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-600" /> OS: WIN_XP_PRO</span>
      </div>
    </div>
  );
}
