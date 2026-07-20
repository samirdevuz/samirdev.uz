import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionResponse,
  createAdminSessionResponse,
  isAdminAuthConfigured,
  isAdminRequest,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import {
  checkAdminRateLimit,
  clearAdminRateLimit,
} from "@/lib/admin-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore(response: NextResponse) {
  response.headers.set("cache-control", "no-store");
  return response;
}

export async function GET(request: NextRequest) {
  return noStore(
    NextResponse.json({
      authenticated: isAdminAuthConfigured() && isAdminRequest(request),
    }),
  );
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return noStore(
      NextResponse.json(
        { ok: false, message: "Admin access is not configured." },
        { status: 503 },
      ),
    );
  }

  let rateLimit: Awaited<ReturnType<typeof checkAdminRateLimit>>;

  try {
    rateLimit = await checkAdminRateLimit(request);
  } catch (error) {
    console.error("Admin rate-limit check failed", error);
    return noStore(
      NextResponse.json(
        { ok: false, message: "Admin access is temporarily unavailable." },
        { status: 503 },
      ),
    );
  }

  if (rateLimit.limited) {
    return noStore(
      NextResponse.json(
        { ok: false, message: "Too many attempts. Try again later." },
        { status: 429 },
      ),
    );
  }

  const rawBody = await request.text();

  if (new TextEncoder().encode(rawBody).byteLength > 4_096) {
    return noStore(
      NextResponse.json(
        { ok: false, message: "Request body is too large." },
        { status: 413 },
      ),
    );
  }

  const body = (() => {
    try {
      return JSON.parse(rawBody) as { password?: string };
    } catch {
      return null;
    }
  })();

  if (!verifyAdminPassword(String(body?.password ?? ""))) {
    return noStore(
      NextResponse.json(
        { ok: false, message: "Invalid admin credentials." },
        { status: 401 },
      ),
    );
  }

  try {
    await clearAdminRateLimit(rateLimit.clientKey);
    return noStore(createAdminSessionResponse());
  } catch (error) {
    console.error("Admin session creation failed", error);
    return noStore(
      NextResponse.json(
        { ok: false, message: "Admin access is temporarily unavailable." },
        { status: 503 },
      ),
    );
  }
}

export async function DELETE() {
  return noStore(clearAdminSessionResponse());
}
