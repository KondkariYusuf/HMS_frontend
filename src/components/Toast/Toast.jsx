/**
 * @file Toast.jsx
 * @description Toast notification banner for temporary feedback messages (success, error, info).
 *
 * @param {Object} props
 * @param {string} [props.message] - Notification text
 * @param {'success' | 'error' | 'info'} [props.type='success'] - Toast type variant
 * @param {Function} [props.onClose] - Close notification handler
 */
import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({
  message = 'Operation completed successfully.',
  type = 'success',
  onClose,
}) {
  const iconMap = {
    success: <CheckCircle2 size={18} style={{ color: '#16a34a' }} />,
    error: <AlertTriangle size={18} style={{ color: '#dc2626' }} />,
    info: <Info size={18} style={{ color: '#0284c7' }} />,
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      data-testid="toast"
      role="status"
      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
    >
      <span className={styles.icon} style={{ display: 'flex', alignItems: 'center' }}>
        {iconMap[type] || iconMap.success}
      </span>
      <span className={styles.message} style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Dismiss"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
