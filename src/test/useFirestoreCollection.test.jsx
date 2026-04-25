import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockCollection = vi.fn(() => ({ type: 'collection' }))
const mockQuery = vi.fn(() => ({ type: 'query' }))
const mockOrderBy = vi.fn((field) => ({ type: 'orderBy', field }))
const mockLimit = vi.fn((count) => ({ type: 'limit', count }))
const mockOnSnapshot = vi.fn()

vi.mock('firebase/firestore', () => ({
  collection: (...args) => mockCollection(...args),
  query: (...args) => mockQuery(...args),
  orderBy: (...args) => mockOrderBy(...args),
  limit: (...args) => mockLimit(...args),
  onSnapshot: (...args) => mockOnSnapshot(...args),
  Timestamp: class MockTimestamp {
    constructor(value) {
      this.value = value
    }
    toDate() {
      return this.value
    }
  },
}))

vi.mock('../services/firebase', () => ({
  db: { type: 'firestore' },
}))

const { Timestamp: MockTimestamp } = await import('firebase/firestore')

describe('useFirestoreCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('subscribes with orderBy and limit, then returns snapshot data', async () => {
    const createdAt = new Date('2026-04-26T00:00:00.000Z')
    mockOnSnapshot.mockImplementation((_queryRef, onSuccess) => {
      onSuccess({
        docs: [
          {
            id: 'quiz-1',
            data: () => ({
              score: 92,
              createdAt: new MockTimestamp(createdAt),
            }),
          },
        ],
      })
      return vi.fn()
    })

    const { useFirestoreCollection } = await import('../hooks/useFirestoreCollection')
    const { result } = renderHook(() =>
      useFirestoreCollection('quizResults', { orderByField: 'createdAt', limitCount: 5 })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockOrderBy).toHaveBeenCalledWith('createdAt')
    expect(mockLimit).toHaveBeenCalledWith(5)
    expect(result.current.isConnected).toBe(true)
    expect(result.current.data).toEqual([
      { id: 'quiz-1', score: 92, createdAt },
    ])
  })

  it('surfaces subscription errors and marks the connection offline', async () => {
    mockOnSnapshot.mockImplementation((_queryRef, _onSuccess, onError) => {
      onError(new Error('permission-denied'))
      return vi.fn()
    })

    const { useFirestoreCollection } = await import('../hooks/useFirestoreCollection')
    const { result } = renderHook(() => useFirestoreCollection('quizResults'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isConnected).toBe(false)
    expect(result.current.error).toBe('permission-denied')
  })
})
