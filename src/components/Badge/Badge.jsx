/**
 * @file Badge.jsx
 * @description Status pill badge component supporting reservation status and VIP membership tier variants.
 * @figmaFrame Figma frame: Components - Status Pill / Badge
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content text
 * @param {'in-house' | 'arriving' | 'checked-out' | 'vip' | 'regular' | 'error'} [props.variant='in-house'] - Status or tier variant
 */
import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ children = 'In-House', variant = 'in-house' }) {
  const variantClass = styles[variant] || styles['in-house'];

  return (
    <span className={`${styles.badge} ${variantClass}`} data-testid="badge">
      {children}
    </span>
  );
}
