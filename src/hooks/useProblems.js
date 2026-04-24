import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  collection, addDoc, deleteDoc,
  doc, query, orderBy, limit,
  onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import {dateString} from "../utils/streakUtils";

export const TOPICS = [
  'Arrays', 'Strings', 'Trees', 'Graphs', 'DP',
  'Linked Lists', 'Stack/Queue', 'Binary Search', 'Recursion',
]

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const TARGET_PER_TOPIC = 30

export function useProblems() {
  const { user } = useAuth()
  const [problems, setProblems] = useState([])
  const [problemsloading, setProblemsLoading]   = useState(true)

  useEffect(() => {
    if (!user) return

    const ref = collection(db, 'users', user.uid, 'problems')
    const q   = query(ref, orderBy('solvedAt', 'desc'), limit(50))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProblems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setProblemsLoading(false)
    })

    return unsubscribe
  }, [user])

  const addProblem = useCallback(async ({ name, topic, difficulty }) => {
    if (!user) return
    await addDoc(collection(db, 'users', user.uid, 'problems'), {
      name:       name.trim(),
      topic,
      difficulty,
      date:    dateString(0),
      solvedAt:   serverTimestamp(),
    })
  }, [user])

  const deleteProblem = useCallback(async (id) => {
    await deleteDoc(doc(db, 'users', user.uid, 'problems', id))
  }, [user])

  // Only recomputes when problems array changes
  const topicStats = useMemo(() =>
    TOPICS.map(topic => {
      const count = problems.filter(p => p.topic === topic).length
      return {
        name:    topic,
        count,
        percent: Math.min(Math.round((count / TARGET_PER_TOPIC) * 100), 100),
      }
    }),
  [problems])

  const todayCount = problems.filter(p => p.date === dateString(0)).length

  return {
    problems,
    problemsloading,
    addProblem,
    deleteProblem,
    topicStats,
    totalSolved: problems.length,
    todayCount,
  }
}