/**
 * @file Billing/Invoices/Index.jsx
 * @description Invoices list, details, PDF downloads, and status tracking.
 * @figmaFrame Figma frame: Billing - Invoices (19-billing.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function BillingInvoicesPage() {
  return (
    <div className={styles.page} data-testid="billing-invoices-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoices & Billing Ledger</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Billing (19-billing.md) ]
          </p>
        </div>
        <Button variant="primary">+ Create Invoice</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Unified Invoices Directory & Payment Status Table Stub ]
        </div>
      </div>
    </div>
  );
}
