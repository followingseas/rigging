import Link from 'next/link'
import { KINDS, KIND_COLORS, KIND_LABELS, isCatalogKind } from '@/lib/kinds'
import { listCatalogUsage } from '@/lib/queries'

export default async function CatalogPage({ searchParams }: {
  searchParams: Promise<{ kind?: string }>
}) {
  const { kind } = await searchParams
  const activeKind = kind && isCatalogKind(kind) ? kind : undefined
  const items = await listCatalogUsage(activeKind)

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Catalog</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">커뮤니티가 쓰고 있는 도구 목록 — 사용자 수 순</p>
      <nav className="mb-6 flex flex-wrap gap-1.5 text-sm">
        <Link
          href="/catalog"
          className={
            !activeKind
              ? 'rounded-full bg-[var(--surface-2)] px-3.5 py-1.5 font-medium'
              : 'rounded-full px-3.5 py-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]'
          }
        >
          All
        </Link>
        {KINDS.map((k) => (
          <Link
            key={k}
            href={`/catalog?kind=${k}`}
            className={
              activeKind === k
                ? 'inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-3.5 py-1.5 font-medium'
                : 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]'
            }
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: KIND_COLORS[k] }} aria-hidden="true" />
            {KIND_LABELS[k]}
          </Link>
        ))}
      </nav>
      <ul className="flex flex-col gap-2">
        {items.map((i) => (
          <li key={i.id}>
            <Link
              href={`/catalog/${i.kind}/${i.slug}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:border-[var(--accent-deep)]"
            >
              <span className="h-2 w-2 flex-none rounded-full" style={{ background: KIND_COLORS[i.kind] }} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-medium">{i.name}</span>
              <span className="text-xs uppercase tracking-wide text-[var(--muted)]/70">{i.kind}</span>
              <span className="w-16 text-right text-sm text-[var(--muted)] tabular-nums">
                {i.user_count > 0 ? `${i.user_count}명` : '—'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
