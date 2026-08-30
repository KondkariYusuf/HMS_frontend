/**
 * @file Restaurant/Tables/Index.jsx
 * @description Refined Restaurant POS Table Selection interface.
 * @reference Frame: Redefined Restaurant POS Table Selection.jpeg
 */
import React from 'react';
import useRestaurantTables from '@hooks/useRestaurantTables';
import RestaurantOrderModal from '@components/RestaurantOrderModal/RestaurantOrderModal';
import styles from './Index.module.css';

export default function RestaurantTablesPage() {
  const {
    tables,
    activeFloor,
    floorOptions,
    selectedTable,
    isModalOpen,
    setActiveFloor,
    openTableModal,
    closeTableModal,
  } = useRestaurantTables();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'OCCUPIED':
        return styles.statusOccupied;
      case 'AVAILABLE':
        return styles.statusAvailable;
      case 'RESERVED':
        return styles.statusReserved;
      default:
        return '';
    }
  };

  return (
    <div className={styles.pageContainer} data-testid="restaurant-tables-page">
      {/* Header Section */}
      <header className={styles.headerRow}>
        <div>
          <h1 className={styles.headerTitle}>Table Selection</h1>
          <p className={styles.headerSubtitle}>
            Select a table to start or manage an order.
          </p>
        </div>
      </header>

      {/* Summary KPI Cards Row */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} ${styles.iconTotal}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="6" width="16" height="10" rx="2" />
              <line x1="8" y1="16" x2="8" y2="20" />
              <line x1="16" y1="16" x2="16" y2="20" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>TOTAL TABLES</span>
            <span className={styles.kpiValue}>32</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} ${styles.iconAvailable}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>AVAILABLE</span>
            <span className={styles.kpiValue}>18</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} ${styles.iconOccupied}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>OCCUPIED</span>
            <span className={styles.kpiValue}>12</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} ${styles.iconReserved}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>RESERVED</span>
            <span className={styles.kpiValue}>2</span>
          </div>
        </div>
      </section>

      {/* Floor Filter Nav & Timestamp Bar */}
      <div className={styles.filterRow}>
        <nav className={styles.filterPills} aria-label="Floor Plan Filter">
          {floorOptions.map((floor) => {
            const isActive = activeFloor === floor;
            return (
              <button
                key={floor}
                type="button"
                className={`${styles.filterPill} ${
                  isActive ? styles.filterPillActive : ''
                }`}
                onClick={() => setActiveFloor(floor)}
                aria-pressed={isActive}
              >
                {floor}
              </button>
            );
          })}
        </nav>
        <span className={styles.updatedTime}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Last updated: 2 mins ago
        </span>
      </div>

      {/* Tables Grid */}
      <main className={styles.tablesGrid}>
        {tables.map((table) => (
          <article
            key={table.id}
            className={styles.tableCard}
            onClick={() => openTableModal(table)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openTableModal(table);
              }
            }}
          >
            <header className={styles.cardHeader}>
              <span className={styles.tableNum}>{table.number}</span>
              <span
                className={`${styles.statusBadge} ${getStatusBadgeClass(
                  table.status
                )}`}
              >
                <span className={styles.statusBadgeDot} />
                {table.status}
              </span>
            </header>

            <div className={styles.cardDetails}>
              <span className={styles.guestText}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {table.guests}
              </span>
              <span className={styles.subtext}>{table.subtext}</span>
            </div>
          </article>
        ))}
      </main>

      {/* Bottom Floating Interactive Button */}
      <div className={styles.floatingButtonWrapper}>
        <button
          type="button"
          className={styles.floorPlanButton}
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.alert('Opening Interactive Floor Plan Map');
            }
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <span>View Floor Plan Interactive →</span>
        </button>
      </div>

      {/* Frame 4: Interactive Table Order Modal Overlay */}
      <RestaurantOrderModal
        isOpen={isModalOpen}
        onClose={closeTableModal}
        tableNumber={selectedTable ? selectedTable.number : '01'}
      />
    </div>
  );
}
