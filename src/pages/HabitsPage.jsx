import React, { useState, useCallback } from 'react';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitFormModal } from '../components/habits/HabitFormModal';
import { HabitFilters } from '../components/habits/HabitFilters';
import { EmptyState } from '../components/common/EmptyState';
import { useHabits } from '../hooks/useHabits';
import { useToast } from '../components/common/Toast';

/**
 * HabitsPage — full habit management with create/edit/delete/complete
 */
export function HabitsPage() {
  const { toast } = useToast();
  const [view, setView] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [filters, setFilters] = useState({ category: 'All', frequency: 'All', search: '' });

  const {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleComplete,
    todayCount,
    totalCount,
  } = useHabits({
    category: filters.category !== 'All' ? filters.category : undefined,
    frequency: filters.frequency !== 'All' ? filters.frequency : undefined,
    search: filters.search || undefined,
  });

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await updateHabit(editHabit._id, formData);
        toast('Habit updated! ✏️', 'success');
      } else {
        await createHabit(formData);
        toast('Habit created! 🎉', 'success');
      }
      setShowModal(false);
      setEditHabit(null);
    } catch (e) {
      toast(e.response?.data?.message || 'Failed to save habit', 'error');
      throw e; // Let modal show error too
    }
  };

  const handleToggle = async (id) => {
    try {
      const result = await toggleComplete(id);
      toast(
        result.completed
          ? `✅ Completed! Keep it up!`
          : `↩️ Unmarked`,
        result.completed ? 'success' : 'info'
      );
    } catch {
      toast('Failed to update habit', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      toast('Habit deleted', 'info');
    } catch {
      toast('Failed to delete habit', 'error');
    }
  };

  const openCreate = () => { setEditHabit(null); setShowModal(true); };
  const openEdit = (habit) => { setEditHabit(habit); setShowModal(true); };

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🎯 My Habits</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${todayCount} / ${totalCount} completed today`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Habit
        </button>
      </div>

      {/* Filters */}
      <HabitFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        view={view}
        onViewChange={setView}
      />

      {/* Loading skeleton */}
      {loading && (
        <div className={view === 'grid' ? 'habits-grid' : 'habit-list'}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={view === 'grid' ? 'habit-card' : 'habit-list-item'}>
              <div className="skeleton" style={{ height: view === 'grid' ? 160 : 60, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && habits.length === 0 && (
        <EmptyState
          icon="🌱"
          title={filters.search || filters.category !== 'All' ? 'No habits match your filters' : 'No habits yet'}
          description={
            filters.search || filters.category !== 'All'
              ? 'Try adjusting your search or filters.'
              : 'Start building better habits today. Small daily wins lead to big results!'
          }
          action={filters.search || filters.category !== 'All' ? undefined : openCreate}
          actionLabel="+ Create Your First Habit"
        />
      )}

      {/* Habit grid / list */}
      {!loading && habits.length > 0 && (
        <div className={view === 'grid' ? 'habits-grid' : 'habit-list'}>
          {habits.map(h => (
            <HabitCard
              key={h._id}
              habit={h}
              view={view}
              onToggle={handleToggle}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <HabitFormModal
          habit={editHabit}
          onClose={() => { setShowModal(false); setEditHabit(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default HabitsPage;
