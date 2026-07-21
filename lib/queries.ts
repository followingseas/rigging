import { createClient } from '@/lib/supabase/server'
import type { CatalogKind } from '@/lib/kinds'
import type { CatalogItem, CatalogUsage, Profile, RigItemWithCatalog } from '@/lib/types'

const RIG_FIELDS = 'id, user_id, catalog_item_id, note, is_primary, position'

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
  return data
}

export async function getRig(userId: string): Promise<RigItemWithCatalog[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('rig_items')
    .select(`${RIG_FIELDS}, catalog_items(*)`)
    .eq('user_id', userId)
  return (data ?? []) as unknown as RigItemWithCatalog[]
}

export async function getFollowStats(profileId: string, viewerId?: string) {
  const supabase = await createClient()
  const [followers, following, mine] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followee_id', profileId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profileId),
    viewerId
      ? supabase.from('follows').select('follower_id').eq('follower_id', viewerId).eq('followee_id', profileId).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  return {
    followers: followers.count ?? 0,
    following: following.count ?? 0,
    isFollowing: Boolean(mine.data),
  }
}

export async function getFollowing(userId: string): Promise<Profile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('follows')
    .select('followee:profiles!follows_followee_id_fkey(*)')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
  return (data ?? []).map((r) => r.followee) as unknown as Profile[]
}

export async function listProfiles(filter?: { itemSlug?: string }) {
  const supabase = await createClient()
  const select = filter?.itemSlug
    ? `*, rig_items!inner(${RIG_FIELDS}, catalog_items!inner(*))`
    : `*, rig_items(${RIG_FIELDS}, catalog_items(*))`
  let query = supabase.from('profiles').select(select).order('updated_at', { ascending: false }).limit(50)
  if (filter?.itemSlug) query = query.eq('rig_items.catalog_items.slug', filter.itemSlug)
  const { data } = await query
  return (data ?? []) as unknown as (Profile & { rig_items: RigItemWithCatalog[] })[]
}

export async function listCatalogUsage(kind?: CatalogKind): Promise<CatalogUsage[]> {
  const supabase = await createClient()
  let query = supabase.from('catalog_usage').select('*').order('user_count', { ascending: false }).order('name')
  if (kind) query = query.eq('kind', kind)
  const { data } = await query
  return (data ?? []) as CatalogUsage[]
}

export async function getCatalogItem(kind: CatalogKind, slug: string): Promise<CatalogItem | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('catalog_items').select('*').eq('kind', kind).eq('slug', slug).maybeSingle()
  return data
}

export async function listUsersOfItem(catalogItemId: string): Promise<Profile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('rig_items')
    .select('profiles!rig_items_user_id_fkey(*)')
    .eq('catalog_item_id', catalogItemId)
  return (data ?? []).map((r) => r.profiles) as unknown as Profile[]
}

export async function listCatalog(): Promise<CatalogItem[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('catalog_items').select('*').order('name')
  return (data ?? []) as CatalogItem[]
}
