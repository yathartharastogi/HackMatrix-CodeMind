import { createClient } from '@supabase/supabase-js';

// We pull from Vite ENV natively. 
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Strict fallback routing so the application doesn't completely crash if the .env keys are still unmodified placeholders lacking the 'https://' schema.
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://placeholder.supabase.co';
  console.warn("Supabase URL is invalid or missing in .env. Falling back to placeholder string to prevent crash.");
}

if (!supabaseAnonKey) {
  supabaseAnonKey = 'placeholder-anon-key';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
