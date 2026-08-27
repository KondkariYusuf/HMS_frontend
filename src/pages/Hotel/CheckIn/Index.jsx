/**
 * @file Hotel/CheckIn/Index.jsx
 * @description Express guest check-in / check-out desk.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import useBookings from '@hooks/useBookings';

import styles from './Index.module.css';

export default function HotelCheckInPage() {
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useBookings();

  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
  };

  const handleBackToGuest = () => {
    if (selectedGuest) {
      navigate(`/hotel/guests/${selectedGuest.id}`);
    }
  };

  return (
    <div
      className={styles.page}
      data-testid="hotel-check-in-page"
    >
      {/* =========================
          HEADER
      ========================= */}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Express Check-In / Check-Out
          </h1>

          <p className={styles.subtitle}>
            Quickly verify guests, complete check-in, and manage
            room access.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/hotel/guests')}
        >
          Guest Directory
        </Button>
      </header>

      {/* =========================
          SEARCH
      ========================= */}

      <section className={styles.searchCard}>
        <div className={styles.searchHeader}>
          <div>
            <h2>Find Guest</h2>

            <p>
              Search using guest name, phone, email, or ID.
            </p>
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
            setSelectedGuest(null);
          }}
        />
      </section>

      {/* =========================
          GUEST RESULTS
      ========================= */}

      <section className={styles.contentGrid}>
        <div className={styles.guestCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Available Guests</h2>

              <p>
                Select a guest to continue the check-in process.
              </p>
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

        {/* =========================
            CHECK-IN / CHECK-OUT PANEL
        ========================= */}

        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Check-In / Check-Out Details</h2>

              <p>
                Review guest information and manage stay status.
              </p>
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

              <p>
                Choose a booking from the list to manage check-in or check-out.
              </p>
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
                      await updateBookingStatus(selectedBooking.id, 'CHECKED_IN');
                      setSelectedBooking((prev) => prev ? { ...prev, status: 'CHECKED_IN' } : null);
                    }}
                  >
                    Complete Check-In
                  </Button>
                )}

                {selectedBooking.status === 'CHECKED_IN' && (
                  <Button
                    variant="primary"
                    onClick={async () => {
                      await updateBookingStatus(selectedBooking.id, 'CHECKED_OUT');
                      setSelectedBooking((prev) => prev ? { ...prev, status: 'CHECKED_OUT' } : null);
                    }}
                  >
                    Complete Check-Out
                  </Button>
                )}

                {selectedBooking.status !== 'CHECKED_OUT' && (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await updateBookingStatus(selectedBooking.id, 'CANCELLED');
                      setSelectedBooking((prev) => prev ? { ...prev, status: 'CANCELLED' } : null);
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

      {/* =========================
          WORKFLOW
      ========================= */}

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
    </div>
  );
}