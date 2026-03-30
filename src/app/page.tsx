import Link from "next/link";

export default function Home() {
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
        <p className="text-xl md:text-2xl text-slate-300 mb-2 font-semibold tracking-wide">
          Flip. Tinker. Play.
        </p>
        <p className="text-lg text-slate-400 mb-8">
          Youth pinball + maker camp. Building skills, focus, and fun.
        </p>

        {/* Date badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          June 23–27, 2026 — Memphis, TN
        </div>

        {/* Register CTA */}
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
        >
          Register Now
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        {/* Coaches CTA */}
        <Link 
          href="/join" 
          className="mt-10 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500"></span>
          </span>
          <span>Want to help? <span className="text-cyan-400 group-hover:underline">Join the crew →</span></span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-slate-500 text-sm text-center">
        <p>© 2026 Multiball Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
