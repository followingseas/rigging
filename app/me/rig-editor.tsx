'use client'

import { useMemo, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { KINDS, KIND_COLORS, KIND_LABELS, type CatalogKind } from '@/lib/kinds'
import type { CatalogItem, RigItemWithCatalog } from '@/lib/types'
import { addRigItem, removeRigItem, updateRigItem } from './actions'

function AddButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      className="rounded-md bg-[var(--accent-deep)] px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      disabled={pending}
    >
      {pending ? '추가 중…' : label}
    </button>
  )
}

/** 항목 추가 콤보박스 — 제안·신규 등록 UI가 전부 오버레이 안에 있어 레이아웃이 밀리지 않는다 */
function AddItemBox({ kind, catalog, ownedIds }: {
  kind: CatalogKind
  catalog: CatalogItem[]
  ownedIds: Set<string>
}) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const q = text.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (!q) return []
    return catalog
      .filter((c) => c.kind === kind && !ownedIds.has(c.id) && c.name.toLowerCase().includes(q))
      .slice(0, 6)
  }, [q, catalog, kind, ownedIds])
  const exactMatch = suggestions.some((s) => s.name.toLowerCase() === q)

  function closeIfOutside(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
  }

  function submitExisting(item: CatalogItem) {
    const form = formRef.current
    if (!form) return
    ;(form.elements.namedItem('catalog_item_id') as HTMLInputElement).value = item.id
    form.requestSubmit()
    setText('')
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative" onBlur={closeIfOutside}>
      <form
        ref={formRef}
        action={addRigItem}
        onSubmit={() => { setText(''); setOpen(false) }}
        className="flex items-center gap-2"
      >
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="catalog_item_id" defaultValue="" />
        <input
          name="name"
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
          placeholder={`${KIND_LABELS[kind]} 추가…`}
          autoComplete="off"
          className="h-9 w-full max-w-xs rounded-md border border-[var(--border)] bg-transparent px-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </form>

      {open && q && (
        <div className="absolute top-full z-20 mt-1.5 w-full max-w-xs overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-xl shadow-black/30">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => submitExisting(s)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--accent-deep)]/25"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: KIND_COLORS[kind] }} />
              {s.name}
            </button>
          ))}
          {!exactMatch && (
            <form action={addRigItem} onSubmit={() => { setText(''); setOpen(false) }}
              className="border-t border-[var(--border)] px-3 py-2.5">
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="name" value={text.trim()} />
              <p className="mb-1.5 text-xs text-[var(--muted)]">
                카탈로그에 없어요 — <span className="text-[var(--fg)]">&lsquo;{text.trim()}&rsquo;</span> 새로 등록
              </p>
              <div className="flex items-center gap-2">
                <input
                  name="url"
                  placeholder="공식 URL (선택)"
                  className="h-8 min-w-0 flex-1 rounded-md border border-[var(--border)] bg-transparent px-2.5 text-xs placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
                <AddButton label="등록" />
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

/** 노트는 blur 시 자동 저장 — 저장 버튼 없음 */
function ItemRow({ item }: { item: RigItemWithCatalog }) {
  const kind = item.catalog_items.kind
  const primaryToggleable = kind === 'harness'
  const noteFormRef = useRef<HTMLFormElement>(null)
  const savedNote = item.note ?? ''

  return (
    <li className="grid h-12 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-2 w-2 flex-none rounded-full" style={{ background: KIND_COLORS[kind] }} aria-hidden="true" />
        <span className="truncate text-sm font-medium">{item.catalog_items.name}</span>
        {primaryToggleable && (
          <form action={updateRigItem} className="flex">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="is_primary" value={String(!item.is_primary)} />
            <button
              title={item.is_primary ? '주력 해제' : '주력으로 표시'}
              className={item.is_primary ? 'text-sm' : 'text-sm opacity-25 transition-opacity hover:opacity-70'}
              style={item.is_primary ? { color: KIND_COLORS[kind] } : undefined}
            >
              ★
            </button>
          </form>
        )}
      </div>
      <form ref={noteFormRef} action={updateRigItem} className="min-w-0">
        <input type="hidden" name="id" value={item.id} />
        <input
          name="note"
          defaultValue={savedNote}
          placeholder="한 줄 노트"
          maxLength={140}
          onBlur={(e) => { if (e.target.value !== savedNote) noteFormRef.current?.requestSubmit() }}
          className="h-8 w-full rounded-md border border-transparent bg-transparent px-2 text-sm text-[var(--muted)] placeholder:text-[var(--muted)]/50 focus:border-[var(--border)] focus:text-[var(--fg)] focus:outline-none"
        />
      </form>
      <form action={removeRigItem}>
        <input type="hidden" name="id" value={item.id} />
        <button title="제거" className="rounded p-1 text-[var(--muted)] opacity-50 hover:text-[var(--coral)] hover:opacity-100">
          ✕
        </button>
      </form>
    </li>
  )
}

export default function RigEditor({ rig, catalog }: { rig: RigItemWithCatalog[]; catalog: CatalogItem[] }) {
  const ownedIds = new Set(rig.map((r) => r.catalog_item_id))
  return (
    <div className="flex flex-col gap-9">
      {KINDS.map((kind) => {
        const items = rig.filter((i) => i.catalog_items.kind === kind)
        return (
          <section key={kind}>
            <h2 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_COLORS[kind] }} aria-hidden="true" />
              {KIND_LABELS[kind]}
              <span className="font-normal text-[var(--muted)]">{items.length > 0 ? items.length : ''}</span>
            </h2>
            <ul className="mb-2.5 flex flex-col gap-2">
              {items.map((i) => <ItemRow key={i.id} item={i} />)}
            </ul>
            <AddItemBox kind={kind} catalog={catalog} ownedIds={ownedIds} />
          </section>
        )
      })}
    </div>
  )
}
