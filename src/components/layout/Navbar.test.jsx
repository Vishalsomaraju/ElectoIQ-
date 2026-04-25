import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useAuthContext } from '../../context/AuthContext'

// Mock the AuthContext hook
vi.mock('../../context/AuthContext', () => ({
  useAuthContext: vi.fn(),
}))

describe('Navbar Component', () => {
  const mockSignInWithGoogle = vi.fn()
  const mockLogout = vi.fn()

  const defaultAuthContext = {
    user: null,
    loading: false,
    signInWithGoogle: mockSignInWithGoogle,
    logout: mockLogout,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthContext.mockReturnValue(defaultAuthContext)
  })

  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    // Check logo
    expect(screen.getByLabelText(/ElectoIQ home/i)).toBeInTheDocument()
    
    // Check navigation links
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.getByText('Quiz')).toBeInTheDocument()
    expect(screen.getByText('Glossary')).toBeInTheDocument()
  })

  it('renders login button when unauthenticated', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    
    const signInButtons = screen.getAllByRole('button', { name: /Sign in with Google/i })
    expect(signInButtons.length).toBeGreaterThan(0)
  })

  it('calls signInWithGoogle when login button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    
    // Get the desktop sign in button (usually the first one if mobile is hidden via CSS, but userEvent interacts with all in test DOM)
    const signInButton = screen.getAllByRole('button', { name: /Sign in with Google/i })[0]
    await user.click(signInButton)
    
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('renders user avatar and logout when authenticated', () => {
    useAuthContext.mockReturnValue({
      ...defaultAuthContext,
      user: { displayName: 'John Doe', photoURL: 'http://example.com/photo.jpg', isAnonymous: false },
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    const logoutButtons = screen.getAllByRole('button', { name: /Sign out/i })
    expect(logoutButtons.length).toBeGreaterThan(0)
  })

  it('calls logout when sign out button is clicked', async () => {
    const user = userEvent.setup()
    useAuthContext.mockReturnValue({
      ...defaultAuthContext,
      user: { displayName: 'John Doe', isAnonymous: false },
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    
    const logoutButton = screen.getAllByRole('button', { name: /Sign out/i })[0]
    await user.click(logoutButton)
    
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('toggles dark mode when moon/sun button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    
    const themeToggle = screen.getAllByRole('button', { name: /Switch to (light|dark) mode/i })[0]
    await user.click(themeToggle)
    
    // Check if the html element gets the dark class
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
