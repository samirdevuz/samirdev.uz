import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionResponse,
  createAdminSessionResponse,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();
const maxAttempts = 5;
const windowMs = 10 * 60 * 1000;

function getClientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || record.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > maxAttempts;
}

function clearAttempts(key: string) {
  attempts.delete(key);
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again later." },
      { status: 429, headers: { "cache-control": "no-store" } },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;

  if (!verifyAdminPassword(String(body?.password ?? ""))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  clearAttempts(clientKey);
  const response = createAdminSessionResponse();
  response.headers.set("cache-control", "no-store");
  return response;
}

export async function DELETE() {
  const response = clearAdminSessionResponse();
  response.headers.set("cache-control", "no-store");
  return response;
}
