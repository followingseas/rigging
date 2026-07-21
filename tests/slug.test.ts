import { describe, expect, it } from 'vitest'
import { slugify } from '../lib/slug'

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Claude Code')).toBe('claude-code')
  })
  it('trims and collapses separators', () => {
    expect(slugify('  GPT-5  ')).toBe('gpt-5')
    expect(slugify('some_thing.v2')).toBe('some-thing-v2')
  })
  it('strips unsafe characters', () => {
    expect(slugify('a/b@c!')).toBe('abc')
  })
  it('collapses repeated hyphens and trims edges', () => {
    expect(slugify('--a---b--')).toBe('a-b')
  })
})
