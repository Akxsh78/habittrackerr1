import React from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'habits', label: 'My Habits', icon: '🎯' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'badges', label: 'Badges & Rewards', icon: '🏆' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

/**
 * Sidebar — fixed left navigation with logo, nav items, and user profile card
 *
 * @param {string} currentPage - active page id
 * @param {function} onNavigate - called with page id
 * @param {boolean} isOpen - mobile open state
 * @param {function} onClose - closes sidebar on mobile
 */
export function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleNav = (id) => {
    onNavigate(id);
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">❖</div>
          <div>
            <div className="logo-text">HabitFlow</div>
            <span className="logo-sub">Build Better Every Day</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Main</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="nav-section-title" style={{ marginTop: 20 }}>Account</div>
        {user?.role === 'admin' && (
          <button
            className={`nav-item ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => handleNav('admin')}
            style={{ color: 'var(--accent)' }}
          >
            <span className="nav-icon">🛡️</span>
            Admin Dashboard
          </button>
        )}
        <button className="nav-item" onClick={logout} style={{ color: 'var(--red)' }}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </nav>

      {/* User card */}
      <div className="sidebar-footer">
        <div className="user-card" onClick={() => handleNav('settings')}>
          <div className="avatar">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>→</span>
        </div>

        {/* Points badge */}
        {user?.totalPoints > 0 && (
          <div style={{
            marginTop: 8, padding: '6px 10px',
            background: 'var(--accent-glow)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12, color: 'var(--accent2)',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            ⚡ {user.totalPoints} points earned
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
