/**
 * @file Reservations/Index.jsx
 * @description Reservation management screen for booking lists, filtering, and guest check-ins.
 * @figmaFrame Figma frame: Reservations - List/Grid View
 *
 * Props/Components: DataTable, Button, Badge, Modal stub
 */
import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function ReservationsPage() {
  return (
    <div className={styles.page} data-testid="reservations-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Reservations</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — Figma Frame: Reservations - List/Grid View ]
          </p>
        </div>
        <Button variant="primary">+ New Reservation</Button>
      </header>

      <div className={styles.contentCard}>
        <DataTable />
      </div>
    </div>
  );
}
