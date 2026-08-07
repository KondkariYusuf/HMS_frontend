/**
 * @file QuickActionsGrid.jsx
 * @description 2x2 grid of quick action icon buttons for common front-desk workflows (New Booking, Check-In, Room Service, Assign Staff).
 * @figmaFrame Figma frame: Dashboard - Quick Actions
 *
 * @param {Object} props
 * @param {Array<{id: string, label: string, icon: string, variant: 'primary' | 'secondary'}>} [props.actions] - List of 4 quick action definitions
 * @param {Function} [props.onActionClick] - Click handler passing action object
 */
import React from 'react';
import styles from './QuickActionsGrid.module.css';

export default function QuickActionsGrid({
  actions = [
    {
      id: 'new-booking',
      label: 'New Reservation',
      icon: '➕',
      variant: 'primary',
    },
    {
      id: 'check-in',
      label: 'Express Check-In',
      icon: '🔑',
      variant: 'secondary',
    },
    {
      id: 'room-service',
      label: 'Log Service Request',
      icon: '🛎️',
      variant: 'secondary',
    },
    {
      id: 'assign-staff',
      label: 'Assign Duty',
      icon: '👤',
      variant: 'secondary',
    },
  ],
  onActionClick,
}) {
  return (
    <div className={styles.grid} data-testid="quick-actions-grid">
      {actions.map((act) => (
        <button
          key={act.id}
          className={`${styles.actionTile} ${styles[act.variant || 'secondary']}`}
          onClick={() => onActionClick && onActionClick(act)}
        >
          <span className={styles.icon}>{act.icon}</span>
          <span className={styles.label}>{act.label}</span>
        </button>
      ))}
    </div>
  );
}
