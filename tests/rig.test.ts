import { describe, expect, it } from 'vitest'
import { groupRig } from '../lib/rig'
import type { RigItemWithCatalog } from '../lib/types'

function item(over: Partial<RigItemWithCatalog> & { kind: string; name: string }): RigItemWithCatalog {
  const { kind, name, ...rest } = over
  return {
    id: name,
    user_id: 'u1',
    catalog_item_id: name,
    note: null,
    is_primary: false,
    position: 0,
    catalog_items: {
      id: name,
      kind: kind as RigItemWithCatalog['catalog_items']['kind'],
      name,
      slug: name,
      url: null,
      created_by: null,
      created_at: '',
    },
    ...rest,
  } as RigItemWithCatalog
}

describe('groupRig', () => {
  it('groups by kind in canonical KINDS order, skipping empty kinds', () => {
    const groups = groupRig([item({ kind: 'editor', name: 'zed' }), item({ kind: 'harness', name: 'claude-code' })])
    expect(groups.map(([kind]) => kind)).toEqual(['harness', 'editor'])
  })
  it('sorts primary first, then by position', () => {
    const groups = groupRig([
      item({ kind: 'model', name: 'b', position: 1 }),
      item({ kind: 'model', name: 'c', position: 2, is_primary: true }),
      item({ kind: 'model', name: 'a', position: 0 }),
    ])
    expect(groups[0][1].map((i) => i.catalog_items.name)).toEqual(['c', 'a', 'b'])
  })
})
