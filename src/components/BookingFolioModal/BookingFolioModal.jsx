/**
 * @file BookingFolioModal.jsx
 * @description Comprehensive Folio & Financial Ledger modal for hotel reservations.
 * Supports viewing running balances, itemized charges/payments, posting new transactions,
 * locking the folio to seal financial ledger, and opening existing Cloudinary PDF invoices for locked folios.
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Lock,
  Unlock,
  Plus,
  Printer,
  X,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  User,
  Calendar,
} from 'lucide-react';

import bookingService from '@services/bookingService';
import Button from '@components/Button/Button';
import styles from './BookingFolioModal.module.css';

export default function BookingFolioModal({ isOpen, onClose, booking, onToast }) {
  const [folioData, setFolioData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Lock & Transaction submitting states
  const [isLocking, setIsLocking] = useState(false);
  const [isAddingTxn, setIsAddingTxn] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Transaction Form state
  const [txnForm, setTxnForm] = useState({
    txnType: 'room_service',
    description: '',
    unitPrice: '',
    quantity: 1,
    isCredit: false,
  });

  // ESC Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch Folio Data
  const loadFolio = async () => {
    if (!booking?.id) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await bookingService.getFolio(booking.id);
      const data = res?.data?.data || res?.data?.response || res?.data || {};
      setFolioData(data);

      // Extract existing Cloudinary PDF URL if present
      const existingPdf = data.file?.url || data.pdfUrl || data.booking?.file?.url || booking.rawRecord?.file?.url || booking.rawRecord?.pdfUrl;
      if (existingPdf) {
        setPdfUrl(existingPdf);
      }
    } catch (err) {
      console.warn('Failed to load folio details:', err);
      // Fallback local folio structure if backend 404s for draft
      setFolioData({
        folioNumber: `FOL-${booking.bookingRef?.replace('#', '') || Date.now()}`,
        status: 'open',
        totalCharges: booking.amount?.replace('₹', '') || '0.00',
        totalPayments: '0.00',
        balance: booking.amount?.replace('₹', '') || '0.00',
        transactions: [
          {
            id: 'txn-1',
            txnType: 'room_rent',
            description: `Room Rent & Stay Charges for ${booking.guest?.name || 'Guest'}`,
            amount: booking.amount?.replace('₹', '') || '0.00',
            createdAt: new Date().toISOString(),
            isCredit: false,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && booking?.id) {
      loadFolio();
    }
  }, [isOpen, booking?.id]);

  // Lock Folio Action
  const handleLockFolio = async () => {
    if (!booking?.id) return;
    setIsLocking(true);
    setErrorMsg('');

    try {
      const res = await bookingService.lockFolio(booking.id);
      const resData = res?.data?.data || res?.data || {};

      const generatedPdf = resData.pdfUrl || resData.file?.url;
      if (generatedPdf) {
        setPdfUrl(generatedPdf);
      }

      if (onToast) onToast(`Folio for ${booking.bookingRef} locked successfully!`, 'success');
      loadFolio();
    } catch (err) {
      const serverErr = err?.response?.data?.message || err?.message || 'Failed to lock folio.';
      setErrorMsg(serverErr);
      if (onToast) onToast(serverErr, 'error');
    } finally {
      setIsLocking(false);
    }
  };

  // Add Transaction Action
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!txnForm.description.trim() || !txnForm.unitPrice) {
      setErrorMsg('Description and Amount are required.');
      return;
    }

    setIsAddingTxn(true);
    setErrorMsg('');

    try {
      const payload = {
        txnType: txnForm.txnType,
        description: txnForm.description.trim(),
        unitPrice: Number(txnForm.unitPrice),
        quantity: Number(txnForm.quantity || 1),
        amount: Number(txnForm.unitPrice) * Number(txnForm.quantity || 1),
        isCredit: Boolean(txnForm.isCredit),
      };

      await bookingService.postFolioTransaction(booking.id, payload);
      if (onToast) onToast('Folio transaction added successfully!', 'success');
      setShowAddForm(false);
      setTxnForm({ txnType: 'room_service', description: '', unitPrice: '', quantity: 1, isCredit: false });
      loadFolio();
    } catch (err) {
      const serverErr = err?.response?.data?.message || 'Failed to post transaction.';
      setErrorMsg(serverErr);
      if (onToast) onToast(serverErr, 'error');
    } finally {
      setIsAddingTxn(false);
    }
  };

  if (!isOpen || !booking) return null;

  const isFolioLocked = (folioData?.status || '').toLowerCase() === 'locked' || (folioData?.status || '').toLowerCase() === 'closed';

  return (
    <div className={styles.backdrop} onClick={onClose} data-testid="booking-folio-modal">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div
              className={styles.iconCircle}
              style={{
                background: isFolioLocked ? '#e0f2fe' : '#dcfce7',
                color: isFolioLocked ? '#0284c7' : '#15803d',
              }}
            >
              <Receipt size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className={styles.modalTitle}>Guest Booking Folio</h2>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: isFolioLocked ? '#e0f2fe' : '#dcfce7',
                    color: isFolioLocked ? '#0284c7' : '#15803d',
                    border: isFolioLocked ? '1px solid #7dd3fc' : '1px solid #86efac',
                  }}
                >
                  {isFolioLocked ? <Lock size={12} /> : <Unlock size={12} />}
                  {isFolioLocked ? 'LOCKED / CLOSED' : 'OPEN (UNLOCKED)'}
                </span>
              </div>
              <p className={styles.subtitle}>
                Folio Ref: <strong>{folioData?.folioNumber || `FOL-${booking.bookingRef}`}</strong> | Booking Ref: <strong>{booking.bookingRef}</strong>
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className={styles.errorAlert}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Fetching guest folio ledger from server...</p>
          </div>
        ) : (
          <div className={styles.modalBody}>
            {/* Guest & Reservation Quick Meta */}
            <div className={styles.metaRow}>
              <div>
                <span className={styles.metaLabel}><User size={13} /> GUEST NAME</span>
                <span className={styles.metaVal}>{booking.guest?.name || 'Guest'}</span>
              </div>
              <div>
                <span className={styles.metaLabel}><Calendar size={13} /> STAY DATES</span>
                <span className={styles.metaVal}>{booking.checkIn} → {booking.checkOut}</span>
              </div>
              <div>
                <span className={styles.metaLabel}><FileText size={13} /> ROOM CATEGORY</span>
                <span className={styles.metaVal}>{booking.roomType}</span>
              </div>
            </div>

            {/* Financial Ledger Cards */}
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.cardLabel}>TOTAL CHARGES</span>
                <div className={styles.cardVal} style={{ color: '#0f172a' }}>
                  ₹{Number(folioData?.totalCharges || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className={styles.summaryCard}>
                <span className={styles.cardLabel}>TOTAL PAYMENTS</span>
                <div className={styles.cardVal} style={{ color: '#16a34a' }}>
                  ₹{Number(folioData?.totalPayments || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className={styles.summaryCard} style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <span className={styles.cardLabel} style={{ color: '#0369a1' }}>NET BALANCE DUE</span>
                <div className={styles.cardVal} style={{ color: '#0284c7' }}>
                  ₹{Number(folioData?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className={styles.ledgerHeader}>
              <h3 className={styles.ledgerTitle}>Itemized Transactions Ledger</h3>
              {!isFolioLocked && (
                <Button
                  variant="secondary"
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px' }}
                >
                  <Plus size={14} /> {showAddForm ? 'Cancel Add' : 'Add Charge / Payment'}
                </Button>
              )}
            </div>

            {/* Add Transaction Form */}
            {showAddForm && !isFolioLocked && (
              <form onSubmit={handleAddTransaction} className={styles.addTxnForm}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--color-primary-dark)' }}>Post New Transaction to Folio</h4>
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.inputLabel}>TRANSACTION TYPE</label>
                    <select
                      className={styles.selectInput}
                      value={txnForm.txnType}
                      onChange={(e) => setTxnForm({ ...txnForm, txnType: e.target.value })}
                    >
                      <option value="room_rent">Room Rent Charge</option>
                      <option value="room_service">Room Service / Food</option>
                      <option value="laundry">Laundry Service</option>
                      <option value="minibar">Minibar Consumption</option>
                      <option value="tax">Tax / Tariff Fee</option>
                      <option value="discount">Discount / Allowance</option>
                      <option value="payment">Guest Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.inputLabel}>DESCRIPTION *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Dinner Order #402"
                      value={txnForm.description}
                      onChange={(e) => setTxnForm({ ...txnForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className={styles.inputLabel}>AMOUNT (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={styles.textInput}
                      placeholder="0.00"
                      value={txnForm.unitPrice}
                      onChange={(e) => setTxnForm({ ...txnForm, unitPrice: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className={styles.inputLabel}>TRANSACTION NATURE</label>
                    <select
                      className={styles.selectInput}
                      value={txnForm.isCredit ? 'credit' : 'debit'}
                      onChange={(e) => setTxnForm({ ...txnForm, isCredit: e.target.value === 'credit' })}
                    >
                      <option value="debit">Charge / Debit (Increases Balance)</option>
                      <option value="credit">Payment / Credit (Reduces Balance)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <Button variant="primary" type="submit" disabled={isAddingTxn}>
                    {isAddingTxn ? 'Posting...' : 'Post Transaction'}
                  </Button>
                </div>
              </form>
            )}

            {/* Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>TYPE</th>
                    <th>DESCRIPTION</th>
                    <th>AMOUNT</th>
                    <th>NATURE</th>
                  </tr>
                </thead>
                <tbody>
                  {folioData?.transactions && folioData.transactions.length > 0 ? (
                    folioData.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={styles.txnTypeBadge}>
                            {tx.txnType ? tx.txnType.replace('_', ' ').toUpperCase() : 'CHARGE'}
                          </span>
                        </td>
                        <td>{tx.description || 'N/A'}</td>
                        <td style={{ fontWeight: 600 }}>
                          ₹{Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span
                            style={{
                              color: tx.isCredit ? '#16a34a' : '#d97706',
                              fontWeight: 600,
                              fontSize: '12px',
                            }}
                          >
                            {tx.isCredit ? 'CREDIT' : 'DEBIT'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        No transactions recorded in this folio yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Footer Bar */}
        <div className={styles.modalFooter}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isFolioLocked && (
              <Button
                variant="primary"
                onClick={handleLockFolio}
                disabled={isLocking}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dc2626', borderColor: '#dc2626' }}
              >
                <Lock size={15} /> {isLocking ? 'Locking...' : 'Lock Folio'}
              </Button>
            )}

            {/* ONLY render View PDF Invoice button for LOCKED folios that have an existing Cloudinary PDF link */}
            {isFolioLocked && pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Button
                  variant="secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0284c7', borderColor: '#7dd3fc' }}
                >
                  <Printer size={15} /> View PDF Invoice
                </Button>
              </a>
            )}
          </div>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
