import { createClient } from '@supabase/supabase-js'

// Client-side instance (safe because it only uses NEXT_PUBLIC_* keys)
export const supabaseBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
import { createClient } from '@supabase/supabase-js'

export const supabaseBrowser = () =>
  createClient(
    "https://uqmaubpvilaxwipffjjm.supabase.co", // hardcoded public URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbWF1YnB2aWxheHdpcGZmamptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDE3OTksImV4cCI6MjA3NDI3Nzc5OX0.8iSTDxxe9bsNR8YV6UQd8ZrMwPE0d7HWt2WMD85ecfE"                         // hardcoded anon key
  )
