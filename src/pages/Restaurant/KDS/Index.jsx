/**
 * @file Restaurant/KDS/Index.jsx
 * @description Kitchen Display System (KDS) & KOT order preparation monitor.
 * @figmaFrame Figma frame: Restaurant - Kitchen Display (14-orders-kitchen.md)
 */
import React from 'react';
import styles from './Index.module.css';

export default function RestaurantKDSPage() {
  return (
    <div className={styles.page} data-testid="restaurant-kds-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Kitchen Display System (KDS)</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Orders & Kitchen (14-orders-kitchen.md) ]
          </p>
        </div>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Live KOT Tickets & Kitchen Order Status Monitor Stub ]
        </div>
      </div>
    </div>
  );
}
