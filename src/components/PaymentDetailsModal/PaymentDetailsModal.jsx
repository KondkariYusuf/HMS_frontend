/**
 * @file PaymentDetailsModal.jsx
 * @description Comprehensive payment receipt & transaction details modal.
 * Calls backend GET /api/payment/:id via paymentService.getById(id).
 * Conforms strictly to privacy guidelines (no raw internal database UUIDs exposed).
 */

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import paymentService from '@services/paymentService';
import styles from './PaymentDetailsModal.module.css';

// Sleek inline SVG icons
const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const PrinterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
);

export default function PaymentDetailsModal({
  isOpen,
  paymentId,
  initialData = null,
  onClose,
}) {
  const [payment, setPayment] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchPaymentDetails = useCallback(async () => {
    if (!paymentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.getById(paymentId);
      const data =
        res?.data?.data ||
        res?.data?.response ||
        res?.data ||
        res;
      setPayment(data);
    } catch (err) {
      console.error('Failed to fetch payment details:', err);
      setError(err?.message || 'Failed to load payment transaction details.');
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchPaymentDetails();
    } else if (!isOpen) {
      setPayment(null);
      setError(null);
    }
  }, [isOpen, paymentId, fetchPaymentDetails]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const status = (payment?.status || 'paid').toLowerCase();
  const isPaid = status === 'paid';
  const isPending = status === 'pending';

  return (
    <Modal
      isOpen={isOpen}
      maxWidth="680px"
      onClose={onClose}
      title="Payment Receipt & Transaction Details"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <PrinterIcon /> Print Receipt
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>Fetching payment details from backend (GET /api/payment/{paymentId})...</span>
        </div>
      ) : error ? (
        <div className={styles.errorBox}>
          <strong>Error Loading Payment</strong>
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={fetchPaymentDetails} style={{ marginTop: '8px' }}>
            Retry Connection
          </Button>
        </div>
      ) : payment ? (
        <div className={styles.container}>
          {/* Hero Banner with Amount & Status */}
          <div className={styles.heroBanner}>
            <div>
              <div className={styles.heroAmountLabel}>Amount Received</div>
              <div className={styles.heroAmount}>
                ₹{Number(payment.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.heroStatusGroup}>
              <span
                className={`${styles.statusBadge} ${
                  isPaid ? styles.statusPaid : isPending ? styles.statusPending : styles.statusFailed
                }`}
              >
                {payment.status || 'PAID'}
              </span>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                {isPaid ? 'Payment Verified' : 'Awaiting Settlement'}
              </span>
            </div>
          </div>

          {/* Section 1: Transaction Information */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Transaction Overview</h4>
            <div className={styles.grid3}>
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Payment Method</span>
                <span className={styles.fieldValue} style={{ textTransform: 'uppercase', color: '#0284c7' }}>
                  {(payment.method || 'UPI').replace('_', ' ')}
                </span>
              </div>

              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Payment Purpose</span>
                <span className={styles.fieldValue} style={{ textTransform: 'capitalize' }}>
                  {(payment.paymentFor || 'Booking Charge').replace('_', ' ')}
                </span>
              </div>

              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Convenience Fee</span>
                <span className={styles.fieldValue}>
                  ₹{Number(payment.convenienceFeeAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className={styles.grid2} style={{ marginTop: '12px' }}>
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>UTR / Transaction Reference</span>
                <div className={styles.copyableField}>
                  <span className={styles.fieldValue} style={{ fontFamily: 'monospace' }}>
                    {payment.transactionRef || 'N/A (Cash / Direct Counter)'}
                  </span>
                  {payment.transactionRef && (
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => handleCopy(payment.transactionRef, 'utr')}
                      title="Copy Reference"
                    >
                      <CopyIcon />
                      <span style={{ marginLeft: '4px' }}>
                        {copiedField === 'utr' ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Settlement Date & Time</span>
                <span className={styles.fieldValue}>
                  {payment.paidAt || payment.createdAt
                    ? new Date(payment.paidAt || payment.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Linked Reservation / Booking Context */}
          {payment.booking && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Linked Reservation</h4>
              <div className={styles.linkedCard}>
                <div className={styles.grid3}>
                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Booking Reference</span>
                    <span className={styles.fieldValue} style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                      {payment.booking.bookingNumber || payment.booking.code || 'Confirmed Booking'}
                    </span>
                  </div>

                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Primary Guest</span>
                    <span className={styles.fieldValue}>
                      {payment.booking.primaryGuest
                        ? `${payment.booking.primaryGuest.firstName || ''} ${payment.booking.primaryGuest.lastName || ''}`.trim()
                        : payment.booking.guestName || 'Registered Guest'}
                      {payment.booking.primaryGuest?.phoneNumber ? ` (${payment.booking.primaryGuest.phoneNumber})` : ''}
                    </span>
                  </div>

                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Room / Unit</span>
                    <span className={styles.fieldValue}>
                      {payment.booking.room?.roomNumber ? `Room ${payment.booking.room.roomNumber}` : 'Assigned Unit'}
                    </span>
                  </div>
                </div>

                <div className={styles.grid2} style={{ marginTop: '10px' }}>
                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Stay Duration</span>
                    <span className={styles.fieldValue}>
                      {payment.booking.checkInDate ? new Date(payment.booking.checkInDate).toLocaleDateString() : 'N/A'}{' '}
                      to{' '}
                      {payment.booking.checkOutDate ? new Date(payment.booking.checkOutDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Booking Total / Balance</span>
                    <span className={styles.fieldValue} style={{ color: '#16a34a' }}>
                      ₹{Number(payment.booking.totalAmount || 0).toLocaleString('en-IN')} (Balance: ₹{Number(payment.booking.balance || 0).toLocaleString('en-IN')})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Linked Invoice Context (if present) */}
          {payment.invoice && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Linked Invoice</h4>
              <div className={styles.linkedCard}>
                <div className={styles.grid3}>
                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Invoice Number</span>
                    <span className={styles.fieldValue} style={{ fontWeight: 700 }}>
                      {payment.invoice.invoiceNumber || 'Official Invoice'}
                    </span>
                  </div>

                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Invoice Status</span>
                    <span className={styles.fieldValue} style={{ textTransform: 'uppercase' }}>
                      {payment.invoice.status || 'GENERATED'}
                    </span>
                  </div>

                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Invoice Total</span>
                    <span className={styles.fieldValue}>
                      ₹{Number(payment.invoice.totalAmount || payment.invoice.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Property, Branch & Staff Details */}
          {(payment.organization || payment.organizationBranch || payment.creator) && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Hotel Property & Staff</h4>
              <div className={styles.grid2}>
                <div className={styles.fieldItem}>
                  <span className={styles.fieldLabel}>Property / Branch</span>
                  <span className={styles.fieldValue}>
                    {payment.organizationBranch?.name || payment.organization?.name || 'Main Hotel Branch'}
                    {payment.organizationBranch?.code ? ` (${payment.organizationBranch.code})` : ''}
                  </span>
                </div>

                {payment.creator && (
                  <div className={styles.fieldItem}>
                    <span className={styles.fieldLabel}>Recorded By Staff</span>
                    <span className={styles.fieldValue}>
                      {payment.creator.firstName || ''} {payment.creator.lastName || ''}
                      {payment.creator.email ? ` • ${payment.creator.email}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
