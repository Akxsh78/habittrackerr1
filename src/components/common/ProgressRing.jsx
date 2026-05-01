import React from 'react';

/**
 * ProgressRing — circular SVG progress indicator
 *
 * @param {number} percentage - 0 to 100
 * @param {number} size - diameter in px (default 80)
 * @param {number} stroke - stroke width (default 6)
 * @param {string} color - stroke color (default accent purple)
 * @param {React.ReactNode} children - center content
 */
export function ProgressRing({
  percentage = 0,
  size = 80,
  stroke = 6,
  color = 'var(--accent)',
  children
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg3)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {children && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default ProgressRing;
