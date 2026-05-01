import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ProgressRing } from '../components/common/ProgressRing';

const ALL_BADGES = [
  { name: 'Getting Started', description: 'Complete 10 habit entries', icon: '⭐', threshold: 10, type: 'completions' },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', threshold: 7, type: 'streak' },
  { name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', threshold: 30, type: 'streak' },
  { name: 'Halfway Hero', description: 'Complete 50 habit entries', icon: '🏅', threshold: 50, type: 'completions' },
  { name: 'Century Completions', description: 'Complete 100 habit entries', icon: '🏆', threshold: 100, type: 'completions' },
  { name: 'Century Club', description: 'Maintain a 100-day streak', icon: '💎', threshold: 100, type: 'streak' },
];

const LEVELS = [
  { name: 'Beginner', minPoints: 0, maxPoints: 199, color: '#94a3b8', icon: '🌱' },
  { name: 'Explorer', minPoints: 200, maxPoints: 499, color: '#22d3a0', icon: '⚡' },
  { name: 'Achiever', minPoints: 500, maxPoints: 999, color: '#38bdf8', icon: '🎯' },
  { name: 'Champion', minPoints: 1000, maxPoints: 1999, color: '#f59e0b', icon: '🏅' },
  { name: 'Legend', minPoints: 2000, maxPoints: Infinity, color: '#7c5cfc', icon: '👑' },
];

/**
 * BadgesPage — gamification: badges earned, all-badges grid, points, and level
 */
export function BadgesPage() {
  const { user } = useAuth();
  const points = user?.totalPoints || 0;
  const earnedNames = new Set((user?.badges || []).map(b => b.name));

  // Determine current level
  const level = LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const levelProgress = nextLevel
    ? Math.round(((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100)
    : 100;

  const earnedCount = (user?.badges || []).length;
  const progressPct = Math.round((earnedCount / ALL_BADGES.length) * 100);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🏆 Badges & Rewards</h1>
          <p className="page-subtitle">{earnedCount} / {ALL_BADGES.length} badges earned</p>
        </div>
      </div>

      {/* Points & Level card */}
      <div className="card mb-24" style={{
        background: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(236,72,153,0.08))',
        borderColor: 'rgba(124,92,252,0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Points ring */}
          <ProgressRing percentage={levelProgress} size={100} stroke={8} color={level.color}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>{level.icon}</div>
            </div>
          </ProgressRing>

          {/* Level info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
                {points.toLocaleString()}
              </span>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>points</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 99,
              background: level.color + '22', color: level.color,
              fontSize: 13, fontWeight: 700, marginBottom: 12
            }}>
              {level.icon} {level.name}
            </div>
            {nextLevel && (
              <>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
                  {nextLevel.minPoints - points} pts to {nextLevel.icon} {nextLevel.name}
                </div>
                <div className="progress-bar-wrap" style={{ height: 6, maxWidth: 260 }}>
                  <div className="progress-bar-fill" style={{ width: `${levelProgress}%`, background: level.color }} />
                </div>
              </>
            )}
          </div>

          {/* Badge progress */}
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <ProgressRing percentage={progressPct} size={80} stroke={7} color="var(--amber)">
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                {earnedCount}/{ALL_BADGES.length}
              </div>
            </ProgressRing>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>badges earned</div>
          </div>
        </div>
      </div>

      {/* Earned badges */}
      {earnedCount > 0 && (
        <div className="mb-24">
          <div style={{
            fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
            color: 'var(--text)', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            ✅ Earned Badges
            <span style={{ fontSize: 12, color: 'var(--green)', background: 'var(--green-bg)', padding: '2px 8px', borderRadius: 99 }}>
              {earnedCount}
            </span>
          </div>
          <div className="badges-grid">
            {(user?.badges || []).map((b, i) => (
              <div key={i} className="badge-card earned">
                <div className="badge-card-icon">{b.icon}</div>
                <div className="badge-card-name">{b.name}</div>
                <div className="badge-card-desc">{b.description}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>
                  🏆 +100 pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All badges */}
      <div>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
          color: 'var(--text)', marginBottom: 14
        }}>
          🎯 All Badges
        </div>
        <div className="badges-grid">
          {ALL_BADGES.map(b => {
            const isEarned = earnedNames.has(b.name);
            return (
              <div key={b.name} className={`badge-card ${isEarned ? 'earned' : 'locked'}`}>
                <div className="badge-card-icon">{b.icon}</div>
                <div className="badge-card-name">{b.name}</div>
                <div className="badge-card-desc">{b.description}</div>
                <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: isEarned ? 'var(--green)' : 'var(--text3)' }}>
                  {isEarned ? '✓ Earned · +100 pts' : '🔒 Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level guide */}
      <div className="card" style={{ marginTop: 28 }}>
        <div className="card-title">⚡ Level Guide</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEVELS.map((l, i) => {
            const isCurrent = l.name === level.name;
            return (
              <div key={l.name} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: isCurrent ? l.color + '15' : 'var(--bg2)',
                border: `1px solid ${isCurrent ? l.color + '40' : 'var(--border)'}`,
              }}>
                <span style={{ fontSize: 22 }}>{l.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isCurrent ? l.color : 'var(--text)' }}>
                    {l.name} {isCurrent && '← You are here'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                    {l.maxPoints === Infinity ? `${l.minPoints}+ points` : `${l.minPoints} – ${l.maxPoints} points`}
                  </div>
                </div>
                {points >= l.minPoints && (
                  <span style={{ fontSize: 16, color: 'var(--green)' }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BadgesPage;
