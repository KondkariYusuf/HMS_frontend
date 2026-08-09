/**
 * @file PastArchive.jsx
 * @description Past Bookings Archive view (Frame 3 - Refined Past Bookings Archive).
 * Displays historical records (CHECKED_OUT, CANCELLED, NO_SHOW) with search and export capabilities.
 */
import React from 'react';
import useBookings from '@hooks/useBookings';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import styles from './PastArchive.module.css';

export default function PastArchive() {
  const { bookings, loading, error, filters, setFilters, refetch } = useBookings({
    status: 'CHECKED_OUT',
    sortBy: 'checkOut',
    sortOrder: 'desc',
  });

  const handleStatusTabChange = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'CHECKED_OUT':
        return 'checked-out';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'error';
      default:
        return 'regular';
    }
  };

  const columns = [
    { key: 'guest', title: 'Guest & Booking Ref' },
    { key: 'room', title: 'Room Info' },
    { key: 'dates', title: 'Stay Dates' },
    { key: 'total', title: 'Total Amount' },
    { key: 'status', title: 'Archive Status' },
  ];

  const tableData = bookings.map((item) => ({
    id: item.id,
    guest: {
      name: item.primaryGuest?.name || 'Guest',
      tag: item.bookingRef || 'REF-N/A',
    },
    room: item.rooms?.[0]?.roomNumber
      ? `Room ${item.rooms[0].roomNumber}`
      : 'Standard Room',
    dates: `${item.checkIn || ''} — ${item.checkOut || ''}`,
    total: item.totalAmount ? `₹${(item.totalAmount / 100).toFixed(2)}` : '₹0.00',
    status: item.status || 'CHECKED_OUT',
  }));

  return (
    <div className={styles.container} data-testid="past-bookings-archive">
      <div className={styles.toolbar}>
        <div className={styles.statusTabs}>
          {[
            { label: 'Checked Out', value: 'CHECKED_OUT' },
            { label: 'Cancelled', value: 'CANCELLED' },
            { label: 'No-Show', value: 'NO_SHOW' },
            { label: 'All Past', value: '' },
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

        <div className={styles.searchGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search archive by guest or ref..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.alert('Exporting archive records to CSV...')}
          >
            Export Archive
          </Button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <Button variant="secondary" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
      )}

      <div className={styles.contentCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <p>Loading historical archive...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Archive Empty</p>
            <p className={styles.emptyText}>
              No past booking records match your filter criteria.
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
              return null;
            }}
          />
        )}
      </div>
    </div>
  );
}
