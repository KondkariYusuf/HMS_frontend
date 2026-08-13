/**
 * @file Billing/Payments/Index.jsx
 * @description Payment receipts log showing completed transactions, UTRs, and refunds.
 * @figmaFrame Figma frame: Billing & Invoices (19-billing.md)
 */
import React from 'react';
import usePayments from '@hooks/usePayments';
import styles from './Index.module.css';

export default function BillingPaymentsPage() {
  const { payments, searchQuery, setSearchQuery, updatePaymentStatus } = usePayments();

  const handleRefund = (pay) => {
    if (window.confirm(`Are you sure you want to refund payment ${pay.id}?`)) {
      updatePaymentStatus(pay.id, 'REFUNDED');
    }
  };

  return (
    <div className={styles.page} data-testid="billing-payments-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Payment Processing Log</h1>
          <p className={styles.subtitle}>
            Track all incoming payments, view UTR references, and manage refunds.
          </p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by Payment ID, Invoice, Name, or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Invoice Ref</th>
                <th>Guest</th>
                <th>Method & UTR</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className={styles.rightAlign}>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((pay) => (
                  <tr key={pay.id} className={styles.tableRow}>
                    <td className={styles.paymentId}>{pay.id}</td>
                    <td className={styles.invoiceRef}>{pay.invoiceId}</td>
                    <td className={styles.guestName}>{pay.guestName}</td>
                    <td>
                      <div className={styles.methodCell}>
                        <span className={styles.methodText}>{pay.method.replace('_', ' ')}</span>
                        <span className={styles.utrText}>{pay.utr}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(pay.date).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[pay.status]}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className={styles.rightAlign}>
                      <span className={styles.amountText}>
                        {pay.currency === 'INR' ? '₹' : '$'}{pay.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {pay.status === 'COMPLETED' ? (
                        <button
                          className={styles.refundBtn}
                          onClick={() => handleRefund(pay)}
                        >
                          Refund
                        </button>
                      ) : (
                        <span className={styles.noActionText}>N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    No payments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
