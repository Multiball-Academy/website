"use client";

import { useState } from "react";
import Link from "next/link";

export default function CoachesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    background: "",
    why: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Validation helpers
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const nameError = touched.name && !formData.name.trim() ? "Name is required" : "";
  const emailError = touched.email 
    ? (!formData.email.trim() ? "Email is required" : !isValidEmail(formData.email) ? "Please enter a valid email" : "")
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    setTouched({ name: true, email: true });
    
    // Validate before submitting
    if (!formData.name.trim() || !formData.email.trim() || !isValidEmail(formData.email)) {
      return;
    }
    
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
        setFormData({ name: "", email: "", role: "", background: "", why: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  // Styled icon component matching silverball aesthetic
  const StyledIcon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-400 flex items-center justify-center shadow-lg ${className}`}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 flex items-center justify-center text-slate-700 font-bold">
        {children}
      </div>
    </div>
  );

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
          Join the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Camp Crew
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Help kids build focus, resilience, and real-world skills through pinball and hands-on making.
        </p>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        {/* The Opportunity */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">The Opportunity</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-slate-300">
            <p>
              Summer camps start 2026, with year-round programs to follow. We need people who are 
              great with kids — whether you want to lead, assist, or help out. <strong className="text-white">Pinball skills? Optional.</strong>
            </p>
            <p>
              Our AI coaching assistant, <strong className="text-cyan-400">Coach Flip</strong>, handles 
              the game knowledge. Player stats, drill suggestions, progress tracking. You bring the 
              presence, the encouragement, the human connection.
            </p>
          </div>
        </section>

        {/* Roles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Ways to Get Involved</h2>
          <div className="grid gap-4">
            {[
              { 
                icon: "🎯", 
                title: "Lead Coach", 
                commitment: "Full camp week",
                desc: "Run the daily schedule, lead skills sessions, and guide the overall camp experience. You're the face of the program." 
              },
              { 
                icon: "🔧", 
                title: "Maker Lab Assistant", 
                commitment: "Flexible",
                desc: "Help kids build circuits, wire kickers, and create their kinetic sculptures. Perfect if you're handy and patient." 
              },
              { 
                icon: "🙌", 
                title: "Volunteer", 
                commitment: "Half-day shifts OK",
                desc: "Support the team with check-in, snacks, setup, and general help. Great way to be involved without a big commitment." 
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">{item.commitment}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What Team Members Do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">What the Crew Does</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "01", title: "Run Labs & Practice", desc: "Lead skills drills, maker sessions, and keep the energy high" },
              { icon: "02", title: "Coach Mindset", desc: "Help kids manage frustration, build focus, compete well" },
              { icon: "03", title: "Hands-On Making", desc: "Guide building projects — circuits, kickers, kinetic sculptures" },
              { icon: "04", title: "Build Relationships", desc: "Be a mentor, not just an instructor" },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4">
                <StyledIcon>{item.icon}</StyledIcon>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
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
              "Makers, tinkerers, and handy people",
              "Pinball enthusiasts who enjoy working with kids",
              "Parents who want to be more involved",
              "College students looking for meaningful part-time work",
              "Anyone who wants to help (even a few hours)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 mt-2 flex-shrink-0"></span>
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
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Training on pinball fundamentals + our coaching philosophy
            </p>
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <strong className="text-cyan-400">Coach Flip</strong> as your second brain (player insights, session prep)
            </p>
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Paid positions for lead coaches; stipends for assistants
            </p>
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              A chance to build something from the ground up
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Do I need to be a pinball expert?", a: "No. Coach Flip handles game knowledge. You focus on the kids." },
              { q: "What's the time commitment?", a: "Flexible. Lead a full camp, help with maker labs, or volunteer for a few hours. Whatever works for you." },
              { q: "Is this paid?", a: "Lead coaches: hourly rate. Assistants: stipend. Volunteers: our eternal gratitude (and free lunch)." },
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
                <label htmlFor="name" className="block text-slate-300 mb-2">Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  disabled={status === "loading"}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                    nameError ? "border-red-400" : "border-white/20"
                  }`}
                />
                {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-slate-300 mb-2">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (touched.email) setTouched({ ...touched, email: true });
                  }}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  disabled={status === "loading"}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                    emailError ? "border-red-400" : "border-white/20"
                  }`}
                />
                {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-slate-300 mb-2">
                  What role interests you? <span className="text-slate-500">(optional)</span>
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  <option value="" className="bg-slate-800">Not sure yet</option>
                  <option value="lead-coach" className="bg-slate-800">Lead Coach</option>
                  <option value="maker-assistant" className="bg-slate-800">Maker Lab Assistant</option>
                  <option value="volunteer" className="bg-slate-800">Volunteer</option>
                  <option value="multiple" className="bg-slate-800">Open to multiple roles</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="background" className="block text-slate-300 mb-2">
                  Your background <span className="text-slate-500">(optional)</span>
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
                  Why does this interest you? <span className="text-slate-500">(optional)</span>
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
                {status === "loading" ? "Sending..." : "I'm In"}
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
