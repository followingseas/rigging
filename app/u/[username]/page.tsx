import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getFollowStats, getProfileByUsername, getRig } from '@/lib/queries'
import RigSections from '@/components/rig-sections'
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

      <RigSections rig={rig} emptyText="아직 등록된 rig가 없습니다." />
    </main>
  )
}
