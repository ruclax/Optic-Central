import { createServerClient } from '@supabase/ssr'

export const createSupabaseServerClient = (cookies: any) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    }
  )
}
