'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      html5: true,
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onstop: () => {
        setPlaying(false);
        setProgress(0);
      },
      onend: () => {
        setPlaying(false);
        setProgress(0);
      },
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [src]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const seek = soundRef.current.seek();
          const duration = soundRef.current.duration();
          setProgress((seek / duration) * 100);
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [playing]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const restart = () => {
    if (!soundRef.current) return;
    soundRef.current.stop();
    soundRef.current.play();
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    soundRef.current.mute(newMuted);
  };

  return (
    <div className="w-full bg-primary/5 border border-primary/20 p-6 rounded-lg glow-border">
      <div className="flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="relative h-2 bg-primary/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="p-3 rounded-full border border-primary/40 text-primary hover:bg-primary/20 transition-all active:scale-95"
            >
              {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button 
              onClick={restart}
              className="p-2 rounded-full border border-primary/20 text-primary/70 hover:text-primary transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-primary/60 tracking-widest uppercase">
              {playing ? "Analyzing Frequency..." : "Idle"}
            </div>
            <button 
              onClick={toggleMute}
              className="p-2 text-primary/70 hover:text-primary transition-all"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
