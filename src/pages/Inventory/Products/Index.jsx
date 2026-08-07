/**
 * @file Inventory/Products/Index.jsx
 * @description Product catalog, SKU categories, and brand management.
 * @figmaFrame Figma frame: Inventory - Products Catalog (16-inventory.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function InventoryProductsPage() {
  return (
    <div className={styles.page} data-testid="inventory-products-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory Products & SKU Catalog</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Inventory (16-inventory.md) ]
          </p>
        </div>
        <Button variant="primary">+ Add Product</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Products & Inventory Catalog Table Stub ]
        </div>
      </div>
    </div>
  );
}
