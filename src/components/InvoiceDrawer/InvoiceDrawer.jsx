/**
 * @file InvoiceDrawer.jsx
 * @description Slide-out drawer component displaying detailed invoice line items and totals.
 */
import React from 'react';
import styles from './InvoiceDrawer.module.css';

export default function InvoiceDrawer({ isOpen, onClose, invoice }) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} data-testid="invoice-drawer">
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h2 className={styles.title}>Invoice Details</h2>
              <p className={styles.subtitle}>{invoice?.id}</p>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        {invoice ? (
          <div className={styles.body}>
            <section className={styles.metaSection}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Guest Name</span>
                <span className={styles.metaValue}>{invoice.guestName}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Status</span>
                <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                  {invoice.status}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Issue Date</span>
                <span className={styles.metaValue}>
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Due Date</span>
                <span className={styles.metaValue}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
            </section>

            <section className={styles.itemsSection}>
              <h3 className={styles.sectionTitle}>Line Items</h3>
              <div className={styles.itemsList}>
                {invoice.items.map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemMain}>
                      <span className={styles.itemDesc}>{item.description}</span>
                      <span className={styles.itemQty}>Qty: {item.quantity}</span>
                    </div>
                    <span className={styles.itemTotal}>
                      {invoice.currency === 'INR' ? '₹' : '$'}
                      {item.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.totalsSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalValue}>
                  {invoice.currency === 'INR' ? '₹' : '$'}
                  {invoice.subTotal.toLocaleString()}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tax</span>
                <span className={styles.totalValue}>
                  {invoice.currency === 'INR' ? '₹' : '$'}
                  {invoice.taxTotal.toLocaleString()}
                </span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotalRow}`}>
                <span className={styles.totalLabel}>Grand Total</span>
                <span className={styles.grandTotalValue}>
                  {invoice.currency === 'INR' ? '₹' : '$'}
                  {invoice.grandTotal.toLocaleString()}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Amount Paid</span>
                <span className={styles.paidValue}>
                  {invoice.currency === 'INR' ? '₹' : '$'}
                  {invoice.amountPaid.toLocaleString()}
                </span>
              </div>
              <div className={`${styles.totalRow} ${styles.dueRow}`}>
                <span className={styles.totalLabel}>Balance Due</span>
                <span className={styles.dueValue}>
                  {invoice.currency === 'INR' ? '₹' : '$'}
                  {invoice.amountDue.toLocaleString()}
                </span>
              </div>
            </section>
          </div>
        ) : (
          <div className={styles.emptyState}>No invoice selected.</div>
        )}

        <footer className={styles.footer}>
          {invoice?.amountDue > 0 ? (
            <button className={styles.payBtn}>Record Payment</button>
          ) : (
            <button className={styles.downloadBtn} onClick={() => window.print()}>Download PDF</button>
          )}
        </footer>
      </div>
    </>
  );
}
