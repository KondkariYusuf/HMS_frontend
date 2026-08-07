/**
 * @file Restaurant/Menu/Index.jsx
 * @description Restaurant menu categories, items, and pricing management.
 * @figmaFrame Figma frame: Restaurant - Menu (13-menu.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function RestaurantMenuPage() {
  return (
    <div className={styles.page} data-testid="restaurant-menu-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Menu & Item Catalog</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Menu (13-menu.md) ]
          </p>
        </div>
        <Button variant="primary">+ Add Menu Item</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Menu Categories & Food Items Manager Stub ]
        </div>
      </div>
    </div>
  );
}
