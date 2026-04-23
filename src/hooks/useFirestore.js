// src/hooks/useFirestore.js
import { useState, useCallback } from 'react'
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../services/firebase'

export function useFirestore(collectionName) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getDocument = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const ref = doc(db, collectionName, id)
      const snap = await getDoc(ref)
      return snap.exists() ? { id: snap.id, ...snap.data() } : null
    } catch (err) {
      console.error(`Error in getDocument (${collectionName}):`, err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const setDocument = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const ref = doc(db, collectionName, id)
      await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
      return true
    } catch (err) {
      console.error(`Error in setDocument (${collectionName}):`, err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const addDocument = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const ref = collection(db, collectionName)
      const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() })
      return docRef.id
    } catch (err) {
      console.error(`Error in addDocument (${collectionName}):`, err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const updateDocument = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const ref = doc(db, collectionName, id)
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
      return true
    } catch (err) {
      console.error(`Error in updateDocument (${collectionName}):`, err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const deleteDocument = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteDoc(doc(db, collectionName, id))
      return true
    } catch (err) {
      console.error(`Error in deleteDocument (${collectionName}):`, err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const getCollection = useCallback(async (conditions = [], sortBy = null) => {
    setLoading(true)
    setError(null)
    try {
      let q = collection(db, collectionName)
      const constraints = conditions.map(([field, op, val]) => where(field, op, val))
      if (sortBy) constraints.push(orderBy(sortBy))
      q = query(q, ...constraints)
      const snap = await getDocs(q)
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    } catch (err) {
      console.error(`Error in getCollection (${collectionName}):`, err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  return { loading, error, getDocument, setDocument, addDocument, updateDocument, deleteDocument, getCollection }
}
