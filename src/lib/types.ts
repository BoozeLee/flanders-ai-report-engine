export type Sector =
  | "construction"
  | "retail"
  | "logistics"
  | "accountancy"
  | "manufacturing"
  | "healthcare"
  | "hospitality"
  | "other";

export type MaturityLevel = "starter" | "developing" | "advanced" | "leader";
export type Complexity = "low" | "medium" | "high";
export type Priority = "low" | "medium" | "high" | "critical";

export interface ScanAnswers {
  sector: Sector;
  companySize: "1-5" | "6-20" | "21-50" | "51-200";
  painPoint: string;
  currentTools: string[];
  dataMaturity: 1 | 2 | 3 | 4 | 5;
  automationAmbition: 1 | 2 | 3 | 4 | 5;
  riskSensitivity: "low" | "medium" | "high";
}

export interface ReadinessScore {
  total: number;
  maturityLevel: MaturityLevel;
  breakdown: {
    dataReadiness: number;
    processClarity: number;
    technicalCapacity: number;
    ambitionScore: number;
  };
  recommendedNextStep: string;
  topOpportunities: string[];
}

export interface WorkflowOpportunity {
  id: string;
  title: string;
  currentProcess: string;
  aiSolution: string;
  hoursSavedPerMonth: number;
  estimatedMonthlyValue: number;
  implementationComplexity: Complexity;
  riskScore: number;
  priority: Priority;
  sector: Sector;
  tags: string[];
}

export interface WorkPackage {
  id: string;
  name: string;
  description: string;
  rdAngle: string;
  durationMonths: number;
  costEur: number;
  deliverables: string[];
}

export interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
  durationWeeks: number;
  status: "planned" | "in_progress" | "completed";
}

export interface VlaioReport {
  companyName: string;
  sector: Sector;
  generatedAt: string;
  executiveSummary: string;
  problemStatement: string;
  proposedInnovation: string;
  technicalUncertainty: string;
  workPackages: WorkPackage[];
  expectedImpact: string;
  dataComplianceApproach: string;
  roadmapItems: RoadmapItem[];
  pilotPlan: string;
  fundingUse: string;
  totalBudgetEur: number;
}

export interface ReportContext {
  companyName: string;
  answers: ScanAnswers;
  score: ReadinessScore;
  opportunities: WorkflowOpportunity[];
  totalHours: number;
  totalEur: number;
  sectorLabel: string;
}
