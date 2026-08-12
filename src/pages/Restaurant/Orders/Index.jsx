/**
 * @file Restaurant/Orders/Index.jsx
 * @description Refined Food Orders Dashboard displaying real-time kitchen queue & service metrics.
 * @reference Frame: Redefined food order dashboard.jpeg
 */
import React from 'react';
import useRestaurantOrders from '@hooks/useRestaurantOrders';
import styles from './Index.module.css';

export default function RestaurantOrdersPage() {
  const {
    orders,
    activeFilter,
    filterStatuses,
    isRefreshing,
    setActiveFilter,
    refreshOrders,
  } = useRestaurantOrders();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return styles.statusCompleted;
      case 'IN PROGRESS':
        return styles.statusInProgress;
      case 'PENDING':
        return styles.statusPending;
      default:
        return '';
    }
  };

  return (
    <div className={styles.pageContainer} data-testid="restaurant-orders-page">
      {/* Header Section */}
      <header className={styles.headerRow}>
        <div>
          <h1 className={styles.headerTitle}>Live Food Orders</h1>
          <p className={styles.headerSubtitle}>
            Real-time monitoring of kitchen queue and service performance.
          </p>
        </div>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={refreshOrders}
          aria-label="Refresh Orders Queue"
        >
          <svg
            className={isRefreshing ? styles.spinIcon : ''}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Refresh Orders</span>
        </button>
      </header>

      {/* Filter Tabs Bar */}
      <nav className={styles.filterRow} aria-label="Order Status Filter">
        {filterStatuses.map((status) => {
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              type="button"
              className={`${styles.filterPill} ${
                isActive ? styles.filterPillActive : ''
              }`}
              onClick={() => setActiveFilter(status)}
              aria-pressed={isActive}
            >
              {status}
            </button>
          );
        })}
      </nav>

      {/* Live Food Orders Grid */}
      <main className={styles.ordersGrid}>
        {orders.map((order) => (
          <article key={order.id} className={styles.orderCard}>
            <header className={styles.cardHeader}>
              <div>
                <h3 className={styles.tableTitle}>Table {order.tableNumber}</h3>
                <p className={styles.orderMeta}>
                  ORDER {order.orderNumber} • {order.time}
                </p>
              </div>
              <span
                className={`${styles.statusBadge} ${getStatusBadgeClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </header>

            <div className={styles.cardBody}>
              <div className={styles.itemList}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <span className={styles.itemName}>
                      {item.name} x {item.quantity}
                    </span>
                    <span className={styles.itemPrice}>₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <footer className={styles.cardFooter}>
              <span className={styles.totalLabel}>TOTAL</span>
              <span className={styles.totalAmount}>₹{order.total.toLocaleString()}</span>
            </footer>
          </article>
        ))}
      </main>

      {/* Bottom Summary Section */}
      <div className={styles.bottomGrid}>
        {/* Afternoon Kitchen Performance Banner */}
        <section className={styles.performanceCard}>
          <div className={styles.performanceText}>
            <h3 className={styles.performanceTitle}>
              Afternoon Kitchen Performance
            </h3>
            <p className={styles.performanceSub}>
              Avg. prep time is 12m 45s (Down 10% from yesterday)
            </p>
          </div>
          <div className={styles.performanceStats}>
            <div className={styles.statGroup}>
              <span className={styles.statValue}>42</span>
              <span className={styles.statLabel}>TODAY</span>
            </div>
            <div className={styles.statGroup}>
              <span className={styles.statValue}>₹12.4k</span>
              <span className={styles.statLabel}>REVENUE</span>
            </div>
          </div>
        </section>

        {/* Most Popular Dish Card */}
        <section className={styles.popularCard}>
          <span className={styles.popularLabel}>MOST POPULAR</span>
          <h3 className={styles.popularTitle}>Butter Chicken</h3>
          <p className={styles.popularSub}>18 orders served today</p>
        </section>
      </div>
    </div>
  );
}
