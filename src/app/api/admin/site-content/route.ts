import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/data/site-content";
import type { SiteContent } from "@/data/site-content";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  const response = NextResponse.json({ content });
  response.headers.set("cache-control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { content?: SiteContent };

    if (!body || !body.content) {
      return NextResponse.json(
        { error: "Content object is required." },
        { status: 400 },
      );
    }

    const saved = await updateSiteContent(body.content);
    const response = NextResponse.json({ content: saved, ok: true });
    response.headers.set("cache-control", "no-store");
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save site content.",
      },
      { status: 400 },
    );
  }
}
