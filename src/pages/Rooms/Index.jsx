/**
 * @file Rooms/Index.jsx
 * @description Room management screen listing room status, floor configurations, and housekeeping state.
 * @figmaFrame Figma frame: Rooms - Room Management
 *
 * Components integrated (stubs): FloorConfigurationModal trigger, ProgressBar, Button, Badge
 */
import React, { useState } from 'react';
import Button from '@components/Button/Button';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import styles from './Index.module.css';

export default function RoomsPage() {
  const [isFloorModalOpen, setFloorModalOpen] = useState(false);

  return (
    <div className={styles.page} data-testid="rooms-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Rooms & Floor Management</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — Figma Frame: Rooms - Room Management ]
          </p>
        </div>
        <Button variant="secondary" onClick={() => setFloorModalOpen(true)}>
          Configure Floors
        </Button>
      </header>

      <div className={styles.overviewCard}>
        <h3 className={styles.cardTitle}>Overall Property Capacity</h3>
        <ProgressBar />
      </div>

      <div className={styles.placeholderGrid}>
        <div className={styles.roomCardStub}>
          [ Room 101 Stub - Single King ]
        </div>
        <div className={styles.roomCardStub}>
          [ Room 102 Stub - Deluxe Suite ]
        </div>
        <div className={styles.roomCardStub}>
          [ Room 103 Stub - Executive Suite ]
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
