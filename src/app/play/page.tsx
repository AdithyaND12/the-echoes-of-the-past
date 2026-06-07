'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '@/components/Terminal';
import WordleGuesser from '@/components/WordleGuesser';
import { CheckCircle, XCircle, Key, Headphones } from 'lucide-react';

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

      if (res.ok) {
        if (data.isCompleted) {
          router.push('/success');
        } else if (data.noPuzzles) {
          setNoPuzzles(true);
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
        if (data.letter && !collectedLetters.includes(data.letter)) {
          setCollectedLetters(prev => [...prev, data.letter]);
        }
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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Game Screen glass container */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Mode Switcher */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowWordle(false)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-[12px] transition-all font-black text-[10px] uppercase tracking-[0.2em] border-t border-x ${
              !showWordle 
                ? 'bg-archive-black/50 border-archive-amber/30 text-archive-amber' 
                : 'bg-transparent border-transparent text-archive-white/30 hover:text-archive-white/60'
            }`}
          >
            <Headphones size={14} /> Audio Analysis
          </button>
          <button 
            onClick={() => setShowWordle(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-[12px] transition-all font-black text-[10px] uppercase tracking-[0.2em] border-t border-x ${
              showWordle 
                ? 'bg-archive-black/50 border-archive-amber/30 text-archive-amber' 
                : 'bg-transparent border-transparent text-archive-white/30 hover:text-archive-white/60'
            }`}
          >
            <Key size={14} /> Master Override
          </button>
        </div>

        <motion.div
          key={showWordle ? 'wordle' : 'audio'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {!showWordle ? (
            <div className="bg-archive-black/50 backdrop-blur-md rounded-[12px] p-6 md:p-12 border border-archive-amber/20 shadow-[0_0_50px_rgba(17,17,17,0.8)]">
              {/* HUD */}
              <div className="flex justify-between items-center mb-10 border-b border-archive-amber/10 pb-6">
                <div>
                  <h3 className="text-archive-amber/50 text-[10px] uppercase tracking-[0.4em] font-bold">Tape Identification</h3>
                  <div className="text-2xl font-bold font-mono text-archive-white/90">
                    RE_SESSION_0{puzzle.nodeIndex}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-archive-amber/50 text-[10px] uppercase tracking-[0.4em] font-bold">Fragments Retrieved</div>
                  <div className="flex gap-1 justify-end mt-1">
                    {collectedLetters.map((l, i) => (
                      <span key={i} className="w-5 h-5 flex items-center justify-center bg-archive-green/20 border border-archive-green/40 text-archive-green text-[10px] rounded font-bold font-mono">
                        {l}
                      </span>
                    ))}
                    {Array.from({ length: Math.max(0, (jumbledLetters.length || 6) - collectedLetters.length) }).map((_, i) => (
                      <span key={i} className="w-5 h-5 flex items-center justify-center bg-white/5 border border-white/10 text-white/20 text-[10px] rounded font-bold font-mono">
                        ?
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-[8px] text-archive-amber/30 uppercase tracking-widest font-mono">
                    Pool: {jumbledLetters.join(' ')}
                  </div>
                </div>
              </div>

              {/* Core Interaction */}
              <div className="space-y-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="relative">
                    <label className="block text-[11px] uppercase tracking-[0.4em] font-bold mb-5 text-archive-amber/70">
                      Archive Data Restoration Input
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      disabled={submitting || status.type === 'success'}
                      className="w-full bg-white/5 border border-white/10 rounded-[12px] p-4 text-2xl text-archive-white focus:outline-none focus:border-archive-amber/60 focus:bg-white/10 focus:ring-1 focus:ring-archive-amber/30 transition-all font-mono placeholder:text-archive-white/20 backdrop-blur-sm"
                      placeholder="ENTER RESPONSE..."
                    />
                    
                    <AnimatePresence>
                      {status.type !== 'none' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`mt-8 p-5 rounded-[8px] flex items-center gap-5 font-mono text-sm uppercase tracking-widest ${
                            status.type === 'success' 
                              ? 'border border-archive-green/50 text-archive-green bg-archive-green/10 shadow-[0_0_20px_rgba(124,255,124,0.1)]' 
                              : 'border border-red-500/50 text-red-400 bg-red-900/20 shadow-[0_0_20px_rgba(255,0,0,0.1)]'
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

                  <div className="group pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !answer.trim() || status.type === 'success'}
                      className="relative w-full py-5 bg-archive-amber/10 border border-archive-amber text-archive-amber uppercase tracking-[0.3em] font-bold rounded-[12px] overflow-hidden transition-all duration-300 hover:text-archive-black hover:shadow-[0_0_30px_rgba(200,155,99,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-none"
                    >
                      <span className="relative z-10">{submitting ? "Processing Data..." : "Restore Segment"}</span>
                      {(!submitting && answer.trim() && status.type !== 'success') && <div className="absolute inset-0 bg-archive-amber w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <WordleGuesser 
              collectedLetters={collectedLetters} 
              jumbledLetters={jumbledLetters}
              onSuccess={() => router.push('/success')} 
            />
          )}
        </motion.div>

        {/* Hints - only show in Audio Analysis mode */}
        {!showWordle && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-[12px] bg-archive-black/30 backdrop-blur-md border border-white/5 transition-all duration-1000 ${
                hints.h1 ? 'opacity-100' : 'opacity-30 blur-[2px]'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-archive-amber/50 border-b border-archive-amber/10 pb-2 italic">Observation Log I</div>
              <div className="font-mono text-sm text-archive-white/80 leading-relaxed">
                {hints.h1 ? `> ${hints.h1}` : "> Insufficient data to decode primary frequency..."}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-[12px] bg-archive-black/30 backdrop-blur-md border border-white/5 transition-all duration-1000 ${
                hints.h2 ? 'opacity-100' : 'opacity-30 blur-[2px]'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-archive-amber/50 border-b border-archive-amber/10 pb-2 italic">Observation Log II</div>
              <div className="font-mono text-sm text-archive-white/80 leading-relaxed">
                {hints.h2 ? `> ${hints.h2}` : "> Signal noise remains too high for secondary analysis..."}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="mt-12 mb-8 text-[10px] text-archive-white/30 font-black font-mono flex gap-16 uppercase tracking-[0.4em] relative z-10">
        <span>ARCHIVE_ID: {localStorage.getItem('teamId') || 'UNKNOWN'}</span>
        <span>SEGMENT_ATTEMPTS: {puzzle.attempts}</span>
      </div>
    </div>
  );
}
