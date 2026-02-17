"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto flex-1 flex flex-col justify-center py-12">
        {/* Silverball Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-400 shadow-2xl shadow-white/30 relative">
            {/* Metallic shine effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500"></div>
            {/* Inner highlight */}
            <div className="absolute top-3 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white to-transparent opacity-80 blur-sm"></div>
            {/* Secondary highlight */}
            <div className="absolute top-5 left-6 w-3 h-3 rounded-full bg-white opacity-90"></div>
            {/* Bottom reflection */}
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-tl from-slate-400 to-transparent opacity-50 blur-sm"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Multiball
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
            {" "}Academy
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-slate-300 mb-2 font-light">
          Youth Competitive Pinball
        </p>
        <p className="text-lg text-slate-400 mb-12">
          Building focus, resilience, and community — one flipper at a time.
        </p>

        {/* Email signup */}
        {status !== "success" ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "..." : "Notify Me"}
            </button>
          </form>
        ) : (
          <div className="mb-4 px-6 py-4 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 max-w-md mx-auto">
            ✓ {message}
          </div>
        )}

        {/* Error message */}
        {status === "error" && (
          <p className="text-red-400 text-sm mb-4">{message}</p>
        )}

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm mt-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Summer 2026 — Memphis, TN
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-slate-500 text-sm text-center">
        <p>© 2026 Multiball Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
