/**
 * @file CustomerHistoryModal.jsx
 * @description A large modal overlay displaying comprehensive historical data for a specific customer.
 */
import React, { useState } from 'react';
import styles from './CustomerHistoryModal.module.css';
import useCustomerHistory from '@hooks/useCustomerHistory';

export default function CustomerHistoryModal({ isOpen, onClose, customer }) {
  const [activeTab, setActiveTab] = useState('Stays');
  const history = useCustomerHistory(customer?.name);

  if (!isOpen || !customer) return null;

  const TABS = ['Stays', 'Invoices', 'Payments', 'Loyalty'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Stays':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.stays.length > 0 ? (
                  history.stays.map((stay) => (
                    <tr key={stay.id}>
                      <td className={styles.refText}>{stay.id}</td>
                      <td>{stay.room}</td>
                      <td>{new Date(stay.checkIn).toLocaleDateString()}</td>
                      <td>{new Date(stay.checkOut).toLocaleDateString()}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[stay.status]}`}>
                          {stay.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyState}>No stay history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'Invoices':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.invoices.length > 0 ? (
                  history.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className={styles.refText}>{inv.id}</td>
                      <td className={styles.capitalize}>{inv.type.replace('_', ' ')}</td>
                      <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td>{inv.currency === 'INR' ? '₹' : '$'}{inv.grandTotal.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyState}>No invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'Payments':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Ref (Invoice)</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.payments.length > 0 ? (
                  history.payments.map((pay) => (
                    <tr key={pay.id}>
                      <td className={styles.refText}>{pay.id}</td>
                      <td className={styles.subRefText}>{pay.invoiceId}</td>
                      <td className={styles.capitalize}>{pay.method.replace('_', ' ')}</td>
                      <td>{pay.currency === 'INR' ? '₹' : '$'}{pay.amount.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[pay.status]}`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyState}>No payment history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'Loyalty':
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Reason</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {history.loyalty.length > 0 ? (
                  history.loyalty.map((tx) => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[tx.type]}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`${styles.pointsText} ${tx.points > 0 ? styles.positive : styles.negative}`}>
                        {tx.points > 0 ? '+' : ''}{tx.points}
                      </td>
                      <td>{tx.reason}</td>
                      <td className={styles.subRefText}>{tx.reference}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyState}>No loyalty history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Full Customer History</h2>
            <p className={styles.subtitle}>{customer.name} (ID: {customer.id})</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className={styles.tabsContainer}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {renderTabContent()}
        </div>
      </div>
    </>
  );
}
