/**
 * @file Admin/Subscription/Index.jsx
 * @description Organization subscription plan, tier limits, and billing history.
 * @figmaFrame Figma frame: Admin - Subscription Plans (04-subscription-plans.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function AdminSubscriptionPage() {
  return (
    <div className={styles.page} data-testid="admin-subscription-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Subscription & Plan Details</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Subscription & Plans
            (04-subscription-plans.md) ]
          </p>
        </div>
        <Button variant="primary">Upgrade Plan</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Enterprise Subscription Plan & Usage Limits Overview Stub ]
        </div>
      </div>
    </div>
  );
}
