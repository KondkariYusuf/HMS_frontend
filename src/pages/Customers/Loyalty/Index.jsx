/**
 * @file Customers/Loyalty/Index.jsx
 * @description Customer loyalty points, rewards tier, and redemption rules.
 * @figmaFrame Figma frame: Customers - Loyalty Program (15-customers.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function CustomersLoyaltyPage() {
  return (
    <div className={styles.page} data-testid="customers-loyalty-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Loyalty Program & Tiers</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Customers (15-customers.md) ]
          </p>
        </div>
        <Button variant="secondary">Configure Reward Rules</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Customer Loyalty Tiers & Points Management Stub ]
        </div>
      </div>
    </div>
  );
}
