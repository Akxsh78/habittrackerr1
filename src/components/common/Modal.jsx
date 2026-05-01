import React, { useEffect } from 'react';

/**
 * Modal — accessible overlay dialog with close on Escape and backdrop click
 */
export function Modal({ title, onClose, children, maxWidth = 520 }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * ConfirmModal — simple yes/no confirmation dialog
 */
export function ConfirmModal({ title, message, confirmLabel = 'Confirm', confirmVariant = 'danger', onConfirm, onClose, loading = false }) {
  return (
    <Modal title={title} onClose={onClose} maxWidth={400}>
      <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button
          className={`btn btn-${confirmVariant}`}
          style={{ flex: 2 }}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default Modal;
