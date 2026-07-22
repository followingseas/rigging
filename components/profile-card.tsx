import Link from 'next/link'
import { KIND_COLORS } from '@/lib/kinds'
import type { Profile, RigItemWithCatalog } from '@/lib/types'

export default function ProfileCard({ profile, rigItems }: {
  profile: Profile
  rigItems?: RigItemWithCatalog[]
}) {
  const preview = (rigItems ?? [])
    .filter((r) => r.catalog_items)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .slice(0, 5)

  return (
    <Link
      href={`/u/${profile.username}`}
      className="group flex items-center gap-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 transition-colors hover:border-[var(--accent-deep)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.avatar_url ?? ''}
        alt=""
        className="h-11 w-11 flex-none rounded-full border border-[var(--border)] bg-[var(--surface-2)]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium group-hover:text-[var(--accent)]">@{profile.username}</span>
          {profile.tagline && (
            <span className="truncate text-sm text-[var(--muted)]">{profile.tagline}</span>
          )}
        </div>
        {preview.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {preview.map((r) => (
              <span key={r.id} className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: KIND_COLORS[r.catalog_items.kind] }}
                  aria-hidden="true"
                />
                {r.catalog_items.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-[var(--muted)]">아직 비어 있는 rig</p>
        )}
      </div>
    </Link>
  )
}
