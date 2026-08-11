/**
 * @file Hotel/Rooms/Index.jsx
 * @description Hotel room types, rooms grid, and floor layout management screen (Frame 4: Refined Room Booking Modal).
 * @reference Figma frame: Hotel - Rooms Setup & Refined Room Booking Modal (frames/refined room booking modal.jpeg)
 */
import React, { useState } from 'react';
import useBookings from '@hooks/useBookings';
import Button from '@components/Button/Button';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import RoomBookingModal from '@components/RoomBookingModal/RoomBookingModal';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import styles from './Index.module.css';

export default function HotelRoomsPage() {
  const { createBooking } = useBookings();

  const [isFloorModalOpen, setFloorModalOpen] = useState(false);
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);

  const roomsList = [
    { roomNumber: '204', roomType: 'Deluxe Ocean Suite', pricePerNight: 250, floor: 'Floor 2', status: 'VACANT' },
    { roomNumber: '301', roomType: 'Executive King Suite', pricePerNight: 320, floor: 'Floor 3', status: 'VACANT' },
    { roomNumber: '102', roomType: 'Junior Suite', pricePerNight: 190, floor: 'Floor 1', status: 'VACANT' },
    { roomNumber: '501', roomType: 'Penthouse Suite', pricePerNight: 550, floor: 'Floor 5', status: 'MAINTENANCE' },
  ];

  const housekeepingSegments = [
    { label: 'Occupied (156 Rooms)', value: 78, color: 'var(--color-primary)' },
    { label: 'Vacant Clean (34 Rooms)', value: 17, color: 'var(--color-primary-dark)' },
    { label: 'Dirty / Cleaning Needed (8 Rooms)', value: 4, color: 'var(--color-primary-tint)' },
    { label: 'Maintenance (2 Rooms)', value: 1, color: 'var(--color-error)' },
  ];

  const handleBookingSuccess = (bookingPayload) => {
    createBooking({
      guestName: bookingPayload.primaryGuest.name,
      guestEmail: bookingPayload.primaryGuest.email,
      guestPhone: bookingPayload.primaryGuest.phone,
      roomName: `${bookingPayload.roomNumber} - ${bookingPayload.roomType}`,
      checkIn: bookingPayload.checkIn,
      checkOut: bookingPayload.checkOut,
      source: 'WALK_IN',
      totalAmount: bookingPayload.totalAmount,
      paidAmount: bookingPayload.paidAmount,
      status: 'CHECKED_IN',
    });
    setSelectedRoomModal(null);
  };

  return (
    <div className={styles.page} data-testid="hotel-rooms-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Hotel Rooms & Floors Management</h1>
          <p className={styles.subtitle}>
            Manage room status, floor layouts, and launch quick walk-in room bookings.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setFloorModalOpen(true)}>
          Configure Floor Layout
        </Button>
      </header>

      <div className={styles.overviewCard}>
        <h3 className={styles.cardTitle}>Property Room Capacity</h3>
        <ProgressBar segments={housekeepingSegments} showLegend />
      </div>

      <div className={styles.roomGrid}>
        {roomsList.map((room) => (
          <div key={room.roomNumber} className={styles.roomCard}>
            <div className={styles.cardHeader}>
              <span className={styles.roomTitle}>Room {room.roomNumber}</span>
              <span className={`${styles.statusBadge} ${styles[room.status.toLowerCase()]}`}>
                {room.status}
              </span>
            </div>
            <p className={styles.roomType}>{room.roomType}</p>
            <p className={styles.roomMeta}>{room.floor} • ${room.pricePerNight} / night</p>

            <Button
              variant="primary"
              onClick={() => setSelectedRoomModal(room)}
              data-testid={`book-room-${room.roomNumber}-btn`}
            >
              🔑 Book & Check-In
            </Button>
          </div>
        ))}
      </div>

      {/* Frame 4 Modal Overlay */}
      {selectedRoomModal && (
        <RoomBookingModal
          isOpen={Boolean(selectedRoomModal)}
          onClose={() => setSelectedRoomModal(null)}
          roomData={selectedRoomModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      <FloorConfigurationModal
        isOpen={isFloorModalOpen}
        onClose={() => setFloorModalOpen(false)}
        onSave={() => setFloorModalOpen(false)}
      />
    </div>
  );
}
