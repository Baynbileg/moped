import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "Missing Supabase settings. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local",
  );
}

export const supabase = createClient(url, key);

export const BUCKET = "product-images";

// image_url can hold a full URL or just the file path inside the bucket
export function imageUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return supabase.storage.from(BUCKET).getPublicUrl(value).data.publicUrl;
}