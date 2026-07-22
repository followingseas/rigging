import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoSymbol } from '@/components/logo'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <LogoSymbol size={26} />
          <span className="display text-lg font-semibold tracking-tight">rigging</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/explore" className="rounded-md px-3 py-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]">
            Explore
          </Link>
          <Link href="/catalog" className="rounded-md px-3 py-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]">
            Catalog
          </Link>
          {user ? (
            <>
              <Link href="/me" className="rounded-md px-3 py-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]">
                My rig
              </Link>
              <form action="/auth/signout" method="post" className="ml-1">
                <button className="rounded-md px-3 py-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-lg bg-[var(--accent)] px-3.5 py-1.5 font-medium text-[#0b1f2a] hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
