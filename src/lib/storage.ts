import { Redis } from "@upstash/redis";
import type { VlaioReport } from "@/lib/types";

const TTL = 60 * 60 * 24 * 30; // 30 days

function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function setReport(id: string, report: VlaioReport): Promise<void> {
  await getRedis().set(`report:${id}`, JSON.stringify(report), { ex: TTL });
}

export async function getReport(id: string): Promise<VlaioReport | null> {
  const raw = await getRedis().get<string>(`report:${id}`);
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : (raw as VlaioReport);
  } catch {
    return null;
  }
}
