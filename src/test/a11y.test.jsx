import { expect, describe, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import Home from '../pages/Home'

expect.extend(toHaveNoViolations)

describe('Accessibility Standards (WCAG)', () => {
  it('Home page should have no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <Home />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
