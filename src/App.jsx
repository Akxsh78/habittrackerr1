import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { HabitsPage } from './pages/HabitsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { BadgesPage } from './pages/BadgesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/AuthPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';


// ─── Page map ─────────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  habits: 'My Habits',
  analytics: 'Analytics',
  calendar: 'Calendar',
  badges: 'Badges & Rewards',
  settings: 'Settings',
  admin: 'Admin Dashboard',
};

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="loading-logo">❖</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          HabitFlow
        </div>
        <div style={{ color: 'var(--text3)', fontSize: 13 }}>Loading your habits...</div>
      </div>
    </div>
  );
}

// ─── App Shell (rendered when user is logged in) ──────────────────────────────
function AppShell() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingHabits, setPendingHabits] = useState([]);

  // Load pending habits count for notification badge
  useEffect(() => {
    import('./services/api').then(({ habitsAPI }) => {
      habitsAPI.getAll().then(res => {
        const incomplete = res.data.data.filter(h => !h.completedToday);
        setPendingHabits(incomplete);
      }).catch(() => { });
    });
  }, [page]);

  const navigate = useCallback((pageId) => {
    setPage(pageId);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} />;
      case 'habits': return <HabitsPage searchQuery={searchQuery} />;
      case 'analytics': return <AnalyticsPage />;
      case 'calendar': return <CalendarPage />;
      case 'badges': return <BadgesPage />;
      case 'settings': return <SettingsPage />;
      case 'admin': return <AdminDashboardPage />;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99, backdropFilter: 'blur(2px)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="main-content">
        <TopBar
          title={PAGE_TITLES[page]}
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          pendingHabits={pendingHabits}
        />
        {renderPage()}
      </div>
    </div>
  );
}

// ─── Auth Gate ─────────────────────────────────────────────────────────────────
function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <LoginPage />;
  }

  return <AppShell />;
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGate />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
