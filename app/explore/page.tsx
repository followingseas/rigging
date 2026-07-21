import Link from 'next/link'
import { listProfiles } from '@/lib/queries'
import ProfileCard from '@/components/profile-card'

export default async function ExplorePage({ searchParams }: {
  searchParams: Promise<{ item?: string }>
}) {
  const { item } = await searchParams
  const profiles = await listProfiles(item ? { itemSlug: item } : undefined)

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Explore</h1>
        {item && (
          <p className="text-sm opacity-70">
            <span className="text-[var(--accent)]">{item}</span> 사용자 {profiles.length}명 ·{' '}
            <Link href="/explore" className="underline">필터 해제</Link>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {profiles.length === 0 && <p className="opacity-50">아직 프로필이 없습니다.</p>}
        {profiles.map((p) => (
          <ProfileCard
            key={p.id}
            profile={p}
            summary={p.rig_items?.slice(0, 5).map((r) => r.catalog_items?.name).filter(Boolean).join(' · ')}
          />
        ))}
      </div>
    </main>
  )
}
