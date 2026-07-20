import "server-only";

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

const maxAttempts = 5;
const windowSeconds = 10 * 60;
const localAttempts = new Map<
  string,
  { attemptCount: number; windowStartedAt: number }
>();

function getTrustedClientAddress(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip")?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

function getClientKey(request: NextRequest) {
  const address = getTrustedClientAddress(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const salt =
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "local-development-only";

  return createHash("sha256")
    .update(`${salt}\0${address}\0${userAgent}`)
    .digest("hex");
}

function checkLocalRateLimit(clientKey: string) {
  const now = Date.now();
  const current = localAttempts.get(clientKey);

  if (!current || current.windowStartedAt + windowSeconds * 1000 <= now) {
    localAttempts.set(clientKey, { attemptCount: 1, windowStartedAt: now });
    return false;
  }

  current.attemptCount += 1;
  return current.attemptCount > maxAttempts;
}

export async function checkAdminRateLimit(request: NextRequest) {
  const clientKey = getClientKey(request);
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Supabase admin storage is not configured.");
    }

    return { clientKey, limited: checkLocalRateLimit(clientKey) };
  }

  const { data, error } = await supabase.rpc(
    "check_portfolio_admin_rate_limit",
    {
      p_client_key: clientKey,
      p_window_seconds: windowSeconds,
      p_max_attempts: maxAttempts,
    },
  );

  if (error) {
    throw new Error("Could not verify the admin rate limit.", {
      cause: error,
    });
  }

  return { clientKey, limited: data === true };
}

export async function clearAdminRateLimit(clientKey: string) {
  localAttempts.delete(clientKey);

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("portfolio_admin_rate_limits")
    .delete()
    .eq("client_key", clientKey);

  if (error) {
    throw new Error("Could not clear the admin rate limit.", { cause: error });
  }
}
