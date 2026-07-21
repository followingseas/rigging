import type { CatalogKind } from './kinds'

export type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  tagline: string | null
  github_url: string | null
  created_at: string
  updated_at: string
}

export type CatalogItem = {
  id: string
  kind: CatalogKind
  name: string
  slug: string
  url: string | null
  created_by: string | null
  created_at: string
}

export type CatalogUsage = Pick<CatalogItem, 'id' | 'kind' | 'name' | 'slug' | 'url'> & {
  user_count: number
}

export type RigItemWithCatalog = {
  id: string
  user_id: string
  catalog_item_id: string
  note: string | null
  is_primary: boolean
  position: number
  catalog_items: CatalogItem
}
