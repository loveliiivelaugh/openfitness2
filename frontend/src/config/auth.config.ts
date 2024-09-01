import { createClient } from '@supabase/supabase-js';

const {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_KEY: supabaseAnonKey
} = import.meta.env;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);