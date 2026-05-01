import React from 'react';

/**
 * EmptyState — friendly empty state with icon, title, description, and optional CTA
 */
export function EmptyState({ icon = '🌱', title, description, action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {description && <div className="empty-desc">{description}</div>}
      {action && actionLabel && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
