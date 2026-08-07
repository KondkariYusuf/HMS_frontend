/**
 * @file Fab.jsx
 * @description Floating Action Button component with primary branding, icon, and optional label text.
 * @figmaFrame Figma frame: Components - Floating Action Button
 *
 * @param {Object} props
 * @param {string} [props.icon='➕'] - Icon symbol or component
 * @param {string} [props.label] - Optional text label (expanded FAB)
 * @param {Function} [props.onClick] - Click handler
 */
import React from 'react';
import styles from './Fab.module.css';

export default function Fab({ icon = '➕', label = 'Quick Add', onClick }) {
  return (
    <button
      className={`${styles.fab} ${label ? styles.extended : ''}`}
      onClick={onClick}
      data-testid="fab"
      aria-label={label || 'Floating Action Button'}
    >
      <span className={styles.icon}>{icon}</span>
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
