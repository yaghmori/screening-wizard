import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for the screening table
export interface ScreeningRecord {
  id?: number
  created_at?: string
  first_name?: string
  last_name?: string
  email?: string
  data: Record<string, unknown> // JSON field containing the form data
}
