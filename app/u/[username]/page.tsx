import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getFollowStats, getProfileByUsername, getRig } from '@/lib/queries'
import { groupRig } from '@/lib/rig'
import { KIND_LABELS } from '@/lib/kinds'
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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-10 flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.avatar_url ?? ''} alt="" className="h-16 w-16 rounded-full bg-[var(--border)]" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold">
            {profile.display_name ?? profile.username}
            <span className="ml-2 text-sm font-normal opacity-50">@{profile.username}</span>
          </h1>
          {profile.tagline && <p className="text-sm opacity-70">{profile.tagline}</p>}
          <p className="mt-1 text-xs opacity-50">
            followers {stats.followers} ·{' '}
            <Link href={`/u/${profile.username}/following`} className="hover:text-[var(--accent)]">
              following {stats.following}
            </Link>
          </p>
        </div>
        {user && user.id !== profile.id && (
          <FollowButton followeeId={profile.id} username={profile.username} isFollowing={stats.isFollowing} />
        )}
      </div>

      {groups.length === 0 && <p className="opacity-50">아직 등록된 rig가 없습니다.</p>}
      <div className="flex flex-col gap-8">
        {groups.map(([kind, items]) => (
          <section key={kind}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
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
