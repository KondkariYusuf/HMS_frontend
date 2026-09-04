/**
 * @file Billing/Payments/Index.jsx
 * @description Master Finance & Payments Ledger page for hotel accountants and front-desk managers.
 * Connected to backend /api/payment API with metrics, filtering by method/status, search, and refund/void actions.
 */

import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Trash2,
  DollarSign,
  AlertCircle,
  FileText,
  Eye,
} from 'lucide-react';
import usePayments from '@hooks/usePayments';
import Toast from '@components/Toast/Toast';
import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';
import styles from './Index.module.css';

export default function BillingPaymentsPage() {
  const {
    payments,
    metrics,
    loading,
    searchQuery,
    setSearchQuery,
    methodFilter,
    setMethodFilter,
    statusFilter,
    setStatusFilter,
    updatePaymentStatus,
    voidPayment,
    getPaymentById,
    refetch,
  } = usePayments();

  const [toast, setToast] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefund = async (pay) => {
    if (window.confirm(`Are you sure you want to refund payment ${pay.id} of ₹${pay.amount.toLocaleString()}?`)) {
      try {
        await updatePaymentStatus(pay.id, 'REFUNDED');
        showToast(`Payment ${pay.id} marked as REFUNDED.`, 'info');
      } catch (err) {
        showToast('Failed to refund payment.', 'error');
      }
    }
  };

  const handleVoid = async (pay) => {
    if (window.confirm(`Are you sure you want to VOID payment ${pay.id}? This action cannot be undone.`)) {
      try {
        await voidPayment(pay.id);
        showToast(`Payment ${pay.id} voided successfully.`, 'success');
      } catch (err) {
        showToast('Failed to void payment.', 'error');
      }
    }
  };

  const handleViewPayment = async (pay) => {
    setSelectedPayment(pay);
    setLoadingDetails(true);
    try {
      const detailed = await getPaymentById(pay.id);
      if (detailed) {
        setSelectedPayment((prev) => (prev && prev.id === pay.id ? { ...prev, ...detailed } : prev));
      }
    } catch (err) {
      console.warn('Failed to load payment details from API:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className={styles.page} data-testid="billing-payments-page">
      {/* Toast Feedback */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard className={styles.headerIcon} size={28} color="#0284c7" />
            Hotel Payments & Finance Ledger
          </h1>
          <p className={styles.subtitle}>
            Track real-time guest payment receipts, verify UTR numbers, and manage voids/refunds (`PAYMENT_READALL`).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={refetch} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={15} /> Refresh Ledger
          </Button>
          <Button variant="primary" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={15} /> Print Statement
          </Button>
        </div>
      </header>

      {/* Financial Metrics Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TOTAL REVENUE RECEIVED
          </span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
            ₹{metrics.totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Across {metrics.count} payments</span>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            UPI / QR PAYMENTS
          </span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            ₹{metrics.upiTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Instant bank transfers</span>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CASH RECEIVED
          </span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            ₹{metrics.cashTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Front desk till count</span>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CARD / WIRE PAYMENTS
          </span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
            ₹{metrics.cardTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>POS & NEFT settlements</span>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className={styles.toolbar} style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div className={styles.searchBox} style={{ flex: '1', minWidth: '280px' }}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by Payment ID, Guest Name, or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                background: '#ffffff',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <option value="ALL">All Payment Methods</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="BANK_TRANSFER">Bank Wire / NEFT</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                background: '#ffffff',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid / Completed</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Payments Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID / Date</th>
                <th>Guest / Payer</th>
                <th>Method</th>
                <th>Transaction UTR Ref</th>
                <th>Status</th>
                <th className={styles.rightAlign}>Amount Paid</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Loading payment records...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((pay) => {
                  const isPaid = (pay.status || '').toUpperCase() === 'PAID' || (pay.status || '').toUpperCase() === 'COMPLETED';
                  const isRefunded = (pay.status || '').toUpperCase() === 'REFUNDED';

                  return (
                    <tr key={pay.id} className={styles.tableRow}>
                      <td className={styles.paymentId}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{pay.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {pay.date ? new Date(pay.date).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className={styles.guestName} style={{ fontWeight: 600 }}>
                        {pay.guestName}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: '#f1f5f9',
                            color: '#0369a1',
                            textTransform: 'uppercase',
                          }}
                        >
                          {pay.method.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155' }}>
                        {pay.utr || 'N/A'}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: isPaid ? '#dcfce7' : isRefunded ? '#fee2e2' : '#fef3c7',
                            color: isPaid ? '#15803d' : isRefunded ? '#991b1b' : '#d97706',
                          }}
                        >
                          {pay.status}
                        </span>
                      </td>
                      <td className={styles.rightAlign} style={{ fontWeight: 800, color: '#16a34a', fontSize: '15px' }}>
                        ₹{Number(pay.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleViewPayment(pay)}
                            title="View Payment Receipt & Details"
                            style={{ padding: '4px 8px', fontSize: '12px', background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                          </button>
                          {isPaid && (
                            <button
                              type="button"
                              className={styles.refundBtn}
                              onClick={() => handleRefund(pay)}
                              title="Refund Payment"
                              style={{ padding: '4px 10px', fontSize: '12px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Refund
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleVoid(pay)}
                            title="Void Payment (PAYMENT_DELETE)"
                            style={{ padding: '4px 8px', fontSize: '12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No payment records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details & Receipt Modal */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          title="Payment Transaction Details"
        >
          <div style={{ padding: '8px 0', fontSize: '13px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Transaction ID</strong>
                <span style={{ fontWeight: 600 }}>{selectedPayment.id}</span>
              </div>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Date & Time</strong>
                <span>{selectedPayment.date ? new Date(selectedPayment.date).toLocaleString() : 'N/A'}</span>
              </div>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Guest Name</strong>
                <span style={{ fontWeight: 600 }}>{selectedPayment.guestName}</span>
              </div>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Payment Method</strong>
                <span style={{ textTransform: 'uppercase' }}>{selectedPayment.method?.replace('_', ' ')}</span>
              </div>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>UTR / Reference</strong>
                <span style={{ fontFamily: 'monospace' }}>{selectedPayment.utr || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Status</strong>
                <span style={{ fontWeight: 700, color: (selectedPayment.status || '').toUpperCase() === 'PAID' ? '#15803d' : '#d97706' }}>
                  {selectedPayment.status}
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Total Paid Amount</span>
              <strong style={{ fontSize: '18px', color: '#16a34a' }}>
                ₹{Number(selectedPayment.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setSelectedPayment(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
