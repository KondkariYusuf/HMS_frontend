/**
 * @file Customers/Loyalty/Index.jsx
 * @description Customer loyalty points, rewards tier, and redemption rules.
 * @figmaFrame Figma frame: Customers - Loyalty Program (15-customers.md)
 */
import React from 'react';
import useCustomerLoyalty from '@hooks/useCustomerLoyalty';
import styles from './Index.module.css';

export default function CustomersLoyaltyPage() {
  const { transactions, typeFilter, setTypeFilter } = useCustomerLoyalty();

  const FILTER_TYPES = ['All', 'EARN', 'REDEEM', 'ADJUST'];

  return (
    <div className={styles.page} data-testid="customers-loyalty-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Loyalty Program & Tiers</h1>
          <p className={styles.subtitle}>
            Manage reward points, redemptions, and adjustments across all guests.
          </p>
        </div>
        <button className={styles.configBtn}>Configure Reward Rules</button>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>⭐</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Total Points Issued</span>
            <span className={styles.kpiValue}>24,500</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>🎁</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Points Redeemed</span>
            <span className={styles.kpiValue}>8,200</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>📉</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Points Expired</span>
            <span className={styles.kpiValue}>1,150</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>💰</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Active Liability</span>
            <span className={styles.kpiValue}>15,150</span>
          </div>
        </div>
      </section>

      <section className={styles.ledgerSection}>
        <div className={styles.ledgerHeader}>
          <h2 className={styles.ledgerTitle}>Transaction Ledger</h2>
          <div className={styles.filters}>
            {FILTER_TYPES.map((type) => (
              <button
                key={type}
                className={`${styles.filterPill} ${typeFilter === type ? styles.activeFilter : ''}`}
                onClick={() => setTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Balance After</th>
                  <th>Reason & Reference</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className={styles.tableRow}>
                      <td className={styles.txId}>{tx.id}</td>
                      <td className={styles.customerName}>{tx.customerName}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${styles[tx.type]}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.points} ${tx.points > 0 ? styles.positivePoints : styles.negativePoints}`}
                        >
                          {tx.points > 0 ? '+' : ''}{tx.points}
                        </span>
                      </td>
                      <td className={styles.balance}>{tx.balanceAfter}</td>
                      <td>
                        <div className={styles.reasonCell}>
                          <span>{tx.reason}</span>
                          <span className={styles.referenceText}>{tx.reference}</span>
                        </div>
                      </td>
                      <td>
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.emptyState}>
                      No loyalty transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
