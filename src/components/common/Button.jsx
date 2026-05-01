import React from 'react';

/**
 * Button — reusable button component with variants, sizes, loading state
 *
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - shows spinner when true
 * @param {boolean} fullWidth - stretches to container width
 * @param {string} leftIcon - emoji/icon before label
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    fullWidth ? 'btn-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="spinner" style={{ width: 16, height: 16 }} />
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
