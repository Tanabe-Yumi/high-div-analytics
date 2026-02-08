import { createClient } from '@supabase/supabase-js'
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ensure the client is only created if variables are present, otherwise might throw or return null in strict mode
// For this MVP, we assume env vars are set.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
