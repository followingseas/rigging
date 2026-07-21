'use client'

import { useMemo, useState } from 'react'
import { KINDS, KIND_LABELS, type CatalogKind } from '@/lib/kinds'
import type { CatalogItem, RigItemWithCatalog } from '@/lib/types'
import { addRigItem, removeRigItem, updateRigItem } from './actions'

function AddItemForm({ kind, catalog, ownedIds }: {
  kind: CatalogKind
  catalog: CatalogItem[]
  ownedIds: Set<string>
}) {
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<CatalogItem | null>(null)
  const suggestions = useMemo(() => {
    const q = text.trim().toLowerCase()
    if (!q || picked) return []
    return catalog
      .filter((c) => c.kind === kind && !ownedIds.has(c.id) && c.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [text, picked, catalog, kind, ownedIds])
  const isNew = text.trim() !== '' && !picked

  return (
    <form
      action={addRigItem}
      className="relative mt-2 flex flex-wrap items-center gap-2"
      onSubmit={() => { setText(''); setPicked(null) }}
    >
      <input type="hidden" name="kind" value={kind} />
      {picked && <input type="hidden" name="catalog_item_id" value={picked.id} />}
      <input
        name="name"
        value={picked ? picked.name : text}
        onChange={(e) => { setPicked(null); setText(e.target.value) }}
        placeholder={`Add ${KIND_LABELS[kind]}…`}
        autoComplete="off"
        className="w-56 rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
      />
      {isNew && (
        <input
          name="url"
          placeholder="URL (optional, 신규 등록)"
          className="w-64 rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
        />
      )}
      <button className="rounded-md bg-[var(--accent-deep)] px-3 py-1.5 text-sm hover:opacity-90">Add</button>
      {suggestions.length > 0 && (
        <ul className="absolute top-full z-10 mt-1 w-56 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => { setPicked(s); setText(s.name) }}
                className="block w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--accent-deep)]/30"
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}

function ItemRow({ item }: { item: RigItemWithCatalog }) {
  const primaryToggleable = item.catalog_items.kind === 'harness' || item.catalog_items.kind === 'model'
  return (
    <li className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
      {primaryToggleable && (
        <form action={updateRigItem}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_primary" value={String(!item.is_primary)} />
          <button title="toggle primary" className={item.is_primary ? 'text-[var(--accent)]' : 'opacity-30 hover:opacity-70'}>★</button>
        </form>
      )}
      <span className="text-sm font-medium">{item.catalog_items.name}</span>
      <form action={updateRigItem} className="flex flex-1 items-center gap-2">
        <input type="hidden" name="id" value={item.id} />
        <input
          name="note"
          defaultValue={item.note ?? ''}
          placeholder="한 줄 노트 (선택)"
          maxLength={140}
          className="min-w-40 flex-1 rounded border border-transparent bg-transparent px-2 py-1 text-sm opacity-80 outline-none focus:border-[var(--border)]"
        />
        <button className="text-xs opacity-50 hover:opacity-100">save</button>
      </form>
      <form action={removeRigItem}>
        <input type="hidden" name="id" value={item.id} />
        <button title="remove" className="opacity-40 hover:text-red-400 hover:opacity-100">✕</button>
      </form>
    </li>
  )
}

export default function RigEditor({ rig, catalog }: { rig: RigItemWithCatalog[]; catalog: CatalogItem[] }) {
  const ownedIds = new Set(rig.map((r) => r.catalog_item_id))
  return (
    <div className="flex flex-col gap-8">
      {KINDS.map((kind) => (
        <section key={kind}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            {KIND_LABELS[kind]}
          </h2>
          <ul className="flex flex-col gap-2">
            {rig.filter((i) => i.catalog_items.kind === kind).map((i) => <ItemRow key={i.id} item={i} />)}
          </ul>
          <AddItemForm kind={kind} catalog={catalog} ownedIds={ownedIds} />
        </section>
      ))}
    </div>
  )
}
