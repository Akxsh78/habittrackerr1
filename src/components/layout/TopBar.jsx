import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * TopBar — sticky header with page title, search, theme toggle, notifications
 *
 * @param {string} title - current page name
 * @param {function} onMenuClick - opens mobile sidebar
 * @param {string} searchQuery - controlled search value
 * @param {function} onSearch - called with new search string
 * @param {Array} pendingHabits - habits not yet completed today (for notification count)
 */
export function TopBar({ title, onMenuClick, searchQuery, onSearch, pendingHabits = [] }) {
  const { user, theme, toggleTheme } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="topbar">
      {/* Left side: hamburger + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: 'var(--text)', padding: 4,
            display: 'none' // shown via CSS media query
          }}
          className="menu-hamburger"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      {/* Right side: search, theme, notifs, avatar */}
      <div className="topbar-right">
        {/* Search */}
        <div className="search-bar">
          <span style={{ fontSize: 14, color: 'var(--text3)', flexShrink: 0 }}>🔍</span>
          <input
            placeholder="Search habits..."
            value={searchQuery || ''}
            onChange={e => onSearch?.(e.target.value)}
            aria-label="Search habits"
          />
        </div>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="notif-btn"
            onClick={() => setShowNotif(p => !p)}
            aria-label={`${pendingHabits.length} pending habits`}
          >
            🔔
            {pendingHabits.length > 0 && <div className="notif-dot" />}
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 280, background: 'var(--surface)',
              border: '1px solid var(--border2)', borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                🔔 Reminders
              </div>
              {pendingHabits.length === 0 ? (
                <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                  All habits completed! 🎉
                </div>
              ) : (
                pendingHabits.slice(0, 5).map(h => (
                  <div key={h._id} style={{
                    padding: '10px 16px', display: 'flex', gap: 10,
                    alignItems: 'center', borderBottom: '1px solid var(--border)',
                    fontSize: 13, color: 'var(--text2)'
                  }}>
                    <span style={{ fontSize: 18 }}>{h.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {h.reminder?.enabled ? `⏰ ${h.reminder.time}` : 'No reminder set'}
                      </div>
                    </div>
                    <span style={{ fontSize: 16 }}>○</span>
                  </div>
                ))
              )}
              {pendingHabits.length > 5 && (
                <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
                  +{pendingHabits.length - 5} more pending
                </div>
              )}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div
          className="avatar"
          style={{ cursor: 'pointer' }}
          title={user?.name}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
