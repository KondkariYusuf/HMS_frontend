/**
 * @file Hotel/Guests/Details/Index.jsx
 * @description Guest profile and stay history information screen connected to backend API.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Avatar from '@components/Avatar/Avatar';
import useHotelGuests from '@hooks/useHotelGuests';
import useBookings from '@hooks/useBookings';
import hotelGuestService from '@services/hotelGuestService';

import styles from './Index.module.css';

export default function GuestDetailsPage() {
  const navigate = useNavigate();
  const { guestId } = useParams();
  const { guests, loading: listLoading } = useHotelGuests();
  const { bookings } = useBookings();

  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compute live guest stays from bookings hook
  const guestStays = useMemo(() => {
    if (!guestId) return [];
    return bookings.filter((b) => {
      const pid = b.primaryGuestId || b.primaryGuest?.id;
      return String(pid) === String(guestId);
    });
  }, [bookings, guestId]);

  useEffect(() => {
    // 1. Try finding in list state first
    const found = guests.find((item) => String(item.id) === String(guestId));
    if (found) {
      setGuest(found);
      setLoading(false);
      return;
    }

    // 2. Fetch directly from backend API if not in list state
    async function fetchGuestById() {
      setLoading(true);
      try {
        const response = await hotelGuestService.getById(guestId);
        const g = response?.data?.data || response?.data;
        if (g && (g.id || g.firstName)) {
          const normalized = {
            id: g.id || guestId,
            firstName: g.firstName || '',
            lastName: g.lastName || '',
            name: `${g.firstName || ''} ${g.lastName || ''}`.trim() || 'Guest',
            email: g.email || '',
            phone: g.phone || g.phoneNumber || '',
            idType: g.idProofType || g.idType || 'OTHER',
            idNumber: g.idProofNumber || g.idNumber || '',
            status: g.status || 'ACTIVE',
            totalStays: g.totalStays || 0,
          };
          setGuest(normalized);
        } else {
          setGuest(null);
        }
      } catch (err) {
        console.warn('Failed to fetch guest details from API:', err);
        setGuest(null);
      } finally {
        setLoading(false);
      }
    }

    if (!listLoading) {
      fetchGuestById();
    }
  }, [guestId, guests, listLoading]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-secondary)' }}>
          <p>Loading guest profile details...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Guest Not Found</h1>
          <p>The requested guest profile (ID: {guestId}) could not be found.</p>

          <Button
            variant="primary"
            onClick={() => navigate('/hotel/guests')}
          >
            Back to Guest Directory
          </Button>
        </div>
      </div>
    );
  }

  const fullName = guest.name || `${guest.firstName} ${guest.lastName}`.trim() || 'Guest';
  const totalStaysCount = guestStays.length > 0 ? guestStays.length : guest.totalStays;

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate('/hotel/guests')}
      >
        ← Back to Guest Directory
      </button>

      <header className={styles.header}>
        <div className={styles.profileHeader}>
          <Avatar name={fullName} size="lg" />

          <div>
            <h1 className={styles.title}>{fullName}</h1>

            <p className={styles.guestId}>
              Guest ID: {guest.id}
            </p>

            <Badge
              variant={
                guest.status === 'ACTIVE'
                  ? 'in-house'
                  : guest.status === 'BLACKLISTED'
                    ? 'error'
                    : 'regular'
              }
            >
              {guest.status}
            </Badge>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate('/hotel/guests')}>Guest Directory</Button>

          <Button
            variant="primary"
            onClick={() => navigate('/hotel/check-in')}
          >
            Express Check-In
          </Button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>TOTAL STAYS</span>
          <strong className={styles.statValue}>
            {totalStaysCount}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>GUEST STATUS</span>
          <strong className={styles.statText}>
            {guest.status}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>ID TYPE</span>
          <strong className={styles.statText}>
            {String(guest.idType || 'OTHER').replaceAll('_', ' ')}
          </strong>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Personal Information</h2>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span>Full Name</span>
              <strong>{fullName}</strong>
            </div>

            <div className={styles.detailItem}>
              <span>Phone</span>
              <strong>{guest.phone || 'N/A'}</strong>
            </div>

            <div className={styles.detailItem}>
              <span>Email</span>
              <strong>{guest.email || 'N/A'}</strong>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Identity Document</h2>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span>Document Type</span>
              <strong>
                {String(guest.idType || 'OTHER').replaceAll('_', ' ')}
              </strong>
            </div>

            <div className={styles.detailItem}>
              <span>Document Number</span>
              <strong>{guest.idNumber || 'N/A'}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Stay History ({guestStays.length})</h2>
            <p>Previous and current stays associated with this guest.</p>
          </div>
        </div>

        {guestStays.length > 0 ? (
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Booking Ref</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Room</th>
                  <th style={{ padding: '12px 16px' }}>Check-In Date</th>
                  <th style={{ padding: '12px 16px' }}>Check-Out Date</th>
                  <th style={{ padding: '12px 16px' }}>Total Amount</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {guestStays.map((stay) => (
                  <tr key={stay.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                      {stay.bookingRef || stay.bookingNumber || `#BK-${stay.id?.slice(0, 6)}`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {stay.assignedRoom || 'Deluxe Room'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {stay.checkIn || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {stay.checkOut || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      ₹{Number(stay.totalAmount || stay.grandTotal || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge
                        variant={
                          stay.status === 'CHECKED_IN'
                            ? 'in-house'
                            : stay.status === 'CANCELLED'
                            ? 'error'
                            : 'regular'
                        }
                      >
                        {stay.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.historyEmpty}>
            <span className={styles.historyIcon}>▣</span>
            <strong>No stay history found</strong>
            <p>No previous or active bookings recorded for this guest in the system.</p>
          </div>
        )}
      </section>
    </div>
  );
}