import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRig, listCatalog } from '@/lib/queries'
import { updateTagline } from './actions'
import RigEditor from './rig-editor'

export default async function MePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')
  const [rig, catalog] = await Promise.all([getRig(user.id), listCatalog()])

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold">My Rig</h1>
        <Link href={`/u/${profile.username}`} className="text-sm text-[var(--accent)] hover:underline">
          공개 프로필 보기 →
        </Link>
      </div>
      <form action={updateTagline} className="mb-10 flex gap-2">
        <input
          name="tagline"
          defaultValue={profile.tagline ?? ''}
          placeholder="한 줄 소개 (선택, 120자)"
          maxLength={120}
          className="flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button className="rounded-md border border-[var(--border)] px-3 text-sm hover:border-[var(--accent)]">저장</button>
      </form>
      <RigEditor rig={rig} catalog={catalog} />
    </main>
  )
}
