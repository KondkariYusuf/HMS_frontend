/**
 * @file CustomerDrawer.jsx
 * @description Slide-out drawer component displaying customer details and history.
 */
import React, { useState } from 'react';
import useCustomerLoyalty from '@hooks/useCustomerLoyalty';
import styles from './CustomerDrawer.module.css';
import Avatar from '@components/Avatar/Avatar';
import CustomerHistoryModal from '@components/CustomerHistoryModal/CustomerHistoryModal';

export default function CustomerDrawer({ isOpen, onClose, customer }) {
  const { transactions } = useCustomerLoyalty();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  if (!isOpen) return null;

  // Filter loyalty transactions for this specific customer
  const customerLoyaltyHistory = transactions.filter(
    (tx) => tx.customerName === customer?.name
  );

  const earnedPoints = customerLoyaltyHistory
    .filter(tx => tx.type === 'EARN')
    .reduce((sum, tx) => sum + tx.points, 0);

  const redeemedPoints = customerLoyaltyHistory
    .filter(tx => tx.type === 'REDEEM')
    .reduce((sum, tx) => sum + Math.abs(tx.points), 0);

  const adjustedPoints = customerLoyaltyHistory
    .filter(tx => tx.type === 'ADJUST')
    .reduce((sum, tx) => sum + tx.points, 0);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} data-testid="customer-drawer">
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Customer Details</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        {customer ? (
          <div className={styles.body}>
            <section className={styles.profileSection}>
              <Avatar name={customer.name} size="lg" />
              <div className={styles.profileInfo}>
                <h3 className={styles.customerName}>{customer.name}</h3>
                <p className={styles.customerId}>ID: {customer.id}</p>
                <span className={`${styles.typeBadge} ${styles[customer.type]}`}>
                  {customer.type.replace('_', ' ')}
                </span>
              </div>
            </section>

            <section className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>Contact Information</h4>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Phone:</span>
                <span className={styles.detailValue}>{customer.phone || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{customer.email || 'N/A'}</span>
              </div>
            </section>

            <section className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>Engagement Metrics</h4>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Total Visits</span>
                  <span className={styles.metricValue}>{customer.visitCount}</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Lifetime Spend</span>
                  <span className={styles.metricValue}>
                    {customer.currency === 'INR' ? '₹' : '$'}
                    {customer.lifetimeSpend.toLocaleString()}
                  </span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Loyalty Points</span>
                  <span className={styles.metricValue}>{customer.loyaltyPoints}</span>
                </div>
              </div>
            </section>

            <section className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>Loyalty Program</h4>
              <div className={styles.loyaltySummary}>
                <div className={styles.loyaltyStat}>
                  <span className={styles.statLabel}>Earned</span>
                  <span className={styles.statValuePositive}>+{earnedPoints}</span>
                </div>
                <div className={styles.loyaltyStat}>
                  <span className={styles.statLabel}>Redeemed</span>
                  <span className={styles.statValueNegative}>-{redeemedPoints}</span>
                </div>
                <div className={styles.loyaltyStat}>
                  <span className={styles.statLabel}>Adjusted</span>
                  <span className={styles.statValueNeutral}>{adjustedPoints}</span>
                </div>
              </div>
              <div className={styles.activityList}>
                {customerLoyaltyHistory.length > 0 ? (
                  customerLoyaltyHistory.map((tx) => (
                    <div key={tx.id} className={styles.activityItem}>
                      <div className={`${styles.activityDot} ${styles[tx.type]}`} />
                      <div className={styles.activityContent}>
                        <div className={styles.activityHeader}>
                          <p className={styles.activityTitle}>{tx.reason}</p>
                          <p className={`${styles.txPoints} ${tx.points > 0 ? styles.txPositive : styles.txNegative}`}>
                            {tx.points > 0 ? '+' : ''}{tx.points} pts
                          </p>
                        </div>
                        <div className={styles.activityMeta}>
                          <p className={styles.activityDate}>
                            {new Date(tx.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className={styles.activityRef}>Ref: {tx.reference}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyStateText}>No loyalty transactions found.</p>
                )}
              </div>
            </section>

            <section className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>Recent Activity</h4>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityContent}>
                    <p className={styles.activityTitle}>Last Visit</p>
                    <p className={styles.activityDate}>
                      {customer.lastVisitAt
                        ? new Date(customer.lastVisitAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'No previous visits'}
                    </p>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityContent}>
                    <p className={styles.activityTitle}>Profile Created</p>
                    <p className={styles.activityDate}>
                      {new Date(customer.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className={styles.emptyState}>No customer selected.</div>
        )}

        <footer className={styles.footer}>
          <button 
            className={styles.actionBtn}
            onClick={() => setIsHistoryModalOpen(true)}
          >
            View Full History
          </button>
        </footer>
      </div>

      <CustomerHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        customer={customer}
      />
    </>
  );
}
