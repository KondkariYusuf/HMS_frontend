/**
 * @file Notifications/Index.jsx
 * @description In-app notification inbox & system email delivery logs.
 * @figmaFrame Figma frame: Notifications - Inbox & Email Logs (20-notifications.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function NotificationsPage() {
  return (
    <div className={styles.page} data-testid="notifications-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Notification Center</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Notifications (20-notifications.md) ]
          </p>
        </div>
        <Button variant="secondary">Mark All as Read</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Notification Inbox & Email Dispatch Logs Stub ]
        </div>
      </div>
    </div>
  );
}
