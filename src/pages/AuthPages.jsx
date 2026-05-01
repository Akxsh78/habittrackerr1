import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

// ─── Shared auth form wrapper ─────────────────────────────────
function AuthCard({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">❖</div>
          <div className="auth-logo-text">HabitFlow</div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────
export function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleLogin = async () => {
    setError('');
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast('Welcome back! 👋', 'success');
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <AuthCard>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Log in to continue your habit journey</p>

      {error && <div className="alert alert-error mb-20">⚠️ {error}</div>}

      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          className="form-input"
          placeholder="Enter your username"
          value={form.username}
          onChange={e => set('username', e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={e => set('password', e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button className="btn btn-primary btn-full mb-20" onClick={handleLogin} disabled={loading}>
        {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Login'}
      </button>
    </AuthCard>
  );
}

export default LoginPage;