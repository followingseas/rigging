import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRig, listCatalog } from '@/lib/queries'
import { updateTagline } from '../actions'
import RigEditor from '../rig-editor'

export default async function MeEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')
  const [rig, catalog] = await Promise.all([getRig(user.id), listCatalog()])

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">프로필 편집</h1>
        <Link
          href="/me"
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:border-[var(--accent-deep)] hover:text-[var(--fg)]"
        >
          완료
        </Link>
      </div>
      <p className="mb-7 text-sm text-[var(--muted)]">
        변경은 즉시 저장됩니다. 노트는 입력 후 바깥을 클릭하면 저장돼요.
      </p>
      <form action={updateTagline} className="mb-8 flex gap-2">
        <input
          name="tagline"
          defaultValue={profile.tagline ?? ''}
          placeholder="한 줄 소개 (선택)"
          maxLength={120}
          className="h-10 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
        <button className="rounded-md border border-[var(--border)] px-4 text-sm hover:border-[var(--accent-deep)]">
          저장
        </button>
      </form>
      <RigEditor rig={rig} catalog={catalog} />
    </main>
  )
}
