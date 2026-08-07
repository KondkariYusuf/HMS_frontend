/**
 * @file Hotel/CheckIn/Index.jsx
 * @description Express guest check-in / check-out desk management screen.
 * @figmaFrame Figma frame: Hotel - Express Check-In Desk
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function HotelCheckInPage() {
  return (
    <div className={styles.page} data-testid="hotel-check-in-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Express Check-In / Check-Out Desk</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Bookings & Folio (11-bookings-folio.md) ]
          </p>
        </div>
        <Button variant="primary">Scan Guest QR / ID</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Express Check-In Workflow & Key Card Issue Interface Stub ]
        </div>
      </div>
    </div>
  );
}
