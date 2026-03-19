"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const QUOTES = [
  "Clarity creates momentum.",
  "Small wins compound into big outcomes.",
  "Focus beats frenzy, every single day.",
  "Ship work that matters, faster.",
];

const COUNTER_START = 28473;

export function AuthHeroPanel() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(COUNTER_START);

  useEffect(() => {
    const quoteTimer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4200);

    return () => window.clearInterval(quoteTimer);
  }, []);

  useEffect(() => {
    const counterTimer = window.setInterval(() => {
      setTasksCompleted((prev) => prev + Math.floor(Math.random() * 6) + 2);
    }, 1800);

    return () => window.clearInterval(counterTimer);
  }, []);

  const formattedCounter = useMemo(
    () => new Intl.NumberFormat("en-US").format(tasksCompleted),
    [tasksCompleted]
  );

  return (
    <div className="relative overflow-hidden rounded-ocean-card border border-cyan-200/20 bg-slate-950/70 px-6 py-8 sm:px-8 sm:py-10">
      <motion.div
        className="absolute -left-20 -top-16 h-60 w-60 rounded-full bg-cyan-400/30 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-ocean-pill border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-xs tracking-wide text-cyan-100">
          <Activity className="size-3.5" />
          Live Productivity Stream
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/85">
            Built for modern teams
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Work Calmly. Execute Relentlessly.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-200/85 sm:text-base">
            Plan with confidence, keep priorities visible, and complete meaningful work without context-switch chaos.
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/80">
            Tasks completed today by our users
          </p>
          <motion.p
            key={formattedCounter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mt-2 text-3xl font-semibold text-white sm:text-4xl"
          >
            {formattedCounter}
          </motion.p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-cyan-100/80">
            Motivation pulse
          </p>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={QUOTES[quoteIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-lg font-medium text-white"
            >
              “{QUOTES[quoteIndex]}”
            </motion.blockquote>
          </AnimatePresence>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-200">
            <CheckCircle2 className="size-4" />
            <span>Teams shipping faster with less stress.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
