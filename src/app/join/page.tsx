'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Terminal from "@/components/Terminal";
import { motion } from "framer-motion";
import { UserPlus, Fingerprint, Shield } from "lucide-react";

export default function JoinPage() {
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, teamId }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("teamToken", data.token);
        localStorage.setItem("teamId", data.teamId);
        router.push("/play");
      } else {
        setError(data.error || "Failed to register team");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      {/* Decorative Icons */}
      <div className="absolute top-1/2 left-20 -translate-y-1/2 opacity-5 hidden lg:block">
        <Fingerprint size={400} />
      </div>

      <Terminal title="SQUAD_REGISTRATION" className="max-w-md paper-texture">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-full bg-primary/5 mb-4 border border-primary/20">
            <UserPlus size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold glow-text tracking-widest text-center uppercase font-serif">Initialize Squad</h2>
          <div className="h-0.5 w-16 bg-primary/20 mt-2" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-primary/60">Squad Designation</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-white/40 border-2 border-primary/10 p-4 text-primary focus:outline-none focus:border-primary transition-all font-mono shadow-inner"
              placeholder="Enter Squad Name..."
            />
          </div>
          
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-primary/60">Access Frequency ID</label>
            <input
              type="text"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full bg-white/40 border-2 border-primary/10 p-4 text-primary focus:outline-none focus:border-primary transition-all font-mono shadow-inner"
              placeholder="Enter Unique ID..."
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-error/5 border-l-4 border-error text-error text-xs font-mono italic"
            >
              [AUTH_NOTICE]: {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary border-2 border-primary text-white hover:bg-white hover:text-primary transition-all font-bold tracking-[0.2em] uppercase text-sm disabled:opacity-30 shadow-lg flex items-center justify-center gap-3 mt-4"
          >
            {loading ? "Synchronizing..." : "Access Archives"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-center gap-2 opacity-30">
          <Shield size={12} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold font-mono">Secure Connection Established</span>
        </div>
      </Terminal>
    </div>
  );
}
