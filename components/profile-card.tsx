import Link from 'next/link'
import type { Profile } from '@/lib/types'

export default function ProfileCard({ profile, summary }: { profile: Profile; summary?: string }) {
  return (
    <Link
      href={`/u/${profile.username}`}
      className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:border-[var(--accent)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={profile.avatar_url ?? ''} alt="" className="h-10 w-10 rounded-full bg-[var(--border)]" />
      <div className="min-w-0">
        <div className="font-medium">@{profile.username}</div>
        <div className="truncate text-sm opacity-60">{summary ?? profile.tagline ?? ''}</div>
      </div>
    </Link>
  )
}
