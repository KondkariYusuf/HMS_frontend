/**
 * @file Dashboard/Index.jsx
 * @description Refined Teal Hospitality Dashboard screen for Front Desk & Bookings (Frame 1).
 * @figmaFrame Figma frame: Refined Teal Hospitality Dashboard
 *
 * Integrated components: KpiCard, ProgressBar, ChartCard, AgendaCard, DataTable, QuickActionsGrid, Timeline, FutureBookingModal, RoomBookingModal
 */
import React, { useState } from 'react';
import useBookings from '@hooks/useBookings';
import KpiCard from '@components/KpiCard/KpiCard';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import ChartCard from '@components/ChartCard/ChartCard';
import AgendaCard from '@components/AgendaCard/AgendaCard';
import DataTable from '@components/DataTable/DataTable';
import QuickActionsGrid from '@components/QuickActionsGrid/QuickActionsGrid';
import Timeline from '@components/Timeline/Timeline';
import FutureBookingModal from '@components/FutureBookingModal/FutureBookingModal';
import RoomBookingModal from '@components/RoomBookingModal/RoomBookingModal';
import styles from './Index.module.css';

export default function DashboardPage() {
  const { bookings, loading, meta, refetch } = useBookings({ limit: 5 });

  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Compute live Front Desk KPIs from fetched bookings & meta
  const totalReservations = meta?.total || bookings.length || 0;
  const checkInsToday = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const inHouseGuests = bookings.filter((b) => b.status === 'CHECKED_IN').length;

  const tableData = bookings.map((item) => ({
    id: item.id,
    guest: {
      name: item.primaryGuest?.name || 'Guest',
      tag: item.bookingRef || 'REF-N/A',
    },
    room: item.rooms?.[0]?.roomNumber
      ? `Room ${item.rooms[0].roomNumber}`
      : 'Standard Suite',
    dates: `${item.checkIn || ''} - ${item.checkOut || ''}`,
    status: item.status || 'CONFIRMED',
  }));

  return (
    <div className={styles.page} data-testid="dashboard-page">
      <header className={styles.header}>
        <h1 className={styles.title}>Refined Front Desk Hospitality Dashboard</h1>
        <p className={styles.subtitle}>
          Operational Command Center — Reservations, Check-ins, and Live Guest Stays
        </p>
      </header>

      {/* Front Desk KPI Cards Row */}
      <section className={styles.kpiGrid}>
        <KpiCard
          label="TOTAL RESERVATIONS"
          value={String(totalReservations)}
          delta="+12.4%"
        />
        <KpiCard
          label="CHECK-INS TODAY"
          value={String(checkInsToday)}
          delta="+5.1%"
        />
        <KpiCard
          label="IN-HOUSE GUESTS"
          value={String(inHouseGuests)}
          delta="+18.2%"
        />
        <KpiCard
          label="OCCUPANCY RATE"
          value="84%"
          delta="+2.0%"
          isPositive={true}
        />
      </section>

      {/* Main Front Desk Grid */}
      <section className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <ChartCard title="Occupancy & Booking Forecast" />
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>{"Today's Room Occupancy Distribution"}</h3>
            <ProgressBar />
          </div>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>Recent Front Desk Bookings</h3>
            {loading ? (
              <p>Loading recent bookings...</p>
            ) : (
              <DataTable data={tableData} />
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>Quick Front-Desk Actions</h3>
            <QuickActionsGrid
              onActionClick={(act) => {
                if (act.id === 'new-booking') setIsFutureModalOpen(true);
                if (act.id === 'check-in') setIsRoomModalOpen(true);
              }}
            />
          </div>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>{"Today's Guest Arrival Agenda"}</h3>
            <div className={styles.agendaList}>
              <AgendaCard
                date="09:00 AM"
                title="VIP Guest Arrival — Executive Suite 02"
              />
              <AgendaCard
                date="11:30 AM"
                title="Group Check-in — Deluxe Wing"
                status="pending"
              />
            </div>
          </div>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>Recent Activity Stream</h3>
            <Timeline />
          </div>
        </div>
      </section>

      {/* Interactive Overlays */}
      <FutureBookingModal
        isOpen={isFutureModalOpen}
        onClose={() => setIsFutureModalOpen(false)}
        onSuccess={() => refetch()}
      />
      <RoomBookingModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

