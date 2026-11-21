import { createClient } from "@supabase/supabase-js";

// Supabase project "ElevateBiz": sign-in and storage for the client onboarding.
// Both values are public by design (the publishable key only allows what the database's row level security permits).
const SUPABASE_URL = "https://heoxllgqwylqtgskrztc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_JxCFEbxvFy0-jtlXTgBumw_hqpbFlen";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
