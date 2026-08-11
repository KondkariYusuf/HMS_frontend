/**
 * @file Hotel/Reservations/UpcomingBookings.jsx
 * @description Active & Upcoming Bookings Management Screen (Frame 2: Premium Upcoming Bookings Management).
 * Features 4 summary KPI cards, channel/status filter pills, search input, filter settings modal, interactive pagination,
 * booking details modal, new reservation modal, and full data persistence.
 * @reference Figma frame: Premium Upcoming Bookings Management (frames/premium upcoming bookings management.jpeg)
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookings from '@hooks/useBookings';
import Avatar from '@components/Avatar/Avatar';
import Button from '@components/Button/Button';
import FutureBookingModal from '@components/FutureBookingModal/FutureBookingModal';
import styles from './UpcomingBookings.module.css';

const ITEMS_PER_PAGE = 10;

export default function UpcomingBookings() {
  const navigate = useNavigate();
  const {
    upcomingBookings,
    upcomingSummary,
    loading,
    error,
    refetch,
    createBooking,
    updateBookingStatus,
  } = useBookings();

  // State Management for Interactive Features
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('NEWEST');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filtered and Sorted Dataset
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...upcomingBookings];

    // Filter pills selection
    if (activeFilter === 'OTA') {
      result = result.filter((b) => b.sourceType === 'OTA');
    } else if (activeFilter === 'DIRECT') {
      result = result.filter((b) => b.sourceType === 'DIRECT');
    } else if (activeFilter === 'PENDING') {
      result = result.filter((b) => b.status === 'PENDING_ALLOTMENT');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => {
        const nameMatch = b.guest.name.toLowerCase().includes(q);
        const emailMatch = b.guest.email.toLowerCase().includes(q);
        const refMatch = b.bookingRef.toLowerCase().includes(q);
        const roomMatch = b.roomType.toLowerCase().includes(q);
        return nameMatch || emailMatch || refMatch || roomMatch;
      });
    }

    // Sorting
    if (sortBy === 'NEWEST') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'OLDEST') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === 'AMOUNT_HIGH') {
      result.sort((a, b) => (b.rawRecord?.totalAmount || 0) - (a.rawRecord?.totalAmount || 0));
    } else if (sortBy === 'AMOUNT_LOW') {
      result.sort((a, b) => (a.rawRecord?.totalAmount || 0) - (b.rawRecord?.totalAmount || 0));
    }

    return result;
  }, [upcomingBookings, activeFilter, searchQuery, sortBy]);

  // Pagination Calculations
  const totalItems = filteredAndSortedBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Current Page Paginated Items
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedBookings, currentPage]);

  // Page range indicator (e.g., Showing 1-10 of 25)
  const rangeText = useMemo(() => {
    if (totalItems === 0) return 'Showing 0-0 of 0 bookings';
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    return `Showing ${start}-${end} of ${totalItems} bookings`;
  }, [currentPage, totalItems]);

  // Handle New Booking Creation from Modal
  const handleBookingCreated = (newBookingData) => {
    createBooking(newBookingData);
    setCurrentPage(1);
    setIsNewBookingModalOpen(false);
  };

  // Reset Page when Filters Change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container} data-testid="upcoming-bookings-page">
      {/* Header Bar */}
      <div className={styles.topNavigation}>
        <button
          className={styles.backLink}
          onClick={() => navigate('/')}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Upcoming Bookings</h1>
          <p className={styles.subtitle}>
            Track future reservations, OTA bookings, and room allocations.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsNewBookingModalOpen(true)}
          data-testid="new-booking-btn"
        >
          + New Booking
        </Button>
      </div>

      {/* Top 4 Metric Cards Row (Dynamic Metrics) */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>UPCOMING BOOKINGS</span>
            <div className={styles.cardValue}>{upcomingSummary.upcomingCount}</div>
            <span className={styles.cardDeltaUp}>📈 {upcomingSummary.upcomingDelta}</span>
          </div>
          <div className={styles.iconCircle}>📅</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>ROOMS RESERVED</span>
            <div className={styles.cardValue}>{upcomingSummary.roomsReserved}</div>
            <span className={styles.cardSubtext}>✔ {upcomingSummary.occupancyPercent}</span>
          </div>
          <div className={styles.iconCircle}>🛏️</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>FROM OTAS</span>
            <div className={styles.cardValue}>{upcomingSummary.otaCount}</div>
            <span className={styles.cardSubtext}>{upcomingSummary.otaChannels}</span>
          </div>
          <div className={styles.iconCircle}>🌐</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>PENDING ALLOTMENT</span>
            <div className={styles.cardValue}>{upcomingSummary.pendingCount}</div>
            <span className={styles.cardAlertText}>⚠️ {upcomingSummary.pendingAlert}</span>
          </div>
          <div className={styles.iconCircleAmber}>⚠️</div>
        </div>
      </div>

      {/* Filter Pills & Search Control Row */}
      <div className={styles.controlRow}>
        <div className={styles.pillsGroup}>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'ALL' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('ALL')}
          >
            All
          </button>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'OTA' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('OTA')}
          >
            OTA
          </button>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'DIRECT' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('DIRECT')}
          >
            Walk-in / Direct
          </button>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'PENDING' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('PENDING')}
          >
            Pending Allotment <span className={styles.badgeCount}>{upcomingSummary.pendingCount}</span>
          </button>
        </div>

        <div className={styles.searchFilterGroup}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, ID or room..."
              value={searchQuery}
              onChange={handleSearchChange}
              data-testid="search-input"
            />
          </div>
          <button
            className={styles.filterIconButton}
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Filter & Sort Options"
            title="Sort & Filter Settings"
            data-testid="filter-settings-btn"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer} data-testid="upcoming-loading">
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Fetching upcoming bookings from server...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorAlert} data-testid="upcoming-error">
          <span className={styles.errorIcon}>⚠️</span>
          <div className={styles.errorContent}>
            <h4 className={styles.errorTitle}>Error Loading Reservations</h4>
            <p className={styles.errorMessage}>{error.message}</p>
          </div>
          <Button variant="secondary" onClick={refetch}>
            Retry API Request
          </Button>
        </div>
      )}

      {/* Data Table & Empty State */}
      {!loading && !error && (
        <>
          {paginatedBookings.length > 0 ? (
            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>GUEST</th>
                    <th className={styles.th}>CHECK-IN</th>
                    <th className={styles.th}>CHECK-OUT</th>
                    <th className={styles.th}>TYPE</th>
                    <th className={styles.th}>SOURCE / CHANNEL</th>
                    <th className={styles.th}>BOOKING ID</th>
                    <th className={styles.th}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((b) => (
                    <tr
                      key={b.id}
                      className={styles.tr}
                      onClick={() => setSelectedBooking(b)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className={styles.td}>
                        <div className={styles.guestCell}>
                          <Avatar name={b.guest.name} size="sm" />
                          <div className={styles.guestInfo}>
                            <span className={styles.guestName}>{b.guest.name}</span>
                            <span className={styles.guestEmail}>{b.guest.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.dateText}>{b.checkIn}</span>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.dateText}>{b.checkOut}</span>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.roomTypeBadge}>{b.roomType}</span>
                      </td>

                      <td className={styles.td}>
                        <div className={styles.channelCell}>
                          <span className={styles.channelIcon}>{b.channelIcon}</span>
                          <span className={styles.channelName}>{b.channel}</span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.bookingIdText}>{b.bookingRef}</span>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.amountText}>{b.amount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table Footer / Pagination */}
              <div className={styles.tableFooter}>
                <span className={styles.paginationInfo} data-testid="pagination-range">
                  {rangeText}
                </span>
                <div className={styles.paginationControls}>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous Page"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      className={`${styles.pageBtn} ${
                        currentPage === num ? styles.activePageBtn : ''
                      }`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next Page"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState} data-testid="upcoming-empty">
              <p className={styles.emptyTitle}>No matching upcoming reservations found</p>
              <p className={styles.emptySubtitle}>
                Try adjusting your search query or filter category.
              </p>
            </div>
          )}
        </>
      )}

      {/* Filter Settings Modal */}
      {isFilterModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsFilterModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Sort & Filter Options</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setIsFilterModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sort Order</label>
                <select
                  className={styles.select}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="OLDEST">Oldest First</option>
                  <option value="AMOUNT_HIGH">Highest Amount</option>
                  <option value="AMOUNT_LOW">Lowest Amount</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="primary" onClick={() => setIsFilterModalOpen(false)}>
                Apply & Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Booking Details & Actions Modal */}
      {selectedBooking && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedBooking(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Reservation Details</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>Booking Ref:</strong> {selectedBooking.bookingRef}</p>
              <p><strong>Guest:</strong> {selectedBooking.guest.name} ({selectedBooking.guest.email})</p>
              <p><strong>Phone:</strong> {selectedBooking.guest.phone || 'N/A'}</p>
              <p><strong>Room Category:</strong> {selectedBooking.roomType}</p>
              <p><strong>Check-In:</strong> {selectedBooking.checkIn}</p>
              <p><strong>Check-Out:</strong> {selectedBooking.checkOut}</p>
              <p><strong>Channel:</strong> {selectedBooking.channel}</p>
              <p><strong>Total Amount:</strong> {selectedBooking.amount}</p>
              <p><strong>Current Status:</strong> {selectedBooking.status}</p>
            </div>
            <div className={styles.modalFooter}>
              {selectedBooking.status !== 'CHECKED_IN' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'CHECKED_IN');
                    setSelectedBooking(null);
                  }}
                >
                  Mark Checked-In
                </Button>
              )}
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal Overlay */}
      {isNewBookingModalOpen && (
        <FutureBookingModal
          isOpen={isNewBookingModalOpen}
          onClose={() => setIsNewBookingModalOpen(false)}
          onBookingCreated={handleBookingCreated}
        />
      )}
    </div>
  );
}
