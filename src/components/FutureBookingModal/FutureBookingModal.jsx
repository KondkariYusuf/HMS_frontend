/**
 * @file FutureBookingModal.jsx
 * @description Modal form component for advance room reservations and future booking creation (Frame 5: Premium Future Booking Modal).
 * Strictly reproduces the visual composition, card containers, inputs, and button styling of frames/premium future booking modal.jpeg.
 * @reference Figma frame: Premium Future Booking Modal (frames/premium future booking modal.jpeg)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility flag
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} [props.onBookingCreated] - Callback when new future booking is created
 */
import React, { useState } from 'react';
import styles from './FutureBookingModal.module.css';

export default function FutureBookingModal({ isOpen, onClose, onBookingCreated }) {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Room requirement items (supports Add Another Room)
  const [roomRequirements, setRoomRequirements] = useState([
    { id: 'rr-1', roomType: '', paymentMode: '', rentPerNight: '', advanceDeposit: '' },
  ]);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddAnotherRoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRoomRequirements((prev) => [
      ...prev,
      { id: `rr-${Date.now()}`, roomType: '', paymentMode: '', rentPerNight: '', advanceDeposit: '' },
    ]);
  };

  const handleRoomChange = (index, field, value) => {
    setRoomRequirements((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Guest Name is required.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const firstRoom = roomRequirements[0];
    const rentAmount = parseFloat(firstRoom?.rentPerNight) || 250;
    const depositAmount = parseFloat(firstRoom?.advanceDeposit) || 50;

    const bookingPayload = {
      guestName,
      guestPhone: phone,
      guestEmail: `${guestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      roomName: firstRoom?.roomType || 'Deluxe Ocean Suite',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      totalAmount: rentAmount * 3 * 100,
      paidAmount: depositAmount * 100,
      source: 'DIRECT',
      status: 'CONFIRMED',
    };

    window.setTimeout(() => {
      setIsSubmitting(false);
      if (onBookingCreated) {
        onBookingCreated(bookingPayload);
      }
      onClose();
    }, 300);
  };

  return (
    <div className={styles.backdrop} onClick={onClose} data-testid="future-booking-modal">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header Block */}
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.headerTag}>FUTURE RESERVATION</span>
            <h1 className={styles.modalTitle}>Make Future Booking</h1>
            <p className={styles.subtitle}>
              Reserve rooms and schedule upcoming stays for premium guests.
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

          {/* Card 1: Guest Information */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircle}>👤</div>
              <h3 className={styles.sectionTitle}>Guest Information</h3>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  GUEST NAME <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter full name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>PHONE NUMBER</label>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Room Requirements */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircle}>🛏️</div>
              <h3 className={styles.sectionTitle}>Room Requirements</h3>
            </div>

            {roomRequirements.map((room, idx) => (
              <div key={room.id} className={styles.subCardBox}>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>ROOM TYPE</label>
                    <select
                      className={styles.select}
                      value={room.roomType}
                      onChange={(e) => handleRoomChange(idx, 'roomType', e.target.value)}
                    >
                      <option value="">Select Room Type</option>
                      <option value="Deluxe Ocean Suite">Deluxe Ocean Suite</option>
                      <option value="Executive King Suite">Executive King Suite</option>
                      <option value="Junior Suite">Junior Suite</option>
                      <option value="Penthouse Suite">Penthouse Suite</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>PAYMENT MODE</label>
                    <select
                      className={styles.select}
                      value={room.paymentMode}
                      onChange={(e) => handleRoomChange(idx, 'paymentMode', e.target.value)}
                    >
                      <option value="">Select Mode</option>
                      <option value="CREDIT_CARD">Credit Card / Debit Card</option>
                      <option value="CASH">Cash Deposit</option>
                      <option value="UPI">UPI / Online Transfer</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>RENT / NIGHT</label>
                    <div className={styles.currencyInputBox}>
                      <span className={styles.currencyPrefix}>$</span>
                      <input
                        type="number"
                        className={styles.currencyInput}
                        placeholder="0.00"
                        value={room.rentPerNight}
                        onChange={(e) => handleRoomChange(idx, 'rentPerNight', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>ADVANCE DEPOSIT</label>
                    <div className={styles.currencyInputBox}>
                      <span className={styles.currencyPrefix}>$</span>
                      <input
                        type="number"
                        className={styles.currencyInput}
                        placeholder="0.00"
                        value={room.advanceDeposit}
                        onChange={(e) => handleRoomChange(idx, 'advanceDeposit', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className={styles.addAnotherRoomBtn}
              onClick={handleAddAnotherRoom}
              data-testid="add-another-room-btn"
            >
              ⊕ Add Another Room
            </button>
          </div>

          {/* Modal Footer Bar */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveFutureBtn}
              disabled={isSubmitting}
              data-testid="save-future-booking-btn"
            >
              {isSubmitting ? 'Saving...' : 'Save Future Booking ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
