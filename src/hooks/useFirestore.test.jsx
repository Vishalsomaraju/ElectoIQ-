// src/hooks/useFirestore.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'

// ── Mocks ─────────────────────────────────────────────────────────────────
const mockDocRef = { id: 'doc123', path: 'users/doc123' }
const mockColRef = { id: 'users' }

const mockGetDoc = vi.fn()
const mockSetDoc = vi.fn()
const mockAddDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockGetDocs = vi.fn()
const mockDoc = vi.fn(() => mockDocRef)
const mockCollection = vi.fn(() => mockColRef)
const mockQuery = vi.fn((colRef) => colRef)
const mockWhere = vi.fn()
const mockOrderBy = vi.fn()
const mockLimit = vi.fn()

vi.mock('firebase/firestore', () => ({
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
  addDoc: (...args) => mockAddDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  doc: (...args) => mockDoc(...args),
  collection: (...args) => mockCollection(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  orderBy: (...args) => mockOrderBy(...args),
  limit: (...args) => mockLimit(...args),
  serverTimestamp: () => ({ _seconds: 0 }),
}))

vi.mock('../services/firebase', () => ({
  db: { type: 'firestore' },
  // auth.currentUser required by setDoc/addDoc/updateDoc/deleteDoc
  auth: { currentUser: { uid: 'test-user-123' } },
}))

// Import after mocks
import { useFirestore } from './useFirestore'

// ── Tests ─────────────────────────────────────────────────────────────────
describe('useFirestore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDocument', () => {
    it('returns document data when document exists', async () => {
      const mockData = { name: 'Voter', age: 25 }
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockData,
        id: 'doc123',
      })

      const { result } = renderHook(() => useFirestore('users'))

      let data
      await act(async () => {
        data = await result.current.getDocument('doc123')
      })

      expect(data).toEqual({ ...mockData, id: 'doc123' })
      expect(mockGetDoc).toHaveBeenCalledTimes(1)
    })

    it('returns null when document does not exist', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
      })

      const { result } = renderHook(() => useFirestore('users'))

      let data
      await act(async () => {
        data = await result.current.getDocument('nonexistent')
      })

      expect(data).toBeNull()
    })

    it('handles network errors gracefully and sets error state', async () => {
      mockGetDoc.mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useFirestore('users'))

      let data
      await act(async () => {
        data = await result.current.getDocument('doc123')
      })

      expect(data).toBeNull()
      expect(result.current.error).toBe('Network error')
    })
  })

  describe('setDocument', () => {
    it('calls setDoc with the correct collection and document id', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useFirestore('quizResults'))
      const testData = { score: 90, quizId: 'q1' }

      let success
      await act(async () => {
        success = await result.current.setDocument('user1', testData)
      })

      expect(mockSetDoc).toHaveBeenCalledTimes(1)
      expect(mockDoc).toHaveBeenCalledWith({ type: 'firestore' }, 'quizResults', 'user1')
      expect(success).toBe(true)
    })

    it('returns false and sets error state on failure', async () => {
      mockSetDoc.mockRejectedValueOnce(new Error('Permission denied'))
      const { result } = renderHook(() => useFirestore('quizResults'))

      let success
      await act(async () => {
        success = await result.current.setDocument('user1', { score: 50 })
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Permission denied')
    })
  })

  describe('addDocument', () => {
    it('returns the new document id', async () => {
      mockAddDoc.mockResolvedValueOnce(mockDocRef)
      const { result } = renderHook(() => useFirestore('results'))
      const newData = { message: 'New quiz result' }

      let docId
      await act(async () => {
        docId = await result.current.addDocument(newData)
      })

      expect(docId).toBe('doc123')
      expect(mockAddDoc).toHaveBeenCalledTimes(1)
    })

    it('returns null on error', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('Write failed'))
      const { result } = renderHook(() => useFirestore('results'))

      let docId
      await act(async () => {
        docId = await result.current.addDocument({})
      })

      expect(docId).toBeNull()
      expect(result.current.error).toBe('Write failed')
    })
  })

  describe('updateDocument', () => {
    it('calls updateDoc and returns true on success', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useFirestore('users'))

      let success
      await act(async () => {
        success = await result.current.updateDocument('user1', { displayName: 'Updated Name' })
      })

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1)
      expect(success).toBe(true)
    })

    it('returns false and sets error on failure', async () => {
      mockUpdateDoc.mockRejectedValueOnce(new Error('Update failed'))
      const { result } = renderHook(() => useFirestore('users'))

      let success
      await act(async () => {
        success = await result.current.updateDocument('user1', { displayName: 'Name' })
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Update failed')
    })
  })

  describe('deleteDocument', () => {
    it('calls deleteDoc and returns true on success', async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useFirestore('users'))

      let success
      await act(async () => {
        success = await result.current.deleteDocument('user1')
      })

      expect(mockDeleteDoc).toHaveBeenCalledTimes(1)
      expect(success).toBe(true)
    })

    it('returns false and sets error on failure', async () => {
      mockDeleteDoc.mockRejectedValueOnce(new Error('Delete failed'))
      const { result } = renderHook(() => useFirestore('users'))

      let success
      await act(async () => {
        success = await result.current.deleteDocument('user1')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Delete failed')
    })
  })

  describe('getCollection', () => {
    it('returns array of documents with merged ids', async () => {
      const mockDocs = [
        { id: 'a1', data: () => ({ term: 'Election' }) },
        { id: 'a2', data: () => ({ term: 'Ballot' }) },
      ]
      mockGetDocs.mockResolvedValueOnce({ docs: mockDocs })

      const { result } = renderHook(() => useFirestore('glossary'))

      let docs
      await act(async () => {
        docs = await result.current.getCollection()
      })

      expect(docs).toHaveLength(2)
      expect(docs[0]).toMatchObject({ id: 'a1', term: 'Election' })
      expect(docs[1]).toMatchObject({ id: 'a2', term: 'Ballot' })
    })

    it('returns empty array when collection is empty', async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [] })

      const { result } = renderHook(() => useFirestore('empty'))

      let docs
      await act(async () => {
        docs = await result.current.getCollection()
      })

      expect(docs).toEqual([])
    })

    it('returns empty array and sets error on network failure', async () => {
      mockGetDocs.mockRejectedValueOnce(new Error('Connection failed'))

      const { result } = renderHook(() => useFirestore('data'))

      let docs
      await act(async () => {
        docs = await result.current.getCollection()
      })

      expect(docs).toEqual([])
      expect(result.current.error).toBe('Connection failed')
    })
  })

  describe('state management', () => {
    it('loading is false initially', () => {
      const { result } = renderHook(() => useFirestore('test'))
      expect(result.current.loading).toBe(false)
    })

    it('error is null initially', () => {
      const { result } = renderHook(() => useFirestore('test'))
      expect(result.current.error).toBeNull()
    })
  })
})
