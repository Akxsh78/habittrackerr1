import React, { useState, useEffect, useMemo } from 'react';
import { StatCard } from '../components/common/StatCard';
import { HabitCard } from '../components/habits/HabitCard';
import { WeeklyBarChart, CategoryPieChart } from '../components/analytics/Charts';
import { useAuth } from '../context/AuthContext';
import { habitsAPI } from '../services/api';

const MOTIVATIONAL_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
];

/**
 * DashboardPage — overview of stats, charts, pending habits, and motivational quote
 */
export function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rotate quote daily by day-of-year index
  const quote = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    Promise.all([habitsAPI.getStats(), habitsAPI.getAll()])
      .then(([statsRes, habitsRes]) => {
        setStats(statsRes.data.data);
        // Show only incomplete habits (top 4)
        const incomplete = habitsRes.data.data.filter(h => !h.completedToday);
        setHabits(incomplete.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Pending reminders today
  const reminders = habits.filter(h => h.reminder?.enabled);

  const handleToggle = async (id) => {
    const { data } = await habitsAPI.toggleComplete(id, {});
    if (data.completed) {
      setHabits(prev => prev.filter(h => h._id !== id));
      // Refresh stats
      const statsRes = await habitsAPI.getStats();
      setStats(statsRes.data.data);
    }
  };

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting()}, {user?.username || user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="page-subtitle">{today}</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('habits')}>
          + New Habit
        </button>
      </div>

      {/* Reminder banner */}
      {reminders.length > 0 && (
        <div className="reminder-banner mb-24">
          <span className="reminder-icon">⏰</span>
          <div className="reminder-text">
            <strong>{reminders.length} habit{reminders.length > 1 ? 's' : ''} pending: </strong>
            {reminders.slice(0, 3).map(h => h.title).join(', ')}
            {reminders.length > 3 && ` +${reminders.length - 3} more`}
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('habits')}>
            View All
          </button>
        </div>
      )}

      {/* Motivational quote */}
      <div className="quote-card mb-24">
        <div className="quote-mark">"</div>
        <p className="quote-text">{quote.text}</p>
        <div className="quote-author">— {quote.author}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-24">
        <StatCard
          icon="🎯" value={stats?.totalHabits ?? '—'} label="Total Habits"
          change="Active habits" changeUp={false} color="purple" loading={loading}
        />
        <StatCard
          icon="✅" value={stats?.completedToday ?? '—'} label="Done Today"
          change={`${stats?.completionRate ?? 0}% completion rate`} color="green" loading={loading}
        />
        <StatCard
          icon="🔥" value={stats?.totalStreak ?? '—'} label="Total Streak Days"
          change={`Best: ${stats?.maxStreak ?? 0} days`} color="amber" loading={loading}
        />
        <StatCard
          icon="📈" value={`${stats?.completionRate ?? 0}%`} label="Today's Rate"
          change={stats?.completionRate >= 80 ? '🚀 Excellent!' : stats?.completionRate >= 50 ? '💪 Good progress' : '⚡ Keep going!'}
          color="blue" loading={loading}
        />
      </div>

      {/* Charts row */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-title">📊 This Week</div>
          <div className="chart-wrap">
            {!loading && <WeeklyBarChart data={stats?.weeklyData || []} totalHabits={stats?.totalHabits || 0} />}
          </div>
        </div>
        <div className="card">
          <div className="card-title">🎨 By Category</div>
          <div className="chart-wrap">
            {!loading && <CategoryPieChart categoryStats={stats?.categoryStats || {}} />}
          </div>
        </div>
      </div>

      {/* Pending habits today */}
      {habits.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-20">
            <div className="card-title" style={{ margin: 0 }}>⏳ Pending Today</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('habits')}>
              View All →
            </button>
          </div>
          <div className="habit-list">
            {habits.map(h => (
              <HabitCard
                key={h._id}
                habit={h}
                view="list"
                onToggle={handleToggle}
                onEdit={() => onNavigate('habits')}
                onDelete={async (id) => setHabits(prev => prev.filter(x => x._id !== id))}
              />
            ))}
          </div>
        </div>
      )}

      {/* All done state */}
      {!loading && habits.length === 0 && stats?.totalHabits > 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            All habits done!
          </div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>
            Amazing work today. Come back tomorrow to keep your streak going!
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && stats?.totalHabits === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>
            No habits yet
          </div>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>
            Start building better habits today!
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('habits')}>
            + Create Your First Habit
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
