import { expect, describe, it, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Timeline from '../pages/Timeline'
import VoterJourney from '../pages/VoterJourney'
import Quiz from '../pages/Quiz'
import Glossary from '../pages/Glossary'

// Mock matchMedia to prevent Jest-axe errors
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

expect.extend(toHaveNoViolations)

describe('Accessibility Standards (WCAG)', () => {
  const renderWithProviders = (ui) => render(
    <MemoryRouter>
      <AuthProvider>
        <AppProvider>
          {ui}
        </AppProvider>
      </AuthProvider>
    </MemoryRouter>
  )

  it('Home page should have no accessibility violations', async () => {
    let container;
    await act(async () => { container = renderWithProviders(<Home />).container })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Dashboard page should have no accessibility violations', async () => {
    let container;
    await act(async () => { container = renderWithProviders(<Dashboard />).container })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Timeline page should have no accessibility violations', async () => {
    let container;
    await act(async () => { container = renderWithProviders(<Timeline />).container })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('VoterJourney page should have no accessibility violations', async () => {
    let container;
    await act(async () => { container = renderWithProviders(<VoterJourney />).container })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Quiz page should have no accessibility violations', async () => {
    let container;
    await act(async () => { container = renderWithProviders(<Quiz />).container })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Glossary page should have no accessibility violations', async () => {
    let container;
    await act(async () => { container = renderWithProviders(<Glossary />).container })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
