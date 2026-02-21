"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_ONBOARDING_STEPS, DEMO_SCHOOL } from "@/lib/school-admin-demo-data";

const EXAMPLE_TEACHERS = [
  { name: "Ms. Priya Verma", email: "priya.v@dps.edu", subject: "Mathematics", sent: true },
  { name: "Mr. Rajesh Iyer", email: "rajesh@dps.edu", subject: "Science", sent: true },
  { name: "Mrs. Sunita Rao", email: "sunita@dps.edu", subject: "Hindi", sent: false },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(3); // Step 3 is next incomplete

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress header */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white">School Onboarding</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Complete all steps to launch LearnX at your school
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Progress</div>
            <div className="text-sm font-bold text-pink-400">
              {DEMO_ONBOARDING_STEPS.filter((s) => s.completed).length} / {DEMO_ONBOARDING_STEPS.length} complete
            </div>
          </div>
        </div>

        {/* Step indicators with connecting lines */}
        <div className="flex items-center justify-between relative">
          {/* Connecting line background */}
          <div className="absolute top-5 left-[40px] right-[40px] h-0.5 bg-white/5" />
          {/* Connecting line progress */}
          <div
            className="absolute top-5 left-[40px] h-0.5 bg-pink-500/40 transition-all duration-500"
            style={{
              width: `${((DEMO_ONBOARDING_STEPS.filter((s) => s.completed).length) / (DEMO_ONBOARDING_STEPS.length - 1)) * 100}%`,
              maxWidth: "calc(100% - 80px)",
            }}
          />

          {DEMO_ONBOARDING_STEPS.map((step) => {
            const isActive = currentStep === step.step;
            const isDone = step.completed;
            return (
              <button
                key={step.step}
                onClick={() => setCurrentStep(step.step)}
                className="relative z-10 flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isDone
                      ? "bg-emerald-500/20 border-2 border-emerald-500/40"
                      : isActive
                      ? "bg-pink-500/20 border-2 border-pink-500/60 shadow-lg shadow-pink-500/20"
                      : "bg-white/5 border-2 border-white/10"
                  }`}
                >
                  {isDone ? (
                    <span className="text-emerald-300 text-sm font-bold">{"\u2713"}</span>
                  ) : (
                    <span>{step.emoji}</span>
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={`text-xs font-semibold ${
                      isDone ? "text-emerald-300" : isActive ? "text-pink-400" : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-600 max-w-[120px]">{step.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{"\u{1F3EB}"}</span>
              <h3 className="text-sm font-bold text-white">Step 1: School Information</h3>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 font-semibold">
                {"\u2713"} Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">School Name</label>
                  <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white">
                    {DEMO_SCHOOL.name}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">School Code</label>
                  <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-pink-400 font-mono">
                    {DEMO_SCHOOL.code}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">City</label>
                  <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white">
                    {DEMO_SCHOOL.city}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">Board</label>
                    <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white">
                      {DEMO_SCHOOL.board}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">Established</label>
                    <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white">
                      {DEMO_SCHOOL.establishedYear}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-sm font-semibold hover:bg-pink-500/30 transition-all border border-pink-500/20"
              >
                Next: Invite Teachers {"\u2192"}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{"\u{1F4DA}"}</span>
              <h3 className="text-sm font-bold text-white">Step 2: Invite Teachers</h3>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 font-semibold">
                {"\u2713"} 2 invited
              </span>
            </div>

            {/* Teacher invite list */}
            <div className="space-y-2 mb-4">
              {EXAMPLE_TEACHERS.map((teacher, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-sm">
                    {"\u{1F469}\u200D\u{1F3EB}"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{teacher.name}</div>
                    <div className="text-[10px] text-slate-500">{teacher.email} | {teacher.subject}</div>
                  </div>
                  {teacher.sent ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 font-semibold">
                      {"\u2713"} Invite Sent
                    </span>
                  ) : (
                    <button className="px-3 py-1.5 rounded-lg bg-pink-500/15 text-pink-400 text-[10px] font-semibold hover:bg-pink-500/25 transition-all">
                      Send Invite
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add more */}
            <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
              <span className="text-slate-500 text-xs">+ Add more teachers via email or bulk CSV upload</span>
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2 rounded-xl bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10 transition-all border border-white/10"
              >
                {"\u2190"} Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-sm font-semibold hover:bg-pink-500/30 transition-all border border-pink-500/20"
              >
                Next: Enroll Students {"\u2192"}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{"\u{1F465}"}</span>
              <h3 className="text-sm font-bold text-white">Step 3: Enroll Students</h3>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-semibold">
                Pending
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* CSV upload */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-3">Option A: Bulk Upload via CSV</h4>
                <div className="rounded-xl border-2 border-dashed border-white/10 p-8 text-center hover:border-pink-500/30 transition-all cursor-pointer group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{"\u{1F4C1}"}</div>
                  <div className="text-sm text-slate-400 mb-1">Drag & drop a CSV file here</div>
                  <div className="text-[10px] text-slate-600 mb-3">or click to browse</div>
                  <button className="px-4 py-2 rounded-xl bg-pink-500/15 text-pink-400 text-xs font-semibold hover:bg-pink-500/25 transition-all border border-pink-500/15">
                    Browse Files
                  </button>
                </div>
                <div className="mt-3 text-[10px] text-slate-600">
                  CSV format: Name, Class, Section, Parent Email (optional)
                </div>
              </div>

              {/* Share code */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-3">Option B: Share School Code</h4>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 text-center">
                  <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-semibold">School Join Code</div>
                  <div className="text-3xl font-black font-mono text-pink-400 tracking-widest mb-3">
                    {DEMO_SCHOOL.code}
                  </div>
                  <div className="text-xs text-slate-400 mb-4">
                    Share this code with students. They can enter it during sign-up to auto-join the school.
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-semibold hover:bg-white/10 transition-all border border-white/10">
                      {"\u{1F4CB}"} Copy Code
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-semibold hover:bg-white/10 transition-all border border-white/10">
                      {"\u{1F4F1}"} Share via WhatsApp
                    </button>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{"\u{1F517}"}</span>
                    <div className="text-[10px] text-slate-400">
                      Direct Link:{" "}
                      <span className="text-pink-400 font-mono">learnx.app/join/{DEMO_SCHOOL.code.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2 rounded-xl bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10 transition-all border border-white/10"
              >
                {"\u2190"} Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-sm font-semibold hover:bg-pink-500/30 transition-all border border-pink-500/20"
              >
                Next: Go Live {"\u2192"}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{"\u{1F680}"}</span>
              <h3 className="text-sm font-bold text-white">Step 4: Review & Go Live</h3>
            </div>

            {/* Summary dashboard */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                <div className="text-2xl mb-1">{"\u{1F3EB}"}</div>
                <div className="text-lg font-black text-white">1</div>
                <div className="text-[10px] text-slate-500">School Verified</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                <div className="text-2xl mb-1">{"\u{1F469}\u200D\u{1F3EB}"}</div>
                <div className="text-lg font-black text-white">{DEMO_SCHOOL.teacherCount}</div>
                <div className="text-[10px] text-slate-500">Teachers Invited</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                <div className="text-2xl mb-1">{"\u{1F393}"}</div>
                <div className="text-lg font-black text-white">{DEMO_SCHOOL.studentCount.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Students Enrolled</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                <div className="text-2xl mb-1">{"\u{1F4DA}"}</div>
                <div className="text-lg font-black text-white">12</div>
                <div className="text-[10px] text-slate-500">Classes Active</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-6">
              <h4 className="text-xs font-bold text-slate-300 mb-3">Pre-Launch Checklist</h4>
              <div className="space-y-2">
                {[
                  { label: "School details verified", done: true },
                  { label: "At least 5 teachers invited", done: true },
                  { label: "Student enrollment started", done: false },
                  { label: "Admin contact verified", done: true },
                  { label: "Data privacy policy acknowledged", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                        item.done
                          ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                          : "bg-white/5 text-slate-600 border border-white/10"
                      }`}
                    >
                      {item.done ? "\u2713" : ""}
                    </div>
                    <span className={`text-xs ${item.done ? "text-slate-300" : "text-slate-500"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Go Live button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 rounded-xl bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10 transition-all border border-white/10"
              >
                {"\u2190"} Back
              </button>
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-bold hover:from-pink-400 hover:to-pink-500 transition-all shadow-lg shadow-pink-500/25 flex items-center gap-2">
                <span>{"\u{1F680}"}</span>
                Go Live!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
