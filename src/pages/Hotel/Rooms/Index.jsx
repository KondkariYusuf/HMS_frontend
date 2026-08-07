/**
 * @file Hotel/Rooms/Index.jsx
 * @description Hotel room types, rooms, and floor layout management screen.
 * @figmaFrame Figma frame: Hotel - Rooms & Floors Setup (09-rooms-setup.md)
 */
import React, { useState } from 'react';
import Button from '@components/Button/Button';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import styles from './Index.module.css';

export default function HotelRoomsPage() {
  const [isFloorModalOpen, setFloorModalOpen] = useState(false);

  return (
    <div className={styles.page} data-testid="hotel-rooms-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Hotel Rooms & Floors Management</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Rooms Setup (09-rooms-setup.md) ]
          </p>
        </div>
        <Button variant="secondary" onClick={() => setFloorModalOpen(true)}>
          Configure Floor Layout
        </Button>
      </header>

      <div className={styles.overviewCard}>
        <h3 className={styles.cardTitle}>Property Room Capacity</h3>
        <ProgressBar />
      </div>

      <div className={styles.placeholderGrid}>
        <div className={styles.roomCardStub}>[ Room 101 - King Deluxe ]</div>
        <div className={styles.roomCardStub}>
          [ Room 102 - Executive Suite ]
        </div>
        <div className={styles.roomCardStub}>
          [ Room 103 - Presidential Suite ]
        </div>
      </div>

      <FloorConfigurationModal
        isOpen={isFloorModalOpen}
        onClose={() => setFloorModalOpen(false)}
        onSave={() => setFloorModalOpen(false)}
      />
    </div>
  );
}
