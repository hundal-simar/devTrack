import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  dateString,
  buildCalendarDays,
  buildWeeks,
} from '../utils/streakUtils';

export function useStreak() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0, activityLog: [] });
  const [loading, setLoading] = useState(true);

  // Fetch streak info from Express server
  const fetchStreak = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.get('/streaks');
      setStreakData(data);
    } catch (error) {
      console.error('Error fetching streak data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load streak details on init
  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  // Map dates in activityLog to YYYY-MM-DD set for UI grid renderer
  const activeDateSet = useMemo(() =>
    new Set(streakData.activityLog.map((d) => new Date(d).toISOString().split('T')[0]))
  , [streakData.activityLog]);

  const activeLast30 = useMemo(() => {
    const thirtyDaysAgo = dateString(29);
    return [...activeDateSet].filter((d) => d >= thirtyDaysAgo).length;
  }, [activeDateSet]);

  const calendarDays = useMemo(() => buildCalendarDays(activeDateSet), [activeDateSet]);
  const weeklyBreakdown = useMemo(() => buildWeeks(activeDateSet), [activeDateSet]);

  return {
    loading,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    activeLast30,
    calendarDays,
    weeklyBreakdown,
    refetchStreak: fetchStreak,
  };
}