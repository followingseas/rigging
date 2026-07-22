import Link from 'next/link'
import { listProfiles } from '@/lib/queries'
import ProfileCard from '@/components/profile-card'

export default async function ExplorePage({ searchParams }: {
  searchParams: Promise<{ item?: string }>
}) {
  const { item } = await searchParams
  const profiles = await listProfiles(item ? { itemSlug: item } : undefined)

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        {item && (
          <p className="text-sm text-[var(--muted)]">
            <span className="text-[var(--accent)]">{item}</span> 사용자 {profiles.length}명 ·{' '}
            <Link href="/explore" className="underline hover:text-[var(--fg)]">필터 해제</Link>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        {profiles.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted)]">
            조건에 맞는 프로필이 없습니다.
          </div>
        )}
        {profiles.map((p) => (
          <ProfileCard key={p.id} profile={p} rigItems={p.rig_items} />
        ))}
      </div>
    </main>
  )
}
