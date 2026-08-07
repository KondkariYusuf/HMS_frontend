/**
 * @file Customers/Directory/Index.jsx
 * @description Unified customer directory across hotel and restaurant domains.
 * @figmaFrame Figma frame: Customers - Directory (15-customers.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function CustomersDirectoryPage() {
  return (
    <div className={styles.page} data-testid="customers-directory-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Unified Customer Directory</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Customers (15-customers.md) ]
          </p>
        </div>
        <Button variant="primary">+ Add Customer</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Customer Directory & Transaction History List Stub ]
        </div>
      </div>
    </div>
  );
}
