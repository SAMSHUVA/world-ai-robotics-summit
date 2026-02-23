import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hgvqypmgsjfralmugszy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 🚨 LEGACY BRIDGE CLIENT
// This client is maintained for compatibility with existing API routes.
// For Browser Components: use '@/lib/supabase/client'
// For Server Components/Middleware: use '@/lib/supabase/server'
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
