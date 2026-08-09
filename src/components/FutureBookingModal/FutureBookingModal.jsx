/**
 * @file FutureBookingModal.jsx
 * @description Premium Future Booking Modal component (Frame 4).
 * Structured pop-up modal for creating future reservations.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility control
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} [props.onSuccess] - Callback executed on successful booking creation
 */
import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import useBookingActions from '@hooks/useBookingActions';
import useRoomAvailability from '@hooks/useRoomAvailability';
import useGuestLookup from '@hooks/useGuestLookup';
import styles from './FutureBookingModal.module.css';

export default function FutureBookingModal({ isOpen, onClose, onSuccess }) {
  const { createBooking, actionLoading, actionError } = useBookingActions();
  const { checkAvailability, roomTypes } = useRoomAvailability();
  const { searchGuests, createGuestProfile } = useGuestLookup();

  // Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState('');
  const [ratePerNight, setRatePerNight] = useState(0);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [source, setSource] = useState('DIRECT');
  const [depositAmount, setDepositAmount] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [formError, setFormError] = useState(null);

  // Trigger availability check when check-in or check-out changes
  useEffect(() => {
    if (checkIn && checkOut) {
      if (new Date(checkOut) <= new Date(checkIn)) {
        setFormError('Check-Out date must be strictly after Check-In date.');
        return;
      }
      setFormError(null);
      checkAvailability({ checkIn, checkOut, adults, children });
    }
  }, [checkIn, checkOut, adults, children, checkAvailability]);

  // Update default rate when room type changes
  const handleRoomTypeChange = (e) => {
    const rTypeId = e.target.value;
    setSelectedRoomTypeId(rTypeId);
    const selected = roomTypes.find((rt) => rt.roomTypeId === rTypeId);
    if (selected) {
      setRatePerNight(selected.baseRate || 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName || !guestPhone) {
      setFormError('Guest Full Name and Phone Number are required.');
      return;
    }
    if (!checkIn || !checkOut) {
      setFormError('Check-In and Check-Out dates are required.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setFormError('Check-Out date must be strictly after Check-In date.');
      return;
    }
    if (!selectedRoomTypeId) {
      setFormError('Please select a Room Type.');
      return;
    }

    try {
      // 1. Check or create guest profile
      let guestId = null;
      const existingGuests = await searchGuests(guestPhone);
      if (existingGuests && existingGuests.length > 0) {
        guestId = existingGuests[0].id;
      } else {
        const nameParts = guestName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Guest';
        const newGuest = await createGuestProfile({
          firstName,
          lastName,
          phone: guestPhone,
          email: guestEmail || undefined,
        });
        guestId = newGuest.id;
      }

      // 2. Build booking payload
      const payload = {
        checkIn,
        checkOut,
        source,
        specialRequests,
        rooms: [
          {
            roomTypeId: selectedRoomTypeId,
            ratePerNight: Math.round(Number(ratePerNight)),
            adults: Number(adults),
            children: Number(children),
          },
        ],
        guests: [
          {
            guestId,
            isPrimary: true,
          },
        ],
      };

      await createBooking(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to complete reservation.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Advance Future Booking"
      footer={
        <div className={styles.footerActions}>
          <Button variant="ghost" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={actionLoading}>
            {actionLoading ? 'Creating...' : 'Confirm Booking'}
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

        {/* Section 1: Guest Information */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>1. Primary Guest Details</h4>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="guestName">
                Full Name *
              </label>
              <input
                id="guestName"
                type="text"
                className={styles.input}
                placeholder="e.g. Aarav Sharma"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="guestPhone">
                Phone Number *
              </label>
              <input
                id="guestPhone"
                type="tel"
                className={styles.input}
                placeholder="+919812345678"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="guestEmail">
                Email Address
              </label>
              <input
                id="guestEmail"
                type="email"
                className={styles.input}
                placeholder="guest@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Dates & Schedule */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>2. Reservation Schedule</h4>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="checkIn">
                Check-In Date *
              </label>
              <input
                id="checkIn"
                type="date"
                className={styles.input}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="checkOut">
                Check-Out Date *
              </label>
              <input
                id="checkOut"
                type="date"
                className={styles.input}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Room Type & Rate */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>3. Room Selection</h4>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="roomType">
                Room Category *
              </label>
              <select
                id="roomType"
                className={styles.select}
                value={selectedRoomTypeId}
                onChange={handleRoomTypeChange}
                required
              >
                <option value="">-- Select Room Type --</option>
                {roomTypes.map((rt) => (
                  <option key={rt.roomTypeId} value={rt.roomTypeId}>
                    {rt.name} (Available: {rt.availableCount}) — ₹
                    {(rt.baseRate / 100).toFixed(2)}/night
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="rate">
                Rate / Night (Paisa)
              </label>
              <input
                id="rate"
                type="number"
                className={styles.input}
                value={ratePerNight}
                onChange={(e) => setRatePerNight(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="adults">
                Adults
              </label>
              <input
                id="adults"
                type="number"
                min="1"
                className={styles.input}
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="children">
                Children
              </label>
              <input
                id="children"
                type="number"
                min="0"
                className={styles.input}
                value={children}
                onChange={(e) => setChildren(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Source & Payment */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>4. Booking Source & Advance</h4>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="source">
                Booking Source
              </label>
              <select
                id="source"
                className={styles.select}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="DIRECT">Direct Website</option>
                <option value="WALK_IN">Walk-In Desk</option>
                <option value="PHONE">Phone Reservation</option>
                <option value="OTA">OTA / Travel Portal</option>
                <option value="CORPORATE">Corporate Booking</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="deposit">
                Deposit Amount (₹)
              </label>
              <input
                id="deposit"
                type="number"
                className={styles.input}
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="specialReq">
                Special Requests
              </label>
              <input
                id="specialReq"
                type="text"
                className={styles.input}
                placeholder="e.g. High floor, non-smoking"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
