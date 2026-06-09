'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';

export default function AdminPage() {
  const [settings, setSettings] = useState({ googleFormUrl: '', teamIdFieldId: '', answerFieldId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings').then(res => res.json()).then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    alert('Settings saved');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <Terminal title="CONFIG_TERMINAL">
        <form onSubmit={saveSettings} className="space-y-4">
          <div>
            <label className="block text-xs uppercase">Google Form URL</label>
            <input className="w-full bg-black border p-2" value={settings.googleFormUrl} onChange={e => setSettings({...settings, googleFormUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs uppercase">Team ID Field Entry ID</label>
            <input className="w-full bg-black border p-2" value={settings.teamIdFieldId} onChange={e => setSettings({...settings, teamIdFieldId: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs uppercase">Answer Field Entry ID</label>
            <input className="w-full bg-black border p-2" value={settings.answerFieldId} onChange={e => setSettings({...settings, answerFieldId: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-primary p-2">Save</button>
        </form>
      </Terminal>
    </div>
  );
}
