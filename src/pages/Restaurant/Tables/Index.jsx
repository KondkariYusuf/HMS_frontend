/**
 * @file Restaurant/Tables/Index.jsx
 * @description Restaurant dining areas, table layout, and reservation status screen.
 * @figmaFrame Figma frame: Restaurant - Tables & Areas (12-restaurant-setup.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function RestaurantTablesPage() {
  return (
    <div className={styles.page} data-testid="restaurant-tables-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tables & Dining Areas Setup</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Restaurant Setup (12-restaurant-setup.md)
            ]
          </p>
        </div>
        <Button variant="primary">+ Add Dining Area</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Interactive Floor & Table Map Interface Stub ]
        </div>
      </div>
    </div>
  );
}
