'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Key } from 'lucide-react';

interface WordleGuesserProps {
  onSuccess: () => void;
  collectedLetters: string[];
  jumbledLetters: string[];
}

export default function WordleGuesser({ onSuccess, collectedLetters, jumbledLetters }: WordleGuesserProps) {
  const [guess, setGuess] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<{ type: 'none' | 'success' | 'error', message: string }>({ type: 'none', message: '' });
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newGuess = [...guess];
    newGuess[index] = value.toUpperCase();
    setGuess(newGuess);

    // Move to next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !guess[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalGuess = guess.join('');
    if (finalGuess.length < 6) return;

    setLoading(true);
    setStatus({ type: 'none', message: '' });

    try {
      const token = localStorage.getItem('teamToken');
      const res = await fetch('/api/game/wordle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ guess: finalGuess }),
      });

      const data = await res.json();
      if (data.correct) {
        setStatus({ type: 'success', message: data.message });
        setTimeout(onSuccess, 2000);
      } else {
        setStatus({ type: 'error', message: data.message });
        setTimeout(() => setStatus({ type: 'none', message: '' }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Override connection error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-archive-black/40 backdrop-blur-xl border border-archive-amber/30 p-8 rounded-[16px] shadow-[0_0_40px_rgba(200,155,99,0.1)]">
      <div className="flex items-center gap-3 mb-8 border-b border-archive-amber/10 pb-4">
        <Key className="text-archive-amber animate-pulse" size={20} />
        <h3 className="text-archive-amber uppercase tracking-[0.3em] font-black text-sm">Master Override Sequence</h3>
      </div>

      <div className="mb-8">
        <div className="text-[10px] text-archive-white/40 uppercase tracking-widest mb-3">Available Fragments (Jumbled Pool):</div>
        <div className="flex flex-wrap gap-3">
          {jumbledLetters.map((l, i) => {
            const isCollected = collectedLetters.includes(l);
            return (
              <div 
                key={i} 
                className={`w-10 h-12 border-2 flex items-center justify-center font-mono font-bold rounded-lg text-lg transition-all duration-500 ${
                  isCollected 
                    ? 'border-archive-green bg-archive-green/10 text-archive-green shadow-[0_0_15px_rgba(124,255,124,0.3)] scale-110' 
                    : 'border-white/10 bg-white/5 text-white/10'
                }`}
              >
                {l}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[10px] text-archive-amber/50 italic font-mono">
          &gt; Collect all letters by identifying songs, then unscramble them to solve the override.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2">
          {guess.map((char, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-full h-14 bg-white/5 border border-white/20 rounded-[8px] text-center text-2xl font-mono text-archive-white focus:outline-none focus:border-archive-amber focus:bg-white/10 transition-all uppercase"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || guess.join('').length < 6}
          className="w-full py-4 bg-archive-amber/20 border border-archive-amber text-archive-amber uppercase tracking-[0.4em] font-black text-xs rounded-[8px] hover:bg-archive-amber hover:text-archive-black transition-all disabled:opacity-30 disabled:hover:bg-archive-amber/20 disabled:hover:text-archive-amber"
        >
          {loading ? 'Initializing Override...' : 'Execute Override'}
        </button>
      </form>

      <AnimatePresence>
        {status.type !== 'none' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-6 p-4 rounded border flex items-center gap-3 font-mono text-xs uppercase tracking-tighter ${
              status.type === 'success' ? 'border-archive-green/30 text-archive-green bg-archive-green/5' : 'border-red-500/30 text-red-400 bg-red-900/10'
            }`}
          >
            {status.type === 'success' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
