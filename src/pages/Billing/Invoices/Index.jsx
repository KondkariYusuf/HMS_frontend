/**
 * @file Billing/Reports/Index.jsx
 * @description Billing reports interface.
 */


import React, { useState } from 'react';
import useInvoices from '@hooks/useInvoices';
import InvoiceDrawer from '@components/InvoiceDrawer/InvoiceDrawer';
import styles from './Index.module.css';

export default function BillingInvoicesPage() {
  const {
    invoices,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    totalInvoices,
  } = useInvoices();

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const CATEGORIES = ['All', 'Hotel Stays', 'Restaurant', 'Purchases'];

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className={styles.page} data-testid="billing-invoices-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoices & Billing</h1>
          <p className={styles.subtitle}>
            Manage all guest folios, restaurant bills, and supplier invoices. Total: {totalInvoices}
          </p>
        </div>
        <button className={styles.exportBtn} onClick={() => window.print()}>Export Report</button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by Invoice # or Guest Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.tabBtn} ${categoryFilter === cat ? styles.activeTab : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Guest / Supplier</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th className={styles.rightAlign}>Grand Total</th>
                <th className={styles.rightAlign}>Balance Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className={styles.tableRow} onClick={() => handleRowClick(inv)}>
                    <td className={styles.invoiceId}>{inv.id}</td>
                    <td className={styles.guestName}>{inv.guestName}</td>
                    <td>
                      <span className={styles.typeText}>{inv.type.replace('_', ' ')}</span>
                    </td>
                    <td>
                      {new Date(inv.issueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className={styles.rightAlign}>
                      {inv.currency === 'INR' ? '₹' : '$'}{inv.grandTotal.toLocaleString()}
                    </td>
                    <td className={`${styles.rightAlign} ${styles.dueAmount}`}>
                      {inv.amountDue > 0 ? (
                        <>{inv.currency === 'INR' ? '₹' : '$'}{inv.amountDue.toLocaleString()}</>
                      ) : (
                        <span className={styles.paidText}>Paid</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(inv);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceDrawer
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
