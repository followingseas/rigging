import { toggleFollow } from './actions'

export default function FollowButton({ followeeId, username, isFollowing }: {
  followeeId: string
  username: string
  isFollowing: boolean
}) {
  return (
    <form action={toggleFollow}>
      <input type="hidden" name="followee_id" value={followeeId} />
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="is_following" value={String(isFollowing)} />
      <button
        className={
          isFollowing
            ? 'rounded-md border border-[var(--border)] px-4 py-1.5 text-sm opacity-80 hover:opacity-100'
            : 'rounded-md bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[#0b1f2a] hover:opacity-90'
        }
      >
        {isFollowing ? 'Following ✓' : 'Follow'}
      </button>
    </form>
  )
}
