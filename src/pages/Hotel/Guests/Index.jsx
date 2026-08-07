/**
 * @file Hotel/Guests/Index.jsx
 * @description Hotel guest profiles, verification documents, and directory.
 * @figmaFrame Figma frame: Hotel - Guests (10-hotel-guests.md)
 */
import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function HotelGuestsPage() {
  const guestColumns = [
    { key: 'guest', title: 'Guest Name & Tag' },
    { key: 'room', title: 'Identity Doc' },
    { key: 'dates', title: 'Total Stays' },
    { key: 'status', title: 'VIP Status' },
    { key: 'actions', title: 'Actions' },
  ];

  const guestData = [
    {
      id: 'gst-1',
      guest: { name: 'Eleanor Vance', tag: 'VIP Platinum' },
      room: 'Passport #AB948102',
      dates: '12 Stays',
      status: 'vip',
    },
    {
      id: 'gst-2',
      guest: { name: 'Marcus Brody', tag: 'Frequent Guest' },
      room: 'Driver License #DL-48192',
      dates: '5 Stays',
      status: 'regular',
    },
  ];

  return (
    <div className={styles.page} data-testid="hotel-guests-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Guest Directory</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Hotel Guests (10-hotel-guests.md) ]
          </p>
        </div>
        <Button variant="primary">+ Register Guest</Button>
      </header>

      <div className={styles.overviewCard}>
        <DataTable columns={guestColumns} data={guestData} />
      </div>
    </div>
  );
}
