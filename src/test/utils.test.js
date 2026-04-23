// src/test/utils.test.js
import { describe, it, expect } from 'vitest'
import {
  cn,
  sanitizeInput,
  formatDate,
  capitalize,
  calcScore,
  getGrade,
  shuffle,
  truncate,
} from '../utils/helpers'

// ── cn ─────────────────────────────────────────────────────────────────
describe('cn', () => {
  it('merges class strings without duplicates', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
  it('handles falsy values without throwing', () => {
    expect(cn('px-4', false, null, undefined)).toBe('px-4')
  })
  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })
})

// ── sanitizeInput ──────────────────────────────────────────────────────
describe('sanitizeInput', () => {
  it('strips HTML tags from user input', () => {
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello')
  })
  it('strips template injection patterns', () => {
    expect(sanitizeInput('Hello {system_prompt}')).toBe('Hello')
  })
  it('strips javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)')
  })
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world')
  })
  it('caps length at 500 characters', () => {
    const long = 'a'.repeat(600)
    expect(sanitizeInput(long).length).toBe(500)
  })
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('')
  })
  it('returns empty string for null/undefined input', () => {
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(undefined)).toBe('')
  })
})

// ── capitalize ─────────────────────────────────────────────────────────
describe('capitalize', () => {
  it('capitalizes first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
  })
  it('handles empty string without throwing', () => {
    expect(capitalize('')).toBe('')
  })
  it('handles null/undefined without throwing', () => {
    expect(capitalize(null)).toBe('')
    expect(capitalize(undefined)).toBe('')
  })
})

// ── calcScore ──────────────────────────────────────────────────────────
describe('calcScore', () => {
  it('returns 80 for 8 correct out of 10', () => {
    expect(calcScore(8, 10)).toBe(80)
  })
  it('returns 0 for zero correct', () => {
    expect(calcScore(0, 10)).toBe(0)
  })
  it('returns 100 for all correct', () => {
    expect(calcScore(10, 10)).toBe(100)
  })
  it('returns 0 when total is zero to avoid division by zero', () => {
    expect(calcScore(0, 0)).toBe(0)
  })
  it('rounds to nearest integer', () => {
    expect(calcScore(1, 3)).toBe(33)
  })
})

// ── getGrade ───────────────────────────────────────────────────────────
describe('getGrade', () => {
  it('returns Expert Voter for scores >= 90', () => {
    expect(getGrade(90).label).toBe('Expert Voter')
    expect(getGrade(100).label).toBe('Expert Voter')
  })
  it('returns Informed Voter for scores 70-89', () => {
    expect(getGrade(70).label).toBe('Informed Voter')
    expect(getGrade(89).label).toBe('Informed Voter')
  })
  it('returns Aware Citizen for scores 50-69', () => {
    expect(getGrade(50).label).toBe('Aware Citizen')
    expect(getGrade(69).label).toBe('Aware Citizen')
  })
  it('returns Keep Learning for scores below 50', () => {
    expect(getGrade(49).label).toBe('Keep Learning')
    expect(getGrade(0).label).toBe('Keep Learning')
  })
})

// ── shuffle ────────────────────────────────────────────────────────────
describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr)).toHaveLength(arr.length)
  })
  it('does not mutate the original array', () => {
    const arr = [1, 2, 3]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })
  it('contains the same elements as the original', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr).sort()).toEqual([...arr].sort())
  })
  it('handles empty array without throwing', () => {
    expect(shuffle([])).toEqual([])
  })
})

// ── truncate ───────────────────────────────────────────────────────────
describe('truncate', () => {
  it('truncates text longer than maxLen with ellipsis', () => {
    expect(truncate('Hello World', 5)).toBe('Hello…')
  })
  it('returns full text when shorter than maxLen', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })
  it('handles null/undefined input without throwing', () => {
    expect(truncate(null)).toBe(null)
    expect(truncate(undefined)).toBe(undefined)
  })
  it('returns text unchanged when exactly at maxLen', () => {
    expect(truncate('12345', 5)).toBe('12345')
  })
})
