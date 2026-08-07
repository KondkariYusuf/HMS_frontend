/**
 * @file Inventory/PurchaseOrders/Index.jsx
 * @description Purchase orders, goods receipt notes (GRN), and vendor invoices.
 * @figmaFrame Figma frame: Inventory - Purchasing (18-purchase.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function InventoryPurchaseOrdersPage() {
  return (
    <div className={styles.page} data-testid="inventory-purchase-orders-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Purchase Orders & Receipts</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Purchase (18-purchase.md) ]
          </p>
        </div>
        <Button variant="primary">+ Create Purchase Order</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Purchase Orders & Goods Receipt Notes Interface Stub ]
        </div>
      </div>
    </div>
  );
}
