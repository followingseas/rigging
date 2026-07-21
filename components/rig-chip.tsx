import type { RigItemWithCatalog } from '@/lib/types'

export default function RigChip({ item }: { item: RigItemWithCatalog }) {
  const c = item.catalog_items
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm">
      {item.is_primary && <span title="primary" className="text-[var(--accent)]">★</span>}
      {c.url ? (
        <a href={c.url} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">{c.name}</a>
      ) : (
        c.name
      )}
      {item.note && <span className="opacity-60">— {item.note}</span>}
    </span>
  )
}
