// src/test/context.test.jsx
// Full branch coverage for AppContext reducer + provider + hook
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import '@testing-library/jest-dom'

vi.mock('../constants', () => ({
  SUGGESTED_QUESTIONS: {
    HOME: ['What is ECI?', 'How do I register?'],
  },
}))

import { AppProvider, useAppContext } from '../context/AppContext'

// ── Wrapper helper ──────────────────────────────────────────────────────────
function wrapper({ children }) {
  return <AppProvider>{children}</AppProvider>
}

function useApp() {
  return useAppContext()
}

// ── Provider mounts without error ───────────────────────────────────────────
describe('AppProvider', () => {
  it('renders children', () => {
    render(
      <AppProvider>
        <span>hello</span>
      </AppProvider>
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('throws when useAppContext is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      renderHook(() => useAppContext())
    }).toThrow('useAppContext must be used within AppProvider')
    spy.mockRestore()
  })
})

// ── Initial state ────────────────────────────────────────────────────────────
describe('initial state', () => {
  it('has correct default values', () => {
    const { result } = renderHook(useApp, { wrapper })
    const { state } = result.current
    expect(state.currentPage).toBe('home')
    expect(state.chatOpen).toBe(false)
    expect(state.chatContext).toBeNull()
    expect(state.quizState.started).toBe(false)
    expect(state.quizState.completed).toBe(false)
    expect(state.quizState.score).toBe(0)
    expect(state.progress.quizzesCompleted).toBe(0)
  })
})

// ── SET_PAGE ─────────────────────────────────────────────────────────────────
describe('SET_PAGE', () => {
  it('updates currentPage', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'SET_PAGE', payload: 'quiz' }))
    expect(result.current.state.currentPage).toBe('quiz')
  })
})

// ── START_QUIZ ───────────────────────────────────────────────────────────────
describe('START_QUIZ', () => {
  it('sets started to true and resets quiz state', () => {
    const { result } = renderHook(useApp, { wrapper })
    // complete a quiz first so we have non-default state to reset
    act(() => result.current.dispatch({ type: 'COMPLETE_QUIZ', payload: { score: 80 } }))
    act(() => result.current.dispatch({ type: 'START_QUIZ' }))
    const { quizState } = result.current.state
    expect(quizState.started).toBe(true)
    expect(quizState.completed).toBe(false)
    expect(quizState.currentIndex).toBe(0)
    expect(quizState.score).toBe(0)
  })
})

// ── ANSWER_QUESTION ──────────────────────────────────────────────────────────
describe('ANSWER_QUESTION', () => {
  it('stores answer at given index', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() =>
      result.current.dispatch({ type: 'ANSWER_QUESTION', payload: { index: 2, answer: 1 } })
    )
    expect(result.current.state.quizState.answers[2]).toBe(1)
  })

  it('stores multiple answers independently', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => {
      result.current.dispatch({ type: 'ANSWER_QUESTION', payload: { index: 0, answer: 2 } })
      result.current.dispatch({ type: 'ANSWER_QUESTION', payload: { index: 1, answer: 3 } })
    })
    expect(result.current.state.quizState.answers[0]).toBe(2)
    expect(result.current.state.quizState.answers[1]).toBe(3)
  })
})

// ── NEXT_QUESTION ────────────────────────────────────────────────────────────
describe('NEXT_QUESTION', () => {
  it('increments currentIndex', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'NEXT_QUESTION' }))
    expect(result.current.state.quizState.currentIndex).toBe(1)
    act(() => result.current.dispatch({ type: 'NEXT_QUESTION' }))
    expect(result.current.state.quizState.currentIndex).toBe(2)
  })
})

// ── COMPLETE_QUIZ ────────────────────────────────────────────────────────────
describe('COMPLETE_QUIZ', () => {
  it('marks completed and records score', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() =>
      result.current.dispatch({ type: 'COMPLETE_QUIZ', payload: { score: 75 } })
    )
    expect(result.current.state.quizState.completed).toBe(true)
    expect(result.current.state.quizState.score).toBe(75)
  })

  it('increments quizzesCompleted and accumulates totalScore', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'COMPLETE_QUIZ', payload: { score: 60 } }))
    act(() => result.current.dispatch({ type: 'COMPLETE_QUIZ', payload: { score: 80 } }))
    expect(result.current.state.progress.quizzesCompleted).toBe(2)
    expect(result.current.state.progress.totalScore).toBe(140)
  })
})

// ── RESET_QUIZ ───────────────────────────────────────────────────────────────
describe('RESET_QUIZ', () => {
  it('restores quizState to initial values', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'COMPLETE_QUIZ', payload: { score: 90 } }))
    act(() => result.current.dispatch({ type: 'RESET_QUIZ' }))
    const { quizState } = result.current.state
    expect(quizState.started).toBe(false)
    expect(quizState.completed).toBe(false)
    expect(quizState.score).toBe(0)
    expect(quizState.currentIndex).toBe(0)
  })
})

// ── MARK_TIMELINE_VIEWED ─────────────────────────────────────────────────────
describe('MARK_TIMELINE_VIEWED', () => {
  it('adds a stage id to timelineViewed', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'MARK_TIMELINE_VIEWED', payload: 'stage-1' }))
    expect(result.current.state.progress.timelineViewed).toContain('stage-1')
  })

  it('deduplicates repeated ids', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => {
      result.current.dispatch({ type: 'MARK_TIMELINE_VIEWED', payload: 'stage-1' })
      result.current.dispatch({ type: 'MARK_TIMELINE_VIEWED', payload: 'stage-1' })
    })
    expect(result.current.state.progress.timelineViewed.filter(s => s === 'stage-1')).toHaveLength(1)
  })
})

// ── MARK_GLOSSARY_VIEWED ─────────────────────────────────────────────────────
describe('MARK_GLOSSARY_VIEWED', () => {
  it('adds a term id to glossaryViewed', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'MARK_GLOSSARY_VIEWED', payload: 'eci' }))
    expect(result.current.state.progress.glossaryViewed).toContain('eci')
  })

  it('deduplicates repeated ids', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => {
      result.current.dispatch({ type: 'MARK_GLOSSARY_VIEWED', payload: 'evm' })
      result.current.dispatch({ type: 'MARK_GLOSSARY_VIEWED', payload: 'evm' })
    })
    expect(result.current.state.progress.glossaryViewed.filter(s => s === 'evm')).toHaveLength(1)
  })
})

// ── TOGGLE_CHAT ──────────────────────────────────────────────────────────────
describe('TOGGLE_CHAT', () => {
  it('toggles chatOpen when no payload', () => {
    const { result } = renderHook(useApp, { wrapper })
    expect(result.current.state.chatOpen).toBe(false)
    act(() => result.current.dispatch({ type: 'TOGGLE_CHAT' }))
    expect(result.current.state.chatOpen).toBe(true)
    act(() => result.current.dispatch({ type: 'TOGGLE_CHAT' }))
    expect(result.current.state.chatOpen).toBe(false)
  })

  it('sets chatOpen to explicit true via payload', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'TOGGLE_CHAT', payload: true }))
    expect(result.current.state.chatOpen).toBe(true)
  })

  it('sets chatOpen to explicit false via payload', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'TOGGLE_CHAT', payload: true }))
    act(() => result.current.dispatch({ type: 'TOGGLE_CHAT', payload: false }))
    expect(result.current.state.chatOpen).toBe(false)
  })
})

// ── SET_CHAT_CONTEXT ─────────────────────────────────────────────────────────
describe('SET_CHAT_CONTEXT', () => {
  it('stores chat context payload', () => {
    const { result } = renderHook(useApp, { wrapper })
    const ctx = { stageName: 'Voting Day' }
    act(() => result.current.dispatch({ type: 'SET_CHAT_CONTEXT', payload: ctx }))
    expect(result.current.state.chatContext).toEqual(ctx)
  })

  it('allows clearing context by dispatching null', () => {
    const { result } = renderHook(useApp, { wrapper })
    act(() => result.current.dispatch({ type: 'SET_CHAT_CONTEXT', payload: { stageName: 'X' } }))
    act(() => result.current.dispatch({ type: 'SET_CHAT_CONTEXT', payload: null }))
    expect(result.current.state.chatContext).toBeNull()
  })
})

// ── SET_SUGGESTED_QUESTIONS ──────────────────────────────────────────────────
describe('SET_SUGGESTED_QUESTIONS', () => {
  it('replaces suggested questions', () => {
    const { result } = renderHook(useApp, { wrapper })
    const questions = ['Q1?', 'Q2?']
    act(() =>
      result.current.dispatch({ type: 'SET_SUGGESTED_QUESTIONS', payload: questions })
    )
    expect(result.current.state.suggestedQuestions).toEqual(questions)
  })
})

// ── Unknown action ───────────────────────────────────────────────────────────
describe('default case', () => {
  it('returns state unchanged for unknown action type', () => {
    const { result } = renderHook(useApp, { wrapper })
    const before = result.current.state
    act(() => result.current.dispatch({ type: '__UNKNOWN__' }))
    expect(result.current.state).toStrictEqual(before)
  })
})
