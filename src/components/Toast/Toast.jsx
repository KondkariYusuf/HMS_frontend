/**
 * @file Toast.jsx
 * @description Toast notification banner for temporary feedback messages (success, error, info).
 * @figmaFrame Figma frame: Overlays - Toast Notification
 *
 * @param {Object} props
 * @param {string} [props.message] - Notification text
 * @param {'success' | 'error' | 'info'} [props.type='success'] - Toast type variant
 * @param {Function} [props.onClose] - Close notification handler
 */
import React from 'react';
import styles from './Toast.module.css';

export default function Toast({
  message = 'Operation completed successfully.',
  type = 'success',
  onClose,
}) {
  const iconMap = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      data-testid="toast"
      role="status"
    >
      <span className={styles.icon}>{iconMap[type]}</span>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
