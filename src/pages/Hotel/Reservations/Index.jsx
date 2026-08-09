/**
 * @file Hotel/Reservations/Index.jsx
 * @description Master Front Desk & Bookings domain screen integrating Upcoming Bookings, Past Archive, and Modals.
 * @figmaFrame Figma frame: Premium Upcoming Bookings Management & Refined Past Bookings Archive
 */
import React, { useState } from 'react';
import Button from '@components/Button/Button';
import UpcomingBookings from './UpcomingBookings';
import PastArchive from './PastArchive';
import FutureBookingModal from '@components/FutureBookingModal/FutureBookingModal';
import RoomBookingModal from '@components/RoomBookingModal/RoomBookingModal';
import styles from './Index.module.css';

export default function HotelReservationsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  return (
    <div className={styles.page} data-testid="hotel-reservations-page">
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Front Desk & Reservations Management</h1>
          <p className={styles.subtitle}>
            Manage guest reservations, room allocations, check-ins, and stay archives
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={() => setIsRoomModalOpen(true)}>
            Instant Room Allocation
          </Button>
          <Button variant="primary" onClick={() => setIsFutureModalOpen(true)}>
            + New Reservation
          </Button>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav className={styles.navTabs}>
        <button
          className={`${styles.navTabBtn} ${
            activeTab === 'upcoming' ? styles.navTabBtnActive : ''
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming & Active Bookings
        </button>
        <button
          className={`${styles.navTabBtn} ${
            activeTab === 'archive' ? styles.navTabBtnActive : ''
          }`}
          onClick={() => setActiveTab('archive')}
        >
          Past Stays Archive
        </button>
      </nav>

      {/* Tab Content */}
      <main>
        {activeTab === 'upcoming' ? (
          <UpcomingBookings
            onOpenFutureModal={() => setIsFutureModalOpen(true)}
            onOpenRoomModal={() => setIsRoomModalOpen(true)}
          />
        ) : (
          <PastArchive />
        )}
      </main>

      {/* Overlays */}
      <FutureBookingModal
        isOpen={isFutureModalOpen}
        onClose={() => setIsFutureModalOpen(false)}
      />
      <RoomBookingModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
      />
    </div>
  );
}
