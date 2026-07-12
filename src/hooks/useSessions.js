import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const getTodayString = () => new Date().toISOString().split('T')[0];

const getWeekAgoString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
};

export function useSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged study timer sessions from API
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.get('/timer');
      
      // Map backend fields to frontend expectations:
      // Backend: _id, duration (seconds), durationInMinutes, date, user
      // Frontend expects: id, duration, startedAt (with .toDate() helper), date
      const mapped = data.map((s) => ({
        id: s._id,
        duration: s.duration || Math.round(s.durationInMinutes * 60) || 0,
        startedAt: {
          toDate: () => new Date(s.date),
        },
        rawDate: s.date,
        date: s.date ? new Date(s.date).toISOString().split('T')[0] : getTodayString(),
      }));

      setSessions(mapped);
    } catch (error) {
      console.error('Error fetching study sessions:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load sessions on init
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const saveSession = useCallback(async (seconds, startedAt) => {
    if (!user || seconds < 10) return; // Don't save sessions under 10 seconds
    try {
      await api.post('/timer/session', {
        duration: seconds,
        date: startedAt || new Date(),
      });
      // Refresh session logs after creation
      await fetchSessions();
    } catch (error) {
      console.error('Error saving study session:', error.message);
    }
  }, [user, fetchSessions]);

  const todayString = getTodayString();
  const weekAgoString = getWeekAgoString();

  const todaySessions = useMemo(() =>
    sessions.filter((s) => s.date === todayString)
  , [sessions, todayString]);

  const todayTotal = useMemo(() =>
    todaySessions.reduce((sum, s) => sum + s.duration, 0)
  , [todaySessions]);

  const weekTotal = useMemo(() =>
    sessions
      .filter((s) => s.date >= weekAgoString)
      .reduce((sum, s) => sum + s.duration, 0)
  , [sessions, weekAgoString]);

  const longestSession = useMemo(() =>
    sessions.length === 0 ? 0 : Math.max(...sessions.map((s) => s.duration))
  , [sessions]);

  return {
    sessions,
    todaySessions,
    loading,
    saveSession,
    todayTotal,
    weekTotal,
    longestSession,
  };
}