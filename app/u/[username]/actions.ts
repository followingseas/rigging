'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function toggleFollow(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const followeeId = String(formData.get('followee_id') ?? '')
  const username = String(formData.get('username') ?? '')
  const isFollowing = formData.get('is_following') === 'true'
  if (!followeeId || followeeId === user.id) return

  if (isFollowing) {
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('followee_id', followeeId)
  } else {
    await supabase.from('follows').insert({ follower_id: user.id, followee_id: followeeId })
  }
  revalidatePath(`/u/${username}`)
}
