"use client";

import Link from "next/link";

const SAWYER_URL = "https://www.sawyer.com/providers/multiball-academy"; // Update once Sawyer account is created

const sessions = [
  { id: 1, dates: "June 23–27", status: "open" },
  { id: 2, dates: "July 7–11", status: "open" },
  { id: 3, dates: "July 14–18", status: "open" },
  { id: 4, dates: "July 21–25", status: "open" },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 p-6">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to home
        </Link>
      </nav>

      {/* Hero */}
      <header className="relative z-10 text-center px-4 pt-8 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Summer Camp{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
            2026
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          One week of pinball, making, and competition. Walk in a beginner, walk out a player.
        </p>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        {/* Quick Facts */}
        <section className="mb-12">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Ages", value: "10–15" },
              { label: "Time", value: "9am–3pm" },
              { label: "Capacity", value: "12 campers" },
              { label: "Price", value: "$295/week" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="text-slate-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sessions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Choose Your Week</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-semibold">Session {session.id}</div>
                  <div className="text-slate-400">{session.dates}, 2026</div>
                </div>
                <div className="flex items-center gap-3">
                  {session.status === "open" ? (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                      Spots Available
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                      Waitlist
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's Included */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">What&apos;s Included</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <ul className="space-y-3 text-slate-300">
              {[
                "Full week of instruction (Mon–Fri, 9am–3pm)",
                "Professional pinball machines to practice on",
                "Maker lab projects (circuits, mechanisms, art)",
                "Friday tournament with trophies",
                "Camp t-shirt",
                "Snacks and drinks",
                "Access to Coach Flip AI coaching app",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The Week */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">The Week</h2>
          <div className="space-y-3">
            {[
              { day: "Monday", focus: "Foundations", desc: "Meet the machines, flipper basics, first games" },
              { day: "Tuesday", focus: "Strategy", desc: "When to trap, shot selection, reading modes" },
              { day: "Wednesday", focus: "Deep Dive", desc: "Scoring systems, multipliers, wizard goals" },
              { day: "Thursday", focus: "Tournament Prep", desc: "Practice matches, bracket format, mindset" },
              { day: "Friday", focus: "Tournament Day", desc: "Real competition, trophies, family showcase" },
            ].map((item) => (
              <div
                key={item.day}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4"
              >
                <div className="w-24 flex-shrink-0">
                  <div className="text-cyan-400 font-semibold">{item.day}</div>
                </div>
                <div>
                  <div className="text-white font-semibold">{item.focus}</div>
                  <div className="text-slate-400 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to Bring */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">What to Bring</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <ul className="space-y-2 text-slate-300">
              {[
                "Comfortable clothes (you'll be standing and moving)",
                "Closed-toe shoes",
                "Water bottle",
                "Lunch (or money for nearby food)",
                "Curiosity and a willingness to learn",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-slate-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Register CTA */}
        <section className="text-center">
          <a
            href={SAWYER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            Register Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <p className="text-slate-400 mt-4 text-sm">
            Registration powered by Sawyer. Secure checkout, payment plans available.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-4">Questions?</h2>
          <div className="space-y-4">
            {[
              { 
                q: "What if my kid has never played pinball?", 
                a: "Perfect! Most campers are beginners. We start from scratch and meet each kid where they are." 
              },
              { 
                q: "Is there a sibling discount?", 
                a: "Yes! 10% off the second camper. Enter code SIBLING at checkout." 
              },
              { 
                q: "What's the refund policy?", 
                a: "Full refund up to 14 days before camp. 50% refund up to 7 days before. No refunds within 7 days (but you can transfer to another session if space is available)." 
              },
              { 
                q: "Where is camp located?", 
                a: "Memphis, TN. Exact location will be shared with registered families 2 weeks before camp." 
              },
              { 
                q: "Can my kid do multiple weeks?", 
                a: "Absolutely! Each week builds skills. Repeat campers get deeper into strategy and maker projects." 
              },
            ].map((item) => (
              <div key={item.q} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 text-center">
          <p className="text-slate-400">
            More questions? Email us at{" "}
            <a href="mailto:hello@multiballacademy.com" className="text-cyan-400 hover:underline">
              hello@multiballacademy.com
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-slate-500 text-sm text-center">
        <p>© 2026 Multiball Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
