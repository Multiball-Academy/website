"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registration_id");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-8 max-w-lg text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          You&apos;re Registered! 🎉
        </h1>
        
        <p className="text-slate-300 mb-6 text-lg">
          Payment successful! Your camper is officially signed up for 
          <span className="text-white font-semibold"> Multiball Academy Summer Camp 2026</span>.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-slate-400 text-sm mb-2">Confirmation ID</p>
          <p className="text-white font-mono text-lg">{registrationId || "—"}</p>
        </div>
        
        <div className="space-y-3 text-left bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold text-center mb-3">What&apos;s Next?</h3>
          <div className="flex items-start gap-3">
            <span className="text-cyan-400">📧</span>
            <p className="text-slate-300 text-sm">Check your email for a confirmation with all the details</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-cyan-400">📋</span>
            <p className="text-slate-300 text-sm">We&apos;ll send a welcome packet closer to camp with what to bring</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-cyan-400">🎮</span>
            <p className="text-slate-300 text-sm">Get ready for an amazing week of pinball and making!</p>
          </div>
        </div>
        
        <div className="text-slate-400 text-sm mb-6">
          <p><strong className="text-white">Camp Dates:</strong> June 29 – July 3, 2026</p>
          <p><strong className="text-white">Hours:</strong> 9am – 3pm daily</p>
        </div>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
