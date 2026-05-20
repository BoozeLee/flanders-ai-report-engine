import { generateReport } from "@/lib/report-generator";
import { setReport } from "@/lib/storage";
import type { ScanAnswers } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { answers, companyName } = (await req.json()) as {
      answers: ScanAnswers;
      companyName: string;
    };

    if (!answers || !companyName) {
      return Response.json({ error: "Missing answers or companyName" }, { status: 400 });
    }

    const reportId = crypto.randomUUID();
    const report = await generateReport(companyName, answers);
    await setReport(reportId, report);

    return Response.json({ reportId });
  } catch (err) {
    console.error("Report generation failed:", err);
    return Response.json({ error: "Report generation failed" }, { status: 500 });
  }
}
