import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isCatalogKind } from '@/lib/kinds'
import { getCatalogItem, listUsersOfItem } from '@/lib/queries'
import { safeHttpUrl } from '@/lib/url'
import ProfileCard from '@/components/profile-card'

export default async function CatalogItemPage({ params }: {
  params: Promise<{ kind: string; slug: string }>
}) {
  const { kind, slug } = await params
  if (!isCatalogKind(kind)) notFound()
  const item = await getCatalogItem(kind, slug)
  if (!item) notFound()
  const users = await listUsersOfItem(item.id)
  const url = safeHttpUrl(item.url)

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider opacity-40">{item.kind}</p>
        <h1 className="text-xl font-bold">{item.name}</h1>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="text-sm text-[var(--accent)] hover:underline">
            {url}
          </a>
        )}
      </div>
      <h2 className="mb-3 text-sm font-semibold opacity-70">사용 중인 사람 {users.length}명</h2>
      <div className="flex flex-col gap-2">
        {users.map((p) => <ProfileCard key={p.id} profile={p} />)}
      </div>
      <p className="mt-6 text-sm">
        <Link href={`/explore?item=${item.slug}`} className="text-[var(--accent)] hover:underline">
          Explore에서 rig와 함께 보기 →
        </Link>
      </p>
    </main>
  )
}
