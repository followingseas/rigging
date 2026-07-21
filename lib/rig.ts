import { KINDS, type CatalogKind } from './kinds'
import type { RigItemWithCatalog } from './types'

export function groupRig(items: RigItemWithCatalog[]): [CatalogKind, RigItemWithCatalog[]][] {
  return KINDS.map((kind): [CatalogKind, RigItemWithCatalog[]] => [
    kind,
    items
      .filter((i) => i.catalog_items.kind === kind)
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position),
  ]).filter(([, group]) => group.length > 0)
}
