'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/Terminal';
import AudioPlayer from '@/components/AudioPlayer';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, BarChart2, Settings as SettingsIcon, Music, Users, Radio } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'puzzles' | 'analytics' | 'settings'>('puzzles');
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingPuzzle, setEditingPuzzle] = useState<any>(null);
  const router = useRouter();

  const fetchPuzzles = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/puzzles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setPuzzles(await res.json());
    } else {
      router.push('/admin/login');
    }
  };

  const fetchTeams = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/teams', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setTeams(await res.json());
    }
  };

  const fetchSettings = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setSettings(await res.json());
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPuzzles(), fetchTeams(), fetchSettings()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleSavePuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {
      correctAnswer: formData.get('correctAnswer'),
      acceptedAnswers: (formData.get('acceptedAnswers') as string).split(',').map(s => s.trim()),
      hint1: formData.get('hint1'),
      hint2: formData.get('hint2'),
      rewardLetter: formData.get('rewardLetter'),
      audioUrl: '', // Explicitly set to blank for Live Event Mode
    };

    if (editingPuzzle?._id) data._id = editingPuzzle._id;

    console.log('Saving node data:', data);
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/puzzles', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditingPuzzle(null);
      fetchPuzzles();
      alert('Node saved successfully');
    } else {
      const err = await res.json();
      alert(`Error saving node: ${err.error || 'Unknown error'}`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      targetWord: formData.get('targetWord'),
      attemptsPerPuzzle: Number(formData.get('attemptsPerPuzzle')),
      masterAudioUrl: formData.get('masterAudioUrl'),
    };

    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Settings updated successfully');
      fetchSettings();
    } else {
      const err = await res.json();
      alert(`Error updating settings: ${err.error || 'Unknown error'}`);
    }
  };

  const handleDeletePuzzle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this puzzle?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/admin/puzzles?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPuzzles();
  };

  const formatTime = (startTime: string, endTime?: string) => {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    const diff = Math.floor((end - start) / 1000);
    
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  if (loading) return <div className="p-10 text-primary font-mono">LOADING SYSTEM...</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold glow-text tracking-tighter">ADMIN TERMINAL</h1>
            <p className="text-primary/40 text-xs font-mono uppercase mt-1">Archive Management System v2.0</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('adminToken'); router.push('/admin/login'); }}
            className="text-primary/60 hover:text-error transition-all text-xs uppercase tracking-widest"
          >
            [ DISCONNECT ]
          </button>
        </div>

        {/* Master Audio Control (DJ Mode) */}
        {settings && (
          <div className="mb-10 bg-archive-black/40 border border-archive-amber/30 rounded-lg p-6 backdrop-blur-md shadow-[0_0_30px_rgba(200,155,99,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-archive-amber uppercase tracking-widest text-xs font-black">
                <Radio size={16} className={settings.masterAudioUrl ? "animate-pulse" : "opacity-30"} /> 
                Live Event Audio Control
              </div>
              {!settings.masterAudioUrl && (
                <span className="text-[10px] text-archive-amber/40 italic font-mono uppercase">
                  &lt; No Audio Source Configured &gt;
                </span>
              )}
            </div>
            {settings.masterAudioUrl ? (
              <AudioPlayer src={settings.masterAudioUrl} />
            ) : (
              <div className="py-4 border border-dashed border-archive-amber/10 rounded flex items-center justify-center">
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="text-[10px] text-archive-amber/60 hover:text-archive-amber transition-all uppercase tracking-widest font-bold underline underline-offset-4"
                >
                  Configure Master Audio in Settings
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 mb-8">
          {[
            { id: 'puzzles', icon: Music, label: 'Puzzles' },
            { id: 'analytics', icon: BarChart2, label: 'Analytics' },
            { id: 'settings', icon: SettingsIcon, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border transition-all font-bold tracking-widest text-xs uppercase ${
                activeTab === tab.id ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'border-primary/20 text-primary/40 hover:border-primary/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'puzzles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Music className="text-primary" /> MEMORY FRAGMENTS
                </h2>
                <button 
                  onClick={() => setEditingPuzzle({})}
                  className="p-2 border border-primary/40 text-primary hover:bg-primary/10 rounded transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>

              {puzzles.map((p, idx) => (
                <div key={p._id} className="p-4 border border-primary/20 bg-primary/5 flex justify-between items-center hover:border-primary/50 transition-all group">
                  <div>
                    <div className="text-xs text-primary/40 mb-1">NODE 0{idx + 1}</div>
                    <div className="font-bold text-primary">{p.correctAnswer}</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingPuzzle(p)} className="p-2 text-primary hover:bg-primary/20 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeletePuzzle(p._id)} className="p-2 text-error hover:bg-error/20 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Terminal 
                title={editingPuzzle?._id ? "EDIT_NODE" : "NEW_NODE"}
                key={editingPuzzle?._id || 'new-puzzle'}
              >
                <form onSubmit={handleSavePuzzle} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase text-primary/60 block mb-1">Display Name</label>
                    <input name="correctAnswer" defaultValue={editingPuzzle?.correctAnswer} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase text-primary/60 block mb-1">Accepted (comma separated)</label>
                      <input name="acceptedAnswers" defaultValue={editingPuzzle?.acceptedAnswers?.join(', ')} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-primary/60 block mb-1">Reward Letter (1 char)</label>
                      <input name="rewardLetter" defaultValue={editingPuzzle?.rewardLetter} maxLength={1} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none text-center font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-primary/60 block mb-1">Intel Level 1</label>
                    <textarea name="hint1" defaultValue={editingPuzzle?.hint1} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none h-20" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-primary/60 block mb-1">Intel Level 2</label>
                    <textarea name="hint2" defaultValue={editingPuzzle?.hint2} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none h-20" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary/10 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-background transition-all">
                    COMMIT CHANGES
                  </button>
                  {editingPuzzle && (
                    <button type="button" onClick={() => setEditingPuzzle(null)} className="w-full text-[10px] text-primary/40 uppercase tracking-widest mt-2 hover:text-primary transition-all">
                      CANCEL
                    </button>
                  )}
                </form>
              </Terminal>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-primary" /> DEPLOYED SQUADS
            </h2>
            <div className="border border-primary/20 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-primary/10 border-b border-primary/20">
                  <tr>
                    <th className="p-4 uppercase text-primary/60">Squad</th>
                    <th className="p-4 uppercase text-primary/60">ID</th>
                    <th className="p-4 uppercase text-primary/60">Progress</th>
                    <th className="p-4 uppercase text-primary/60">Time</th>
                    <th className="p-4 uppercase text-primary/60">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t._id} className="border-b border-primary/10 hover:bg-primary/5 transition-all">
                      <td className="p-4 font-bold text-primary">{t.name}</td>
                      <td className="p-4 text-primary/60">{t.teamId}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1 bg-primary/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(t.currentPuzzleIndex / puzzles.length) * 100}%` }} />
                          </div>
                          <span>{t.currentPuzzleIndex}/{puzzles.length}</span>
                        </div>
                      </td>
                      <td className="p-4 text-primary/60">{formatTime(t.startTime, t.endTime)}</td>
                      <td className="p-4">
                        {t.isCompleted ? (
                          <span className="text-success glow-text-success">CALIBRATED</span>
                        ) : (
                          <span className="text-accent">ACTIVE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md">
            <Terminal title="SYSTEM_CONFIG" key={settings?._id || 'settings'}>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase text-primary/60 block mb-1">Final Word (Target)</label>
                  <input name="targetWord" defaultValue={settings?.targetWord} required maxLength={6} className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none uppercase font-mono tracking-widest" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-primary/60 block mb-1">Master Audio URL (Merged MP3)</label>
                  <input name="masterAudioUrl" defaultValue={settings?.masterAudioUrl} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none font-mono" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-primary/60 block mb-1">Attempts Per Puzzle</label>
                  <input name="attemptsPerPuzzle" type="number" defaultValue={settings?.attemptsPerPuzzle} required className="w-full bg-background border border-primary/20 p-2 text-sm text-primary focus:border-primary outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-primary/10 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-background transition-all">
                  SAVE CONFIGURATION
                </button>
                <div className="p-4 border border-primary/10 bg-primary/5 rounded">
                  <div className="text-[10px] uppercase text-primary/40 mb-2">Current Rules</div>
                  <ul className="text-xs space-y-2 text-primary/80">
                    <li>Hint 1 Threshold: 2 attempts</li>
                    <li>Hint 2 Threshold: 4 attempts</li>
                    <li>Wordle Word: {settings?.targetWord}</li>
                  </ul>
                </div>
              </form>
            </Terminal>
          </div>
        )}
      </div>
    </div>
  );
}
