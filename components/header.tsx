import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoSymbol } from '@/components/logo'

const REPO_URL = 'https://github.com/followingseas/rigging'

function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
            <GitHubIcon />
            Star
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
