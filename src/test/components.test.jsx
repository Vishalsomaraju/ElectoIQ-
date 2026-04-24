import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useGemini } from '../hooks/useGemini'
import { calcScore, sanitizeInput } from '../utils/helpers'

vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(),
}))

vi.mock('../hooks/useGemini', () => ({
  useGemini: vi.fn(),
}))

vi.mock('framer-motion', () => {
  const motion = new Proxy({}, {
    get: (_, tag) => ({ children, ...props }) => React.createElement(tag, props, children),
  })

  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useInView: () => true,
  }
})

describe('component accessibility and behavior', () => {
  const dispatch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAppContext.mockReturnValue({
      state: {
        currentPage: 'quiz',
        progress: {
          timelineViewed: [1, 2, 3],
          glossaryViewed: Array.from({ length: 11 }, (_, idx) => idx + 1),
          quizzesCompleted: 2,
          totalScore: 150,
        },
        chatOpen: false,
        chatContext: null,
        suggestedQuestions: [],
      },
      dispatch,
    })

    useGemini.mockReturnValue({
      messages: [],
      streaming: false,
      error: null,
      sendMessage: vi.fn(),
      clearChat: vi.fn(),
    })
  })

  it('renders the floating chat button with an accessible label', async () => {
    const { FloatingChat } = await import('../components/shared/FloatingChat')
    render(<FloatingChat />)

    expect(screen.getByRole('button', { name: /open electobot chat assistant/i })).toBeInTheDocument()
  })

  it('toggles the quiz assistant button label as the drawer opens', async () => {
    const user = userEvent.setup()
    const Quiz = (await import('../pages/Quiz')).default

    render(<Quiz />)

    const toggleButton = screen.getByRole('button', { name: /open ai assistant/i })
    await user.click(toggleButton)

    expect(screen.getByRole('button', { name: /close ai assistant/i })).toBeInTheDocument()
  })

  it('renders dashboard derived stats from progress state', async () => {
    const Dashboard = (await import('../pages/Dashboard')).default

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/overall civic progress: 31 percent/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/avg score: 75%/i)).toBeInTheDocument()
  })

  it('opens a timeline stage and dispatches chat context actions', async () => {
    const user = userEvent.setup()
    const Timeline = (await import('../pages/Timeline')).default

    render(<Timeline />)

    await user.click(screen.getAllByRole('button', { name: /details/i })[0])
    await user.click(screen.getByRole('button', { name: /ask electobot about this stage/i }))

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CHAT_CONTEXT',
      payload: { stageName: 'Election Commission Announcement' },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_CHAT',
      payload: true,
    })
  })
})

describe('helpers edge cases', () => {
  it('calcScore handles zero total without throwing', () => {
    expect(() => calcScore(5, 0)).not.toThrow()
    expect(calcScore(5, 0)).toBe(0)
  })

  it('sanitizeInput handles null without throwing', () => {
    expect(() => sanitizeInput(null)).not.toThrow()
    expect(sanitizeInput(null)).toBe('')
  })
})
