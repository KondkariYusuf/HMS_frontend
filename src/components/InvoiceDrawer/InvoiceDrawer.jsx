/**
 * @file InvoiceDrawer.jsx
 * @description Slide-out drawer displaying detailed invoice line items, financial totals,
 * payment settlement form (PAYMENT_CREATE), and Cloudinary PDF receipt access.
 */
import React, { useState } from 'react';
import paymentService from '@services/paymentService';
import styles from './InvoiceDrawer.module.css';

export default function InvoiceDrawer({ isOpen, onClose, invoice, onPaymentSuccess }) {
  const [showPayForm, setShowPayForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [payData, setPayData] = useState({
    amount: '',
    method: 'upi',
    transactionRef: '',
  });

  if (!isOpen) return null;

  const isPaid = (invoice?.status || '').toUpperCase() === 'PAID' || Number(invoice?.amountDue || 0) <= 0;
  const balanceDue = Number(invoice?.amountDue !== undefined ? invoice.amountDue : (invoice?.grandTotal || 0) - (invoice?.amountPaid || 0));
  const pdfLink = invoice?.rawRecord?.file?.url || invoice?.rawRecord?.pdfUrl || invoice?.file?.url || invoice?.pdfUrl;

  const handleOpenPayForm = () => {
    setShowPayForm(true);
    setPayData({
      amount: balanceDue > 0 ? balanceDue : (invoice?.grandTotal || 0),
      method: 'upi',
      transactionRef: '',
    });
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    const amt = Number(payData.amount);
    if (!amt || amt <= 0) {
      setErrorMsg('Please enter a valid payment amount.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const activeBranchId = localStorage.getItem('syncstays_branch_id');
      let userOrgId = null;
      let userBranchId = null;
      try {
        const rawUser = localStorage.getItem('syncstays_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          userOrgId = u.organizationId;
          userBranchId = u.organizationBranchId;
        }
      } catch (e) { }

      const payload = {
        organizationId: invoice?.rawRecord?.organizationId || userOrgId || undefined,
        organizationBranchId: invoice?.rawRecord?.organizationBranchId || userBranchId || activeBranchId || undefined,
        paymentFor: 'booking',
        bookingId: invoice?.bookingId || invoice?.rawRecord?.bookingId || invoice?.id,
        invoiceId: invoice?.id,
        amount: amt,
        convenienceFeeAmount: 0,
        method: payData.method || 'upi',
        status: 'paid',
        transactionRef: payData.transactionRef || `UPI/${Date.now()}/SUCCESS`,
        paidAt: new Date().toISOString(),
      };

      await paymentService.create(payload);
      setShowPayForm(false);

      if (onPaymentSuccess) {
        onPaymentSuccess(invoice.id, amt);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to post payment settlement.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 16px', fontSize: '13px', borderBottom: '1px solid #fca5a5' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {invoice ? (
          <div className={styles.body}>
            <section className={styles.metaSection}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Guest Name</span>
                <span className={styles.metaValue}>{invoice.guestName}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Status</span>
                <span
                  style={{
                    background: isPaid ? '#dcfce7' : '#fef3c7',
                    color: isPaid ? '#15803d' : '#d97706',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {isPaid ? 'PAID' : (invoice.status || 'ISSUED')}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Issue Date</span>
                <span className={styles.metaValue}>
                  {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Due Date</span>
                <span className={styles.metaValue}>
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </section>

            <section className={styles.itemsSection}>
              <h3 className={styles.sectionTitle}>Line Items</h3>
              <div className={styles.itemsList}>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemMain}>
                        <span className={styles.itemDesc}>{item.description}</span>
                        <span className={styles.itemQty}>Qty: {item.quantity || 1}</span>
                      </div>
                      <span className={styles.itemTotal}>
                        ₹{Number(item.total || item.unitPrice || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.itemRow}>
                    <span className={styles.itemDesc}>Room Rent & Stay Charges</span>
                    <span className={styles.itemTotal}>₹{Number(invoice.grandTotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </section>

            <section className={styles.totalsSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalValue}>
                  ₹{Number(invoice.subTotal || invoice.grandTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tax</span>
                <span className={styles.totalValue}>
                  ₹{Number(invoice.taxTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotalRow}`}>
                <span className={styles.totalLabel}>Grand Total</span>
                <span className={styles.grandTotalValue}>
                  ₹{Number(invoice.grandTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Amount Paid</span>
                <span className={styles.paidValue} style={{ color: '#16a34a', fontWeight: 600 }}>
                  ₹{Number(invoice.amountPaid || (isPaid ? invoice.grandTotal : 0)).toLocaleString('en-IN')}
                </span>
              </div>
              <div className={`${styles.totalRow} ${styles.dueRow}`}>
                <span className={styles.totalLabel}>Balance Due</span>
                <span className={styles.dueValue} style={{ color: balanceDue > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                  ₹{balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
            </section>

            {/* Record Payment Inline Form */}
            {showPayForm && (
              <form onSubmit={handleSettlePayment} style={{ marginTop: '16px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
                  Settle Bill / Record Payment (POST /api/payment)
                </h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      AMOUNT TO PAY (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={payData.amount}
                      onChange={(e) => setPayData({ ...payData, amount: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      PAYMENT METHOD
                    </label>
                    <select
                      value={payData.method}
                      onChange={(e) => setPayData({ ...payData, method: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#fff' }}
                    >
                      <option value="upi">UPI / QR Code</option>
                      <option value="cash">Cash</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="bank_transfer">Bank Wire / NEFT</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      TRANSACTION REF / UTR
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI/1234567890/SUCCESS"
                      value={payData.transactionRef}
                      onChange={(e) => setPayData({ ...payData, transactionRef: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowPayForm(false)}
                    style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ padding: '6px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm & Record Payment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>No invoice selected.</div>
        )}

        <footer className={styles.footer} style={{ gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
          {!isPaid && !showPayForm && (
            <button className={styles.payBtn} onClick={handleOpenPayForm} style={{ background: '#16a34a', borderColor: '#16a34a' }}>
              Pay Invoice / Settle Bill
            </button>
          )}

          {pdfLink && (
            <button
              className={styles.downloadBtn}
              onClick={() => window.open(pdfLink, '_blank', 'noopener,noreferrer')}
              style={{ background: '#e0f2fe', color: '#0284c7', borderColor: '#7dd3fc', fontWeight: 600 }}
            >
              📄 View Cloudinary PDF
            </button>
          )}

          <button className={styles.downloadBtn} onClick={() => window.print()}>
            🖨️ Print Invoice
          </button>
        </footer>
      </div>
    </>
  );
}
