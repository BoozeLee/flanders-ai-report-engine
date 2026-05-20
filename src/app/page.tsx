import Link from "next/link";

const TICKER = [
  "VanderBouw NV", "Logi-Express BV", "Digitale Boekhouders", "MedCare Hasselt",
  "RetailPlus Gent", "TechWorks Mechelen", "Horeca Van den Berg", "Renovatie De Smet",
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#080b14" }}>
      {/* Aurora blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: "absolute", top: "-10%", left: "20%", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 500, height: 400, background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }}
        >
          ✦ AI-rapport in 30 seconden · VLAIO-subsidie klaar
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight mb-5 max-w-3xl" style={{ color: "#e2e8f0", letterSpacing: "-2px", lineHeight: 1.1 }}>
          Genereer uw{" "}
          <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", color: "transparent" }}>
            VLAIO Innovatierapport
          </span>{" "}
          in 2 minuten
        </h1>

        <p className="text-lg mb-10 max-w-xl" style={{ color: "#64748b", lineHeight: 1.6 }}>
          AI-gegenereerd, sectorspecifiek rapport klaar voor VLAIO-subsidieaanvraag. Deel via een vaste URL met uw adviseur.
        </p>

        <Link
          href="/scan"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:opacity-90 hover:scale-105"
          style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", boxShadow: "0 0 0 1px rgba(59,130,246,0.3), 0 8px 32px rgba(59,130,246,0.3)" }}
        >
          Start AI-scan gratis →
        </Link>

        <p className="mt-4 text-xs" style={{ color: "#334155" }}>Geen registratie · 8 vragen · Rapport deelbaar via URL</p>

        {/* Stats */}
        <div className="mt-14 flex rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(13,20,36,0.8)" }}>
          {[
            { v: "10 secties", l: "volledig rapport", c: "#10b981" },
            { v: "< 30 sec", l: "generatietijd", c: "#3b82f6" },
            { v: "8 sectoren", l: "sectorspecifiek", c: "#8b5cf6" },
          ].map((s, i) => (
            <div key={i} className="px-8 py-4 text-center" style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <p className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</p>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Company ticker */}
        <div className="mt-12 w-full max-w-2xl overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10" style={{ background: "linear-gradient(to right, #080b14, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10" style={{ background: "linear-gradient(to left, #080b14, transparent)" }} />
          <div className="marquee-track">
            {[...TICKER, ...TICKER].map((name, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-4 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#475569" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3b82f6" }} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-4 py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest mb-10" style={{ color: "#475569" }}>HOE HET WERKT</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Vul de scan in", d: "8 vragen over uw bedrijf, sector, tools en ambities. Duurt 2 minuten.", c: "#3b82f6" },
              { n: "02", t: "AI genereert rapport", d: "Groq AI schrijft 10 secties — samenvatting, werkpakketten, roadmap, compliance.", c: "#8b5cf6" },
              { n: "03", t: "Deel via URL", d: "Uw rapport krijgt een vaste link. Stuur door naar uw VLAIO-adviseur.", c: "#10b981" },
            ].map((s) => (
              <div key={s.n} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-3xl font-black mb-3" style={{ color: `${s.c}30` }}>{s.n}</p>
                <p className="font-semibold text-sm mb-1" style={{ color: "#e2e8f0" }}>{s.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/scan" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}>
              Start nu gratis →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
