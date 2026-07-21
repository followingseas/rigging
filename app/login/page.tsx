import { signInWithGithub } from './actions'

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">Rigging에 로그인</h1>
      <p className="text-sm opacity-70">GitHub 계정으로 시작합니다. 로그인하면 프로필이 바로 생성됩니다.</p>
      <form action={signInWithGithub}>
        <button className="rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-[#0b1f2a] hover:opacity-90">
          Continue with GitHub
        </button>
      </form>
    </main>
  )
}
