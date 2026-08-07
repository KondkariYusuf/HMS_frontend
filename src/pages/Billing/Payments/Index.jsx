/**
 * @file Billing/Payments/Index.jsx
 * @description Payment collection, receipts, and refund processing screen.
 * @figmaFrame Figma frame: Billing - Payments & Refunds (19-billing.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function BillingPaymentsPage() {
  return (
    <div className={styles.page} data-testid="billing-payments-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Payment Processing & Receipts</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Billing (19-billing.md) ]
          </p>
        </div>
        <Button variant="primary">Record Payment</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Payment Gateway Receipts & Refunds Log Stub ]
        </div>
      </div>
    </div>
  );
}
