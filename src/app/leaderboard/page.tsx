'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import { Trophy, Medal, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const formatTime = (ms: number) => {
    if (!ms || ms === Infinity) return '--:--';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) return <div className="p-10 text-primary font-mono text-center mt-20">SYNCING ARCHIVE DATA...</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold glow-text tracking-widest mb-2 flex items-center justify-center gap-4">
          <Trophy className="text-primary" size={32} />
          HALL OF ECHOES
        </h1>
        <p className="text-primary/40 font-mono text-xs uppercase tracking-[0.3em]">Simulation Calibration Rankings</p>
      </div>

      <Terminal title="TOP_OPERATIVES">
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="p-10 text-center text-primary/40 font-mono italic">No data fragments found. Mission in progress.</div>
          ) : (
            teams.map((team, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={team._id}
                className={`p-4 border flex items-center justify-between transition-all hover:bg-primary/5 ${
                  idx === 0 ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'border-primary/10 bg-background/30'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold font-mono ${
                    idx === 0 ? 'text-primary' : 'text-primary/40'
                  }`}>
                    {idx === 0 ? <Medal size={24} /> : (idx + 1).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <div className="font-bold text-primary tracking-widest">{team.name}</div>
                    <div className="text-[10px] text-primary/40 font-mono uppercase">{team.teamId}</div>
                  </div>
                </div>

                <div className="flex gap-8 text-right">
                  <div className="hidden md:block">
                    <div className="text-[8px] uppercase text-primary/30 tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Target size={10} /> Progress
                    </div>
                    <div className="text-sm font-bold text-primary/80">
                      {team.currentPuzzleIndex} Nodes
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase text-primary/30 tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Clock size={10} /> Sync Time
                    </div>
                    <div className={`text-sm font-bold ${team.isCompleted ? 'text-success glow-text-success' : 'text-primary/80'}`}>
                      {team.isCompleted ? formatTime(new Date(team.endTime).getTime() - new Date(team.startTime).getTime()) : 'ACTIVE'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Terminal>

      <div className="mt-12 text-center">
        <button 
          onClick={() => window.location.href = '/'}
          className="text-primary/40 hover:text-primary transition-all text-xs font-mono uppercase tracking-[0.3em]"
        >
          &gt; RETURN TO COMMAND CENTER
        </button>
      </div>
    </div>
  );
}
