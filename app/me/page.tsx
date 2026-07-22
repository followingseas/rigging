import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getFollowStats, getRig } from '@/lib/queries'
import RigSections from '@/components/rig-sections'

export default async function MePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')
  const [rig, stats] = await Promise.all([getRig(user.id), getFollowStats(user.id)])

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
            {' '}·{' '}
            <Link href={`/u/${profile.username}`} className="hover:text-[var(--accent)]">
              공개 페이지 보기
            </Link>
          </p>
        </div>
        <Link
          href="/me/edit"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#0b1f2a] hover:opacity-90"
        >
          프로필 편집
        </Link>
      </div>
      <RigSections
        rig={rig}
        emptyText="아직 rig가 비어 있어요. 프로필 편집에서 지금 쓰는 도구를 추가해보세요."
      />
    </main>
  )
}
