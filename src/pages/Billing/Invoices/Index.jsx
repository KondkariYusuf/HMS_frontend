/**
 * @file Billing/Invoices/Index.jsx
 * @description Invoices & Billing Ledger page.
 * Displays all guest folios, restaurant bills, and purchase invoices with search & category filters.
 */

import React, { useState } from 'react';
import useInvoices from '@hooks/useInvoices';
import InvoiceDrawer from '@components/InvoiceDrawer/InvoiceDrawer';
import Toast from '@components/Toast/Toast';
import styles from './Index.module.css';

export default function BillingInvoicesPage() {
  const {
    invoices,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    totalInvoices,
    refetch,
  } = useInvoices();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  const CATEGORIES = ['All', 'Hotel Stays', 'Restaurant', 'Purchases'];

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePaymentSuccess = (invoiceId, paidAmount) => {
    setToast({ message: `Payment of ₹${paidAmount.toLocaleString('en-IN')} recorded successfully! Invoice ${invoiceId} marked as PAID.`, type: 'success' });
    setTimeout(() => setToast(null), 4000);
    refetch();
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice((prev) =>
        prev
          ? {
            ...prev,
            status: 'PAID',
            amountPaid: (prev.amountPaid || 0) + paidAmount,
            amountDue: 0,
          }
          : null
      );
    }
  };

  return (
    <div className={styles.page} data-testid="billing-invoices-page">
      {/* Toast Feedback */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Invoices & Billing Ledger</h1>
          <p className={styles.subtitle}>
            Manage guest folios, restaurant bills, and supplier invoices (`INVOICE_READALL`). Total: {totalInvoices}
          </p>
        </div>
        <button className={styles.exportBtn} onClick={() => window.print()}>Export Statement</button>
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
                invoices.map((inv) => {
                  const isPaid = (inv.status || '').toUpperCase() === 'PAID' || Number(inv.amountDue || 0) <= 0;

                  return (
                    <tr key={inv.id} className={styles.tableRow} onClick={() => handleRowClick(inv)}>
                      <td className={styles.invoiceId}>{inv.id}</td>
                      <td className={styles.guestName}>{inv.guestName}</td>
                      <td>
                        <span className={styles.typeText}>{inv.type.replace('_', ' ')}</span>
                      </td>
                      <td>
                        {inv.issueDate ? new Date(inv.issueDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : 'N/A'}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: isPaid ? '#dcfce7' : '#fef3c7',
                            color: isPaid ? '#15803d' : '#d97706',
                          }}
                        >
                          {isPaid ? 'PAID' : (inv.status || 'ISSUED')}
                        </span>
                      </td>
                      <td className={styles.rightAlign} style={{ fontWeight: 600 }}>
                        ₹{Number(inv.grandTotal || 0).toLocaleString('en-IN')}
                      </td>
                      <td className={`${styles.rightAlign} ${styles.dueAmount}`}>
                        {!isPaid && Number(inv.amountDue || 0) > 0 ? (
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>
                            ₹{Number(inv.amountDue).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className={styles.paidText} style={{ color: '#16a34a', fontWeight: 700 }}>
                            Paid (₹0.00)
                          </span>
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    No invoices found matching your filters.
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
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
