import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getFollowStats, getProfileByUsername, getRig } from '@/lib/queries'
import { groupRig } from '@/lib/rig'
import { KIND_COLORS, KIND_LABELS } from '@/lib/kinds'
import RigChip from '@/components/rig-chip'
import FollowButton from './follow-button'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getProfileByUsername(username)
  if (!profile) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [rig, stats] = await Promise.all([
    getRig(profile.id),
    getFollowStats(profile.id, user?.id),
  ])
  const groups = groupRig(rig)

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-10 flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar_url ?? ''}
          alt=""
          className="h-16 w-16 rounded-full border border-[var(--border)] bg-[var(--surface)]"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">
            {profile.display_name ?? profile.username}
            <span className="ml-2 text-sm font-normal text-[var(--muted)]">@{profile.username}</span>
          </h1>
          {profile.tagline && <p className="mt-0.5 text-sm text-[var(--muted)]">{profile.tagline}</p>}
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            팔로워 {stats.followers} ·{' '}
            <Link href={`/u/${profile.username}/following`} className="hover:text-[var(--accent)]">
              팔로잉 {stats.following}
            </Link>
          </p>
        </div>
        {user && user.id !== profile.id && (
          <FollowButton followeeId={profile.id} username={profile.username} isFollowing={stats.isFollowing} />
        )}
      </div>

      {groups.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted)]">
          아직 등록된 rig가 없습니다.
        </div>
      )}
      <div className="flex flex-col gap-9">
        {groups.map(([kind, items]) => (
          <section key={kind}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_COLORS[kind] }} aria-hidden="true" />
              {KIND_LABELS[kind]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {items.map((i) => <RigChip key={i.id} item={i} />)}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
