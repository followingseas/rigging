# Rigging

**Share your AI agent harness setup.**

AI 에이전트 사용자들이 자신의 하네스 셋팅("rig")을 구조화된 프로필로 공개하고, 다른 사람의 rig를 탐색·팔로우하는 커뮤니티입니다. rigging은 배의 돛대·돛줄·장비 일체를 뜻하는 항해 용어로, Followingseas의 항해 컨셉을 잇습니다.

## 주요 기능

- **구조화된 프로필** — 에이전트 하네스, 모델, MCP 서버, 스킬·플러그인, 에디터·터미널을 카테고리별로 등록합니다
- **커뮤니티 카탈로그** — 등록된 도구는 공유 항목이 되어 자동완성과 사용자 수 집계에 활용됩니다
- **탐색과 필터** — 특정 도구를 사용하는 사람들의 rig를 찾아볼 수 있습니다
- **팔로우** — 관심 있는 사용자의 rig를 팔로우하고 팔로잉 목록에서 다시 찾아봅니다

## Tech Stack

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase (Postgres, Auth, RLS) |
| 배포 | Vercel |

인증은 GitHub OAuth를 사용합니다. 데이터베이스 스키마는 [`supabase/migrations`](supabase/migrations)에서 관리합니다.

## License

[MIT](LICENSE)
