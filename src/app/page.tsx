"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service (Mailchimp, ConvertKit, etc.)
    console.log("Email submitted:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-2xl shadow-purple-500/30">
            <span className="text-5xl">🎯</span>
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
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="mb-8 px-6 py-4 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 max-w-md mx-auto">
            ✓ You&apos;re on the list! We&apos;ll be in touch.
          </div>
        )}

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Summer 2026 — Memphis, TN
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-slate-500 text-sm">
        <p>© 2026 Multiball Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
