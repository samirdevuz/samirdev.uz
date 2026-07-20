import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/data/site-content-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxRequestBytes = 160_000;

function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "cache-control": "no-store" } },
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    return NextResponse.json(
      { content: await getSiteContent() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin site content could not be loaded", error);
    return NextResponse.json(
      { error: "Could not load site content." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxRequestBytes) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413, headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > maxRequestBytes) {
      return NextResponse.json(
        { error: "Request body is too large." },
        { status: 413, headers: { "cache-control": "no-store" } },
      );
    }

    const body = JSON.parse(rawBody) as { content?: unknown };
    const content = await saveSiteContent(body.content);
    revalidatePath("/", "page");
    return NextResponse.json(
      { content },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save content.";
    const validationError = !message.startsWith("Could not save");
    if (!validationError) console.error("Admin site content mutation failed", error);
    return NextResponse.json(
      { error: validationError ? message : "Could not save site content." },
      {
        status: validationError ? 400 : 500,
        headers: { "cache-control": "no-store" },
      },
    );
  }
}
