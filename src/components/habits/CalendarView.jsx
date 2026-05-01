import React, { useState } from 'react';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * CalendarView — monthly calendar showing habit completion days
 *
 * @param {object} habit - the habit to display history for
 * @param {function} onToggleDate - optional: allow toggling past dates
 */
export function CalendarView({ habit, onToggleDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().toISOString().split('T')[0];

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const completionDates = new Set((habit?.completions || []).map(c => c.date));

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const isNextDisabled = new Date(year, month + 1, 1) > new Date();

  const handleDayClick = (day) => {
    if (!onToggleDate) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isFuture = new Date(dateStr) > new Date();
    if (!isFuture) onToggleDate(dateStr);
  };

  // Compute streak for this month
  let monthCompletions = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (completionDates.has(dateStr)) monthCompletions++;
  }

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={prevMonth}>← Prev</button>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
          {monthName}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={nextMonth} disabled={isNextDisabled}>
          Next →
        </button>
      </div>

      {/* Month stats */}
      {habit && (
        <div style={{
          display: 'flex', gap: 12, marginBottom: 16,
          padding: '10px 14px', background: 'var(--bg2)',
          borderRadius: 'var(--radius-sm)', fontSize: 13
        }}>
          <span style={{ color: 'var(--text2)' }}>
            📅 <strong style={{ color: 'var(--text)' }}>{monthCompletions}</strong> / {daysInMonth} days completed
          </span>
          <span style={{ color: 'var(--text3)' }}>|</span>
          <span style={{ color: 'var(--amber)', fontWeight: 600 }}>
            🔥 {habit.currentStreak}d streak
          </span>
        </div>
      )}

      {/* Day headers */}
      <div className="calendar-grid">
        {DAY_HEADERS.map(d => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}

        {/* Empty leading cells */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="cal-day empty" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isCompleted = completionDates.has(dateStr);
          const isToday = dateStr === today;
          const isFuture = new Date(dateStr) > new Date();

          return (
            <div
              key={day}
              className={[
                'cal-day',
                isCompleted ? 'completed' : '',
                isToday ? 'today' : '',
                isFuture ? 'opacity-50' : '',
                onToggleDate && !isFuture ? 'cursor-pointer' : ''
              ].filter(Boolean).join(' ')}
              onClick={() => handleDayClick(day)}
              title={`${dateStr}${isCompleted ? ' ✓' : ''}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, color: 'var(--text3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--green)' }} />
          Completed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid var(--accent)' }} />
          Today
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
