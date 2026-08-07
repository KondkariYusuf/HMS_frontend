/**
 * @file Restaurant/POS/Index.jsx
 * @description Point of Sale order entry interface for restaurant & room service.
 * @figmaFrame Figma frame: Restaurant - POS (14-orders-kitchen.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function RestaurantPOSPage() {
  return (
    <div className={styles.page} data-testid="restaurant-pos-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Restaurant POS & Terminal</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Orders & Kitchen (14-orders-kitchen.md) ]
          </p>
        </div>
        <Button variant="primary">+ New POS Order</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Interactive Restaurant POS Grid & Order Cart Interface Stub ]
        </div>
      </div>
    </div>
  );
}
