import { useState, useEffect, useMemo } from 'react'
import {
  collection, addDoc, query,
  orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const getTodayString = () => new Date().toISOString().split('T')[0]

const getWeekAgoString = () => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString().split('T')[0]
}

export function useSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!user) return

    const ref = collection(db, 'users', user.uid, 'sessions')
    const q   = query(ref, orderBy('startedAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const saveSession = async (seconds, startedAt) => {
    if (!user || seconds < 10) return // don't save sessions under 10 seconds
    await addDoc(collection(db, 'users', user.uid, 'sessions'), {
      duration:  seconds,
      startedAt: serverTimestamp(),
      date:      getTodayString(),
    })
  }

  const todayString   = getTodayString()
  const weekAgoString = getWeekAgoString()

  const todaySessions = useMemo(() =>
    sessions.filter(s => s.date === todayString)
  , [sessions, todayString])

  const todayTotal = useMemo(() =>
    todaySessions.reduce((sum, s) => sum + s.duration, 0)
  , [todaySessions])

  const weekTotal = useMemo(() =>
    sessions
      .filter(s => s.date >= weekAgoString)
      .reduce((sum, s) => sum + s.duration, 0)
  , [sessions, weekAgoString])

  const longestSession = useMemo(() =>
    sessions.length === 0 ? 0 : Math.max(...sessions.map(s => s.duration))
  , [sessions])

  return {
    sessions,
    todaySessions,
    loading,
    saveSession,
    todayTotal,
    weekTotal,
    longestSession,
  }
}