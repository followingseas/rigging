'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithGithub() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${origin}/auth/callback?next=/me` },
  })
  redirect(data?.url ?? '/login?error=oauth')
}
