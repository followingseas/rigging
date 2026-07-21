import { notFound } from 'next/navigation'
import { getFollowing, getProfileByUsername } from '@/lib/queries'
import ProfileCard from '@/components/profile-card'

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getProfileByUsername(username)
  if (!profile) notFound()
  const following = await getFollowing(profile.id)

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-xl font-bold">@{profile.username} · Following {following.length}</h1>
      <div className="flex flex-col gap-2">
        {following.length === 0 && <p className="opacity-50">아직 팔로우한 사람이 없습니다.</p>}
        {following.map((p) => <ProfileCard key={p.id} profile={p} />)}
      </div>
    </main>
  )
}
