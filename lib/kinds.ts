export const KINDS = ['harness', 'model', 'mcp', 'skill', 'editor', 'terminal'] as const
export type CatalogKind = (typeof KINDS)[number]

export const KIND_LABELS: Record<CatalogKind, string> = {
  harness: 'Harness',
  model: 'Models',
  mcp: 'MCP Servers',
  skill: 'Skills & Plugins',
  editor: 'Editor',
  terminal: 'Terminal',
}

export function isCatalogKind(v: string): v is CatalogKind {
  return (KINDS as readonly string[]).includes(v)
}
