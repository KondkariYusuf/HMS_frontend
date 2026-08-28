/**
 * @file Hotel/CheckIn/Index.jsx
 * @description Express guest check-in / check-out desk with Toast notifications.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Toast from '@components/Toast/Toast';
import useBookings from '@hooks/useBookings';
import bookingService from '@services/bookingService';
import paymentService from '@services/paymentService';
import BookingFolioModal from '@components/BookingFolioModal/BookingFolioModal';

import styles from './Index.module.css';

export default function HotelCheckInPage() {
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useBookings();

  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedFolioBooking, setSelectedFolioBooking] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to extract numeric amount safely without producing NaN
  const extractNumericAmount = (val) => {
    if (val == null) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Financial Guard: Prevent Check-Out if guest has an outstanding balance
  const handleCheckOutWithGuard = async (b) => {
    if (!b) return;
    let folio = {};
    try {
      const res = await bookingService.getFolio(b.id);
      folio = res?.data?.data || res?.data?.response || res?.data || {};
    } catch (err) {
      console.warn('Check-out getFolio response note:', err);
      folio = b.rawRecord?.bookingFolio || {};
    }

    // Fetch Live Payments from paymentService
    let livePaymentsTotal = extractNumericAmount(folio.totalPayments);
    try {
      const payRes = await paymentService.getAll({ bookingId: b.id });
      const payList = payRes?.data?.data?.responses || payRes?.data?.responses || payRes?.data?.rows || payRes?.data?.data || payRes?.data || [];
      if (Array.isArray(payList) && payList.length > 0) {
        const validPaySum = payList.reduce((sum, p) => {
          const st = (p.status || '').toLowerCase();
          if (st === 'failed' || st === 'refunded') return sum;
          return sum + extractNumericAmount(p.amount);
        }, 0);
        if (validPaySum > 0) {
          livePaymentsTotal = Math.max(livePaymentsTotal, validPaySum);
        }
      }
    } catch (payErr) {
      console.warn('Live payment fetch note:', payErr);
    }

    const liveChargesTotal = extractNumericAmount(folio.totalCharges) ||
      extractNumericAmount(b.grandTotal) ||
      extractNumericAmount(b.subtotal) ||
      extractNumericAmount(b.totalAmount);

    const isLockedOrClosed = (folio.status || '').toLowerCase() === 'locked' || (folio.status || '').toLowerCase() === 'closed';

    const folioBal = folio.balance !== undefined ? extractNumericAmount(folio.balance) : Math.max(0, liveChargesTotal - livePaymentsTotal);
    const netBalance = Math.min(folioBal, Math.max(0, liveChargesTotal - livePaymentsTotal));

    const isUnpaid = !isLockedOrClosed && netBalance > 0.01;

    if (isUnpaid) {
      const formattedBalance = netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      showToast(
        `Cannot Check-Out: Outstanding balance of ₹${formattedBalance} remaining. Please settle payment in Folio.`,
        'error'
      );
      setSelectedFolioBooking(b);
      return;
    }

    try {
      if (!isLockedOrClosed) {
        await bookingService.lockFolio(b.id);
      }
    } catch (e) {}

    await updateBookingStatus(b.id, 'CHECKED_OUT');
    setSelectedBooking((prev) => (prev ? { ...prev, status: 'CHECKED_OUT' } : null));
    showToast(`Check-Out completed successfully for ${b.primaryGuest?.name || 'Guest'}! Folio sealed.`, 'success');
  };

  const arrivingBookings = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return bookings.filter((b) => {
      const fullName = (b.primaryGuest?.name || '').toLowerCase();
      const email = (b.primaryGuest?.email || '').toLowerCase();
      const phone = (b.primaryGuest?.phone || '').toLowerCase();
      const ref = (b.bookingRef || b.id || '').toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        ref.includes(searchValue);

      return matchesSearch;
    });
  }, [bookings, search]);

  return (
    <div
      className={styles.page}
      data-testid="hotel-check-in-page"
    >
      {/* Toast Feedback Banner */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Express Check-In / Check-Out
          </h1>

          <p className={styles.subtitle}>
            Quickly verify guests, complete check-in, and manage room access.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/hotel/guests')}
        >
          Guest Directory
        </Button>
      </header>

      {/* SEARCH */}
      <section className={styles.searchCard}>
        <div className={styles.searchHeader}>
          <div>
            <h2>Find Guest</h2>
            <p>Search using guest name, phone, email, or ID.</p>
          </div>

          <span className={styles.stepBadge}>
            STEP 1
          </span>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search guest by name, phone, email or ID..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedBooking(null);
          }}
        />
      </section>

      {/* GUEST RESULTS */}
      <section className={styles.contentGrid}>
        <div className={styles.guestCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Available Guests</h2>
              <p>Select a guest to continue the check-in process.</p>
            </div>

            <span className={styles.count}>
              {arrivingBookings.length}
            </span>
          </div>

          <div className={styles.guestList}>
            {arrivingBookings.map((booking) => {
              const guestName = booking.primaryGuest?.name || 'Guest';
              const isSelected = selectedBooking?.id === booking.id;

              return (
                <button
                  type="button"
                  key={booking.id}
                  className={`${styles.guestRow} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className={styles.guestInfo}>
                    <div className={styles.avatar}>
                      {guestName.charAt(0)}
                    </div>

                    <div>
                      <strong>{guestName}</strong>
                      <span>{booking.primaryGuest?.phone || booking.bookingRef}</span>
                      <small>{booking.id}</small>
                    </div>
                  </div>

                  <Badge
                    variant={
                      booking.status === 'CHECKED_IN'
                        ? 'in-house'
                        : booking.status === 'CHECKED_OUT'
                        ? 'regular'
                        : 'arriving'
                    }
                  >
                    {booking.status}
                  </Badge>
                </button>
              );
            })}

            {arrivingBookings.length === 0 && (
              <div className={styles.emptyState}>
                No booking or guest found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* CHECK-IN / CHECK-OUT PANEL */}
        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Check-In / Check-Out Details</h2>
              <p>Review guest information and manage stay status.</p>
            </div>

            <span className={styles.count}>
              STEP 2
            </span>
          </div>

          {!selectedBooking ? (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>
                ✓
              </div>

              <strong>Select a booking / guest</strong>
              <p>Choose a booking from the list to manage check-in or check-out.</p>
            </div>
          ) : (
            <div className={styles.selectedPanel}>
              <div className={styles.selectedHeader}>
                <div>
                  <span className={styles.label}>
                    SELECTED BOOKING
                  </span>

                  <h3>
                    {selectedBooking.primaryGuest?.name || 'Guest'}
                  </h3>
                </div>

                <Badge variant={selectedBooking.status === 'CHECKED_IN' ? 'in-house' : 'regular'}>
                  {selectedBooking.status}
                </Badge>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <span>Booking Ref</span>
                  <strong>{selectedBooking.bookingRef || selectedBooking.id}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedBooking.primaryGuest?.phone || 'N/A'}</strong>
                </div>

                <div>
                  <span>Check-In Date</span>
                  <strong>{selectedBooking.checkIn}</strong>
                </div>

                <div>
                  <span>Check-Out Date</span>
                  <strong>{selectedBooking.checkOut}</strong>
                </div>
              </div>

              <div className={styles.actionButtons}>
                {selectedBooking.status !== 'CHECKED_IN' && selectedBooking.status !== 'CHECKED_OUT' && (
                  <Button
                    variant="primary"
                    onClick={async () => {
                      try {
                        await updateBookingStatus(selectedBooking.id, 'CHECKED_IN');
                        setSelectedBooking((prev) => (prev ? { ...prev, status: 'CHECKED_IN' } : null));
                        showToast(`Check-In completed successfully for ${selectedBooking.primaryGuest?.name || 'Guest'}!`, 'success');
                      } catch (err) {
                        showToast('Failed to complete check-in.', 'error');
                      }
                    }}
                  >
                    Complete Check-In
                  </Button>
                )}

                {selectedBooking.status === 'CHECKED_IN' && (
                  <Button
                    variant="primary"
                    onClick={() => handleCheckOutWithGuard(selectedBooking)}
                  >
                    Complete Check-Out
                  </Button>
                )}

                {selectedBooking.status !== 'CHECKED_OUT' && (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await updateBookingStatus(selectedBooking.id, 'CANCELLED');
                        setSelectedBooking((prev) => (prev ? { ...prev, status: 'CANCELLED' } : null));
                        showToast(`Booking ${selectedBooking.bookingRef} cancelled.`, 'info');
                      } catch (err) {
                        showToast('Failed to cancel booking.', 'error');
                      }
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className={styles.workflowCard}>
        <div className={styles.workflowStep}>
          <span className={styles.workflowNumber}>1</span>
          <div>
            <strong>Find Guest</strong>
            <p>Search and select the guest.</p>
          </div>
        </div>

        <div className={styles.workflowLine} />

        <div className={styles.workflowStep}>
          <span className={styles.workflowNumber}>2</span>
          <div>
            <strong>Verify Details</strong>
            <p>Confirm identity and booking.</p>
          </div>
        </div>

        <div className={styles.workflowLine} />

        <div className={styles.workflowStep}>
          <span className={styles.workflowNumber}>3</span>
          <div>
            <strong>Complete Check-In</strong>
            <p>Issue room access and finish.</p>
          </div>
        </div>
      </section>

      {/* Booking Folio Modal */}
      {selectedFolioBooking && (
        <BookingFolioModal
          isOpen={!!selectedFolioBooking}
          onClose={() => setSelectedFolioBooking(null)}
          booking={selectedFolioBooking}
          onToast={showToast}
        />
      )}
    </div>
  );
}