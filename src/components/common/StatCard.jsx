import React from 'react';

/**
 * StatCard — animated stat display card for dashboard
 *
 * @param {string} icon - emoji icon
 * @param {string|number} value - main metric value
 * @param {string} label - description text
 * @param {string} change - optional change indicator text
 * @param {boolean} changeUp - if true, change is positive (green)
 * @param {string} color - 'purple' | 'green' | 'amber' | 'blue'
 * @param {boolean} loading - show skeleton state
 */
export function StatCard({ icon, value, label, change, changeUp = true, color = 'purple', loading = false }) {
  if (loading) {
    return (
      <div className={`stat-card ${color}`}>
        <div className="skeleton" style={{ height: 28, width: 28, borderRadius: 8, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 6, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 4 }} />
      </div>
    );
  }

  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && (
        <div className={`stat-change ${changeUp ? 'up' : 'neutral'}`}>
          {changeUp ? '↑' : '→'} {change}
        </div>
      )}
    </div>
  );
}

export default StatCard;
