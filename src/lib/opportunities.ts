import type { WorkflowOpportunity, Sector } from "@/lib/types";

const ALL_OPPORTUNITIES: WorkflowOpportunity[] = [
  {
    id: "opp-const-1", title: "AI Offerteassistent", sector: "construction",
    currentProcess: "Manueel offertes opmaken vanuit e-mails en klantverzoeken. Duurt 2–3 uur per offerte.",
    aiSolution: "AI extraheert projectvereisten uit e-mails, genereert offertedraft met materiaallijst en tijdsschatting.",
    hoursSavedPerMonth: 28, estimatedMonthlyValue: 1960, implementationComplexity: "medium", riskScore: 30, priority: "critical",
    tags: ["offertes", "documentverwerking", "klantenservice"],
  },
  {
    id: "opp-const-2", title: "Plannings- en roosterautomatisering", sector: "construction",
    currentProcess: "Wekelijkse planning manueel in Excel, telefonische afstemming met arbeiders.",
    aiSolution: "AI-assistent optimaliseert werkrooster op basis van projectdeadlines, beschikbaarheid en vaardigheden.",
    hoursSavedPerMonth: 20, estimatedMonthlyValue: 1400, implementationComplexity: "high", riskScore: 45, priority: "high",
    tags: ["planning", "HR", "communicatie"],
  },
  {
    id: "opp-const-3", title: "Veiligheidsdocumentatie Copilot", sector: "construction",
    currentProcess: "VGP-plannen manueel opgesteld per project, vaak copy-paste met fouten.",
    aiSolution: "AI genereert VGP-plannen op basis van projecttype, locatie en wetgeving.",
    hoursSavedPerMonth: 16, estimatedMonthlyValue: 1120, implementationComplexity: "medium", riskScore: 35, priority: "high",
    tags: ["veiligheid", "compliance", "documentatie"],
  },
  {
    id: "opp-const-4", title: "Klantopvolging Automatisering", sector: "construction",
    currentProcess: "Opvolging na projectafronding ad hoc, veel gemiste kansen.",
    aiSolution: "Automatische opvolgings-e-mails na mijlpalen, tevredenheidscheck en herinneringen.",
    hoursSavedPerMonth: 10, estimatedMonthlyValue: 700, implementationComplexity: "low", riskScore: 15, priority: "medium",
    tags: ["CRM", "e-mail", "retentie"],
  },
  {
    id: "opp-const-5", title: "Factuur- en Betalingsverwerking", sector: "construction",
    currentProcess: "Facturen manueel invoeren, betalingen opvolgen via Excel.",
    aiSolution: "OCR + AI verwerkt inkomende facturen automatisch, matcht met bestellingen.",
    hoursSavedPerMonth: 14, estimatedMonthlyValue: 980, implementationComplexity: "medium", riskScore: 25, priority: "high",
    tags: ["boekhouding", "OCR", "betaling"],
  },
  {
    id: "opp-ret-1", title: "Productbeschrijvingen Generator", sector: "retail",
    currentProcess: "Productbeschrijvingen manueel schrijven voor webshop — 30 min per product.",
    aiSolution: "AI genereert SEO-geoptimaliseerde productbeschrijvingen vanuit technische specs.",
    hoursSavedPerMonth: 24, estimatedMonthlyValue: 1680, implementationComplexity: "low", riskScore: 10, priority: "critical",
    tags: ["content", "e-commerce", "SEO"],
  },
  {
    id: "opp-ret-2", title: "Klantenservice AI Chatbot", sector: "retail",
    currentProcess: "Klantenservice handelt 200+ vragen/week af via e-mail en telefoon.",
    aiSolution: "AI chatbot beantwoordt standaardvragen 24/7, escaleert complexe cases.",
    hoursSavedPerMonth: 32, estimatedMonthlyValue: 2240, implementationComplexity: "medium", riskScore: 25, priority: "critical",
    tags: ["klantenservice", "chatbot", "automatisering"],
  },
  {
    id: "opp-log-1", title: "Routeoptimalisering AI", sector: "logistics",
    currentProcess: "Chauffeurs plannen routes handmatig op basis van ervaring.",
    aiSolution: "AI optimaliseert dagelijkse routes op basis van realtime verkeer en tijdvensters.",
    hoursSavedPerMonth: 40, estimatedMonthlyValue: 2800, implementationComplexity: "high", riskScore: 30, priority: "critical",
    tags: ["routing", "transport", "optimalisering"],
  },
  {
    id: "opp-log-2", title: "Documentverwerking Transport", sector: "logistics",
    currentProcess: "CMR-documenten en vrachtbrieven manueel intypen in systeem.",
    aiSolution: "OCR + AI extraheerd data automatisch, controleert op fouten.",
    hoursSavedPerMonth: 20, estimatedMonthlyValue: 1400, implementationComplexity: "medium", riskScore: 20, priority: "high",
    tags: ["OCR", "transport", "documentatie"],
  },
  {
    id: "opp-acc-1", title: "Factuurverwerking Automatisering", sector: "accountancy",
    currentProcess: "Facturen manueel verwerken en categoriseren — 3 uur/dag.",
    aiSolution: "AI leest, categoriseert en boekt facturen automatisch in boekhoudpakket.",
    hoursSavedPerMonth: 60, estimatedMonthlyValue: 4200, implementationComplexity: "medium", riskScore: 20, priority: "critical",
    tags: ["boekhouding", "OCR", "automatisering"],
  },
  {
    id: "opp-acc-2", title: "E-mail Copilot Accountant", sector: "accountancy",
    currentProcess: "Klantenvragen per e-mail beantwoorden — 2 uur/dag standaardvragen.",
    aiSolution: "AI drafts antwoorden op basis van klantdossier, accountant keurt goed en verstuurt.",
    hoursSavedPerMonth: 40, estimatedMonthlyValue: 2800, implementationComplexity: "low", riskScore: 15, priority: "high",
    tags: ["e-mail", "klantenservice", "copilot"],
  },
  {
    id: "opp-mfg-1", title: "SOP Documentatie Assistent", sector: "manufacturing",
    currentProcess: "Standaard operating procedures handmatig bijhouden en updaten.",
    aiSolution: "AI genereert en update SOP-documenten op basis van proceswijzigingen.",
    hoursSavedPerMonth: 16, estimatedMonthlyValue: 1120, implementationComplexity: "medium", riskScore: 25, priority: "high",
    tags: ["documentatie", "kwaliteit", "processen"],
  },
  {
    id: "opp-hc-1", title: "Dossieropmaak Automatisering", sector: "healthcare",
    currentProcess: "Patiëntdossiers handmatig aanmaken en bijhouden na consultaties.",
    aiSolution: "AI transcribeert consultaties en structureert dossiernotities automatisch.",
    hoursSavedPerMonth: 30, estimatedMonthlyValue: 2100, implementationComplexity: "medium", riskScore: 35, priority: "critical",
    tags: ["dossiers", "transcriptie", "zorg"],
  },
  {
    id: "opp-hosp-1", title: "Reserveringsbeheer AI", sector: "hospitality",
    currentProcess: "Reserveringen via e-mail en telefoon manueel verwerken.",
    aiSolution: "AI verwerkt reserveringsverzoeken automatisch, stuurt bevestigingen en herinneringen.",
    hoursSavedPerMonth: 20, estimatedMonthlyValue: 1400, implementationComplexity: "low", riskScore: 15, priority: "high",
    tags: ["reservaties", "communicatie", "automatisering"],
  },
  {
    id: "opp-other-1", title: "Documentautomatisering", sector: "other",
    currentProcess: "Rapporten en documenten handmatig opmaken op basis van data.",
    aiSolution: "AI genereert gestructureerde rapporten vanuit ruwe data en sjablonen.",
    hoursSavedPerMonth: 20, estimatedMonthlyValue: 1400, implementationComplexity: "low", riskScore: 15, priority: "high",
    tags: ["documenten", "rapportage", "automatisering"],
  },
];

export function getOpportunitiesBySector(sector: Sector): WorkflowOpportunity[] {
  const sectorOpps = ALL_OPPORTUNITIES.filter((o) => o.sector === sector);
  return sectorOpps.length > 0 ? sectorOpps : ALL_OPPORTUNITIES.filter((o) => o.sector === "other");
}
