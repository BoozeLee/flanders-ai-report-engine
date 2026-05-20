import { ScanForm } from "@/components/scan/ScanForm";

export const metadata = {
  title: "AI-Gereedheidscan — Flanders AI Report Engine",
  description: "Vul de 8-stappenscan in en ontvang uw persoonlijk VLAIO-innovatierapport.",
};

export default function ScanPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#080b14" }}>
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "#3b82f6" }}>
            FLANDERS AI REPORT ENGINE
          </p>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#e2e8f0" }}>
            AI-Gereedheidscan
          </h1>
          <p className="text-sm" style={{ color: "#475569" }}>
            8 vragen · 2 minuten · VLAIO-klaar rapport in 30 seconden
          </p>
        </div>
        <ScanForm />
      </div>
    </div>
  );
}
