"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle, Brain, Loader2 } from "lucide-react";
import { calculateReadinessScore } from "@/lib/scoring";
import type { ScanAnswers, Sector } from "@/lib/types";

const SECTORS: { value: Sector; label: string; emoji: string; desc: string }[] = [
  { value: "construction", label: "Bouw & Renovatie", emoji: "🏗️", desc: "Offertes, planning, veiligheid" },
  { value: "retail", label: "Retail & E-commerce", emoji: "🛒", desc: "Beschrijvingen, klantenservice" },
  { value: "logistics", label: "Logistiek", emoji: "🚚", desc: "Routing, updates, documenten" },
  { value: "accountancy", label: "Accountancy & Admin", emoji: "📊", desc: "Facturen, e-mails, rapportage" },
  { value: "manufacturing", label: "Productie & Industrie", emoji: "🏭", desc: "SOP's, kwaliteit, onderhoud" },
  { value: "healthcare", label: "Zorg & Welzijn", emoji: "🏥", desc: "Dossiers, afspraken, rapportage" },
  { value: "hospitality", label: "Horeca & Toerisme", emoji: "🏨", desc: "Reserveringen, communicatie" },
  { value: "other", label: "Andere", emoji: "💼", desc: "Andere sector" },
];

const TOOLS = [
  "Excel", "Outlook", "WhatsApp", "Google Workspace",
  "Microsoft 365", "TeamLeader", "Salesforce", "HubSpot",
  "SAP", "Power Automate", "Zapier", "n8n",
];

const STEPS = [
  { key: "company", label: "Bedrijfsnaam", desc: "Stap 1 van 8" },
  { key: "sector", label: "Sector", desc: "Stap 2 van 8" },
  { key: "size", label: "Bedrijfsgrootte", desc: "Stap 3 van 8" },
  { key: "painpoint", label: "Pijnpunt", desc: "Stap 4 van 8" },
  { key: "tools", label: "Huidige tools", desc: "Stap 5 van 8" },
  { key: "data", label: "Data volwassenheid", desc: "Stap 6 van 8" },
  { key: "ambition", label: "Automatiseringsамbitie", desc: "Stap 7 van 8" },
  { key: "risk", label: "Risicoprofiel", desc: "Stap 8 van 8" },
];

const defaultAnswers: ScanAnswers = {
  sector: "construction",
  companySize: "21-50",
  painPoint: "",
  currentTools: [],
  dataMaturity: 3,
  automationAmbition: 3,
  riskSensitivity: "medium",
};

export function ScanForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [answers, setAnswers] = useState<ScanAnswers>(defaultAnswers);
  const [dir, setDir] = useState<1 | -1>(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function next() {
    setDir(1);
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else submit();
  }

  function back() {
    setDir(-1);
    if (step > 0) setStep((s) => s - 1);
  }

  async function submit() {
    if (!companyName.trim()) {
      setStep(0);
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const score = calculateReadinessScore(answers);
      void score; // computed server-side too, but useful for client-side preview
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, companyName: companyName.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { reportId } = (await res.json()) as { reportId: string };
      router.push(`/report/${reportId}`);
    } catch {
      setError("Rapport generatie mislukt. Probeer het opnieuw.");
      setGenerating(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const variants = {
    enter: { opacity: 0, x: dir * 30 } as const,
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } } as const,
    exit: { opacity: 0, x: dir * -30, transition: { duration: 0.2 } } as const,
  };

  if (generating) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center text-center"
        style={{ background: "rgba(13,20,36,0.95)", border: "1px solid rgba(59,130,246,0.12)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
        >
          <Loader2 size={28} className="text-white animate-spin" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#e2e8f0" }}>
          VLAIO-rapport wordt gegenereerd...
        </h2>
        <p className="text-sm mb-1" style={{ color: "#64748b" }}>
          AI schrijft 10 secties op basis van uw scanantwoorden.
        </p>
        <p className="text-xs" style={{ color: "#334155" }}>Gemiddeld 25–35 seconden</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(13,20,36,0.95)", border: "1px solid rgba(59,130,246,0.12)" }}
    >
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)" }}>
          <Brain size={14} style={{ color: "#3b82f6" }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>{STEPS[step].label}</p>
          <p className="text-xs" style={{ color: "#475569" }}>{STEPS[step].desc}</p>
        </div>
        <span className="text-xs font-mono" style={{ color: "#334155" }}>{Math.round(progress)}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <motion.div
          className="h-0.5"
          style={{ background: "linear-gradient(90deg, #3b82f6, #7c3aed)" }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-1.5 pt-5 px-6">
        {STEPS.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === step ? 24 : 6, height: 6, background: i < step ? "#10b981" : i === step ? "#3b82f6" : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>

      {/* Step content */}
      <div className="p-6 min-h-72 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} variants={variants} initial="enter" animate="center" exit="exit">
            {step === 0 && <StepCompanyName value={companyName} onChange={setCompanyName} />}
            {step === 1 && <StepSector value={answers.sector} onChange={(v) => setAnswers((a) => ({ ...a, sector: v }))} />}
            {step === 2 && <StepSize value={answers.companySize} onChange={(v) => setAnswers((a) => ({ ...a, companySize: v }))} />}
            {step === 3 && <StepPainPoint value={answers.painPoint} onChange={(v) => setAnswers((a) => ({ ...a, painPoint: v }))} />}
            {step === 4 && <StepTools value={answers.currentTools} onChange={(v) => setAnswers((a) => ({ ...a, currentTools: v }))} />}
            {step === 5 && <StepScale label="Hoe volwassen is uw databeheer?" sublabel="1 = alles in papier/hoofd · 5 = gestructureerde databases" value={answers.dataMaturity} onChange={(v) => setAnswers((a) => ({ ...a, dataMaturity: v as 1|2|3|4|5 }))} />}
            {step === 6 && <StepScale label="Hoe groot is uw automatiseringsамbitie?" sublabel="1 = liever manueel · 5 = zo veel mogelijk automatiseren" value={answers.automationAmbition} onChange={(v) => setAnswers((a) => ({ ...a, automationAmbition: v as 1|2|3|4|5 }))} />}
            {step === 7 && <StepRisk value={answers.riskSensitivity} onChange={(v) => setAnswers((a) => ({ ...a, riskSensitivity: v }))} />}
          </motion.div>
        </AnimatePresence>
        {error && <p className="mt-3 text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>}
      </div>

      {/* Nav */}
      <div className="px-6 py-4 flex justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <button onClick={back} disabled={step === 0} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-25" style={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>
          <ChevronLeft size={15} />
          Terug
        </button>
        <button
          onClick={next}
          disabled={step === 0 && !companyName.trim()}
          className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
        >
          {step === STEPS.length - 1 ? (<><CheckCircle size={15} />Genereer Rapport</>) : (<>Volgende<ChevronRight size={15} /></>)}
        </button>
      </div>
    </motion.div>
  );
}

function Card({ active, onClick, children, color = "#3b82f6" }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button onClick={onClick} className="w-full text-left p-3.5 rounded-xl transition-all" style={{ background: active ? `${color}12` : "rgba(255,255,255,0.025)", border: `1px solid ${active ? `${color}40` : "rgba(255,255,255,0.06)"}`, boxShadow: active ? `0 0 0 1px ${color}20` : "none" }}>
      {children}
    </button>
  );
}

function StepCompanyName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>Wat is de naam van uw bedrijf?</h2>
      <p className="text-sm mb-5" style={{ color: "#64748b" }}>Dit verschijnt in uw gepersonaliseerd VLAIO-innovatierapport.</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="bv. VanderBouw NV, De Groene Winkel BV..."
        className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-all"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.18)", color: "#e2e8f0" }}
        onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(59,130,246,0.4)")}
        onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(59,130,246,0.18)")}
      />
    </div>
  );
}

function StepSector({ value, onChange }: { value: Sector; onChange: (v: Sector) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>In welke sector is uw bedrijf actief?</h2>
      <p className="text-sm mb-5" style={{ color: "#64748b" }}>We passen de AI-analyse aan op uw specifieke sector.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {SECTORS.map((s) => (
          <Card key={s.value} active={value === s.value} onClick={() => onChange(s.value)}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{s.emoji}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: value === s.value ? "#93c5fd" : "#e2e8f0" }}>{s.label}</p>
                <p className="text-xs" style={{ color: "#475569" }}>{s.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StepSize({ value, onChange }: { value: ScanAnswers["companySize"]; onChange: (v: ScanAnswers["companySize"]) => void }) {
  const options: { value: ScanAnswers["companySize"]; label: string; desc: string }[] = [
    { value: "1-5", label: "1–5 medewerkers", desc: "Micro-onderneming" },
    { value: "6-20", label: "6–20 medewerkers", desc: "Kleine onderneming" },
    { value: "21-50", label: "21–50 medewerkers", desc: "Kleine KMO" },
    { value: "51-200", label: "51–200 medewerkers", desc: "Middelgrote KMO" },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>Hoe groot is uw bedrijf?</h2>
      <p className="text-sm mb-5" style={{ color: "#64748b" }}>Bedrijfsgrootte beïnvloedt de implementatiestrategie en ROI-berekening.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((o) => (
          <Card key={o.value} active={value === o.value} onClick={() => onChange(o.value)}>
            <p className="font-semibold text-sm" style={{ color: value === o.value ? "#93c5fd" : "#e2e8f0" }}>{o.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{o.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StepPainPoint({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>Wat is uw grootste tijdverspiller vandaag?</h2>
      <p className="text-sm mb-5" style={{ color: "#64748b" }}>Beschrijf welke taak of welk proces u het meeste frustreert.</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="bv. Het opmaken van offertes duurt 2–3 uur, elke keer opnieuw..."
        rows={4}
        className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none transition-all"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.18)", color: "#e2e8f0" }}
      />
    </div>
  );
}

function StepTools({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  function toggle(tool: string) {
    onChange(value.includes(tool) ? value.filter((t) => t !== tool) : [...value, tool]);
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>Welke tools gebruikt uw bedrijf?</h2>
      <p className="text-sm mb-5" style={{ color: "#64748b" }}>Selecteer alle tools die u dagelijks gebruikt.</p>
      <div className="flex flex-wrap gap-2">
        {TOOLS.map((tool) => {
          const active = value.includes(tool);
          return (
            <button key={tool} onClick={() => toggle(tool)} className="px-3 py-1.5 rounded-lg text-sm transition-all" style={{ background: active ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${active ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`, color: active ? "#93c5fd" : "#64748b" }}>
              {tool}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepScale({ label, sublabel, value, onChange }: { label: string; sublabel: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>{label}</h2>
      <p className="text-sm mb-8" style={{ color: "#64748b" }}>{sublabel}</p>
      <div className="flex justify-between gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} className="flex-1 py-5 rounded-xl font-bold text-2xl transition-all" style={{ background: value === n ? "linear-gradient(135deg, #3b82f6, #7c3aed)" : "rgba(255,255,255,0.03)", border: `1px solid ${value === n ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.06)"}`, color: value === n ? "#fff" : "#334155", boxShadow: value === n ? "0 0 20px rgba(59,130,246,0.25)" : "none", transform: value === n ? "scale(1.04)" : "scale(1)" }}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-xs" style={{ color: "#334155" }}>
        <span>Laag</span><span>Hoog</span>
      </div>
    </div>
  );
}

function StepRisk({ value, onChange }: { value: ScanAnswers["riskSensitivity"]; onChange: (v: ScanAnswers["riskSensitivity"]) => void }) {
  const options: { value: ScanAnswers["riskSensitivity"]; label: string; desc: string; color: string }[] = [
    { value: "low", label: "Innovator", desc: "Bereid om snel te experimenteren. Fouten zijn leermomenten.", color: "#10b981" },
    { value: "medium", label: "Pragmaticus", desc: "Bewezen oplossingen, stapsgewijs implementeren met validatie.", color: "#3b82f6" },
    { value: "high", label: "Conservatief", desc: "Elke stap goed onderbouwd en gevalideerd. Geen verrassingen.", color: "#f59e0b" },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: "#e2e8f0" }}>Wat is uw risicoprofiel?</h2>
      <p className="text-sm mb-5" style={{ color: "#64748b" }}>Dit bepaalt welke AI-oplossingen we aanbevelen en hoe we de roadmap opbouwen.</p>
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <Card key={o.value} active={value === o.value} onClick={() => onChange(o.value)} color={o.color}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: value === o.value ? o.color : "#334155" }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: value === o.value ? "#e2e8f0" : "#94a3b8" }}>{o.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{o.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
