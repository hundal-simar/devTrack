import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

// Returns today's date as YYYY-MM-DD string
const getTodayString = () => new Date().toISOString().split('T')[0]

export default function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals]     = useState([])
  const [goalsloading, setGoalsLoading] = useState(true)

  // Real-time listener — updates goals instantly when Firestore changes
  useEffect(() => {
    if (!user) return

    const goalsRef = collection(db, 'users', user.uid, 'goals')
    const q = query(
      goalsRef,
      where('date', '==', getTodayString()),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setGoals(data)
      setGoalsLoading(false)
    })

    return unsubscribe // cleanup listener on unmount
  }, [user])

  const addGoal = useCallback(async (text) => {
  if (!user || !text.trim()) return
  await addDoc(collection(db, 'users', user.uid, 'goals'), {
    text: text.trim(),
    done: false,
    date: getTodayString(),
    createdAt: serverTimestamp(),
  })
}, [user])

const toggleGoal = useCallback(async (goalId, currentDone) => {
  const goalRef = doc(db, 'users', user.uid, 'goals', goalId)
  await updateDoc(goalRef, { done: !currentDone })
}, [user])

const deleteGoal = useCallback(async (goalId) => {
  await deleteDoc(doc(db, 'users', user.uid, 'goals', goalId))
}, [user])

  // Derived values — computed from goals array
  const totalGoals     = goals.length
  const completedGoals = goals.filter((g) => g.done).length
  const progressPercent = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100)

  return {
    goals,
    goalsloading,
    addGoal,
    toggleGoal,
    deleteGoal,
    totalGoals,
    completedGoals,
    progressPercent,
  }
}