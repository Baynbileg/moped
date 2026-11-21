import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
let client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (client) return client;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase settings. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local",
    );
  }
  client = createClient(url, key);
  return client;
}

export const BUCKET = "prodcut-images";
export function imageUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return getSupabase().storage.from(BUCKET).getPublicUrl(value).data.publicUrl;
}
