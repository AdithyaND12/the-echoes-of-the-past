'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/Terminal';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Terminal title="RESTRICTED_ACCESS" className="max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold glow-text tracking-widest text-center uppercase">Admin Override</h2>
          <p className="text-[10px] text-primary/40 font-mono mt-2">SECURE SHELL v4.2 // ENCRYPTION: AES-256</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-primary/60">Encryption Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-primary/30 p-3 text-primary focus:outline-none focus:border-primary glow-border transition-all font-mono"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-error text-xs font-mono glow-text-error"
            >
              [AUTH_FAILURE]: {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 border border-primary text-primary hover:bg-primary hover:text-background transition-all font-bold tracking-widest disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "GRANT ACCESS"}
          </button>
        </form>
      </Terminal>
    </div>
  );
}
