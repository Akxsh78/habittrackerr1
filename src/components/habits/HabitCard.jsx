import React, { useState } from 'react';

const CATEGORY_COLORS = {
  Health: '#f43f5e', Fitness: '#22d3a0', Study: '#38bdf8',
  Mindfulness: '#a855f7', Finance: '#f59e0b', Social: '#ec4899',
  Creative: '#fb923c', Other: '#7c5cfc'
};

/**
 * HabitCard — displays a single habit in grid or list view
 *
 * @param {object} habit - habit data object
 * @param {'grid'|'list'} view - display mode
 * @param {function} onToggle - called with toggle result
 * @param {function} onEdit - called with habit to edit
 * @param {function} onDelete - called with habit id
 */
export function HabitCard({ habit, view = 'grid', onToggle, onEdit, onDelete }) {
  const [toggling, setToggling] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habit.completions?.some(c => c.date === today) || habit.completedToday;

  // Completion rate: completions / days since startDate
  const startDate = habit.startDate ? new Date(habit.startDate) : new Date();
  const daysSinceStart = Math.max(1, Math.ceil((new Date() - startDate) / 86400000));
  const totalCompletions = habit.totalCompletions || 0;
  const completionRate = Math.min(100, Math.round((totalCompletions / daysSinceStart) * 100)) || 0;

  const handleToggle = async () => {
    if (!onToggle || toggling) return;
    setToggling(true);
    try { await onToggle(habit._id); }
    finally { setToggling(false); }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${habit.title}"? This cannot be undone.`)) {
      onDelete?.(habit._id);
    }
  };

  const catColor = CATEGORY_COLORS[habit.category] || 'var(--accent)';

  if (view === 'list') {
    return (
      <div className={`habit-list-item ${completedToday ? 'completed' : ''}`}>
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: habit.color + '22', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 20
        }}>
          {habit.icon}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
            {habit.title}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-gray" style={{ fontSize: 11 }}>{habit.category}</span>
            <span className="badge badge-gray" style={{ fontSize: 11 }}>{habit.frequency}</span>
            <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>
              🔥 {habit.currentStreak}d
            </span>
          </div>
        </div>
        {/* Actions */}
        <button
          className={`complete-btn ${completedToday ? 'done' : ''}`}
          style={{ flex: 'none', width: 'auto', padding: '7px 16px', minWidth: 100 }}
          onClick={handleToggle}
          disabled={toggling}
        >
          {toggling
            ? <span className="spinner" style={{ width: 14, height: 14 }} />
            : completedToday ? '✓ Done' : 'Mark Done'
          }
        </button>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit?.(habit)} title="Edit">✏️</button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={handleDelete} title="Delete">🗑️</button>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`habit-card ${completedToday ? 'completed' : ''}`}>
      {/* Left accent bar */}
      <div className="habit-card-accent" style={{ background: habit.color || catColor }} />

      {/* Header */}
      <div className="habit-card-header">
        <div className="habit-icon-wrap" style={{ background: (habit.color || catColor) + '22' }}>
          {habit.icon}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit?.(habit)} title="Edit">✏️</button>
          <button className="btn btn-danger btn-icon btn-sm" onClick={handleDelete} title="Delete">🗑️</button>
        </div>
      </div>

      {/* Title + description */}
      <div className="habit-title">{habit.title}</div>
      {habit.description && <div className="habit-desc">{habit.description}</div>}

      {/* Meta badges */}
      <div className="habit-meta">
        <span className="badge badge-gray">{habit.frequency}</span>
        <span
          className="badge"
          style={{ background: catColor + '22', color: catColor }}
        >
          {habit.category}
        </span>
        {habit.currentStreak > 0 && (
          <span className="streak-display">🔥 {habit.currentStreak}d streak</span>
        )}
      </div>

      {/* Complete button */}
      <div className="habit-actions">
        <button
          className={`complete-btn ${completedToday ? 'done' : ''}`}
          onClick={handleToggle}
          disabled={toggling}
        >
          {toggling
            ? <span className="spinner" style={{ width: 14, height: 14 }} />
            : completedToday ? '✓ Completed Today' : '◯ Mark Complete'
          }
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap" title={`${completionRate}% overall completion rate`}>
        <div
          className="progress-bar-fill"
          style={{ width: `${completionRate}%`, background: habit.color || catColor }}
        />
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 8, fontSize: 11, color: 'var(--text3)'
      }}>
        <span>🏆 Best: {habit.longestStreak || 0}d</span>
        <span>{completionRate}% rate</span>
        <span>✅ {totalCompletions} total</span>
      </div>
    </div>
  );
}

export default HabitCard;
