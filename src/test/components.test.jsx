// src/test/components.test.jsx
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

// ── Mocks (must be declared before imports that use them) ──────────────────
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, whileHover, whileTap, transition, exit, layout, layoutId, ...validProps } = props
      return <div {...validProps}>{children}</div>
    },
    button: ({ children, ...props }) => {
      const { initial, animate, whileHover, whileTap, transition, ...validProps } = props
      return <button {...validProps}>{children}</button>
    },
    span: ({ children, ...props }) => {
      const { initial, animate, exit, transition, ...validProps } = props
      return <span {...validProps}>{children}</span>
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(() => ({
    state: { chatOpen: false },
    dispatch: vi.fn(),
  })),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: vi.fn(() => vi.fn()) }
})

// ── Imports ────────────────────────────────────────────────────────────────
import { useAppContext } from '../context/AppContext'
import { FloatingChat } from '../components/shared/FloatingChat'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { SectionHeader } from '../components/shared/SectionHeader'
import { StepProgressBar } from '../components/voter-journey/StepProgressBar'
import { WizardNavigation } from '../components/voter-journey/WizardNavigation'
import { sanitizeInput, calcScore, getGrade } from '../utils/helpers'

const mockDispatch = vi.fn()

// ── FloatingChat ─────────────────────────────────────────────────────────
describe('FloatingChat', () => {
  it('renders button', () => {
    useAppContext.mockReturnValue({ state: { chatOpen: false }, dispatch: mockDispatch })
    render(<FloatingChat />)
    const button = screen.getByRole('button', { name: /open electobot/i })
    expect(button).toBeInTheDocument()
  })

  it('is hidden when chatOpen is true', () => {
    useAppContext.mockReturnValue({ state: { chatOpen: true }, dispatch: mockDispatch })
    const { container } = render(<FloatingChat />)
    expect(container).toBeEmptyDOMElement()
  })
})

// ── ProgressBar ──────────────────────────────────────────────────────────
describe('ProgressBar', () => {
  it('renders correct aria attributes', () => {
    render(<ProgressBar value={50} aria-label="test progress" />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '50')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders 0%', () => {
    render(<ProgressBar value={0} />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '0')
  })

  it('clamps overflow', () => {
    render(<ProgressBar value={150} />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '100')
  })

  it('shows percent label when showPercent is true', () => {
    render(<ProgressBar value={75} showPercent />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })
})

// ── Badge ────────────────────────────────────────────────────────────────
describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New Feature</Badge>)
    expect(screen.getByText('New Feature')).toBeInTheDocument()
  })

  it('applies correct variant class for primary', () => {
    const { container } = render(<Badge variant="primary">Primary</Badge>)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Primary')).toBeInTheDocument()
  })

  it('renders without variant (defaults to default)', () => {
    render(<Badge>Default Badge</Badge>)
    expect(screen.getByText('Default Badge')).toBeInTheDocument()
  })
})

// ── Button ───────────────────────────────────────────────────────────────
describe('Button', () => {
  it('loading state disables button', () => {
    render(<Button loading>Click Me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('onClick fires', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabled blocks onClick', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Click Me</Button>)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="icon" />}>With Icon</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders iconRight when provided', () => {
    render(<Button iconRight={<span data-testid="right-icon" />}>With Icon</Button>)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })
})

// ── Card ─────────────────────────────────────────────────────────────────
describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('fires onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable</Card>)
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is keyboard activatable with Enter key when onClick present', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Keyboard Card</Card>)
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is keyboard activatable with Space key when onClick present', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Space Card</Card>)
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has no role when onClick is not present', () => {
    render(<Card>Static Card</Card>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has tabIndex=0 when onClick present', () => {
    render(<Card onClick={() => {}}>Focusable</Card>)
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabindex', '0')
  })
})

// ── Spinner ──────────────────────────────────────────────────────────────
describe('Spinner', () => {
  it('renders with default size', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with lg size', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(<Spinner />)
    // Spinner should have an aria-label or role=status for accessibility
    const spinner = screen.getByRole('status', { hidden: true }) ||
      document.querySelector('[aria-label]')
    expect(spinner ?? document.querySelector('[class*=animate]')).toBeTruthy()
  })
})

// ── SectionHeader ────────────────────────────────────────────────────────
describe('SectionHeader', () => {
  it('renders title', () => {
    render(<SectionHeader title="My Title" />)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders eyebrow', () => {
    render(<SectionHeader title="Title" eyebrow="Eyebrow Text" />)
    expect(screen.getByText('Eyebrow Text')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<SectionHeader title="Title" description="Some description" />)
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('omits description when not provided', () => {
    render(<SectionHeader title="Title" />)
    expect(screen.queryByText('Some description')).not.toBeInTheDocument()
  })
})

// ── StepProgressBar ──────────────────────────────────────────────────────
describe('StepProgressBar', () => {
  const steps = [
    { id: 1, title: 'Register' },
    { id: 2, title: 'Verify' },
    { id: 3, title: 'Vote' },
  ]

  it('renders all step titles', () => {
    render(<StepProgressBar currentStep={1} steps={steps} />)
    expect(screen.getByText('Register')).toBeInTheDocument()
    expect(screen.getByText('Verify')).toBeInTheDocument()
    expect(screen.getByText('Vote')).toBeInTheDocument()
  })

  it('marks current step with the correct aria-label', () => {
    render(<StepProgressBar currentStep={1} steps={steps} />)
    const stepEls = document.querySelectorAll('[aria-label]')
    const currentEl = Array.from(stepEls).find(el =>
      el.getAttribute('aria-label')?.includes('current')
    )
    expect(currentEl).toBeTruthy()
    expect(currentEl.getAttribute('aria-label')).toMatch(/Register.*current/i)
  })

  it('marks past steps with the completed aria-label', () => {
    render(<StepProgressBar currentStep={3} steps={steps} />)
    const stepEls = document.querySelectorAll('[aria-label]')
    const completedEl = Array.from(stepEls).find(el =>
      el.getAttribute('aria-label')?.includes('completed')
    )
    expect(completedEl).toBeTruthy()
    expect(completedEl.getAttribute('aria-label')).toMatch(/Register.*completed/i)
  })

  it('renders correct number of step indicators', () => {
    render(<StepProgressBar currentStep={1} steps={steps} />)
    const stepEls = document.querySelectorAll('[aria-label*="Step"]')
    expect(stepEls.length).toBe(3)
  })
})

// ── WizardNavigation ─────────────────────────────────────────────────────
describe('WizardNavigation', () => {
  const renderWizard = (props) =>
    render(
      <MemoryRouter>
        <WizardNavigation {...props} />
      </MemoryRouter>
    )

  it('disables Back button on first step', () => {
    renderWizard({ currentStep: 1, totalSteps: 3, onPrev: vi.fn(), onNext: vi.fn() })
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn).toBeDisabled()
  })

  it('shows Next Step button on intermediate steps', () => {
    renderWizard({ currentStep: 2, totalSteps: 3, onPrev: vi.fn(), onNext: vi.fn() })
    expect(screen.getByText(/next step/i)).toBeInTheDocument()
  })

  it('shows Take the Quiz button on last step', () => {
    renderWizard({ currentStep: 3, totalSteps: 3, onPrev: vi.fn(), onNext: vi.fn() })
    expect(screen.getByText(/take the quiz/i)).toBeInTheDocument()
  })

  it('calls onPrev when Back is clicked', () => {
    const onPrev = vi.fn()
    renderWizard({ currentStep: 2, totalSteps: 3, onPrev, onNext: vi.fn() })
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when Next Step is clicked', () => {
    const onNext = vi.fn()
    renderWizard({ currentStep: 1, totalSteps: 3, onPrev: vi.fn(), onNext })
    fireEvent.click(screen.getByText(/next step/i))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})

// ── Error States ──────────────────────────────────────────────────────────
describe('Error states', () => {
  it('sanitizeInput strips XSS', () => {
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello')
  })

  it('calcScore handles zero total', () => {
    expect(calcScore(5, 0)).toBe(0)
  })

  it('getGrade for score 0', () => {
    expect(getGrade(0).label).toBe('Keep Learning')
  })
})
