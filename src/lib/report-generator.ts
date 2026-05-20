import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import type { ScanAnswers, VlaioReport, WorkPackage, RoadmapItem } from "@/lib/types";
import { calculateReadinessScore } from "@/lib/scoring";
import { getOpportunitiesBySector } from "@/lib/opportunities";
import {
  buildContext,
  executiveSummaryPrompt,
  problemStatementPrompt,
  proposedInnovationPrompt,
  technicalUncertaintyPrompt,
  workPackagesPrompt,
  expectedImpactPrompt,
  dataCompliancePrompt,
  roadmapPrompt,
  pilotPlanPrompt,
  fundingUsePrompt,
  isValidWorkPackages,
  isValidRoadmap,
} from "@/lib/prompts";

async function callGroq(prompt: string, maxOutputTokens = 600): Promise<string> {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt,
    maxOutputTokens,
  });
  return text.trim();
}

const FALLBACK_WORK_PACKAGES: WorkPackage[] = [
  { id: "wp1", name: "AI Gereedheidsanalyse", description: "Analyse van huidige processen en AI-kansen.", rdAngle: "Sector-specifiek diagnostisch model.", durationMonths: 3, costEur: 45000, deliverables: ["Gereedheidsrapport", "Kansen matrix", "Prioriteitenlijst"] },
  { id: "wp2", name: "Kernoplossing Ontwikkeling", description: "Ontwikkeling van de kern AI-functionaliteit.", rdAngle: "Nieuwe algoritmische aanpak voor procesautomatisering.", durationMonths: 4, costEur: 70000, deliverables: ["Werkend prototype", "API endpoints", "Testrapport"] },
  { id: "wp3", name: "Integratie & Validatie", description: "Integratie met bestaande systemen en validatie.", rdAngle: "Technische onzekerheid bij heterogene data-integratie.", durationMonths: 3, costEur: 50000, deliverables: ["Geïntegreerd systeem", "Validatiestudie", "Gebruikershandleiding"] },
  { id: "wp4", name: "Piloot & Kennisoverdracht", description: "Piloot met 3 Vlaamse KMO's en documentatie.", rdAngle: "Empirisch bewijs van ROI en adoptiegraad.", durationMonths: 2, costEur: 25000, deliverables: ["Pilootrapport", "Case studies", "Kennisartikel"] },
];

const FALLBACK_ROADMAP: RoadmapItem[] = [
  { phase: "Fase 1", title: "MVP Prototype", description: "Werkend prototype met kernscan en eerste AI-resultaten.", durationWeeks: 6, status: "completed" },
  { phase: "Fase 2", title: "AI Backend Integratie", description: "Volledige AI-pipeline, documentverwerking en API.", durationWeeks: 8, status: "in_progress" },
  { phase: "Fase 3", title: "Piloot met KMO's", description: "Validatie met 3–5 bedrijven in de doelsector.", durationWeeks: 6, status: "planned" },
  { phase: "Fase 4", title: "Sectoruitbreiding", description: "Uitrol naar 2 extra sectoren op basis van pilootlessen.", durationWeeks: 8, status: "planned" },
  { phase: "Fase 5", title: "Schaling & Commercialisering", description: "Lancering voor 200+ KMO's, continue verbetering.", durationWeeks: 4, status: "planned" },
];

export async function generateReport(
  companyName: string,
  answers: ScanAnswers
): Promise<VlaioReport> {
  const score = calculateReadinessScore(answers);
  const opportunities = getOpportunitiesBySector(answers.sector).slice(0, 5);
  const ctx = buildContext(companyName, answers, score, opportunities);

  // Batch 1: 4 text sections in parallel
  const [executiveSummary, problemStatement, proposedInnovation, technicalUncertainty] =
    await Promise.all([
      callGroq(executiveSummaryPrompt(ctx)),
      callGroq(problemStatementPrompt(ctx)),
      callGroq(proposedInnovationPrompt(ctx)),
      callGroq(technicalUncertaintyPrompt(ctx)),
    ]);

  // Work packages (JSON) — parse carefully
  const workPackagesRaw = await callGroq(workPackagesPrompt(ctx), 900);
  const workPackages = isValidWorkPackages(workPackagesRaw) ?? FALLBACK_WORK_PACKAGES;

  // Batch 2: 4 more text sections in parallel
  const [expectedImpact, dataComplianceApproach, pilotPlan, fundingUse] =
    await Promise.all([
      callGroq(expectedImpactPrompt(ctx)),
      callGroq(dataCompliancePrompt(ctx)),
      callGroq(pilotPlanPrompt(ctx)),
      callGroq(fundingUsePrompt(ctx)),
    ]);

  // Roadmap (JSON) — parse carefully
  const roadmapRaw = await callGroq(roadmapPrompt(ctx), 750);
  const roadmapItems = isValidRoadmap(roadmapRaw) ?? FALLBACK_ROADMAP;

  const totalBudgetEur = workPackages.reduce((s, wp) => s + wp.costEur, 0);

  return {
    companyName,
    sector: answers.sector,
    generatedAt: new Date().toISOString().split("T")[0],
    executiveSummary,
    problemStatement,
    proposedInnovation,
    technicalUncertainty,
    workPackages,
    expectedImpact,
    dataComplianceApproach,
    roadmapItems,
    pilotPlan,
    fundingUse,
    totalBudgetEur,
  };
}

export function reportToMarkdown(report: VlaioReport): string {
  return `# VLAIO Innovatierapport — ${report.companyName}
**Gegenereerd:** ${report.generatedAt} | **Sector:** ${report.sector}

---

## Samenvatting

${report.executiveSummary}

---

## Probleemstelling

${report.problemStatement}

---

## Voorgestelde Innovatie

${report.proposedInnovation}

---

## Technische Onzekerheid

${report.technicalUncertainty}

---

## Werkpakketten (R&D)

${report.workPackages.map((wp) => `### ${wp.id.toUpperCase()}: ${wp.name}
**Duur:** ${wp.durationMonths} maanden | **Budget:** €${wp.costEur.toLocaleString("nl-BE")}
${wp.description}
**R&D uitdaging:** ${wp.rdAngle}
**Deliverables:** ${wp.deliverables.join(", ")}`).join("\n\n")}

---

## Verwachte Impact voor Vlaanderen

${report.expectedImpact}

---

## Data & AI Compliance

${report.dataComplianceApproach}

---

## Roadmap

${report.roadmapItems.map((r) => `**${r.phase}: ${r.title}** (${r.durationWeeks}w — ${r.status})
${r.description}`).join("\n\n")}

---

## Pilootplan

${report.pilotPlan}

---

## Gebruik van VLAIO-steun

${report.fundingUse}

---

*Totale projectbegroting: €${report.totalBudgetEur.toLocaleString("nl-BE")}*
*Gegenereerd door Flanders AI Report Engine — flanders-ai-report-engine.vercel.app*
`;
}
