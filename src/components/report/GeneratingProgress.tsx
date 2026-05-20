"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";

const STEPS = [
  "Sectoranalyse",
  "Probleemomschrijving",
  "AI-innovatievoorstel",
  "Technische beoordeling",
  "Werkpakketten",
  "Impactanalyse",
  "GDPR-compliance",
  "Roadmap",
  "Pilootplan",
  "Financieringsplan",
];

export function GeneratingProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#080b14" }}>
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
          >
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#e2e8f0" }}>
            Rapport wordt gegenereerd
          </h2>
          <p className="text-sm" style={{ color: "#475569" }}>
            AI analyseert uw bedrijfsdata en schrijft 10 secties...
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="rounded-full h-1.5 mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #3b82f6, #7c3aed)" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <AnimatePresence key={step} mode="wait">
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: done ? 0.5 : active ? 1 : 0.25 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: active ? "rgba(59,130,246,0.08)" : "transparent",
                    border: active ? "1px solid rgba(59,130,246,0.15)" : "1px solid transparent",
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {done ? (
                      <CheckCircle size={14} style={{ color: "#10b981" }} />
                    ) : active ? (
                      <Loader2 size={14} className="animate-spin" style={{ color: "#3b82f6" }} />
                    ) : (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#334155" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: done ? "#475569" : active ? "#e2e8f0" : "#334155" }}
                  >
                    {i + 1 < 10 ? `0${i + 1}` : i + 1} — {step}
                  </span>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#334155" }}>
          {pct}% voltooid · Gemiddeld 25 seconden
        </p>
      </div>
    </div>
  );
}
