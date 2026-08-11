/**
 * @file RoomBookingModal.jsx
 * @description Walk-in Room Booking Modal with native label-wrapped file uploader (Frame 4: Refined Room Booking Modal).
 * Strictly consumes design tokens from tokens.css via CSS Modules.
 * @reference Figma frame: Refined Room Booking Modal (frames/refined room booking modal.jpeg)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility flag
 * @param {Function} props.onClose - Modal close handler
 * @param {Object} [props.roomData] - Selected room object details
 * @param {Function} [props.onBookingSuccess] - Success callback when booking is saved
 */
import React, { useState, useMemo } from 'react';
import styles from './RoomBookingModal.module.css';

export default function RoomBookingModal({
  isOpen,
  onClose,
  roomData = { roomNumber: '301', roomType: 'Executive King Suite', pricePerNight: 320, status: 'VACANT' },
  onBookingSuccess,
}) {
  // Core Form State
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-07-30');
  const [checkInTime, setCheckInTime] = useState('8:15 PM');
  const [checkoutDate, setCheckoutDate] = useState('2026-08-02');
  const [checkoutTime, setCheckoutTime] = useState('11:00 AM');
  const [guestsCount, setGuestsCount] = useState('1');
  const [bookingSource, setBookingSource] = useState('Unspecified');
  const [billNumber, setBillNumber] = useState('INV-001');

  // Interactive Buttons & Drawers State
  const [selectedRooms, setSelectedRooms] = useState([roomData.roomNumber || '301']);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [policeRecord, setPoliceRecord] = useState({ id: '', status: 'NOT_SUBMITTED' });
  const [isPoliceModalOpen, setIsPoliceModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isMultiRoomModalOpen, setIsMultiRoomModalOpen] = useState(false);
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [policeInputVal, setPoliceInputVal] = useState('POL-2026-9901');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Tariff Calculations
  const tariffDetails = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkoutDate);
    const diffTime = Math.max(1, Math.abs(end - start));
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const rate = roomData?.pricePerNight || 320;
    const roomCount = selectedRooms.length;
    const roomSubtotal = nights * rate * roomCount;
    const taxes = Math.round(roomSubtotal * 0.12);
    const grandTotal = roomSubtotal + taxes;

    return { nights, rate, roomCount, roomSubtotal, taxes, grandTotal };
  }, [checkInDate, checkoutDate, roomData, selectedRooms]);

  if (!isOpen) return null;

  // File Upload Native Callback
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => f.name);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleAddSampleDocument = () => {
    setAttachedFiles((prev) => [...prev, `Guest_ID_Scan_${prev.length + 1}.pdf`]);
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Police Record Verification Callback
  const handleSavePoliceRecord = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPoliceRecord({ id: policeInputVal || 'POL-2026-9901', status: 'VERIFIED' });
    setIsPoliceModalOpen(false);
  };

  // Camera Photo Capture Simulation
  const handleCapturePhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCapturedPhoto('Guest_Photo_ID_Captured.jpg');
    setIsCameraModalOpen(false);
  };

  // Toggle Additional Rooms
  const handleToggleRoomSelection = (rNum) => {
    if (selectedRooms.includes(rNum)) {
      if (selectedRooms.length > 1) {
        setSelectedRooms(selectedRooms.filter((r) => r !== rNum));
      }
    } else {
      setSelectedRooms([...selectedRooms, rNum]);
    }
  };

  // Main Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Guest Name is required.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const bookingPayload = {
      roomNumber: selectedRooms.join(', '),
      primaryGuest: {
        name: guestName,
        phone,
      },
      checkIn: checkInDate,
      checkInTime,
      checkOut: checkoutDate,
      checkoutTime,
      guestsCount,
      bookingSource,
      billNumber,
      attachedFiles,
      policeRecord,
      capturedPhoto,
      totalAmount: tariffDetails.grandTotal * 100,
      paidAmount: tariffDetails.grandTotal * 100,
      status: 'CHECKED_IN',
      createdAt: new Date().toISOString(),
    };

    window.setTimeout(() => {
      setIsSubmitting(false);
      if (onBookingSuccess) {
        onBookingSuccess(bookingPayload);
      }
      onClose();
    }, 300);
  };

  return (
    <div className={styles.backdrop} onClick={onClose} data-testid="room-booking-modal">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header Block */}
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.newStayTag}>NEW STAY</span>
            <h1 className={styles.roomTitle}>
              Room {selectedRooms.join(', ')}
            </h1>
            <p className={styles.subtitle}>Enter guest details • documents • billing</p>
          </div>
          <span className={styles.vacantBadge}>● {roomData.status || 'VACANT'}</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

          {/* Section 1: GUEST Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>👤</span> GUEST
              </h3>
              <button
                type="button"
                className={styles.addGuestLink}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                + ADD GUEST
              </button>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  GUEST NAME <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter Guest Name"
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
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: STAY Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>📅</span> STAY
              </h3>
            </div>

            <div className={styles.stayGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  CHECK-IN DATE <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>CHECK-IN TIME</label>
                <select
                  className={styles.select}
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                >
                  <option value="8:15 PM">8:15 PM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  CHECKOUT DATE <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={checkoutDate}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>CHECKOUT TIME</label>
                <select
                  className={styles.select}
                  value={checkoutTime}
                  onChange={(e) => setCheckoutTime(e.target.value)}
                >
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>GUESTS</label>
                <select
                  className={styles.select}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>BOOKING SOURCE</label>
                <select
                  className={styles.select}
                  value={bookingSource}
                  onChange={(e) => setBookingSource(e.target.value)}
                >
                  <option value="Unspecified">Unspecified</option>
                  <option value="Direct Website">Direct Website</option>
                  <option value="OTA Booking">OTA Booking</option>
                  <option value="Walk-In">Walk-In</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>BILL NUMBER</label>
                <input
                  type="text"
                  className={styles.input}
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Pills Row */}
          <div className={styles.pillsRow}>
            <button
              type="button"
              className={styles.pillBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowBillingDetails((prev) => !prev);
              }}
              data-testid="billing-details-pill-btn"
            >
              💰 Billing Details {showBillingDetails ? '▲' : '▼'}
            </button>

            <button
              type="button"
              className={`${styles.pillBtn} ${
                policeRecord.status === 'VERIFIED' ? styles.activeVerifiedPill : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPoliceModalOpen(true);
              }}
              data-testid="police-record-pill-btn"
            >
              📋 {policeRecord.status === 'VERIFIED' ? `Verified #${policeRecord.id}` : '+ Police Record'}
            </button>

            {/* Native Label Wrapper for 100% Reliable File Picker */}
            <label
              className={`${styles.pillBtn} ${styles.fileLabelPill}`}
              data-testid="choose-files-label-btn"
            >
              📎 Choose Files ({attachedFiles.length})
              <input
                type="file"
                className={styles.hiddenNativeFileInput}
                multiple
                onChange={handleFileChange}
              />
            </label>

            <button
              type="button"
              className={`${styles.iconPillBtn} ${capturedPhoto ? styles.activeVerifiedPill : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCameraModalOpen(true);
              }}
              title="Capture Guest Photo"
              data-testid="camera-pill-btn"
            >
              📷
            </button>
          </div>

          {/* Attached Files & Photo Badges Bar */}
          <div className={styles.attachmentsRow}>
            {attachedFiles.map((fname, idx) => (
              <span key={idx} className={styles.attachmentBadge}>
                📄 {fname}{' '}
                <button
                  type="button"
                  className={styles.removeFileBtn}
                  onClick={() => handleRemoveFile(idx)}
                  title="Remove File"
                >
                  ✕
                </button>
              </span>
            ))}
            {capturedPhoto && (
              <span className={styles.attachmentBadge}>
                🖼️ {capturedPhoto}{' '}
                <button
                  type="button"
                  className={styles.removeFileBtn}
                  onClick={() => setCapturedPhoto(null)}
                  title="Remove Photo"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              className={styles.addSampleFileBtn}
              onClick={handleAddSampleDocument}
            >
              + Quick Attach Sample ID
            </button>
          </div>

          {/* Billing Drawer */}
          {showBillingDetails && (
            <div className={styles.billingDrawer} data-testid="billing-drawer">
              <div className={styles.drawerRow}>
                <span>Selected Rooms ({tariffDetails.roomCount}):</span>
                <span>{selectedRooms.join(', ')}</span>
              </div>
              <div className={styles.drawerRow}>
                <span>Tariff ({tariffDetails.nights} Nights @ ${tariffDetails.rate}/night):</span>
                <span>${tariffDetails.roomSubtotal.toFixed(2)}</span>
              </div>
              <div className={styles.drawerRow}>
                <span>Taxes & Fees (12%):</span>
                <span>${tariffDetails.taxes.toFixed(2)}</span>
              </div>
              <div className={styles.drawerTotalRow}>
                <span>Total Amount Payable:</span>
                <strong>${tariffDetails.grandTotal.toFixed(2)}</strong>
              </div>
            </div>
          )}

          {/* Modal Footer Bar */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.bookMultipleBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMultiRoomModalOpen(true);
              }}
              data-testid="book-multiple-rooms-btn"
            >
              🏢 Book Multiple Rooms ({selectedRooms.length})
            </button>

            <div className={styles.footerRightActions}>
              <button
                type="button"
                className={styles.closeTextBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className={styles.saveBookingBtn}
                disabled={isSubmitting}
                data-testid="save-booking-btn"
              >
                📥 {isSubmitting ? 'Saving...' : 'Save Booking'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 1. POLICE RECORD OVERLAY MODAL */}
      {isPoliceModalOpen && (
        <div
          className={styles.subModalBackdrop}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPoliceModalOpen(false);
          }}
        >
          <div className={styles.subModalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.subModalTitle}>📋 Police Verification Record</h3>
            <p className={styles.subModalText}>
              Enter Local Guest Police Verification / Passport ID Reference:
            </p>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. POL-2026-9901"
              value={policeInputVal}
              onChange={(e) => setPoliceInputVal(e.target.value)}
            />
            <div className={styles.subModalFooter}>
              <button
                type="button"
                className={styles.closeTextBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsPoliceModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBookingBtn}
                onClick={handleSavePoliceRecord}
              >
                Verify & Attach Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAMERA PHOTO CAPTURE OVERLAY MODAL */}
      {isCameraModalOpen && (
        <div
          className={styles.subModalBackdrop}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsCameraModalOpen(false);
          }}
        >
          <div className={styles.subModalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.subModalTitle}>📷 Capture Guest ID Photo</h3>
            <div className={styles.viewfinderBox}>
              <span className={styles.cameraIconBig}>📷</span>
              <p>Webcam Viewfinder Active</p>
            </div>
            <div className={styles.subModalFooter}>
              <button
                type="button"
                className={styles.closeTextBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCameraModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBookingBtn}
                onClick={handleCapturePhoto}
              >
                Snap Photo & Attach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOOK MULTIPLE ROOMS SELECTION OVERLAY MODAL */}
      {isMultiRoomModalOpen && (
        <div
          className={styles.subModalBackdrop}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMultiRoomModalOpen(false);
          }}
        >
          <div className={styles.subModalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.subModalTitle}>🏢 Select Additional Rooms</h3>
            <p className={styles.subModalText}>Toggle rooms to combine into this booking:</p>
            <div className={styles.multiRoomGrid}>
              {['301', '302', '303', '304', '305'].map((rNum) => (
                <button
                  key={rNum}
                  type="button"
                  className={`${styles.roomSelectChip} ${
                    selectedRooms.includes(rNum) ? styles.activeChip : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleRoomSelection(rNum);
                  }}
                >
                  Room {rNum} {selectedRooms.includes(rNum) ? '✔' : ''}
                </button>
              ))}
            </div>
            <div className={styles.subModalFooter}>
              <button
                type="button"
                className={styles.saveBookingBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMultiRoomModalOpen(false);
                }}
              >
                Done ({selectedRooms.length} Rooms Selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
