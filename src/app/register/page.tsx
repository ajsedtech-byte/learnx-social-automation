"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STEPS = [
  { title: "Parent Info", emoji: "\u{1F469}" },
  { title: "Add Child", emoji: "\u{1F9D2}" },
  { title: "School Link", emoji: "\u{1F3EB}" },
  { title: "Verify OTP", emoji: "\u2705" },
];

const BOARDS = ["CBSE", "ICSE", "MP Board", "Maharashtra", "Tamil Nadu", "Karnataka", "UP Board", "West Bengal", "IB"];
const STREAMS = ["Science (PCM)", "Science (PCB)", "Commerce", "Arts"];

const SAMPLE_SCHOOLS = [
  "Delhi Public School, R.K. Puram",
  "Kendriya Vidyalaya, Bhopal",
  "Ryan International, Mumbai",
  "DAV Public School, Chennai",
  "Springdales School, New Delhi",
  "St. Xavier's High School, Pune",
  "The Heritage School, Kolkata",
];

interface ChildInfo {
  name: string;
  selectedClass: number;
  board: string;
  stream: string;
  section: string;
  gender: string;
}

const DEFAULT_CHILD: ChildInfo = {
  name: "",
  selectedClass: 5,
  board: "CBSE",
  stream: "Science (PCM)",
  section: "A",
  gender: "Boy",
};

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [children, setChildren] = useState<ChildInfo[]>([{ ...DEFAULT_CHILD }]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const activeChild = children[activeChildIndex];

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = useCallback(() => {
    setOtpSent(true);
    setOtpTimer(30);
  }, []);

  const updateChild = (index: number, field: keyof ChildInfo, value: string | number) => {
    setChildren((prev) =>
      prev.map((child, i) => (i === index ? { ...child, [field]: value } : child))
    );
  };

  const addChild = () => {
    if (children.length < 3) {
      setChildren((prev) => [...prev, { ...DEFAULT_CHILD }]);
      setActiveChildIndex(children.length);
    }
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren((prev) => prev.filter((_, i) => i !== index));
      setActiveChildIndex(Math.max(0, activeChildIndex - 1));
    }
  };

  const handleEnrollmentCode = (code: string) => {
    setEnrollmentCode(code);
    // Simulate auto-populate when a valid code is entered
    if (code.length >= 8) {
      setSchoolName("Delhi Public School, R.K. Puram");
    } else {
      if (!schoolSearch) setSchoolName("");
    }
  };

  const filteredSchools = SAMPLE_SCHOOLS.filter((s) =>
    s.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const handleOtpInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo/40 transition-colors";

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden py-8">
      <div className="blob blob-indigo w-[500px] h-[500px] -top-40 -right-40 opacity-12" />
      <div className="blob blob-teal w-[400px] h-[400px] bottom-20 -left-20 opacity-8" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo via-teal to-purple-500 bg-clip-text text-transparent">
            Create Family Account
          </h1>
          <p className="text-sm text-slate-500 mt-1">Get your child started with LearnX</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${
                  i <= step
                    ? "bg-indigo/20 text-indigo-light border border-indigo/30"
                    : "bg-white/[0.04] text-slate-600 border border-white/[0.06]"
                }`}
              >
                {i < step ? "\u2713" : s.emoji}
              </div>
              <span className={`text-xs font-medium ${i <= step ? "text-slate-300" : "text-slate-600"}`}>
                {s.title}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-indigo/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Parent Info */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">Parent Details</h3>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Sunita Sharma"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Email Address</label>
                  <input type="email" placeholder="sunita@gmail.com" className={inputClasses} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Phone Number (also your password)
                  </label>
                  <input type="tel" placeholder="+91 98765 43210" className={inputClasses} />
                </div>
              </motion.div>
            )}

            {/* Step 2: Child Info */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Add Your Child</h3>
                  {children.length > 1 && (
                    <span className="text-xs text-slate-500">
                      {children.length}/3 children
                    </span>
                  )}
                </div>

                {/* Child tabs if multiple children */}
                {children.length > 1 && (
                  <div className="flex gap-2 mb-2">
                    {children.map((child, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveChildIndex(i)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeChildIndex === i
                            ? "bg-indigo/20 text-indigo-light border border-indigo/30"
                            : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"
                        }`}
                      >
                        {child.name || `Child ${i + 1}`}
                        {children.length > 1 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              removeChild(i);
                            }}
                            className="ml-1 text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            {"\u00D7"}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Child&apos;s Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav"
                    value={activeChild.name}
                    onChange={(e) => updateChild(activeChildIndex, "name", e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Class</label>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                      <button
                        key={c}
                        onClick={() => updateChild(activeChildIndex, "selectedClass", c)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all
                          ${
                            activeChild.selectedClass === c
                              ? "bg-indigo/20 text-indigo-light border border-indigo/30"
                              : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Board</label>
                  <div className="flex flex-wrap gap-2">
                    {BOARDS.map((b) => (
                      <button
                        key={b}
                        onClick={() => updateChild(activeChildIndex, "board", b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeChild.board === b
                            ? "bg-indigo/20 text-indigo-light border border-indigo/30"
                            : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {activeChild.selectedClass >= 11 && (
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Stream (Class 11-12)</label>
                    <div className="flex flex-wrap gap-2">
                      {STREAMS.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateChild(activeChildIndex, "stream", s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeChild.stream === s
                              ? "bg-teal/20 text-teal border border-teal/30"
                              : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Section</label>
                    <input
                      type="text"
                      value={activeChild.section}
                      onChange={(e) => updateChild(activeChildIndex, "section", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Gender</label>
                    <div className="flex gap-2">
                      {["Boy", "Girl"].map((g) => (
                        <button
                          key={g}
                          onClick={() => updateChild(activeChildIndex, "gender", g)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                            activeChild.gender === g
                              ? "bg-indigo/20 text-indigo-light border border-indigo/30"
                              : "bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:bg-white/[0.08]"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Another Child */}
                {children.length < 3 && (
                  <button
                    onClick={addChild}
                    className="w-full py-3 rounded-xl border border-dashed border-white/[0.12] text-sm text-slate-400 font-semibold hover:bg-white/[0.03] hover:border-indigo/30 hover:text-indigo-light transition-all"
                  >
                    + Add Another Child
                  </button>
                )}
                {children.length < 3 && (
                  <p className="text-[11px] text-slate-600 text-center">
                    You can add up to 3 children
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: School Link */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">Link to School</h3>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    School Enrollment Code (if provided by school)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ENR-DPS-2026-A5"
                    value={enrollmentCode}
                    onChange={(e) => handleEnrollmentCode(e.target.value)}
                    className={inputClasses}
                  />
                  {enrollmentCode.length >= 8 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2.5 rounded-lg bg-teal/10 border border-teal/20"
                    >
                      <p className="text-xs text-teal font-medium">
                        {"\u2713"} School found: {schoolName}
                      </p>
                      <p className="text-[11px] text-teal/70 mt-0.5">
                        Section and details will be auto-populated.
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[11px] text-slate-600">OR</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                <div className="relative">
                  <label className="text-xs text-slate-400 mb-1 block">Search School</label>
                  <input
                    type="text"
                    placeholder="Type school name..."
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value);
                      setShowSchoolDropdown(e.target.value.length > 0);
                    }}
                    onFocus={() => schoolSearch && setShowSchoolDropdown(true)}
                    className={inputClasses}
                  />
                  <AnimatePresence>
                    {showSchoolDropdown && filteredSchools.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-navy-light border border-white/[0.08] overflow-hidden z-20 max-h-40 overflow-y-auto"
                      >
                        {filteredSchools.map((school) => (
                          <button
                            key={school}
                            onClick={() => {
                              setSchoolName(school);
                              setSchoolSearch(school);
                              setShowSchoolDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/[0.05] transition-colors"
                          >
                            {school}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {schoolName && !enrollmentCode && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-lg bg-teal/10 border border-teal/20"
                  >
                    <p className="text-xs text-teal font-medium">
                      {"\u2713"} Selected: {schoolName}
                    </p>
                  </motion.div>
                )}

                <div className="p-3 rounded-xl bg-indigo/5 border border-indigo/10">
                  <p className="text-xs text-indigo-light/70 leading-relaxed">
                    {"\u{1F4A1}"} No code? No problem {"\u2014"} you can learn independently! School
                    linking can be done later from settings.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: OTP Verification */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2">Verify Your Phone</h3>
                  <p className="text-sm text-slate-400">
                    Enter the 6-digit code sent to your registered phone number
                  </p>
                </div>

                {/* Summary card */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs text-slate-500 mb-1">Parent</div>
                    <div className="text-sm text-white font-medium">Mrs. Sunita Sharma</div>
                    <div className="text-xs text-slate-400">sunita@gmail.com {"\u00B7"} +91 98765 43210</div>
                  </div>
                  {children.map((child, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-xs text-slate-500 mb-1">Child {children.length > 1 ? i + 1 : ""}</div>
                      <div className="text-sm text-white font-medium">
                        {child.name || "Child"} {"\u00B7"} Class {child.selectedClass}
                        {child.section} {"\u00B7"} {child.board}
                      </div>
                      <div className="text-xs text-slate-400">
                        Auto-generated: {(child.name || "child").toLowerCase()}@learnx.app
                      </div>
                    </div>
                  ))}
                  {schoolName && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-xs text-slate-500 mb-1">School</div>
                      <div className="text-sm text-white font-medium">{schoolName}</div>
                    </div>
                  )}
                </div>

                {/* OTP Input */}
                <div>
                  <div className="flex justify-center gap-3 mb-4">
                    {otpValues.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpInput(i, e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !val && i > 0) {
                            const prevInput = document.getElementById(`otp-${i - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        className="w-11 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center text-lg font-bold text-white outline-none focus:border-indigo/40 transition-colors"
                      />
                    ))}
                  </div>

                  {/* Send / Resend OTP */}
                  <div className="text-center">
                    {!otpSent ? (
                      <button
                        onClick={handleSendOtp}
                        className="px-5 py-2 rounded-xl bg-indigo/20 text-indigo-light text-sm font-semibold border border-indigo/30 hover:bg-indigo/30 transition-all"
                      >
                        Send OTP
                      </button>
                    ) : otpTimer > 0 ? (
                      <p className="text-xs text-slate-500">
                        Resend OTP in{" "}
                        <span className="text-indigo-light font-semibold">{otpTimer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-xs text-indigo-light/80 hover:text-indigo-light font-semibold transition-colors"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-teal/5 border border-teal/10">
                  <div className="text-xs text-teal flex items-center gap-2">
                    <span>{"\u{1F4A1}"}</span> Password = phone number. You can add more children from
                    settings.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {"\u2190"} Back
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {"\u2190"} Sign in instead
              </Link>
            )}
            <button
              onClick={() => (step < 3 ? setStep(step + 1) : null)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo to-teal text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {step === 3 ? "Create Account" : "Next \u2192"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
