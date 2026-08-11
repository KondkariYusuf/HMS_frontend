/**
 * @file Hotel/Reservations/Index.jsx
 * @description Hotel Reservations & Bookings Master Module Screen (Supports Frame 2 & Frame 3 views).
 * @reference Figma frame: Premium Upcoming Bookings Management & Refined Past Booking Archive
 */
import React, { useState } from 'react';
import UpcomingBookings from './UpcomingBookings';
import PastBookingsArchive from './PastBookingsArchive';
import styles from './Index.module.css';

export default function HotelReservationsPage() {
  const [activeTab, setActiveTab] = useState('UPCOMING');

  return (
    <div className={styles.page} data-testid="hotel-reservations-page">
      {/* Sub-Header Navigation Tabs */}
      <div className={styles.subHeaderBar}>
        <div className={styles.tabGroup}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'UPCOMING' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('UPCOMING')}
            data-testid="tab-upcoming"
          >
            Upcoming Bookings
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'ARCHIVE' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('ARCHIVE')}
            data-testid="tab-archive"
          >
            Past Booking Archive
          </button>
        </div>
      </div>

      {activeTab === 'UPCOMING' && (
        <UpcomingBookings onNavigateArchive={() => setActiveTab('ARCHIVE')} />
      )}

      {activeTab === 'ARCHIVE' && (
        <PastBookingsArchive onNavigateBack={() => setActiveTab('UPCOMING')} />
      )}
    </div>
  );
}
