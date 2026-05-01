import React, { useState } from 'react';
import { Modal } from '../common/Modal';

const CATEGORIES = ['Health', 'Fitness', 'Study', 'Mindfulness', 'Finance', 'Social', 'Creative', 'Other'];
const FREQUENCIES = ['Daily', 'Weekly'];
const COLORS = ['#7c5cfc', '#22d3a0', '#f59e0b', '#38bdf8', '#ec4899', '#f43f5e', '#a855f7', '#84cc16', '#06b6d4', '#fb923c'];
const ICONS = ['⭐','🔥','💪','🧘','📚','🏃','💧','🥗','🎯','💡','🎨','🎵','💰','🌱','🤝','✨','📝','🏋️','🚴','🧠'];

/**
 * HabitFormModal — create or edit a habit
 *
 * @param {object|null} habit - if provided, edit mode; otherwise create
 * @param {function} onClose - called on cancel/close
 * @param {function} onSave - called with (savedHabit, isEdit)
 */
export function HabitFormModal({ habit, onClose, onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: habit?.title || '',
    description: habit?.description || '',
    category: habit?.category || 'Health',
    frequency: habit?.frequency || 'Daily',
    startDate: habit?.startDate || today,
    color: habit?.color || COLORS[0],
    icon: habit?.icon || '⭐',
    reminder: habit?.reminder || { enabled: false, time: '09:00' },
  });

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const setReminder = (key, value) => {
    setForm(prev => ({ ...prev, reminder: { ...prev.reminder, [key]: value } }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 100) errs.title = 'Title too long (max 100 chars)';
    if (form.description.length > 500) errs.description = 'Description too long (max 500 chars)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(form, !!habit);
      onClose();
    } catch (e) {
      setErrors({ general: e.message || 'Failed to save habit' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={habit ? '✏️ Edit Habit' : '✨ New Habit'} onClose={onClose}>
      {errors.general && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {errors.general}</div>
      )}

      {/* Title */}
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className={`form-input ${errors.title ? 'border-red' : ''}`}
          placeholder="e.g. Morning Meditation"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          style={errors.title ? { borderColor: 'var(--red)' } : {}}
          autoFocus
        />
        {errors.title && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{errors.title}</div>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          rows={2}
          placeholder="What is this habit about? Why does it matter?"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          style={{ resize: 'vertical' }}
        />
        {errors.description && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{errors.description}</div>}
      </div>

      {/* Category + Frequency */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Frequency</label>
          <select className="form-input" value={form.frequency} onChange={e => set('frequency', e.target.value)}>
            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Start Date */}
      <div className="form-group">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          className="form-input"
          value={form.startDate}
          max={today}
          onChange={e => set('startDate', e.target.value)}
        />
      </div>

      {/* Icon Picker */}
      <div className="form-group">
        <label className="form-label">Icon</label>
        <div className="icon-picker">
          {ICONS.map(icon => (
            <div
              key={icon}
              className={`icon-opt ${form.icon === icon ? 'selected' : ''}`}
              onClick={() => set('icon', icon)}
              title={icon}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="form-group">
        <label className="form-label">Color</label>
        <div className="color-picker">
          {COLORS.map(color => (
            <div
              key={color}
              className={`color-swatch ${form.color === color ? 'selected' : ''}`}
              style={{ background: color }}
              onClick={() => set('color', color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="form-group">
        <label className="form-label">Daily Reminder</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            className={`toggle-switch ${form.reminder.enabled ? 'on' : ''}`}
            onClick={() => setReminder('enabled', !form.reminder.enabled)}
          />
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>
            {form.reminder.enabled ? 'Enabled' : 'Disabled'}
          </span>
          {form.reminder.enabled && (
            <input
              type="time"
              className="form-input"
              value={form.reminder.time}
              onChange={e => setReminder('time', e.target.value)}
              style={{ width: 'auto' }}
            />
          )}
        </div>
      </div>

      {/* Preview */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', background: 'var(--bg2)',
        borderRadius: 'var(--radius-sm)', marginBottom: 16,
        border: '1px solid var(--border)'
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: form.color + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
        }}>
          {form.icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            {form.title || 'Habit Preview'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
            {form.category} · {form.frequency}
            {form.reminder.enabled && ` · 🔔 ${form.reminder.time}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: form.color }} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button
          className="btn btn-primary"
          style={{ flex: 2 }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading
            ? <span className="spinner" style={{ width: 16, height: 16 }} />
            : habit ? '💾 Save Changes' : '✨ Create Habit'
          }
        </button>
      </div>
    </Modal>
  );
}

export default HabitFormModal;
