import { KIND_COLORS } from '@/lib/kinds'
import type { RigItemWithCatalog } from '@/lib/types'
import { safeHttpUrl } from '@/lib/url'

export default function RigChip({ item }: { item: RigItemWithCatalog }) {
  const c = item.catalog_items
  const url = safeHttpUrl(c.url)
  const color = KIND_COLORS[c.kind]
  const name = (
    <span className="font-medium">
      {c.name}
      {item.is_primary && <span title="주력 도구" className="ml-1" style={{ color }}>★</span>}
    </span>
  )
  return (
    <span
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-3 pr-3.5 text-sm"
      title={item.note ?? undefined}
    >
      <span className="h-2 w-2 flex-none rounded-full" style={{ background: color }} aria-hidden="true" />
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">{name}</a>
      ) : (
        name
      )}
      {item.note && <span className="truncate text-[var(--muted)]">{item.note}</span>}
    </span>
  )
}
