import { createClient } from "@supabase/supabase-js";

// ── Platform names (matches the 10 adapters) ──
export type PlatformName =
  | "telegram"
  | "twitter"
  | "instagram"
  | "facebook"
  | "threads"
  | "linkedin"
  | "youtube"
  | "pinterest"
  | "whatsapp"
  | "reddit";

// ── Post row shape used by publishToAll ──
export interface Post {
  id: string;
  content: Record<string, string>;
  media_urls: string[];
  platforms: PlatformName[];
  status: string;
  scheduled_for: string;
  created_at: string;
}

// ── Supabase admin client (server-side only) ──
// Uses placeholder URL during build when env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
