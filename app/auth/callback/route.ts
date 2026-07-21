import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // open redirect 방지: same-origin 상대 경로만 허용
  const rawNext = searchParams.get('next') ?? '/me'
  const target = new URL(rawNext, origin)
  const next = target.origin === origin ? target.pathname + target.search : '/me'
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
