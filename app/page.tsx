import Link from 'next/link'
import { listCatalogUsage, listProfiles } from '@/lib/queries'
import { KIND_COLORS } from '@/lib/kinds'
import ProfileCard from '@/components/profile-card'
import { LogoSymbol } from '@/components/logo'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [profiles, topItems] = await Promise.all([listProfiles(), listCatalogUsage()])

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <section className="mb-16 flex flex-col items-center text-center">
        <div className="hero-bob mb-6">
          <LogoSymbol size={88} />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          Show your <span className="text-[var(--accent)]">rig</span>.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
          rigging은 배를 항해하게 만드는 장비 일체를 뜻합니다.
          당신의 AI 에이전트 위에는 무엇이 얹혀 있나요?
          하네스, MCP, 스킬, 터미널 — 셋업을 공개하고 다른 사람의 rig를 팔로우하세요.
        </p>
        <div className="mt-7 flex gap-3 text-sm">
          <Link
            href="/login"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-[#0b1f2a] hover:opacity-90"
          >
            내 rig 만들기
          </Link>
          <Link
            href="/explore"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 hover:border-[var(--accent-deep)]"
          >
            둘러보기
          </Link>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-3.5 text-sm font-semibold text-[var(--muted)]">최근 업데이트된 rig</h2>
        <div className="flex flex-col gap-2.5">
          {profiles.slice(0, 5).map((p) => (
            <ProfileCard key={p.id} profile={p} rigItems={p.rig_items} />
          ))}
          {profiles.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--border)] px-6 py-10 text-center text-sm text-[var(--muted)]">
              첫 번째 rig의 주인공이 되어보세요.
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3.5 text-sm font-semibold text-[var(--muted)]">많이 쓰는 도구</h2>
        <div className="flex flex-wrap gap-2">
          {topItems.slice(0, 14).map((i) => (
            <Link
              key={i.id}
              href={`/catalog/${i.kind}/${i.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-3 pr-3.5 text-sm hover:border-[var(--accent-deep)]"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: KIND_COLORS[i.kind] }} aria-hidden="true" />
              {i.name}
              {i.user_count > 0 && <span className="text-xs text-[var(--muted)]">{i.user_count}</span>}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
