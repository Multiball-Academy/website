"use client";

import { useState } from "react";
import Link from "next/link";

export default function CoachesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    background: "",
    why: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/coach-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Thanks! We'll be in touch.");
        setFormData({ name: "", email: "", background: "", why: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Nav */}
      <nav className="relative z-10 p-6">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to home
        </Link>
      </nav>

      {/* Hero */}
      <header className="relative z-10 text-center px-4 pt-8 pb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Coach with{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Multiball Academy
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          We&apos;re building Little League for pinball. Want in?
        </p>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        {/* The Opportunity */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">The Opportunity</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-slate-300">
            <p>
              Summer camps start 2026, with year-round programs to follow. We need coaches who are 
              great with kids. <strong className="text-white">Pinball skills? Optional.</strong>
            </p>
            <p>
              Our AI coaching assistant, <strong className="text-cyan-400">Coach Flip</strong>, handles 
              the game knowledge. Player stats, drill suggestions, progress tracking. You bring the 
              presence, the encouragement, the human connection.
            </p>
          </div>
        </section>

        {/* What Coaches Do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">What Coaches Do</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "🎯", title: "Run Practice", desc: "Lead drills, facilitate games, keep energy high" },
              { icon: "🧠", title: "Coach Mindset", desc: "Help kids manage frustration, build focus, compete well" },
              { icon: "🔧", title: "Flipper Lab", desc: "Guide hands-on repair and tinkering sessions" },
              { icon: "🤝", title: "Build Relationships", desc: "Be a mentor, not just an instructor" },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who We're Looking For */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Who We&apos;re Looking For</h2>
          <ul className="space-y-3 text-slate-300">
            {[
              "Teachers, sports coaches, youth mentors",
              "Pinball enthusiasts who enjoy working with kids",
              "Parents who want to be more involved",
              "College students looking for meaningful part-time work",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-slate-400 italic">
            No pinball expertise required. We&apos;ll train you.
          </p>
        </section>

        {/* What You Get */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">What You Get</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 text-slate-300">
            <p>✦ Training on pinball fundamentals + our coaching philosophy</p>
            <p>✦ <strong className="text-cyan-400">Coach Flip</strong> as your second brain (player insights, session prep)</p>
            <p>✦ Paid positions (hourly for camps, flexible for ongoing)</p>
            <p>✦ A chance to build something from the ground up</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Do I need to be a pinball expert?", a: "No. Coach Flip handles game knowledge. You focus on the kids." },
              { q: "What's the time commitment?", a: "Flexible. One summer camp, ongoing involvement, or somewhere in between." },
              { q: "Is this paid?", a: "Yes. Hourly rate for camps, with room to grow into larger roles." },
              { q: "Where is this?", a: "Memphis, TN. In-person for camps and programs." },
            ].map((item) => (
              <div key={item.q} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interest Form */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Interested? Let&apos;s Talk.</h2>
          
          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="background" className="block text-slate-300 mb-2">
                  Your background (coaching, teaching, pinball, etc.)
                </label>
                <textarea
                  id="background"
                  rows={3}
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="why" className="block text-slate-300 mb-2">
                  Why does this interest you?
                </label>
                <textarea
                  id="why"
                  rows={3}
                  value={formData.why}
                  onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "I'm Interested"}
              </button>
            </form>
          ) : (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-green-400 text-center">
              <p className="text-xl mb-2">✓ {message}</p>
              <p className="text-green-400/70">We&apos;ll reach out soon to chat.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-slate-500 text-sm text-center">
        <p>© 2026 Multiball Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
