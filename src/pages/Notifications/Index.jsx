/**
 * @file Notifications/Index.jsx
 * @description In-app notification inbox & system email delivery logs.
 * @figmaFrame Figma frame: Notifications - Inbox & Email Logs (20-notifications.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import { useNotifications } from '@hooks/useNotifications';
import styles from './Index.module.css';

const CATEGORY_LABELS = {
  BOOKING: 'Reservation',
  ORDER: 'Restaurant',
  INVOICE: 'Billing',
  PAYMENT: 'Payment',
  PURCHASE: 'Purchase',
  INVENTORY: 'Inventory',
  GUEST: 'Guest',
  STAFF: 'Staff',
  SYSTEM: 'System',
};

const CATEGORY_PATHS = {
  BOOKING: <path d="M4 3.5h8M4 6.5h8M4 9.5h5M3 1.5h10c.6 0 1 .4 1 1v11l-3-2-3 2-3-2-3 2v-11c0-.6.4-1 1-1Z" />,
  ORDER: <path d="M3 3.5h10M4 3.5v8.8c0 .7.5 1.2 1.2 1.2h5.6c.7 0 1.2-.5 1.2-1.2V3.5M6 6.5h4M6 9h4" />,
  INVOICE: <path d="M4 2h8v12l-2-1-2 1-2-1-2 1V2ZM6 5h4M6 8h4M6 11h2" />,
  PAYMENT: <path d="M2.5 5h11v7.5h-11V5ZM2.5 7h11M5 10h2" />,
  PURCHASE: <path d="M3 3h2l1.2 7.2h6.3L14 5H5M6.5 12.5h.1M11.5 12.5h.1" />,
  INVENTORY: <path d="m8 2 5 2.5v7L8 14l-5-2.5v-7L8 2ZM3 4.5 8 7l5-2.5M8 7v7" />,
  GUEST: <path d="M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 13.5c.5-2.2 2.1-3.3 5-3.3s4.5 1.1 5 3.3" />,
  STAFF: <path d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4 13c.4-1.7 1.7-2.6 4-2.6s3.6.9 4 2.6M12 4v3M10.5 5.5h3" />,
  SYSTEM: <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.8 3.8l1.4 1.4M10.8 10.8l1.4 1.4M12.2 3.8l-1.4 1.4M5.2 10.8l-1.4 1.4M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
};

function NotificationIcon({ type, empty = false }) {
  const iconPath = empty
    ? <path d="M4 6C4 3.8 5.6 2 8 2c2.4 0 4 1.8 4 4v3l2 2H2l2-2V6ZM6.5 13c.3.7.8 1 1.5 1s1.2-.3 1.5-1" />
    : CATEGORY_PATHS[type] || CATEGORY_PATHS.SYSTEM;

  return (
    <span className={`${styles.typeIcon} ${empty ? styles.emptyIcon : ''}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {iconPath}
      </svg>
    </span>
  );
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    actionError,
    markingAll,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const formatTimestamp = (value) => {
    if (!value) {
      return 'Date unavailable';
    }

    const timestamp = new Date(value);

    return Number.isNaN(timestamp.getTime())
      ? 'Date unavailable'
      : timestamp.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
  };

  return (
    <div className={styles.page} data-testid="notifications-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Notification Center</h1>
          <p className={styles.subtitle}>Stay updated with important hotel activities and alerts.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.unreadSummary}>
            <span className={styles.summaryValue}>{unreadCount}</span>
            <span>Unread notifications</span>
          </div>
          <Button
            variant="secondary"
            disabled={markingAll || unreadCount === 0}
            onClick={markAllAsRead}
          >
            {markingAll ? 'Marking...' : 'Mark All as Read'}
          </Button>
        </div>
      </header>

      {actionError && <div className={styles.actionError} role="alert">{actionError}</div>}

      <section className={styles.listCard} aria-live="polite">
        <div className={styles.listHeader}>
          <div>
            <h2>Recent activity</h2>
            <p>Updates from across your hotel operations</p>
          </div>
          {!loading && !error && notifications.length > 0 && (
            <span className={styles.totalCount}>{notifications.length} total</span>
          )}
        </div>
        {loading && <p className={styles.stateMessage}>Loading notifications...</p>}
        {!loading && error && <p className={styles.errorMessage} role="alert">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <div className={styles.emptyState}>
            <NotificationIcon empty />
            <h2>You&apos;re all caught up</h2>
            <p>There are no new notifications to display.</p>
          </div>
        )}
        {!loading && !error && notifications.length > 0 && (
          <div className={styles.notificationList}>
            {notifications.map((notification) => (
              <button
                type="button"
                className={`${styles.notificationRow} ${!notification.isRead ? styles.unread : ''}`}
                key={notification._key}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationIcon type={notification.type} />
                <span className={styles.notificationContent}>
                  <span className={styles.notificationTitleRow}>
                    <strong>{notification.title}</strong>
                    {!notification.isRead && <span className={styles.unreadLabel}>Unread</span>}
                  </span>
                  <span className={styles.notificationBody}>{notification.body || 'No additional details.'}</span>
                  <span className={styles.notificationMeta}>
                    {CATEGORY_LABELS[notification.type] || notification.type} / {formatTimestamp(notification.createdAt)}
                  </span>
                </span>
                {!notification.isRead && <span className={styles.unreadDot} aria-label="Unread" />}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
