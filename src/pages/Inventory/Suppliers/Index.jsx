/**
 * @file Inventory/Suppliers/Index.jsx
 * @description Vendor & supplier directory, contact info, and terms.
 * @figmaFrame Figma frame: Inventory - Suppliers (17-suppliers-batch.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function InventorySuppliersPage() {
  return (
    <div className={styles.page} data-testid="inventory-suppliers-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Suppliers & Vendor Directory</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Suppliers & Batch (17-suppliers-batch.md)
            ]
          </p>
        </div>
        <Button variant="primary">+ Add Supplier</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Vendor & Supplier Directory List Stub ]
        </div>
      </div>
    </div>
  );
}
