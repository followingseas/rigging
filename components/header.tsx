import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoSymbol } from '@/components/logo'

const REPO_URL = 'https://github.com/followingseas/rigging'

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  )
}

async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch('https://api.github.com/repos/followingseas/rigging', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null
  } catch {
    return null
  }
}

export default async function Header() {
  const supabase = await createClient()
  const [{ data: { user } }, stars] = await Promise.all([
    supabase.auth.getUser(),
    getStarCount(),
  ])
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? null

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
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-[var(--muted)] hover:border-[var(--accent-deep)] hover:text-[var(--fg)]"
            title="GitHub에서 Star 주기"
          >
            <StarIcon />
            Star
            {stars !== null && (
              <span className="rounded-full bg-[var(--surface-2)] px-1.5 text-xs tabular-nums">
                {stars.toLocaleString()}
              </span>
            )}
          </a>
          {user ? (
            <details className="relative ml-2">
              <summary className="flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl ?? ''}
                  alt="내 프로필"
                  className="h-8 w-8 rounded-full border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:ring-2 hover:ring-[var(--accent-deep)]"
                />
              </summary>
              <div className="absolute right-0 top-full z-40 mt-2 w-40 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] py-1 shadow-xl shadow-black/30">
                <Link href="/me" className="block px-3.5 py-2 hover:bg-[var(--accent-deep)]/25">
                  내 rig
                </Link>
                <Link href="/me/edit" className="block px-3.5 py-2 hover:bg-[var(--accent-deep)]/25">
                  프로필 편집
                </Link>
                <form action="/auth/signout" method="post" className="border-t border-[var(--border)]">
                  <button className="block w-full px-3.5 py-2 text-left text-[var(--muted)] hover:bg-[var(--accent-deep)]/25 hover:text-[var(--fg)]">
                    로그아웃
                  </button>
                </form>
              </div>
            </details>
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
