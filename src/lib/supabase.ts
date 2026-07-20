import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
} as const;

let readClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function getSupabaseUrl() {
  return process.env.SUPABASE_URL?.trim();
}

function getSupabaseSecretKey() {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ??
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function getSupabaseReadClient() {
  const url = getSupabaseUrl();
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ?? getSupabaseSecretKey();

  if (!url || !key) {
    return null;
  }

  readClient ??= createClient(url, key, clientOptions);
  return readClient;
}

export function getSupabaseAdminClient() {
  const url = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!url || !secretKey) {
    return null;
  }

  adminClient ??= createClient(url, secretKey, clientOptions);
  return adminClient;
}

export function getSupabaseStatus() {
  return {
    readConfigured: Boolean(
      getSupabaseUrl() &&
        (process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || getSupabaseSecretKey()),
    ),
    adminConfigured: Boolean(getSupabaseUrl() && getSupabaseSecretKey()),
  };
}
