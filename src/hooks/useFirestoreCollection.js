// ─── Google Service: Cloud Firestore (Real-time) ──────────────────────
// Purpose: Real-time collection subscriptions via onSnapshot listeners
// SDK: firebase/firestore ^4.x
// Docs: https://firebase.google.com/docs/firestore/query-data/listen
import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, orderBy, limit,
  onSnapshot, where, Timestamp,
} from 'firebase/firestore'
import { db } from '../services/firebase'

/**
 * Real-time Firestore collection subscription using onSnapshot.
 * Automatically unsubscribes on component unmount.
 * @param {string} collectionName - Firestore collection to subscribe to
 * @param {Object} [options] - Query options
 * @param {number} [options.limitCount=50] - Max documents to fetch
 * @param {string} [options.orderByField] - Field to order results by
 * @param {Array} [options.filters] - Array of [field, op, value] filter tuples
 * @returns {{ data: Array, loading: boolean, error: string|null, isConnected: boolean }}
 */
export function useFirestoreCollection(collectionName, options = {}) {
  const { limitCount = 50, orderByField = null, filters = [] } = options
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      setError('Firebase not configured')
      return
    }

    const constraints = []
    filters.forEach(([field, op, value]) => {
      constraints.push(where(field, op, value))
    })
    if (orderByField) constraints.push(orderBy(orderByField))
    constraints.push(limit(limitCount))

    const q = query(collection(db, collectionName), ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const docData = doc.data()
          const converted = { id: doc.id }
          for (const [key, value] of Object.entries(docData)) {
            converted[key] = value instanceof Timestamp ? value.toDate() : value
          }
          return converted
        })
        setData(docs)
        setLoading(false)
        setIsConnected(true)
        setError(null)
      },
      (err) => {
        console.warn(`[useFirestoreCollection] ${collectionName} error:`, err)
        setError(err.message)
        setLoading(false)
        setIsConnected(false)
      }
    )

    return () => {
      try { unsubscribe() } catch (err) {
        console.warn('[useFirestoreCollection] Unsubscribe error:', err)
      }
    }
  }, [collectionName, limitCount, orderByField])

  return { data, loading, error, isConnected }
}
