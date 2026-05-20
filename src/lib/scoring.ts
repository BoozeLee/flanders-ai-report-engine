import type { ScanAnswers, ReadinessScore, MaturityLevel } from "@/lib/types";

const TOOL_MATURITY_MAP: Record<string, number> = {
  Excel: 1,
  Outlook: 1,
  WhatsApp: 0,
  "Google Workspace": 2,
  "Microsoft 365": 2,
  TeamLeader: 3,
  Salesforce: 4,
  HubSpot: 3,
  SAP: 4,
  "Power Automate": 4,
  Zapier: 4,
  n8n: 5,
};

function getToolMaturityScore(tools: string[]): number {
  if (!tools.length) return 0;
  const scores = tools.map((t) => TOOL_MATURITY_MAP[t] ?? 1);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.min(avg * 20, 100);
}

function getSizeMultiplier(size: ScanAnswers["companySize"]): number {
  return { "1-5": 0.8, "6-20": 0.9, "21-50": 1.0, "51-200": 1.1 }[size];
}

export function calculateReadinessScore(answers: ScanAnswers): ReadinessScore {
  const dataReadiness = Math.round(
    answers.dataMaturity * 15 + getToolMaturityScore(answers.currentTools) * 0.25
  );
  const processClarity = Math.round(
    answers.automationAmbition * 10 +
      (answers.riskSensitivity === "low" ? 20 : answers.riskSensitivity === "medium" ? 15 : 10)
  );
  const technicalCapacity = Math.round(
    getToolMaturityScore(answers.currentTools) * 0.5 + answers.dataMaturity * 10
  );
  const ambitionScore = Math.round(answers.automationAmbition * 20);

  const sizeMultiplier = getSizeMultiplier(answers.companySize);
  const raw =
    (dataReadiness * 0.3 + processClarity * 0.25 + technicalCapacity * 0.2 + ambitionScore * 0.25) *
    sizeMultiplier;

  const total = Math.min(Math.round(raw), 100);

  let maturityLevel: MaturityLevel;
  if (total < 35) maturityLevel = "starter";
  else if (total < 60) maturityLevel = "developing";
  else if (total < 80) maturityLevel = "advanced";
  else maturityLevel = "leader";

  const nextStepMap: Record<MaturityLevel, string> = {
    starter: "Start met een eenvoudige automatisering: e-mailsjablonen of klantopvolging. Laag risico, direct merkbaar resultaat.",
    developing: "Implementeer een AI-assistent voor uw meest tijdrovende taak. Begin met 1 workflow en bouw uit.",
    advanced: "Combineer meerdere AI-workflows in een geïntegreerd systeem. Overweeg een piloot met externe partners.",
    leader: "U bent klaar voor geavanceerde AI-integraties. Benchmark uw prestaties en deel kennis in uw sector.",
  };

  const opportunityMap: Record<string, string[]> = {
    construction: ["AI Offerteassistent", "VGP Copilot", "Planningsautomatisering"],
    retail: ["Productbeschrijvingen", "Klantenservice AI", "Voorraadbeheer"],
    logistics: ["Routeoptimalisering", "Klantcommunicatie", "Documentverwerking"],
    accountancy: ["Factuurverwerking", "E-mail Copilot", "Rapportgeneratie"],
    manufacturing: ["SOP Assistent", "Kwaliteitscontrole AI", "Onderhoudspredictie"],
    healthcare: ["Dossieropmaak", "Afsprakenbeheer", "Rapportage"],
    hospitality: ["Reserveringsbeheer", "Klantenservice", "Menuoptimalisering"],
    other: ["Documentautomatisering", "E-mail Copilot", "ROI Calculator"],
  };

  return {
    total,
    maturityLevel,
    breakdown: {
      dataReadiness: Math.min(dataReadiness, 100),
      processClarity: Math.min(processClarity, 100),
      technicalCapacity: Math.min(technicalCapacity, 100),
      ambitionScore,
    },
    recommendedNextStep: nextStepMap[maturityLevel],
    topOpportunities: opportunityMap[answers.sector] ?? opportunityMap["other"],
  };
}
