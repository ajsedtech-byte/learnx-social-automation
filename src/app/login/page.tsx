"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Role = "student" | "parent" | "teacher" | "admin";

const ROLES: { key: Role; label: string; emoji: string }[] = [
  { key: "student", label: "Student", emoji: "\u{1F393}" },
  { key: "parent", label: "Parent", emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}" },
  { key: "teacher", label: "Teacher", emoji: "\u{1F4DA}" },
  { key: "admin", label: "Admin", emoji: "\u{1F6E1}\uFE0F" },
];

export default function LoginPage() {
  const [mode, setMode] = useState<Role>("student");
  const [showForgotHint, setShowForgotHint] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="min-h-screen bg-navy flex relative overflow-hidden">
      <div className="blob blob-indigo w-[500px] h-[500px] -top-40 -left-40 opacity-15" />
      <div className="blob blob-teal w-[400px] h-[400px] bottom-20 right-20 opacity-10" />
      <div className="blob blob-purple w-[300px] h-[300px] top-1/2 left-1/3 opacity-8" />

      {/* Left — Branding */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent mb-4">
            LearnX
          </h1>
          <p className="text-xl text-slate-300 font-medium mb-2">
            Every child learns differently.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            K-12 Universal Course Engine. Free education for every Indian student.
            Adaptive learning, brain profiling, spaced repetition, career guidance — all in one platform.
          </p>

          <div className="space-y-3">
            {[
              { emoji: "\u{1F9E0}", text: "9-domain SPARK brain profiling" },
              { emoji: "\u{1F504}", text: "R1-R10 spaced repetition system" },
              { emoji: "\u{1F9EC}", text: "AI-powered Mistake Genome detection" },
              { emoji: "\u{1F680}", text: "GroerX career intelligence for C6-12" },
              { emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}", text: "Real-time parent monitoring dashboard" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{feature.emoji}</span>
                <span className="text-sm text-slate-400">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-6">Sign in to continue learning</p>

            {/* 4-Role Toggle */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.04]">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    setMode(r.key);
                    setShowForgotHint(false);
                    setOtpSent(false);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                    ${mode === r.key ? "bg-indigo/20 text-indigo-light" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <span className="block text-sm mb-0.5">{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Role-specific Form Fields */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* ── Student Form ── */}
                {mode === "student" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Student Email</label>
                      <input
                        type="email"
                        placeholder="aarav@learnx.app"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Password</label>
                      <input
                        type="password"
                        placeholder="Phone number as password"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* ── Parent Form ── */}
                {mode === "parent" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Email or Phone</label>
                      <input
                        type="text"
                        placeholder="parent@gmail.com or +91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Password</label>
                      <input
                        type="password"
                        placeholder="Phone number as password"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">OTP Verification</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors tracking-widest"
                        />
                        <button
                          onClick={() => setOtpSent(true)}
                          className={`px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                            otpSent
                              ? "bg-teal/10 text-teal border border-teal/20"
                              : "bg-indigo/20 text-indigo-light border border-indigo/30 hover:bg-indigo/30"
                          }`}
                        >
                          {otpSent ? "OTP Sent" : "Send OTP"}
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-teal/5 border border-teal/10">
                      <p className="text-[11px] text-teal/80 leading-relaxed">
                        OTP sent to registered phone. 2nd parent can link via OTP from settings.
                      </p>
                    </div>
                  </>
                )}

                {/* ── Teacher Form ── */}
                {mode === "teacher" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">School Code</label>
                      <input
                        type="text"
                        placeholder="e.g. SCH-MH-00421"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Teacher ID</label>
                      <input
                        type="text"
                        placeholder="e.g. TCH-1042"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Password</label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* ── Admin Form ── */}
                {mode === "admin" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Admin Email</label>
                      <input
                        type="email"
                        placeholder="admin@learnx.app"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Password</label>
                      <input
                        type="password"
                        placeholder="Enter admin password"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">2FA Code</label>
                      <input
                        type="text"
                        placeholder="6-digit authenticator code"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors tracking-widest"
                      />
                    </div>
                  </>
                )}

                {/* Sign In Button */}
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo to-teal text-white font-bold text-sm hover:opacity-90 transition-opacity">
                  Sign In
                </button>

                {/* Demo Mode Button — role-specific */}
                <Link
                  href="/"
                  className="block w-full py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center text-sm text-slate-400 font-semibold hover:bg-white/[0.08] transition-colors"
                >
                  {"\u{1F3AE}"} Enter Demo as {ROLES.find((r) => r.key === mode)?.label}
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Footer links */}
            <div className="flex items-center justify-between mt-4">
              <div className="relative">
                <button
                  onClick={() => setShowForgotHint(!showForgotHint)}
                  className="text-xs text-indigo-light/60 hover:text-indigo-light transition-colors"
                >
                  Forgot password?
                </button>
                <AnimatePresence>
                  {showForgotHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 top-full mt-2 p-2.5 rounded-lg bg-indigo/10 border border-indigo/20 w-56 z-20"
                    >
                      <p className="text-[11px] text-indigo-light/80 leading-relaxed">
                        Password is your registered phone number
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/register" className="text-xs text-teal/60 hover:text-teal transition-colors">
                Create account {"\u2192"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
