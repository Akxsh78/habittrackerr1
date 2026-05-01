import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { authAPI } from '../services/api';

/**
 * SettingsPage — profile update, password change, theme, about, T&C
 */
export function SettingsPage() {
  const { user, updateUser, logout, theme, toggleTheme } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
  });
  const [profileErrors, setProfileErrors] = useState({});


  // Preferences
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const setP = (k, v) => setProfileForm(prev => ({ ...prev, [k]: v }));

  const validateProfile = () => {
    const errs = {};
    if (!profileForm.name.trim()) errs.name = 'Name is required';
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const saveProfile = async () => {
    if (!validateProfile()) return;
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast('Profile updated! ✅', 'success');
    } catch (e) {
      toast(e.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'preferences', label: '🎨 Preferences' },
    { id: 'about', label: 'ℹ️ About' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {tab === 'profile' && (
        <div style={{ maxWidth: 600 }}>
          {/* User card */}
          <div className="settings-section">
            <div className="settings-section-title">👤 Your Profile</div>

            {/* Avatar + quick stats */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: 16, background: 'var(--bg2)',
              borderRadius: 'var(--radius-sm)', marginBottom: 24
            }}>
              <div className="avatar avatar-lg" style={{ flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>@{user?.username}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">⚡ {user?.totalPoints || 0} pts</span>
                  <span className="badge badge-amber">🏆 {user?.badges?.length || 0} badges</span>
                  <span className="badge badge-gray">
                    🗓️ Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={profileForm.name}
                onChange={e => setP('name', e.target.value)}
                style={profileErrors.name ? { borderColor: 'var(--red)' } : {}}
              />
              {profileErrors.name && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{profileErrors.name}</div>}
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={user?.username || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 4 }}>Usernames cannot be changed.</div>
            </div>

            <button className="btn btn-primary" onClick={saveProfile} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '💾 Save Profile'}
            </button>
          </div>

          {/* Danger zone */}
          <div className="settings-section" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
            <div className="settings-section-title">⚠️ Account Actions</div>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
              Logging out will end your session. Your data remains safe.
            </p>
            <button className="btn btn-danger" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* ── Preferences Tab ── */}
      {tab === 'preferences' && (
        <div style={{ maxWidth: 600 }}>
          {/* Appearance */}
          <div className="settings-section">
            <div className="settings-section-title">🎨 Appearance</div>
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Dark Mode</div>
                <div className="settings-row-desc">Toggle between light and dark themes</div>
              </div>
              <button className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme} />
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <div className="settings-section-title">🔔 Notifications</div>
            {[
              { label: 'Daily Reminders', desc: 'Receive reminders for incomplete habits', state: notifEnabled, setState: setNotifEnabled },
              { label: 'Sound Alerts', desc: 'Play a sound when a reminder fires', state: soundEnabled, setState: setSoundEnabled },
              { label: 'Weekly Report', desc: 'Get a weekly summary of your progress', state: weeklyReport, setState: setWeeklyReport },
            ].map(item => (
              <div key={item.label} className="settings-row">
                <div>
                  <div className="settings-row-label">{item.label}</div>
                  <div className="settings-row-desc">{item.desc}</div>
                </div>
                <button
                  className={`toggle-switch ${item.state ? 'on' : ''}`}
                  onClick={() => item.setState(p => !p)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── About Tab ── */}
      {tab === 'about' && (
        <div style={{ maxWidth: 600 }}>
          <div className="settings-section">
            <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
              <div style={{
                width: 72, height: 72, background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, margin: '0 auto 16px'
              }}>❖</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
                HabitFlow
              </div>
              <div style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 20 }}>
                Version 1.0.0 · Built with React + Node.js + MongoDB
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[['⚛️', 'React 18'], ['🟢', 'Node.js'], ['🍃', 'MongoDB'], ['🔐', 'JWT Auth']].map(([icon, label]) => (
                  <span key={label} className="badge badge-gray" style={{ padding: '6px 12px', fontSize: 12 }}>
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 12 }}>
                HabitFlow helps you build and maintain positive habits through daily tracking,
                streak motivation, gamification badges, and comprehensive analytics.
              </p>
              <p>
                Features include JWT-secured authentication, habit completion tracking with
                automatic streak calculation, a GitHub-style activity heatmap, categorized habits,
                customizable colors and icons, and a full badge/points system.
              </p>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">📋 Terms & Conditions</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 10 }}>By using HabitFlow, you agree to the following:</p>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>The application is provided for personal habit tracking and self-improvement purposes.</li>
                <li>Your data is stored securely and is never shared with third parties.</li>
                <li>You are responsible for the security of your account credentials.</li>
                <li>The service is provided "as is" without warranty of any kind.</li>
                <li>We reserve the right to update the service and these terms at any time.</li>
              </ul>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">🔐 Privacy Policy</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
              <p>
                HabitFlow collects only the information necessary to provide the service: your name,
                email address, and habit data. Passwords are hashed using bcrypt and are never stored
                in plain text. We do not use tracking cookies, sell your data, or display advertisements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
