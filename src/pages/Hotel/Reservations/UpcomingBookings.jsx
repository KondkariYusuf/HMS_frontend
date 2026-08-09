/**
 * @file UpcomingBookings.jsx
 * @description Upcoming Bookings Management view (Frame 2 - Premium Upcoming Bookings Management).
 * Features filtered reservation listing, check-in actions, status badges, and search toolbar.
 *
 * @param {Object} props
 * @param {Function} [props.onOpenFutureModal] - Trigger to open Future Booking Modal
 * @param {Function} [props.onOpenRoomModal] - Trigger to open Instant Room Booking Modal
 */
import React, { useState } from 'react';
import useBookings from '@hooks/useBookings';
import useBookingActions from '@hooks/useBookingActions';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Toast from '@components/Toast/Toast';
import styles from './UpcomingBookings.module.css';

export default function UpcomingBookings({ onOpenFutureModal, onOpenRoomModal }) {
  const { bookings, loading, error, filters, setFilters, refetch } = useBookings({
    sortBy: 'checkIn',
    sortOrder: 'asc',
  });
  const { checkInGuest, cancelBooking, actionLoading } = useBookingActions();

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleStatusTabChange = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleDateChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleCheckIn = async (bookingRow) => {
    try {
      await checkInGuest(bookingRow.id, { actualCheckInAt: new Date().toISOString() });
      setToastType('success');
      setToastMessage(`Guest ${bookingRow.primaryGuest?.name || ''} checked in successfully!`);
      refetch();
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Check-in failed.');
    }
  };

  const handleCancel = async (bookingRow) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingRow.bookingRef}?`)) {
      return;
    }
    try {
      await cancelBooking(bookingRow.id, { reason: 'Cancelled by front desk' });
      setToastType('success');
      setToastMessage(`Booking ${bookingRow.bookingRef} cancelled.`);
      refetch();
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Cancellation failed.');
    }
  };

  // Map API status string to Badge variant
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'CHECKED_IN':
        return 'in-house';
      case 'CONFIRMED':
        return 'arriving';
      case 'PENDING':
        return 'regular';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'error';
      case 'CHECKED_OUT':
        return 'checked-out';
      default:
        return 'regular';
    }
  };

  // Format table columns
  const columns = [
    { key: 'guest', title: 'Guest Name & Ref' },
    { key: 'room', title: 'Room / Category' },
    { key: 'dates', title: 'Check In / Out' },
    { key: 'balance', title: 'Balance Amount' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' },
  ];

  // Transform backend bookings to DataTable rows
  const tableData = bookings.map((item) => {
    const primaryGuestName = item.primaryGuest?.name || 'Guest';
    const roomInfo =
      item.rooms && item.rooms[0]
        ? `Room ${item.rooms[0].roomNumber || item.rooms[0].roomTypeName || 'Assigned'}`
        : item.roomCount
        ? `${item.roomCount} Room(s)`
        : 'Standard Room';

    return {
      id: item.id,
      raw: item,
      guest: {
        name: primaryGuestName,
        tag: item.bookingRef || 'REF-N/A',
      },
      room: roomInfo,
      dates: `${item.checkIn || ''} to ${item.checkOut || ''}`,
      balance: item.balanceAmount ? `₹${(item.balanceAmount / 100).toFixed(2)}` : 'Paid',
      status: item.status || 'PENDING',
    };
  });

  return (
    <div className={styles.container} data-testid="upcoming-bookings">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Toolbar / Search & Filter Bar */}
      <div className={styles.toolbar}>
        <div className={styles.statusTabs}>
          {[
            { label: 'All Active', value: '' },
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'In-House', value: 'CHECKED_IN' },
          ].map((tab) => (
            <button
              key={tab.value}
              className={`${styles.tabBtn} ${
                filters.status === tab.value ? styles.tabBtnActive : ''
              }`}
              onClick={() => handleStatusTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.filtersGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search guest or ref..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          <input
            type="date"
            className={styles.dateInput}
            value={filters.checkInFrom}
            onChange={(e) => handleDateChange('checkInFrom', e.target.value)}
            aria-label="Filter check-in from"
          />
          <input
            type="date"
            className={styles.dateInput}
            value={filters.checkInTo}
            onChange={(e) => handleDateChange('checkInTo', e.target.value)}
            aria-label="Filter check-in to"
          />
          {onOpenFutureModal && (
            <Button variant="primary" size="sm" onClick={onOpenFutureModal}>
              + Future Booking
            </Button>
          )}
          {onOpenRoomModal && (
            <Button variant="secondary" size="sm" onClick={onOpenRoomModal}>
              Instant Room
            </Button>
          )}
        </div>
      </div>

      {/* Error Visual State */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <Button variant="secondary" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      <div className={styles.contentCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <p>Loading upcoming bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No Reservations Found</p>
            <p className={styles.emptyText}>
              There are no upcoming bookings matching your search or filters.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            renderCustomCell={(row, colKey) => {
              if (colKey === 'status') {
                return (
                  <Badge variant={getBadgeVariant(row.status)}>{row.status}</Badge>
                );
              }
              if (colKey === 'actions') {
                return (
                  <div className={styles.actionCell}>
                    {row.status === 'CONFIRMED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={actionLoading}
                        onClick={() => handleCheckIn(row.raw)}
                      >
                        Check In
                      </Button>
                    )}
                    {row.status !== 'CANCELLED' && row.status !== 'CHECKED_OUT' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={actionLoading}
                        onClick={() => handleCancel(row.raw)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
        )}
      </div>
    </div>
  );
}
