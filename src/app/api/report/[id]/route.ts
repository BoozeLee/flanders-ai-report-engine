import { getReport } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }
  return Response.json(report);
}
