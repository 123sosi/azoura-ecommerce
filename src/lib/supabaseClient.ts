import { createClient } from '@supabase/supabase-js';

// This is the "anon public" key — it is safe to expose in client-side code.
// All real protection comes from Row Level Security (RLS) policies configured
// on the Supabase project, not from hiding this key.
const SUPABASE_URL = 'https://rgzerzwpdnsfldmnbksj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnemVyendwZG5zZmxkbW5ia3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMDgxMDYsImV4cCI6MjA5OTU4NDEwNn0.ysoaA3NXB-iA3QdiZkE8jKZhqBsSTiAVQrll8oJZxIs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
