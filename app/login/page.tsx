import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoSymbol } from '@/components/logo'
import { signInWithGithub } from './actions'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/me')

  return (
    <main className="mx-auto flex max-w-sm flex-col items-center gap-5 px-6 py-24 text-center">
      <LogoSymbol size={56} />
      <h1 className="text-2xl font-semibold tracking-tight">rigging에 로그인</h1>
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        GitHub 계정으로 시작합니다.
        로그인하면 프로필이 바로 만들어져요.
      </p>
      <form action={signInWithGithub}>
        <button className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[#0b1f2a] hover:opacity-90">
          Continue with GitHub
        </button>
      </form>
    </main>
  )
}
