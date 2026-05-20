import type { ReportContext, WorkPackage, RoadmapItem } from "@/lib/types";

const SECTOR_NL: Record<string, string> = {
  construction: "Bouw & Renovatie",
  retail: "Retail & E-commerce",
  logistics: "Logistiek & Transport",
  accountancy: "Accountancy & Financiën",
  manufacturing: "Productie & Industrie",
  healthcare: "Gezondheidszorg",
  hospitality: "Horeca & Toerisme",
  other: "Overige diensten",
};

function base(ctx: ReportContext): string {
  return `Bedrijf: ${ctx.companyName} | Sector: ${ctx.sectorLabel} | Grootte: ${ctx.answers.companySize} medewerkers
AI Gereedheid: ${ctx.score.total}/100 (${ctx.score.maturityLevel}) | Pijnpunt: "${ctx.answers.painPoint}"
Besparingspotentieel: ${ctx.totalHours} uur/maand, €${ctx.totalEur}/maand
Top-3 kansen: ${ctx.score.topOpportunities.join(", ")}`;
}

export function getSectorLabel(ctx: ReportContext): string {
  return SECTOR_NL[ctx.answers.sector] ?? "Diverse diensten";
}

export function executiveSummaryPrompt(ctx: ReportContext): string {
  return `Schrijf een professionele samenvatting van 180–220 woorden voor een VLAIO innovatiedossier.
${base(ctx)}
De samenvatting beschrijft: het bedrijf, het kernprobleem, de voorgestelde AI-innovatie, het verwachte voordeel en de VLAIO-subsidieaanvraag.
Schrijf in het Nederlands. Zakelijk en concreet. Geen bullet points. Geen titels. Alleen lopende tekst.`;
}

export function problemStatementPrompt(ctx: ReportContext): string {
  return `Schrijf een probleemstelling van 120–160 woorden voor een VLAIO innovatiedossier in de ${ctx.sectorLabel}-sector.
${base(ctx)}
Beschrijf: de sector-specifieke uitdagingen, de huidige pijnpunten van het bedrijf ("${ctx.answers.painPoint}"), waarom bestaande tools tekortschieten, en de economische impact van het probleem.
Schrijf in het Nederlands. Zakelijk en feitelijk. Geen bullet points.`;
}

export function proposedInnovationPrompt(ctx: ReportContext): string {
  return `Schrijf een beschrijving van de voorgestelde AI-innovatie van 150–200 woorden voor een VLAIO dossier.
${base(ctx)}
Beschrijf concreet welke AI-technologieën worden ingezet (NLP, workflow-automatisering, documentverwerking), hoe ze het pijnpunt "${ctx.answers.painPoint}" oplossen, en welke nieuwe functionaliteiten worden ontwikkeld.
Vermeld de top-kansen: ${ctx.score.topOpportunities.join(", ")}.
Schrijf in het Nederlands. Zakelijk en technisch onderbouwd.`;
}

export function technicalUncertaintyPrompt(ctx: ReportContext): string {
  return `Schrijf een sectie "Technische Onzekerheid" van 140–180 woorden voor een VLAIO innovatiedossier.
${base(ctx)}
Beschrijf de R&D-uitdagingen: welke technische problemen zijn nog niet opgelost, welke risico's bestaan bij de implementatie in de ${ctx.sectorLabel}-sector, en hoe wordt omgegaan met data-kwaliteit, sectorspecificiteit en GDPR.
Dit is de kern van de R&D-subsidierechtvaardiging — wees specifiek over onzekerheden.
Schrijf in het Nederlands.`;
}

export function workPackagesPrompt(ctx: ReportContext): string {
  return `Genereer 4 werkpakketten (WP1–WP4) voor een VLAIO innovatiedossier.
${base(ctx)}

Geef ALLEEN geldige JSON terug, geen markdown, geen uitleg. Exact dit formaat:
[
  {"id":"wp1","name":"...","description":"...","rdAngle":"...","durationMonths":3,"costEur":45000,"deliverables":["...","...","..."]},
  {"id":"wp2","name":"...","description":"...","rdAngle":"...","durationMonths":4,"costEur":60000,"deliverables":["...","...","..."]},
  {"id":"wp3","name":"...","description":"...","rdAngle":"...","durationMonths":3,"costEur":50000,"deliverables":["...","...","..."]},
  {"id":"wp4","name":"...","description":"...","rdAngle":"...","durationMonths":2,"costEur":25000,"deliverables":["...","..."]}
]

Richtlijnen: WP1=analyse/model, WP2=kerntechnologie, WP3=integratie/validatie, WP4=piloot. Totaalbudget €150.000–€250.000. Namen in het Nederlands. rdAngle beschrijft de R&D-uitdaging.`;
}

export function expectedImpactPrompt(ctx: ReportContext): string {
  return `Schrijf een "Verwachte Impact" sectie van 120–160 woorden voor een VLAIO innovatiedossier.
${base(ctx)}
Beschrijf: kwantitatief verwacht voordeel voor het bedrijf (${ctx.totalHours} uur/maand bespaard, €${ctx.totalEur}/maand), bredere impact voor de ${ctx.sectorLabel}-sector in Vlaanderen, bijdrage aan digitale competitiviteit van Vlaamse KMO's, en eventuele kennisdeling.
Schrijf in het Nederlands. Gebruik concrete cijfers.`;
}

export function dataCompliancePrompt(ctx: ReportContext): string {
  return `Schrijf een "Data & AI Compliance" sectie van 120–150 woorden voor een VLAIO innovatiedossier.
${base(ctx)}
Beschrijf: GDPR-conforme verwerking van bedrijfsdata, EU-gehoste infrastructuur, geen retentie van gevoelige data, menselijke review bij kritische beslissingen, transparantie van AI-aanbevelingen, en biasmonitoring.
Schrijf in het Nederlands. Concreet en professioneel.`;
}

export function roadmapPrompt(ctx: ReportContext): string {
  return `Genereer een roadmap met 5 fasen voor een VLAIO innovatiedossier.
${base(ctx)}

Geef ALLEEN geldige JSON terug, geen markdown, geen uitleg. Exact dit formaat:
[
  {"phase":"Fase 1","title":"...","description":"...","durationWeeks":6,"status":"completed"},
  {"phase":"Fase 2","title":"...","description":"...","durationWeeks":8,"status":"in_progress"},
  {"phase":"Fase 3","title":"...","description":"...","durationWeeks":6,"status":"planned"},
  {"phase":"Fase 4","title":"...","description":"...","durationWeeks":8,"status":"planned"},
  {"phase":"Fase 5","title":"...","description":"...","durationWeeks":4,"status":"planned"}
]

Richtlijnen: Fase1=MVP/prototype (completed), Fase2=kern AI (in_progress), Fase3=piloot, Fase4=sectoruitbreiding, Fase5=scale. Titels en beschrijvingen in het Nederlands.`;
}

export function pilotPlanPrompt(ctx: ReportContext): string {
  return `Schrijf een pilootplan van 100–140 woorden voor een VLAIO innovatiedossier.
${base(ctx)}
Beschrijf: hoe het platform gevalideerd wordt met 3–5 Vlaamse KMO's in de ${ctx.sectorLabel}-sector, welke metrics worden gemeten (tijdbesparing, tevredenheid, ROI), hoe feedback wordt verwerkt, en wat de slaagcriteria zijn.
Schrijf in het Nederlands.`;
}

export function fundingUsePrompt(ctx: ReportContext): string {
  return `Schrijf een "Gebruik van VLAIO-steun" sectie van 100–130 woorden voor een VLAIO innovatiedossier.
${base(ctx)}
Beschrijf concreet hoe de VLAIO-subsidie (35–50% van het projectbudget) wordt aangewend: personeelskosten voor R&D, externe expertise, infrastructuur, validatieonderzoek. Leg uit waarom commerciële financiering onvoldoende is voor deze R&D.
Schrijf in het Nederlands. Zakelijk en concreet.`;
}

export function buildContext(
  companyName: string,
  answers: import("@/lib/types").ScanAnswers,
  score: import("@/lib/types").ReadinessScore,
  opportunities: import("@/lib/types").WorkflowOpportunity[]
): ReportContext {
  const totalHours = opportunities.reduce((s, o) => s + o.hoursSavedPerMonth, 0);
  const totalEur = opportunities.reduce((s, o) => s + o.estimatedMonthlyValue, 0);
  const sectorLabel = SECTOR_NL[answers.sector] ?? "Diverse diensten";
  return { companyName, answers, score, opportunities, totalHours, totalEur, sectorLabel };
}

export function isValidWorkPackages(raw: string): WorkPackage[] | null {
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as WorkPackage[];
  } catch {
    return null;
  }
}

export function isValidRoadmap(raw: string): RoadmapItem[] | null {
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as RoadmapItem[];
  } catch {
    return null;
  }
}
