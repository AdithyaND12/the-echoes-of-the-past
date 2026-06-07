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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg p-8 md:p-12 rounded-[12px] bg-archive-black/50 backdrop-blur-md border border-archive-amber/20 shadow-[0_0_50px_rgba(17,17,17,0.8)] flex flex-col"
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold tracking-widest text-center uppercase text-archive-white drop-shadow-md">Initialize Squad</h2>
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-archive-amber/50 to-transparent mt-4" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col w-full">
          <div className="relative flex flex-col gap-2">
            <label className="text-[10px] text-archive-amber uppercase tracking-[0.2em] ml-1">Squad Designation</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[12px] px-5 py-4 text-archive-white placeholder:text-archive-white/30 focus:outline-none focus:border-archive-amber/60 focus:bg-white/10 focus:ring-1 focus:ring-archive-amber/30 transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter Squad Name..."
            />
          </div>
          
          <div className="relative flex flex-col gap-2">
            <label className="text-[10px] text-archive-amber uppercase tracking-[0.2em] ml-1">Access Frequency ID</label>
            <input
              type="text"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[12px] px-5 py-4 text-archive-white placeholder:text-archive-white/30 focus:outline-none focus:border-archive-amber/60 focus:bg-white/10 focus:ring-1 focus:ring-archive-amber/30 transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter Unique ID..."
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-900/20 border-l-4 border-red-500 text-red-400 text-xs font-mono italic"
            >
              [AUTH_NOTICE]: {error}
            </motion.div>
          )}

          <div className="pt-4 group">
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-5 bg-archive-amber/10 border border-archive-amber text-archive-amber uppercase tracking-[0.3em] font-bold rounded-[12px] overflow-hidden transition-all duration-300 hover:text-archive-black hover:shadow-[0_0_30px_rgba(200,155,99,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-none"
            >
              <span className="relative z-10">{loading ? "Synchronizing..." : "Establish Link"}</span>
              {!loading && <div className="absolute inset-0 bg-archive-amber w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-archive-amber/10 flex items-center justify-center gap-2 opacity-40">
          <Shield size={12} className="text-archive-amber" />
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-archive-amber">Secure Connection Established</span>
        </div>
      </motion.div>
    </div>
  );
}
