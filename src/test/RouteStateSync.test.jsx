import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockDispatch = vi.fn()

vi.mock('../context/AppContext', () => ({
  useAppContext: () => ({ dispatch: mockDispatch }),
}))

describe('RouteStateSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('syncs page name and suggested questions from the route', async () => {
    const { RouteStateSync } = await import('../components/shared/RouteStateSync')
    const { SUGGESTED_QUESTIONS } = await import('../constants')

    render(
      <MemoryRouter initialEntries={['/quiz']}>
        <RouteStateSync />
      </MemoryRouter>
    )

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PAGE', payload: 'quiz' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SUGGESTED_QUESTIONS',
      payload: SUGGESTED_QUESTIONS.QUIZ,
    })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_CHAT_CONTEXT', payload: null })
  })
})
