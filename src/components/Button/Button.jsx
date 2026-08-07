/**
 * @file Button.jsx
 * @description Standardized action button supporting primary, secondary, ghost, and icon-only visual variants.
 * @figmaFrame Figma frame: Components - Button
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children='Button'] - Button label or icon content
 * @param {'primary' | 'secondary' | 'ghost' | 'icon'} [props.variant='primary'] - Button style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {Function} [props.onClick] - Click event handler
 */
import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children = 'Action Button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...rest
}) {
  const btnClasses = [styles.button, styles[variant], styles[size]]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={btnClasses}
      disabled={disabled}
      onClick={onClick}
      data-testid="button"
      {...rest}
    >
      {children}
    </button>
  );
}
