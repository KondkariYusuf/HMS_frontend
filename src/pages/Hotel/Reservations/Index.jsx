/**
 * @file Hotel/Reservations/Index.jsx
 * @description Reservation calendar, room allocation, and folio management.
 * @figmaFrame Figma frame: Hotel - Reservations (11-bookings-folio.md)
 */
import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function HotelReservationsPage() {
  return (
    <div className={styles.page} data-testid="hotel-reservations-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Reservations & Folio Management</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Bookings & Folio (11-bookings-folio.md) ]
          </p>
        </div>
        <Button variant="primary">+ New Reservation</Button>
      </header>

      <div className={styles.overviewCard}>
        <DataTable />
      </div>
    </div>
  );
}
