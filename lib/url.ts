/** http(s) URL만 허용 — javascript: 등 위험 스킴 차단 */
export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return /^https?:\/\//i.test(url) ? url : null
}
