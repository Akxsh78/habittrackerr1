import React, { useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Health', 'Fitness', 'Study', 'Mindfulness', 'Finance', 'Social', 'Creative', 'Other'];
const FREQUENCIES = ['All', 'Daily', 'Weekly'];

/**
 * HabitFilters — search bar, category chips, frequency toggle, view switcher
 *
 * @param {object} filters - current filter state { category, frequency, search }
 * @param {function} onFilterChange - called with updated filter key/value
 * @param {string} view - 'grid' | 'list'
 * @param {function} onViewChange - called with new view string
 */
export function HabitFilters({ filters, onFilterChange, view, onViewChange }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => onFilterChange('search', searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div>
      {/* Search */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: 380, display: 'flex' }}>
          <span style={{ fontSize: 14, color: 'var(--text3)' }}>🔍</span>
          <input
            placeholder="Search habits..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <span
              style={{ fontSize: 12, cursor: 'pointer', color: 'var(--text3)' }}
              onClick={() => { setSearchInput(''); onFilterChange('search', ''); }}
            >
              ✕
            </span>
          )}
        </div>
        {/* Frequency filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {FREQUENCIES.map(f => (
            <button
              key={f}
              className={`filter-chip ${filters.frequency === f ? 'active' : ''}`}
              onClick={() => onFilterChange('frequency', f)}
            >
              {f}
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div className="view-toggle">
          <button
            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => onViewChange('grid')}
            title="Grid view"
          >⊞</button>
          <button
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
            title="List view"
          >☰</button>
        </div>
      </div>

      {/* Category chips */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
            onClick={() => onFilterChange('category', cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HabitFilters;
