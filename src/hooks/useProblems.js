import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const TOPICS = [
  'Arrays', 'Strings', 'Trees', 'Graphs', 'DP',
  'Linked Lists', 'Stack/Queue', 'Binary Search', 'Recursion',
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const TARGET_PER_TOPIC = 30;

export function useProblems() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [problemsloading, setProblemsLoading] = useState(true);

  // Fetch problems and their stats from the backend API
  const fetchProblemsAndStats = useCallback(async () => {
    if (!user) return;
    try {
      setProblemsLoading(true);
      const [problemsData, statsData] = await Promise.all([
        api.get('/problems'),
        api.get('/problems/stats'),
      ]);

      // Map backend problem objects to frontend expectations:
      // Backend: _id, title, topic, difficulty, solvedAt
      // Frontend: id, name, topic, difficulty, solvedAt, date
      const mappedProblems = problemsData.map((p) => ({
        id: p._id,
        name: p.title,
        topic: p.topic,
        difficulty: p.difficulty,
        solvedAt: p.solvedAt,
        date: new Date(p.solvedAt).toISOString().split('T')[0],
      }));

      // Map backend aggregated stats to frontend layout requirements:
      // Backend: topicStats = [ { topic: 'Arrays', count: 0 }, ... ]
      // Frontend: [ { name: 'Arrays', count: 0, percent: 0 }, ... ]
      const mappedStats = statsData.topicStats.map((s) => ({
        name: s.topic,
        count: s.count,
        percent: Math.min(Math.round((s.count / TARGET_PER_TOPIC) * 100), 100),
      }));

      setProblems(mappedProblems);
      setTopicStats(mappedStats);
    } catch (error) {
      console.error('Error fetching problems and stats:', error.message);
    } finally {
      setProblemsLoading(false);
    }
  }, [user]);

  // Fetch on mount or user change
  useEffect(() => {
    fetchProblemsAndStats();
  }, [fetchProblemsAndStats]);

  const addProblem = useCallback(async ({ name, topic, difficulty }) => {
    if (!user) return;
    try {
      await api.post('/problems', {
        title: name.trim(),
        topic,
        difficulty,
      });

      // Refetch list and statistics to keep UI updated
      await fetchProblemsAndStats();
    } catch (error) {
      console.error('Error adding problem:', error.message);
    }
  }, [user, fetchProblemsAndStats]);

  const deleteProblem = useCallback(async (id) => {
    try {
      await api.delete(`/problems/${id}`);
      await fetchProblemsAndStats();
    } catch (error) {
      console.error('Error deleting problem:', error.message);
    }
  }, [fetchProblemsAndStats]);

  // Derived today count
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = problems.filter((p) => p.date === todayStr).length;

  return {
    problems,
    problemsloading,
    addProblem,
    deleteProblem,
    topicStats,
    totalSolved: problems.length,
    todayCount,
  };
}