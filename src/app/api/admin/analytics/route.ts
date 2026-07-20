import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/data/analytics-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "cache-control": "no-store" } },
    );
  }

  const days = Number(request.nextUrl.searchParams.get("days") ?? 30);

  try {
    const response = NextResponse.json({
      summary: await getAnalyticsSummary(days),
    });
    response.headers.set("cache-control", "no-store");
    return response;
  } catch (error) {
    console.error("Admin analytics could not be loaded", error);
    return NextResponse.json(
      { error: "Could not load analytics." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
