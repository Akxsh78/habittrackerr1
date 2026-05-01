import React, { useState } from 'react';
import { StatCard } from '../components/common/StatCard';
import { WeeklyBarChart, MonthlyAreaChart, CategoryPieChart, HeatmapChart } from '../components/analytics/Charts';
import { useStats } from '../hooks/useStats';

/**
 * AnalyticsPage — comprehensive stats, charts, heatmap, and category breakdown
 */
export function AnalyticsPage() {
  const { stats, loading, error } = useStats();
  const [period, setPeriod] = useState('weekly');

  if (error) {
    return <div className="page"><div className="alert alert-error">⚠️ {error}</div></div>;
  }

  const chartData = period === 'weekly' ? stats?.weeklyData : stats?.monthlyData;

  // Average completion rate over past 7 days
  const weeklyAvg = stats?.weeklyData?.length
    ? Math.round(stats.weeklyData.reduce((acc, d) => acc + (stats.totalHabits > 0 ? (d.completed / stats.totalHabits) * 100 : 0), 0) / stats.weeklyData.length)
    : 0;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">📈 Analytics</h1>
          <p className="page-subtitle">Track your progress and identify patterns</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['weekly', 'monthly'].map(p => (
            <button
              key={p}
              className={`filter-chip ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-24">
        <StatCard icon="🎯" value={stats?.totalHabits ?? '—'} label="Active Habits" color="purple" loading={loading} />
        <StatCard icon="✅" value={stats?.completedToday ?? '—'} label="Completed Today" color="green" loading={loading} />
        <StatCard icon="🔥" value={stats?.maxStreak ?? '—'} label="Best Streak" change="All time record" color="amber" loading={loading} />
        <StatCard icon="📊" value={`${weeklyAvg}%`} label="7-Day Avg Rate" color="blue" loading={loading} />
      </div>

      {/* Main progress chart */}
      <div className="card mb-20">
        <div className="flex justify-between items-center mb-20" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ margin: 0 }}>
            {period === 'weekly' ? '📅 Last 7 Days' : '📅 Last 30 Days'}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>
            {stats?.completedToday ?? 0} / {stats?.totalHabits ?? 0} habits today
          </span>
        </div>
        <div style={{ height: 260 }}>
          {!loading && period === 'weekly' && (
            <WeeklyBarChart data={stats?.weeklyData || []} totalHabits={stats?.totalHabits || 0} />
          )}
          {!loading && period === 'monthly' && (
            <MonthlyAreaChart data={stats?.monthlyData || []} totalHabits={stats?.totalHabits || 0} />
          )}
          {loading && <div className="skeleton" style={{ height: '100%', borderRadius: 8 }} />}
        </div>
      </div>

      {/* Two-column: pie + summary */}
      <div className="grid-2 mb-20">
        <div className="card">
          <div className="card-title">🎨 Category Breakdown</div>
          <div style={{ height: 240 }}>
            {!loading && <CategoryPieChart categoryStats={stats?.categoryStats || {}} />}
            {loading && <div className="skeleton" style={{ height: '100%', borderRadius: 8 }} />}
          </div>
        </div>

        {/* Category list with progress bars */}
        <div className="card">
          <div className="card-title">📂 Category Stats</div>
          {loading
            ? [1, 2, 3, 4].map(i => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 8, borderRadius: 4 }} />
                </div>
              ))
            : Object.entries(stats?.categoryStats || {}).map(([name, v]) => {
                const CATEGORY_COLORS = {
                  Health: '#f43f5e', Fitness: '#22d3a0', Study: '#38bdf8',
                  Mindfulness: '#a855f7', Finance: '#f59e0b', Social: '#ec4899',
                  Creative: '#fb923c', Other: '#7c5cfc'
                };
                const color = CATEGORY_COLORS[name] || '#7c5cfc';
                const rate = stats?.totalHabits > 0 ? Math.round((v.count / stats.totalHabits) * 100) : 0;

                return (
                  <div key={name} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: 'var(--text)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                        {name} ({v.count})
                      </span>
                      <span style={{ color: 'var(--text3)', fontSize: 12 }}>
                        {v.completions} completions
                      </span>
                    </div>
                    <div className="progress-bar-wrap" style={{ height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${rate}%`, background: color }} />
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>

      {/* Activity heatmap */}
      <div className="card">
        <div className="card-title">🔥 Activity Heatmap (Last Year)</div>
        {loading
          ? <div className="skeleton" style={{ height: 120, borderRadius: 8 }} />
          : <HeatmapChart heatmapData={stats?.heatmapData || {}} />
        }
      </div>
    </div>
  );
}

export default AnalyticsPage;
