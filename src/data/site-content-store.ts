import "server-only";

import { cache } from "react";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { defaultSiteContent, type SiteContent } from "@/data/site-content";

const contentId = "main";
const maxSerializedBytes = 150_000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeContent<T>(fallback: T, override: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(override) ? override : fallback) as T;
  }

  if (isPlainObject(fallback)) {
    const overrideObject = isPlainObject(override) ? override : {};
    return Object.fromEntries(
      Object.entries(fallback).map(([key, value]) => [
        key,
        mergeContent(value, overrideObject[key]),
      ]),
    ) as T;
  }

  return (typeof override === typeof fallback ? override : fallback) as T;
}

function validateNode(value: unknown, depth = 0): void {
  if (depth > 10) {
    throw new Error("Content structure is too deeply nested.");
  }

  if (typeof value === "string") {
    if (value.length > 5_000) {
      throw new Error("A content field is longer than 5,000 characters.");
    }
    return;
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > 100) {
      throw new Error("A content list contains too many items.");
    }
    value.forEach((item) => validateNode(item, depth + 1));
    return;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length > 200) {
      throw new Error("The content object contains too many fields.");
    }
    entries.forEach(([key, item]) => {
      if (!/^[A-Za-z0-9_-]+$/.test(key)) {
        throw new Error("Content contains an invalid field name.");
      }
      validateNode(item, depth + 1);
    });
    return;
  }

  throw new Error("Content contains an unsupported value.");
}

export function validateSiteContent(input: unknown): SiteContent {
  validateNode(input);
  const serialized = JSON.stringify(input);

  if (new TextEncoder().encode(serialized).byteLength > maxSerializedBytes) {
    throw new Error("Site content is too large.");
  }

  const content = mergeContent(defaultSiteContent, input);

  if (!content.profile.name.trim() || !content.profile.email.trim()) {
    throw new Error("Profile name and email are required.");
  }

  return content;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return defaultSiteContent;
  }

  const { data, error } = await supabase
    .from("portfolio_site_content")
    .select("content")
    .eq("id", contentId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load portfolio site content.", { cause: error });
  }

  return data?.content
    ? mergeContent(defaultSiteContent, data.content)
    : defaultSiteContent;
});

export async function saveSiteContent(input: unknown) {
  const content = validateSiteContent(input);
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin access is not configured.");
  }

  const { error } = await supabase.from("portfolio_site_content").upsert(
    {
      id: contentId,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error("Could not save portfolio site content.", { cause: error });
  }

  return content;
}
