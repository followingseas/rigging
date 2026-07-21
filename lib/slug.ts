export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s._]+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
