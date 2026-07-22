import { groupRig } from '@/lib/rig'
import { KIND_COLORS, KIND_LABELS } from '@/lib/kinds'
import RigChip from './rig-chip'
import type { RigItemWithCatalog } from '@/lib/types'

export default function RigSections({ rig, emptyText }: {
  rig: RigItemWithCatalog[]
  emptyText: string
}) {
  const groups = groupRig(rig)

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted)]">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-9">
      {groups.map(([kind, items]) => (
        <section key={kind}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_COLORS[kind] }} aria-hidden="true" />
            {KIND_LABELS[kind]}
          </h2>
          <div className="flex flex-wrap gap-2">
            {items.map((i) => <RigChip key={i.id} item={i} />)}
          </div>
        </section>
      ))}
    </div>
  )
}
