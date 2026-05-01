import React from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const CATEGORY_COLORS = {
  Health: '#f43f5e', Fitness: '#22d3a0', Study: '#38bdf8',
  Mindfulness: '#a855f7', Finance: '#f59e0b', Social: '#ec4899',
  Creative: '#fb923c', Other: '#7c5cfc'
};

// Custom tooltip for all charts
function ChartTooltip({ active, payload, label, totalHabits }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text)' }}>
          ✅ {p.value} / {totalHabits} completed
        </div>
      ))}
    </div>
  );
}

/**
 * WeeklyBarChart — bar chart of completions for the last 7 days
 */
export function WeeklyBarChart({ data = [], totalHabits = 0 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="dayName"
          tick={{ fill: 'var(--text3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={20}
          domain={[0, Math.max(totalHabits, 1)]}
        />
        <Tooltip content={<ChartTooltip totalHabits={totalHabits} />} />
        <Bar dataKey="completed" fill="#7c5cfc" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * MonthlyAreaChart — smooth area chart of monthly completions
 */
export function MonthlyAreaChart({ data = [], totalHabits = 0 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={v => new Date(v).getDate()}
          tick={{ fill: 'var(--text3)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: 'var(--text3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={20}
        />
        <Tooltip
          content={<ChartTooltip totalHabits={totalHabits} />}
          labelFormatter={v => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <Area
          type="monotone"
          dataKey="completed"
          stroke="#7c5cfc"
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#7c5cfc' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * CategoryPieChart — donut chart of habits by category
 */
export function CategoryPieChart({ categoryStats = {} }) {
  const data = Object.entries(categoryStats).map(([name, v]) => ({
    name,
    value: v.count,
    color: CATEGORY_COLORS[name] || '#7c5cfc'
  }));

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)', fontSize: 13 }}>
        No habits yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={45}
          outerRadius={75}
          dataKey="value"
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [v + ' habit(s)', n]} />
        <Legend
          formatter={v => (
            <span style={{ fontSize: 11, color: 'var(--text2)' }}>{v}</span>
          )}
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * HeatmapChart — GitHub-style contribution heatmap for last 365 days
 */
export function HeatmapChart({ heatmapData = {} }) {
  const maxVal = Math.max(...Object.values(heatmapData), 1);

  // Build 52-week grid
  const weeks = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  let current = new Date(startDate);
  let week = [];

  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];
    const val = heatmapData[dateStr] || 0;
    const level = val === 0 ? 0
      : val <= maxVal * 0.25 ? 1
      : val <= maxVal * 0.5 ? 2
      : val <= maxVal * 0.75 ? 3 : 4;

    week.push({ date: dateStr, val, level });

    if (current.getDay() === 6) {
      weeks.push([...week]);
      week = [];
    }
    current.setDate(current.getDate() + 1);
  }
  if (week.length) weeks.push(week);

  return (
    <div>
      {/* Month labels */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 4, paddingLeft: 2 }}>
        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
          <div key={m} style={{ flex: 1, fontSize: 10, color: 'var(--text3)' }}>{m}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-col">
            {week.map((day, di) => (
              <div
                key={di}
                className="heatmap-cell"
                data-level={day.level}
                title={`${day.date}: ${day.val} completion${day.val !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 10, fontSize: 11, color: 'var(--text3)' }}>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} className="heatmap-cell" data-level={l} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
