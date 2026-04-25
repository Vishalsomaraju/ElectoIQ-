// ─── Google Service: Cloud Firestore — Real-time subscriptions ────────
// Purpose: Live onSnapshot listeners for real-time data sync
// SDK: firebase/firestore ^12.x
// Docs: https://firebase.google.com/docs/firestore/query-data/listen
import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import { logger } from '../utils/logger'

/**
 * Real-time Firestore collection hook using onSnapshot.
 * Automatically unsubscribes on unmount.
 * @param {string} collectionName - Collection to subscribe to
 * @param {Object} [options] - { limitCount?: number, orderByField?: string }
 * @returns {{ data: Array, loading: boolean, error: string|null, isConnected: boolean }}
 */
export function useFirestoreCollection(collectionName, options = {}) {
  const { limitCount = 50, orderByField = null } = options
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
     
    if (!db) { setLoading(false); setError('Firebase not configured'); return }
    const constraints = []
    if (orderByField) constraints.push(orderBy(orderByField))
    constraints.push(limit(limitCount))
    const q = query(collection(db, collectionName), ...constraints)

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const raw = doc.data()
          const out = { id: doc.id }
          for (const [k, v] of Object.entries(raw)) {
            out[k] = v instanceof Timestamp ? v.toDate() : v
          }
          return out
        })
         
        setData(docs)
         
        setLoading(false)
         
        setIsConnected(true)
         
        setError(null)
      },
      (err) => {
        logger.warn(`[useFirestoreCollection] ${collectionName}:`, err)
         
        setError(err.message)
         
        setLoading(false)
         
        setIsConnected(false)
      }
    )
    return () => { try { unsubscribe() } catch (e) { logger.warn('[useFirestoreCollection] cleanup:', e) } }
  }, [collectionName, limitCount, orderByField])

  return { data, loading, error, isConnected }
}
