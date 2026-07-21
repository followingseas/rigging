import Link from 'next/link'
import { listCatalogUsage, listProfiles } from '@/lib/queries'
import ProfileCard from '@/components/profile-card'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [profiles, topItems] = await Promise.all([listProfiles(), listCatalogUsage()])

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Show your <span className="text-[var(--accent)]">rig</span>.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-70">
          AI 에이전트 하네스 셋팅을 공개하고, 다른 사람의 rig를 팔로우하세요.
          Claude Code부터 MCP 서버, 스킬, 터미널까지 — 당신의 배는 어떻게 꾸며져 있나요?
        </p>
        <div className="mt-6 flex justify-center gap-3 text-sm">
          <Link href="/login" className="rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-[#0b1f2a] hover:opacity-90">
            내 rig 만들기
          </Link>
          <Link href="/explore" className="rounded-md border border-[var(--border)] px-4 py-2 hover:border-[var(--accent)]">
            둘러보기
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">최근 업데이트된 rig</h2>
        <div className="flex flex-col gap-2">
          {profiles.slice(0, 5).map((p) => (
            <ProfileCard
              key={p.id}
              profile={p}
              summary={p.rig_items?.slice(0, 5).map((r) => r.catalog_items?.name).filter(Boolean).join(' · ')}
            />
          ))}
          {profiles.length === 0 && <p className="text-sm opacity-50">첫 번째 rig의 주인공이 되어보세요.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">많이 쓰는 도구</h2>
        <div className="flex flex-wrap gap-2">
          {topItems.slice(0, 12).map((i) => (
            <Link
              key={i.id}
              href={`/catalog/${i.kind}/${i.slug}`}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm hover:border-[var(--accent)]"
            >
              {i.name} <span className="opacity-50">{i.user_count}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
