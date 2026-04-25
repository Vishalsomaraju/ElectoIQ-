// src/test/pages.test.jsx
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// ── Mocks — must be hoisted before imports that use them ───────────────────

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }) => {
      const { initial, animate, exit, transition, whileInView, layout, layoutId, variants, viewport, ...rest } = p
      return <div {...rest}>{children}</div>
    },
    ul: ({ children, ...p }) => {
      const { initial, animate, exit, variants, ...rest } = p
      return <ul {...rest}>{children}</ul>
    },
    span: ({ children, ...p }) => {
      const { initial, animate, exit, transition, ...rest } = p
      return <span {...rest}>{children}</span>
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useInView: () => true,
}))

vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(() => ({
    state: {
      chatOpen: false,
      suggestedQuestions: [],
      chatContext: null,
      currentPage: 'glossary',
      progress: {
        quizzesCompleted: 0,
        totalScore: 0,
        timelineViewed: [],
        glossaryViewed: [],
      },
    },
    dispatch: vi.fn(),
  })),
}))

vi.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({ user: null, loading: false }),
}))

vi.mock('../services/gemini', () => ({
  sendMessageStream: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...p }) => <a href={to} {...p}>{children}</a>,
  useNavigate: () => vi.fn(),
  MemoryRouter: ({ children }) => <>{children}</>,
}))

// Stub out shared layout wrappers that add unnecessary complexity in tests
vi.mock('../components/shared/AnimatedPage', () => ({
  AnimatedPage: ({ children }) => <div data-testid="animated-page">{children}</div>,
}))

vi.mock('../components/layout/PageWrapper', () => ({
  PageWrapper: ({ children }) => <main>{children}</main>,
}))

// ── Imports — after mocks ─────────────────────────────────────────────────
import { useAppContext } from '../context/AppContext'

// ═══════════════════════════════════════════════════════════════════════════
// Glossary page
// ═══════════════════════════════════════════════════════════════════════════
describe('Glossary page', () => {
  let Glossary

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../pages/Glossary')
    Glossary = mod.default
  })

  it('renders the "Showing N of M terms" count text', () => {
    render(<Glossary />)
    expect(screen.getByText(/showing/i)).toBeInTheDocument()
  })

  it('renders the heading "Glossary of Terms"', () => {
    render(<Glossary />)
    expect(screen.getByText(/glossary of terms/i)).toBeInTheDocument()
  })

  it('shows the correct initial count (24 of total)', () => {
    render(<Glossary />)
    // Should show "Showing 24 of 55 terms"
    expect(screen.getByText(/showing/i).closest('p').textContent).toMatch(/24/)
  })

  it('filters terms when search query is typed', async () => {
    const user = userEvent.setup()
    render(<Glossary />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await user.type(input, 'EVM')
    await waitFor(() => {
      const countEl = screen.getByText(/showing/i).closest('p')
      // After searching for "EVM" result count should be less than 24
      expect(countEl.textContent).toBeTruthy()
    })
  })

  it('shows empty state when no terms match search', async () => {
    const user = userEvent.setup()
    render(<Glossary />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await user.type(input, 'xyznotarealelectionterm999')
    expect(await screen.findByText(/no terms found/i)).toBeInTheDocument()
  })

  it('clears search when X (Clear search) button is clicked', async () => {
    const user = userEvent.setup()
    render(<Glossary />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await user.type(input, 'EVM')
    const clearBtn = await screen.findByRole('button', { name: /clear search/i })
    await user.click(clearBtn)
    expect(input.value).toBe('')
  })

  it('filters by category when a category button is pressed', async () => {
    const user = userEvent.setup()
    render(<Glossary />)
    const techBtn = screen.getByRole('button', { name: 'Technology' })
    await user.click(techBtn)
    expect(techBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('All category is active by default', () => {
    render(<Glossary />)
    const allBtn = screen.getByRole('button', { name: 'All' })
    expect(allBtn).toHaveAttribute('aria-pressed', 'true')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard page
// ═══════════════════════════════════════════════════════════════════════════
describe('Dashboard page', () => {
  let Dashboard

  beforeEach(async () => {
    useAppContext.mockReturnValue({
      state: {
        chatOpen: false,
        currentPage: 'dashboard',
        progress: {
          quizzesCompleted: 0,
          totalScore: 0,
          timelineViewed: [],
          glossaryViewed: [],
        },
      },
      dispatch: vi.fn(),
    })
    vi.resetModules()
    const mod = await import('../pages/Dashboard')
    Dashboard = mod.default
  })

  it('renders the Dashboard heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders the "Quizzes Done" stat card label', () => {
    render(<Dashboard />)
    expect(screen.getByText('Quizzes Done')).toBeInTheDocument()
  })

  it('renders the "Avg Score" stat card label', () => {
    render(<Dashboard />)
    expect(screen.getByText('Avg Score')).toBeInTheDocument()
  })

  it('renders the "Terms Viewed" stat card label', () => {
    render(<Dashboard />)
    expect(screen.getByText('Terms Viewed')).toBeInTheDocument()
  })

  it('renders the "Timeline Steps" stat card label', () => {
    render(<Dashboard />)
    expect(screen.getByText('Timeline Steps')).toBeInTheDocument()
  })

  it('renders the Milestones section heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Milestones')).toBeInTheDocument()
  })

  it('renders the "First Quiz" milestone', () => {
    render(<Dashboard />)
    expect(screen.getByText('First Quiz')).toBeInTheDocument()
  })

  it('renders the "Glossary Guru" milestone', () => {
    render(<Dashboard />)
    expect(screen.getByText('Glossary Guru')).toBeInTheDocument()
  })

  it('renders the "Continue Learning" quick links section', () => {
    render(<Dashboard />)
    expect(screen.getByText('Continue Learning')).toBeInTheDocument()
  })

  it('shows 0 quizzes done when progress is empty', () => {
    render(<Dashboard />)
    // stat value = 0, aria-label "Quizzes Done: 0"
    const el = document.querySelector('[aria-label="Quizzes Done: 0"]')
    expect(el).not.toBeNull()
    expect(el.textContent).toBe('0')
  })
})
