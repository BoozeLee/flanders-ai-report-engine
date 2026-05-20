"use client";

import { useState } from "react";
import type { VlaioReport } from "@/lib/types";
import { reportToMarkdown } from "@/lib/report-generator";
import { FileText, Copy, Download, CheckCircle, ChevronDown, ChevronUp, Share2 } from "lucide-react";

export function ReportView({ report }: { report: VlaioReport }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["summary", "innovation"])
  );

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function copyMarkdown() {
    navigator.clipboard.writeText(reportToMarkdown(report));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadMarkdown() {
    const blob = new Blob([reportToMarkdown(report)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VLAIO_Rapport_${report.companyName.replace(/\s/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function shareLink() {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const vlaioRequest = Math.round(report.totalBudgetEur * 0.42);
  const vlaioMin = Math.round(report.totalBudgetEur * 0.35);
  const vlaioMax = Math.round(report.totalBudgetEur * 0.5);

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#080b14" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "#ec4899" }}>
              VLAIO INNOVATIERAPPORT
            </p>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "#e2e8f0" }}>
              {report.companyName}
            </h1>
            <p className="text-sm" style={{ color: "#475569" }}>
              Gegenereerd op {report.generatedAt} · AI-gegenereerd rapport
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={shareLink}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: linkCopied ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${linkCopied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`,
                color: linkCopied ? "#10b981" : "#94a3b8",
              }}
            >
              {linkCopied ? <CheckCircle size={14} /> : <Share2 size={14} />}
              {linkCopied ? "Link gekopieerd!" : "Deel rapport"}
            </button>
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: copied ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`,
                color: copied ? "#10b981" : "#94a3b8",
              }}
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? "Gekopieerd!" : "Kopieer"}
            </button>
            <button
              onClick={downloadMarkdown}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <Download size={14} />
              Download .md
            </button>
          </div>
        </div>

        {/* Budget box */}
        <div
          className="rounded-xl p-4 mb-6 flex flex-wrap gap-6"
          style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)" }}
        >
          <div>
            <p className="text-xs" style={{ color: "#64748b" }}>Totale Projectbegroting</p>
            <p className="text-xl font-bold" style={{ color: "#e2e8f0" }}>€{report.totalBudgetEur.toLocaleString("nl-BE")}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: "#64748b" }}>Gevraagde VLAIO-steun</p>
            <p className="text-xl font-bold" style={{ color: "#ec4899" }}>
              €{vlaioMin.toLocaleString("nl-BE")}–€{vlaioMax.toLocaleString("nl-BE")}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: "#64748b" }}>Steunpercentage</p>
            <p className="text-xl font-bold" style={{ color: "#8b5cf6" }}>35–50%</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: "#64748b" }}>Werkpakketten</p>
            <p className="text-xl font-bold" style={{ color: "#3b82f6" }}>{report.workPackages.length} WP&apos;s</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          <Section id="summary" label="01 — Samenvatting" expanded={expandedSections.has("summary")} onToggle={() => toggleSection("summary")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.executiveSummary}</p>
          </Section>

          <Section id="problem" label="02 — Probleemstelling" expanded={expandedSections.has("problem")} onToggle={() => toggleSection("problem")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.problemStatement}</p>
          </Section>

          <Section id="innovation" label="03 — Voorgestelde Innovatie" expanded={expandedSections.has("innovation")} onToggle={() => toggleSection("innovation")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.proposedInnovation}</p>
          </Section>

          <Section id="uncertainty" label="04 — Technische Onzekerheid" expanded={expandedSections.has("uncertainty")} onToggle={() => toggleSection("uncertainty")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.technicalUncertainty}</p>
          </Section>

          <Section id="workpackages" label="05 — Werkpakketten (R&D)" expanded={expandedSections.has("workpackages")} onToggle={() => toggleSection("workpackages")}>
            <div className="space-y-4">
              {report.workPackages.map((wp) => (
                <div key={wp.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>
                      {wp.id.toUpperCase()} — {wp.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
                      €{wp.costEur.toLocaleString("nl-BE")} · {wp.durationMonths} mnd
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "#64748b" }}>{wp.description}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>
                    <span style={{ color: "#8b5cf6" }}>R&D: </span>{wp.rdAngle}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#475569" }}>
                    <span style={{ color: "#94a3b8" }}>Deliverables: </span>{wp.deliverables.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="impact" label="06 — Verwachte Impact voor Vlaanderen" expanded={expandedSections.has("impact")} onToggle={() => toggleSection("impact")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.expectedImpact}</p>
          </Section>

          <Section id="compliance" label="07 — Data & AI Compliance" expanded={expandedSections.has("compliance")} onToggle={() => toggleSection("compliance")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.dataComplianceApproach}</p>
          </Section>

          <Section id="roadmap" label="08 — Roadmap" expanded={expandedSections.has("roadmap")} onToggle={() => toggleSection("roadmap")}>
            <div className="space-y-3">
              {report.roadmapItems.map((item) => {
                const statusColor: Record<string, string> = { completed: "#10b981", in_progress: "#3b82f6", planned: "#475569" };
                return (
                  <div key={item.phase} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: statusColor[item.status] }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>
                        {item.phase}: {item.title}
                        <span className="ml-2 text-xs" style={{ color: "#475569" }}>{item.durationWeeks}w</span>
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section id="pilot" label="09 — Pilootplan" expanded={expandedSections.has("pilot")} onToggle={() => toggleSection("pilot")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.pilotPlan}</p>
          </Section>

          <Section id="funding" label="10 — Gebruik van VLAIO-steun" expanded={expandedSections.has("funding")} onToggle={() => toggleSection("funding")}>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{report.fundingUse}</p>
          </Section>
        </div>

        {/* Footer */}
        <div
          className="mt-8 p-4 rounded-xl text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText size={14} style={{ color: "#475569" }} />
            <p className="text-xs" style={{ color: "#475569" }}>
              AI-gegenereerd rapport op basis van uw scanantwoorden. Controleer altijd met een vakexpert voor officiële VLAIO-indiening.
            </p>
          </div>
          <a
            href="/"
            className="text-xs underline"
            style={{ color: "#3b82f6" }}
          >
            Genereer een nieuw rapport →
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({
  id, label, expanded, onToggle, children,
}: {
  id: string; label: string; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: expanded ? "rgba(59,130,246,0.06)" : "rgba(13,20,36,0.9)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{label}</span>
        {expanded ? <ChevronUp size={16} style={{ color: "#475569" }} /> : <ChevronDown size={16} style={{ color: "#475569" }} />}
      </button>
      {expanded && (
        <div className="px-5 py-4" style={{ background: "rgba(13,20,36,0.9)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
