# Rigging Brand Assets

Rigging의 로고 에셋입니다. 심볼은 선체(에이전트) 위에 하네스 레이어가 실린 "harness stack", 워드마크는 [Outfit](https://fonts.google.com/specimen/Outfit) SemiBold(OFL)를 아웃라인으로 변환해 폰트 설치 없이 렌더됩니다.

## 팔레트

| 이름 | 값 | 용도 |
|------|-----|------|
| Deep Teal | `#1F7A93` | 선체 |
| Teal | `#56B7C3` | 레이어 1 |
| Light Teal | `#7FD1DB` | 레이어 2 |
| Coral | `#E0533D` | 레이어 3 (포인트) |
| Ink | `#16394A` | 라이트 배경 텍스트 |
| Paper | `#E8F6F2` | 다크 배경 텍스트 |
| Night | `#0B1F2A` | 타일 배경 |

## 파일 가이드

| 파일 | 내용 | 권장 용도 |
|------|------|-----------|
| `logo.svg` | 심볼(컬러, 투명 배경) | 범용 |
| `logo-tile.svg` | 다크 라운드 타일 위 심볼 (모서리 투명) | 앱 아이콘 등 라운드 형태를 그대로 쓰는 곳 |
| `logo-square.svg` | full-bleed 정사각 타일 | GitHub Org 아바타 등 플랫폼이 모서리를 깎아주는 곳 |
| `logo-badge.svg` | 투명 배경 + 심볼 확대 | GitHub OAuth App 로고 — 배지 배경색을 `#0B1F2A`로 함께 설정 |
| `logo-mono-black.svg` / `logo-mono-white.svg` | 단색 심볼 | 단색 인쇄, 워터마크 |
| `wordmark.svg` / `wordmark-white.svg` | "rigging" 글자만 (Ink/Paper) | 텍스트 단독 배치 |
| `lockup.svg` / `lockup-white.svg` | 심볼+글자 가로 조합 (라이트/다크 배경용) | README 히어로, 사이트 헤더 |
| `lockup-mono-black.svg` / `lockup-mono-white.svg` | 단색 조합 | 단색 매체 |
| `png/logo-{16,32,64,128,256,512,1024}.png` | 심볼 투명 PNG | 파비콘(16·32), 일반 용도 |
| `png/logo-tile-{256,512,1024}.png` | 라운드 타일 PNG (모서리 투명) | 라운드 형태를 그대로 쓰는 곳 |
| `png/logo-square-{512,1024}.png` | 정사각 타일 PNG | GitHub OAuth App 로고(512 권장), 아바타 |
| `png/apple-touch-icon.png` | 180×180 타일 | iOS 홈 화면 아이콘 |
| `png/lockup-light.png` / `png/lockup-dark.png` | 락업 PNG (라이트/다크 배경용, 투명) | 문서·슬라이드 |

## 사용 규칙

- 심볼 비율과 색상을 변형하지 않습니다. 단색이 필요하면 mono 버전을 사용합니다.
- 라이트 배경에는 `lockup.svg`, 다크 배경에는 `lockup-white.svg`를 사용합니다.
- 워드마크 서체는 아웃라인화되어 있어 폰트 설치가 필요 없습니다.
