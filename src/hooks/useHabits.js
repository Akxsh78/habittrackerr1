import { useState, useEffect, useCallback } from 'react';
import { habitsAPI } from '../services/api';

/**
 * useHabits — manages habit list state, CRUD operations, and filtering
 */
export function useHabits(initialFilters = {}) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  
  // Sync internal state if initialFilters prop changes (e.g. from HabitsPage)
  useEffect(() => {
    setFilters(initialFilters);
  }, [JSON.stringify(initialFilters)]);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await habitsAPI.getAll(filters);
      setHabits(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const createHabit = async (habitData) => {
    const { data } = await habitsAPI.create(habitData);
    setHabits(prev => [{ ...data.data, completedToday: false }, ...prev]);
    return data.data;
  };

  const updateHabit = async (id, habitData) => {
    const { data } = await habitsAPI.update(id, habitData);
    setHabits(prev => prev.map(h => h._id === id ? { ...h, ...data.data } : h));
    return data.data;
  };

  const deleteHabit = async (id) => {
    await habitsAPI.delete(id);
    setHabits(prev => prev.filter(h => h._id !== id));
  };

  const toggleComplete = async (id, date) => {
    const { data } = await habitsAPI.toggleComplete(id, { date });
    setHabits(prev => prev.map(h => h._id === id ? { ...h, ...data.data } : h));
    return data;
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    habits,
    loading,
    error,
    filters,
    updateFilters,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleComplete,
    refetch: fetchHabits,
    todayCount: habits.filter(h => h.completedToday).length,
    totalCount: habits.length,
  };
}
