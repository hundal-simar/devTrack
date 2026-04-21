import { useMemo } from 'react'
import { useSessions } from './useSessions'
import {
  dateString,
  calculateStreak,
  calculateLongestStreak,
  buildCalendarDays,
  buildWeeks,
} from '../utils/streakUtils'

export function useStreak() {
  const { sessions, loading } = useSessions()

  // Set of all dates that have at least one session
  const activeDateSet = useMemo(() =>
    new Set(sessions.map(s => s.date))
  , [sessions])

  // Active days in the last 30 only
  const activeLast30 = useMemo(() => {
    const thirtyDaysAgo = dateString(29)
    return [...activeDateSet].filter(d => d >= thirtyDaysAgo).length
  }, [activeDateSet])

  const currentStreak  = useMemo(() => calculateStreak(activeDateSet),        [activeDateSet])
  const longestStreak  = useMemo(() => calculateLongestStreak(activeDateSet),  [activeDateSet])
  const calendarDays   = useMemo(() => buildCalendarDays(activeDateSet),       [activeDateSet])
  const weeklyBreakdown = useMemo(() => buildWeeks(activeDateSet),             [activeDateSet])

  return {
    loading,
    currentStreak,
    longestStreak,
    activeLast30,
    calendarDays,
    weeklyBreakdown,
  }
}