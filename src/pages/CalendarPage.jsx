import React, { useState, useEffect } from 'react';
import { CalendarView } from '../components/habits/CalendarView';
import { habitsAPI } from '../services/api';
import { useToast } from '../components/common/Toast';

/**
 * CalendarPage — pick a habit and view monthly completion calendar
 */
export function CalendarPage() {
  const { toast } = useToast();
  const [habits, setHabits] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    habitsAPI.getAll()
      .then(res => {
        const list = res.data.data;
        setHabits(list);
        if (list.length > 0) setSelectedId(list[0]._id);
      })
      .catch(() => toast('Failed to load habits', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const selected = habits.find(h => h._id === selectedId) || null;

  const handleToggleDate = async (date) => {
    if (!selected) return;
    try {
      const { data } = await habitsAPI.toggleComplete(selected._id, { date });
      // Update local habit completions
      setHabits(prev => prev.map(h =>
        h._id === selected._id ? { ...h, ...data.data } : h
      ));
      toast(data.completed ? `✅ Marked for ${date}` : `↩️ Unmarked for ${date}`, 'info');
    } catch {
      toast('Failed to update', 'error');
    }
  };

  const CATEGORY_COLORS = {
    Health: '#f43f5e', Fitness: '#22d3a0', Study: '#38bdf8',
    Mindfulness: '#a855f7', Finance: '#f59e0b', Social: '#ec4899',
    Creative: '#fb923c', Other: '#7c5cfc'
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 Calendar</h1>
          <p className="page-subtitle">View and manage your habit history</p>
        </div>
      </div>

      {loading ? (
        <div className="grid-2">
          {[1, 2].map(i => (
            <div key={i} className="card">
              <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text2)' }}>
            No habits to show
          </div>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginTop: 8 }}>
            Create some habits first to see your history here.
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Habit list */}
          <div className="card" style={{ maxHeight: 520, overflowY: 'auto' }}>
            <div className="card-title">Select a Habit</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {habits.map(h => {
                const catColor = CATEGORY_COLORS[h.category] || '#7c5cfc';
                const isSelected = h._id === selectedId;
                return (
                  <div
                    key={h._id}
                    onClick={() => setSelectedId(h._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: isSelected ? 'var(--accent-glow)' : 'var(--bg2)',
                      border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {/* Habit icon */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: (h.color || catColor) + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                    }}>
                      {h.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600,
                        color: isSelected ? 'var(--accent2)' : 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {h.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                        {h.totalCompletions} completions · 🔥 {h.currentStreak}d streak
                      </div>
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0 }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar view */}
          <div className="card">
            {selected ? (
              <>
                {/* Habit header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 20, paddingBottom: 16,
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: (selected.color || CATEGORY_COLORS[selected.category] || '#7c5cfc') + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                  }}>
                    {selected.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                      {selected.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                      {selected.category} · {selected.frequency} · Started {new Date(selected.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <CalendarView habit={selected} onToggleDate={handleToggleDate} />

                {/* All-time stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 12, marginTop: 20, paddingTop: 16,
                  borderTop: '1px solid var(--border)'
                }}>
                  {[
                    ['🔥', 'Current Streak', `${selected.currentStreak}d`],
                    ['🏆', 'Best Streak', `${selected.longestStreak}d`],
                    ['✅', 'Total Done', selected.totalCompletions],
                  ].map(([icon, label, val]) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{val}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
                ← Select a habit to view its calendar
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
