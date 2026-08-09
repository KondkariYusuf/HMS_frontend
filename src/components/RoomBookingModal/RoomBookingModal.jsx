/**
 * @file RoomBookingModal.jsx
 * @description Refined Room Booking Modal component (Frame 5).
 * Instant physical room allocation and check-in modal.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} [props.onSuccess] - Callback after successful booking & allocation
 */
import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import useBookingActions from '@hooks/useBookingActions';
import useRoomAvailability from '@hooks/useRoomAvailability';
import useGuestLookup from '@hooks/useGuestLookup';
import styles from './RoomBookingModal.module.css';

export default function RoomBookingModal({ isOpen, onClose, onSuccess }) {
  const { createBooking, checkInGuest, actionLoading, actionError } = useBookingActions();
  const { fetchPhysicalRooms, physicalRooms } = useRoomAvailability();
  const { searchGuests, createGuestProfile } = useGuestLookup();

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [instantCheckIn, setInstantCheckIn] = useState(true);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPhysicalRooms('AVAILABLE');
    }
  }, [isOpen, fetchPhysicalRooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName || !guestPhone) {
      setFormError('Guest Full Name and Phone are required.');
      return;
    }
    if (!selectedRoomId) {
      setFormError('Please select an available physical room.');
      return;
    }

    const selectedRoom = physicalRooms.find((r) => r.id === selectedRoomId);
    if (!selectedRoom) {
      setFormError('Selected room is invalid.');
      return;
    }

    try {
      // 1. Lookup or create guest
      let guestId = null;
      const existing = await searchGuests(guestPhone);
      if (existing && existing.length > 0) {
        guestId = existing[0].id;
      } else {
        const nameParts = guestName.trim().split(' ');
        const newGuest = await createGuestProfile({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || 'Guest',
          phone: guestPhone,
        });
        guestId = newGuest.id;
      }

      // Today's date YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      // 2. Create instant booking with pinned physical room
      const payload = {
        checkIn: today,
        checkOut: tomorrow,
        source: 'WALK_IN',
        rooms: [
          {
            roomTypeId: selectedRoom.roomTypeId,
            roomId: selectedRoom.id,
            ratePerNight: selectedRoom.baseRate || 500000,
            adults: 1,
          },
        ],
        guests: [{ guestId, isPrimary: true }],
      };

      const newBooking = await createBooking(payload);

      // 3. Perform instant check-in if toggle is active
      if (instantCheckIn && newBooking?.id) {
        await checkInGuest(newBooking.id, { actualCheckInAt: new Date().toISOString() });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setFormError(err.message || 'Instant room booking failed.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instant Room Allocation & Check-In"
      footer={
        <div className={styles.footerActions}>
          <Button variant="ghost" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={actionLoading}>
            {actionLoading ? 'Processing...' : 'Confirm & Allocate'}
          </Button>
        </div>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {(formError || actionError) && (
          <div className={styles.errorBanner}>
            ⚠️ {formError || actionError}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="instantRoom">
            Available Physical Room *
          </label>
          <select
            id="instantRoom"
            className={styles.select}
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            required
          >
            <option value="">-- Select Available Room --</option>
            {physicalRooms.map((rm) => (
              <option key={rm.id} value={rm.id}>
                Room {rm.roomNumber} ({rm.roomTypeName || 'Deluxe'}) — Floor {rm.floor || 1}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="instantGuestName">
            Guest Full Name *
          </label>
          <input
            id="instantGuestName"
            type="text"
            className={styles.input}
            placeholder="Guest Full Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="instantGuestPhone">
            Guest Phone Number *
          </label>
          <input
            id="instantGuestPhone"
            type="tel"
            className={styles.input}
            placeholder="+919812345678"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            required
          />
        </div>

        <div className={styles.toggleRow}>
          <input
            id="instantCheckInToggle"
            type="checkbox"
            checked={instantCheckIn}
            onChange={(e) => setInstantCheckIn(e.target.checked)}
          />
          <label htmlFor="instantCheckInToggle" className={styles.toggleLabel}>
            Perform Instant Guest Check-In Now
          </label>
        </div>
      </form>
    </Modal>
  );
}
