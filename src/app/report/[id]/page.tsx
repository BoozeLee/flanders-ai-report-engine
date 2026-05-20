import { notFound } from "next/navigation";
import { getReport } from "@/lib/storage";
import { ReportView } from "@/components/report/ReportView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) return { title: "Rapport niet gevonden" };
  return {
    title: `VLAIO Rapport — ${report.companyName}`,
    description: `AI-gegenereerd VLAIO innovatierapport voor ${report.companyName}. Budget: €${report.totalBudgetEur.toLocaleString("nl-BE")}.`,
  };
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  return <ReportView report={report} />;
}
