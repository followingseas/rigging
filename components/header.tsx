import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-bold tracking-tight text-[var(--accent)]">⛵ rigging</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/explore" className="hover:text-[var(--accent)]">Explore</Link>
          <Link href="/catalog" className="hover:text-[var(--accent)]">Catalog</Link>
          {user ? (
            <>
              <Link href="/me" className="hover:text-[var(--accent)]">My Rig</Link>
              <form action="/auth/signout" method="post">
                <button className="opacity-60 hover:opacity-100">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-md bg-[var(--accent)] px-3 py-1.5 font-medium text-[#0b1f2a]">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
