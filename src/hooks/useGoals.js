import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Returns today's date as YYYY-MM-DD string
const getTodayString = () => new Date().toISOString().split('T')[0];

export default function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [goalsloading, setGoalsLoading] = useState(true);

  // Fetch goals from API
  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      setGoalsLoading(true);
      const data = await api.get(`/goals?date=${getTodayString()}`);
      
      // Map backend fields to frontend expectations:
      // Backend: _id, text, isCompleted, targetDate
      // Frontend: id, text, done, date
      const mappedGoals = data.map((g) => ({
        id: g._id,
        text: g.text,
        done: g.isCompleted,
        date: g.targetDate,
      }));
      
      setGoals(mappedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error.message);
    } finally {
      setGoalsLoading(false);
    }
  }, [user]);

  // Load goals on init and user state changes
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (text) => {
    if (!user || !text.trim()) return;
    try {
      const data = await api.post('/goals', {
        text: text.trim(),
        targetDate: getTodayString(),
      });

      const newGoal = {
        id: data._id,
        text: data.text,
        done: data.isCompleted,
        date: data.targetDate,
      };

      setGoals((prev) => [...prev, newGoal]);
    } catch (error) {
      console.error('Error adding goal:', error.message);
    }
  }, [user]);

  const toggleGoal = useCallback(async (goalId, currentDone) => {
    try {
      const data = await api.patch(`/goals/${goalId}`);
      
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, done: data.isCompleted } : g))
      );
    } catch (error) {
      console.error('Error toggling goal:', error.message);
    }
  }, []);

  const deleteGoal = useCallback(async (goalId) => {
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error.message);
    }
  }, []);

  // Derived values
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.done).length;
  const progressPercent = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  return {
    goals,
    goalsloading,
    addGoal,
    toggleGoal,
    deleteGoal,
    totalGoals,
    completedGoals,
    progressPercent,
  };
}