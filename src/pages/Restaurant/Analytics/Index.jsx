/**
 * @file Restaurant/Analytics/Index.jsx
 * @description Professional Food Order Analytics Dashboard displaying orders, revenue metrics, performance, and transaction lists.
 * @reference Frame: Professional food order Analytics dashboard.jpeg
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRestaurantAnalytics from '@hooks/useRestaurantAnalytics';
import styles from './Index.module.css';

export default function RestaurantAnalyticsPage() {
  const navigate = useNavigate();
  const {
    transactions,
    searchQuery,
    setSearchQuery,
    handleExportCSV,
  } = useRestaurantAnalytics();

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return styles.statusDelivered;
      case 'IN KITCHEN':
        return styles.statusInKitchen;
      case 'PENDING':
        return styles.statusPending;
      default:
        return '';
    }
  };

  return (
    <div className={styles.pageContainer} data-testid="restaurant-analytics-page">
      {/* Header Section */}
      <header className={styles.headerRow}>
        <h1 className={styles.headerTitle}>Food Order Analytics</h1>
        <nav className={styles.subLinks} aria-label="Analytics Area">
          <a
            href="#property"
            className={`${styles.subLink} ${styles.subLinkActive}`}
            onClick={(e) => e.preventDefault()}
          >
            Property View
          </a>
          <a
            href="#frontdesk"
            className={styles.subLink}
            onClick={(e) => e.preventDefault()}
          >
            Front Desk
          </a>
          <a
            href="#housekeeping"
            className={styles.subLink}
            onClick={(e) => e.preventDefault()}
          >
            Housekeeping
          </a>
        </nav>
      </header>

      {/* KPI Cards Row */}
      <section className={styles.kpiGrid}>
        {/* Card 1: Total Orders */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>TOTAL ORDERS</span>
            <span className={styles.kpiValue}>1,284</span>
            <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
              ▲ +12.5% <span className={styles.trendText}>vs last month</span>
            </span>
          </div>
          <div className={styles.kpiIconBox}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>TOTAL REVENUE</span>
            <span className={styles.kpiValue}>$34,510</span>
            <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
              ▲ +8.2% <span className={styles.trendText}>vs last month</span>
            </span>
          </div>
          <div className={styles.kpiIconBox}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="12" y1="10" x2="12" y2="10.01" />
              <line x1="12" y1="14" x2="12" y2="14.01" />
              <path d="M16 8h-8v8h8V8z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>AVG. ORDER VALUE</span>
            <span className={styles.kpiValue}>$26.88</span>
            <span className={`${styles.kpiTrend} ${styles.trendDown}`}>
              ▼ -2.1% <span className={styles.trendText}>vs last month</span>
            </span>
          </div>
          <div className={styles.kpiIconBox}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Daily Orders & Revenue</h3>
            <p className={styles.chartSubtitle}>
              Real-time tracking for the current week
            </p>
          </div>
          <div className={styles.chartControls}>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <span
                  className={`${styles.legendDot} ${styles.dotOrders}`}
                />
                <span>Orders</span>
              </div>
              <div className={styles.legendItem}>
                <span
                  className={`${styles.legendDot} ${styles.dotRevenue}`}
                />
                <span>Revenue</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={handleExportCSV}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* SVG Curve Line Chart Container */}
        <div className={styles.chartContainer}>
          <svg
            width="100%"
            height="180"
            viewBox="0 0 800 180"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            <line x1="0" y1="30" x2="800" y2="30" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="130" x2="800" y2="130" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Orders Curve (Muted teal) */}
            <path
              d="M 20 120 C 100 140, 160 80, 240 100 C 320 120, 380 150, 460 120 C 540 90, 600 60, 680 70 C 740 80, 770 120, 790 100"
              fill="none"
              stroke="#0b555a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Revenue Curve (Theme primary teal) */}
            <path
              d="M 20 140 C 90 135, 170 150, 250 120 C 330 90, 390 130, 470 100 C 550 70, 610 110, 690 60 C 750 20, 780 80, 790 70"
              fill="none"
              stroke="#147a7e"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Weekday Text Labels */}
            <text x="20" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">MON</text>
            <text x="145" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">TUE</text>
            <text x="270" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">WED</text>
            <text x="395" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">THU</text>
            <text x="520" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">FRI</text>
            <text x="645" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">SAT</text>
            <text x="760" y="175" fill="#94a3b8" fontSize="9" fontWeight="600">SUN</text>
          </svg>
        </div>
      </section>

      {/* Middle Split Grid section */}
      <section className={styles.middleGrid}>
        {/* Top Performing Items Card */}
        <div className={styles.middleCard}>
          <div className={styles.middleTitleRow}>
            <h3 className={styles.middleTitle}>Top Performing Items</h3>
            <span className={styles.moreIcon}>•••</span>
          </div>

          <div className={styles.progressBarList}>
            {/* Item 1 */}
            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.itemLabel}>Butter Chicken (Chef Special)</span>
                <span className={styles.itemValue}>412 orders</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Item 2 */}
            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.itemLabel}>Paneer Tikka Platter</span>
                <span className={styles.itemValue}>328 orders</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: '80%', backgroundColor: 'var(--color-primary)' }}
                />
              </div>
            </div>

            {/* Item 3 */}
            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.itemLabel}>Garlic Naan (Basket)</span>
                <span className={styles.itemValue}>285 orders</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: '65%', backgroundColor: 'var(--color-primary)' }}
                />
              </div>
            </div>

            {/* Item 4 */}
            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.itemLabel}>Dal Makhani High Protein</span>
                <span className={styles.itemValue}>194 orders</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: '45%', backgroundColor: 'var(--color-primary)' }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={() => navigate('/restaurant/menu')}
          >
            View All Menu Analytics
          </button>
        </div>

        {/* Right Section Stacked Cards */}
        <div className={styles.rightStack}>
          {/* Fulfillment Card */}
          <div className={styles.segmentedCard}>
            <h3 className={styles.middleTitle}>Order Fulfillment Status</h3>
            <div className={styles.segmentedBarTrack}>
              <div
                className={styles.segmentCompleted}
                style={{ width: '70%' }}
              />
              <div className={styles.segmentPending} style={{ width: '20%' }} />
              <div
                className={styles.segmentCancelled}
                style={{ width: '10%' }}
              />
            </div>
            <div className={styles.segmentedLegend}>
              <div className={styles.legendDotCol}>
                <span
                  className={`${styles.legendDot} ${styles.dotRevenue}`}
                />
                <span>
                  COMPLETED <strong>898</strong>
                </span>
              </div>
              <div className={styles.legendDotCol}>
                <span
                  className={`${styles.legendDot} ${styles.dotPending}`}
                />
                <span>
                  PENDING <strong>256</strong>
                </span>
              </div>
              <div className={styles.legendDotCol}>
                <span
                  className={`${styles.legendDot} ${styles.dotCancelled}`}
                />
                <span>
                  CANCELLED <strong>130</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Operational Insight Banner Card */}
          <div className={styles.insightCard}>
            <div className={styles.insightIconBox}>
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.insightContent}>
              <h4 className={styles.insightTitle}>Smart Operational Insight</h4>
              <p className={styles.insightText}>
                Orders typically spike by 24% on Friday evenings. We recommend
                scheduling 2 additional staff members in the kitchen between 7
                PM - 9 PM to maintain your 15-minute average delivery time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Transactions Table Card */}
      <section className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <h3 className={styles.middleTitle}>Recent Transactions</h3>
          <div className={styles.searchFilterGroup}>
            <div className={styles.searchBox}>
              <svg
                className={styles.searchIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search transactions"
              />
            </div>
            <button
              type="button"
              className={styles.filterBtn}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.alert('Filtering transactions options...');
                }
              }}
            >
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Room / Location</th>
                <th scope="col">Items</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className={styles.txId}>{tx.id}</td>
                  <td className={styles.txLocation}>{tx.location}</td>
                  <td className={styles.txItems}>{tx.items}</td>
                  <td className={styles.txAmount}>${tx.amount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className={styles.txTime}>{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <footer className={styles.tableFooter}>
          <span className={styles.footerInfo}>
            Showing 1-{transactions.length} of 1,284 entries
          </span>
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => {}}
              aria-label="Previous Page"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${styles.pageBtnActive}`}
              onClick={() => {}}
              aria-current="page"
            >
              1
            </button>
            <button type="button" className={styles.pageBtn} onClick={() => {}}>
              2
            </button>
            <button type="button" className={styles.pageBtn} onClick={() => {}}>
              3
            </button>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => {}}
              aria-label="Next Page"
            >
              ›
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
