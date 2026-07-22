export const KINDS = ['harness', 'mcp', 'skill', 'editor', 'terminal'] as const
export type CatalogKind = (typeof KINDS)[number]

export const KIND_LABELS: Record<CatalogKind, string> = {
  harness: 'Harness',
  mcp: 'MCP Servers',
  skill: 'Skills & Plugins',
  editor: 'Editor',
  terminal: 'Terminal',
}

/* 카테고리 색 — 로고 스택 레이어에서 파생 (globals.css 변수와 동일) */
export const KIND_COLORS: Record<CatalogKind, string> = {
  harness: 'var(--k-harness)',
  mcp: 'var(--k-mcp)',
  skill: 'var(--k-skill)',
  editor: 'var(--k-editor)',
  terminal: 'var(--k-terminal)',
}

export function isCatalogKind(v: string): v is CatalogKind {
  return (KINDS as readonly string[]).includes(v)
}
