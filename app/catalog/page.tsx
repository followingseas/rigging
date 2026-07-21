import Link from 'next/link'
import { KINDS, KIND_LABELS, isCatalogKind } from '@/lib/kinds'
import { listCatalogUsage } from '@/lib/queries'

export default async function CatalogPage({ searchParams }: {
  searchParams: Promise<{ kind?: string }>
}) {
  const { kind } = await searchParams
  const activeKind = kind && isCatalogKind(kind) ? kind : undefined
  const items = await listCatalogUsage(activeKind)

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-xl font-bold">Catalog</h1>
      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link href="/catalog" className={!activeKind ? 'text-[var(--accent)] font-medium' : 'opacity-60 hover:opacity-100'}>All</Link>
        {KINDS.map((k) => (
          <Link key={k} href={`/catalog?kind=${k}`} className={activeKind === k ? 'text-[var(--accent)] font-medium' : 'opacity-60 hover:opacity-100'}>
            {KIND_LABELS[k]}
          </Link>
        ))}
      </nav>
      <ul className="flex flex-col gap-2">
        {items.map((i) => (
          <li key={i.id}>
            <Link
              href={`/catalog/${i.kind}/${i.slug}`}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:border-[var(--accent)]"
            >
              <span>
                <span className="font-medium">{i.name}</span>
                <span className="ml-2 text-xs uppercase opacity-40">{i.kind}</span>
              </span>
              <span className="text-sm opacity-60">{i.user_count} users</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
