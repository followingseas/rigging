'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isCatalogKind } from '@/lib/kinds'
import { slugify } from '@/lib/slug'
import { safeHttpUrl } from '@/lib/url'

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function addRigItem(formData: FormData) {
  const { supabase, user } = await requireUser()
  const kind = String(formData.get('kind') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const url = safeHttpUrl(String(formData.get('url') ?? '').trim())
  const existingId = String(formData.get('catalog_item_id') ?? '') || null
  if (!isCatalogKind(kind) || (!existingId && !name)) return

  let catalogItemId = existingId
  if (!catalogItemId) {
    const slug = slugify(name)
    if (!slug) return
    const { data: existing } = await supabase
      .from('catalog_items').select('id').eq('kind', kind).eq('slug', slug).maybeSingle()
    if (existing) {
      catalogItemId = existing.id
    } else {
      const { data: created, error } = await supabase
        .from('catalog_items')
        .insert({ kind, name, slug, url, created_by: user.id })
        .select('id')
        .single()
      if (error || !created) return
      catalogItemId = created.id
    }
  }

  const { count } = await supabase
    .from('rig_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  await supabase.from('rig_items').insert({
    user_id: user.id,
    catalog_item_id: catalogItemId,
    position: count ?? 0,
  })
  revalidatePath('/me')
  revalidatePath('/me/edit')
}

export async function updateRigItem(formData: FormData) {
  const { supabase, user } = await requireUser()
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const patch: { note?: string | null; is_primary?: boolean } = {}
  if (formData.has('note')) patch.note = String(formData.get('note') ?? '').trim() || null
  if (formData.has('is_primary')) patch.is_primary = formData.get('is_primary') === 'true'
  await supabase.from('rig_items').update(patch).eq('id', id).eq('user_id', user.id)
  revalidatePath('/me')
  revalidatePath('/me/edit')
}

export async function removeRigItem(formData: FormData) {
  const { supabase, user } = await requireUser()
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await supabase.from('rig_items').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/me')
  revalidatePath('/me/edit')
}

export async function updateTagline(formData: FormData) {
  const { supabase, user } = await requireUser()
  const tagline = String(formData.get('tagline') ?? '').trim().slice(0, 120) || null
  await supabase.from('profiles').update({ tagline }).eq('id', user.id)
  revalidatePath('/me')
  revalidatePath('/me/edit')
}
