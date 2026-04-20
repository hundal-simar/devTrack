import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    })

    return unsubscribe // cleanup listener on unmount
  }, [user])

  const addGoal = async (text) => {
    if (!user || !text.trim()) return
    const goalsRef = collection(db, 'users', user.uid, 'goals')
    await addDoc(goalsRef, {
      text: text.trim(),
      done: false,
      date: getTodayString(),
      createdAt: serverTimestamp(),
    })
  }

  const toggleGoal = async (goalId, currentDone) => {
    const goalRef = doc(db, 'users', user.uid, 'goals', goalId)
    await updateDoc(goalRef, { done: !currentDone })
  }

  const deleteGoal = async (goalId) => {
    const goalRef = doc(db, 'users', user.uid, 'goals', goalId)
    await deleteDoc(goalRef)
  }

  // Derived values — computed from goals array
  const totalGoals     = goals.length
  const completedGoals = goals.filter((g) => g.done).length
  const progressPercent = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100)

  return {
    goals,
    loading,
    addGoal,
    toggleGoal,
    deleteGoal,
    totalGoals,
    completedGoals,
    progressPercent,
  }
}