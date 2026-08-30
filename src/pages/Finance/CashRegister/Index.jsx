/* global Blob, URL */
import React, { useState, useRef, useEffect } from 'react';
import styles from './Index.module.css';

const summaryCards = [
  {
    label: 'OPENING BALANCE',
    title: 'OPENING',
    value: '₹12,22,22,22',
    type: 'opening',
  },
  {
    label: 'CASH IN DRAWER',
    title: 'LIVE',
    value: '₹12,22,22,22',
    type: 'live',
  },
  {
    label: 'NET REVENUE',
    title: '+0.8%',
    value: '₹08,20,000',
    type: 'revenue',
  },
  {
    label: 'ONLINE RECEIVED',
    title: '',
    value: '₹0',
    type: 'online',
  },
  {
    label: 'CASH INFLOW',
    title: '',
    value: '₹0',
    type: 'inflow',
  },
  {
    label: 'TOTAL EXPENSES',
    title: '',
    value: '₹0',
    type: 'expenses',
  },
];

// Formats today's date as DD - MM - YYYY to match the existing display format
function getTodayFormatted() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd} - ${mm} - ${yyyy}`;
}

// CSV export utility (same pattern as Billing/Reports)
function exportToCSV(transactions) {
  const headers = ['Date', 'Time', 'Type', 'Description', 'Mode', 'Amount'];
  const rows = transactions.map((t) => [
    t.date,
    t.time,
    t.type,
    t.description,
    t.mode,
    t.amount,
  ]);
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'cash-register.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const MODES = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'];
const EMPTY_FORM = { description: '', amount: '', mode: 'Cash' };

// Simple inline modal shared by Add Credit, Add Expense, Withdraw Cash, and + Add
function TransactionModal({ title, type, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const descRef = useRef(null);

  useEffect(() => {
    if (descRef.current) descRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    onSave({
      id: `tx-${Date.now()}`,
      date: `${dd}-${mm}-${yyyy}`,
      time: `${hh}:${min}`,
      type,
      description: form.description.trim(),
      mode: form.mode,
      amount: `₹${Number(form.amount).toLocaleString('en-IN')}`,
    });
    onClose();
  };

  // Inline modal overlay styles (no new CSS classes — use inline style)
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };
  const cardStyle = {
    background: 'var(--color-surface)',
    borderRadius: 18,
    padding: '32px 36px',
    width: 400,
    maxWidth: '92vw',
    boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
  };
  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--color-text-muted)',
    letterSpacing: '0.5px',
  };
  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 9,
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
    fontSize: 15,
    boxSizing: 'border-box',
    marginBottom: 18,
  };
  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 24px', fontSize: 20 }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>DESCRIPTION</label>
          <input
            ref={descRef}
            style={inputStyle}
            type="text"
            placeholder="Enter description..."
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            required
          />
          <label style={labelStyle}>AMOUNT (₹)</label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            placeholder="0"
            value={form.amount}
            onChange={(e) =>
              setForm((p) => ({ ...p, amount: e.target.value }))
            }
            required
          />
          <label style={labelStyle}>MODE</label>
          <select
            style={inputStyle}
            value={form.mode}
            onChange={(e) =>
              setForm((p) => ({ ...p, mode: e.target.value }))
            }
          >
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <div style={footerStyle}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 22px',
                borderRadius: 9,
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: 9,
                border: 'none',
                background: 'var(--color-primary)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CashRegisterPage() {
  const [selectedDate, setSelectedDate] = useState('30 - 07 - 2026');
  const [transactions, setTransactions] = useState([]);
  // modal: null | 'credit' | 'expense' | 'withdraw'
  const [modal, setModal] = useState(null);
  // filterType: null | 'Credit' | 'Expense' | 'Withdraw'
  const [filterType, setFilterType] = useState(null);

  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleTodayClick = () => {
    setSelectedDate(getTodayFormatted());
  };

  const handleExportCSV = () => {
    exportToCSV(transactions);
  };

  const handleLedgerDownload = () => {
    exportToCSV(displayedTransactions);
  };

  const handleFilterToggle = () => {
    // Cycle through filter types: null → Credit → Expense → Withdraw → null
    setFilterType((prev) => {
      if (prev === null) return 'Credit';
      if (prev === 'Credit') return 'Expense';
      if (prev === 'Expense') return 'Withdraw';
      return null;
    });
  };

  const displayedTransactions =
    filterType
      ? transactions.filter((t) => t.type === filterType)
      : transactions;

  const modalConfig = {
    credit:  { title: 'Add Credit',       type: 'Credit'   },
    expense: { title: 'Add Expense',       type: 'Expense'  },
    withdraw:{ title: 'Withdraw Cash',     type: 'Withdraw' },
  };

  return (
    <div className={styles.page}>
      {/* Transaction Modal */}
      {modal && (
        <TransactionModal
          title={modalConfig[modal].title}
          type={modalConfig[modal].type}
          onSave={addTransaction}
          onClose={() => setModal(null)}
        />
      )}

      {/* Page Header */}
      <section className={styles.header}>
        <div>
          <h1 className={styles.title}>Cash Register</h1>
          <p className={styles.subtitle}>
            Track hotel cash flow, expenses, and revenue.
          </p>
        </div>

        <button className={styles.exportButton} onClick={handleExportCSV}>
          <span>＋</span>
          Export CSV
        </button>
      </section>

      {/* Actions + Date */}
      <section className={styles.controls}>
        <div className={styles.actionGroup}>
          <button
            className={`${styles.actionButton} ${styles.creditButton}`}
            onClick={() => setModal('credit')}
          >
            Add Credit
          </button>

          <button
            className={`${styles.actionButton} ${styles.expenseButton}`}
            onClick={() => setModal('expense')}
          >
            Add Expense
          </button>

          <button
            className={`${styles.actionButton} ${styles.withdrawButton}`}
            onClick={() => setModal('withdraw')}
          >
            Withdraw Cash
          </button>
        </div>

        <div className={styles.dateGroup}>
          <label className={styles.dateBox}>
            <span>DATE:</span>
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>

          <button className={styles.todayButton} onClick={handleTodayClick}>Today</button>
        </div>
      </section>

      {/* Summary Cards */}
      <section className={styles.summaryGrid}>
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`${styles.summaryCard} ${styles[card.type]}`}
          >
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>
                {card.type === 'opening' && '▣'}
                {card.type === 'live' && '◎'}
                {card.type === 'revenue' && '▥'}
                {card.type === 'online' && '◎'}
                {card.type === 'inflow' && '↑'}
                {card.type === 'expenses' && '↓'}
              </div>

              {card.title && (
                <span className={styles.cardStatus}>{card.title}</span>
              )}
            </div>

            <span className={styles.cardLabel}>{card.label}</span>
            <strong className={styles.cardValue}>{card.value}</strong>
          </div>
        ))}
      </section>

      {/* Pending Transactions */}
      <section className={styles.pendingBar}>
        <div className={styles.pendingTitle}>
          <span className={styles.pendingIcon}>⌛</span>
          <strong>Pending Transactions (4)</strong>
        </div>

        <div className={styles.pendingActions}>
          <span className={styles.netBadge}>Net: ₹21,099</span>
          <button className={styles.addButton} onClick={() => setModal('credit')}>+ Add</button>
        </div>
      </section>

      {/* Transaction Ledger */}
      <section className={styles.ledgerCard}>
        <div className={styles.ledgerHeader}>
          <h2>
            Transaction Ledger
            {filterType && (
              <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
                — {filterType}
              </span>
            )}
          </h2>

          <div className={styles.ledgerTools}>
            <button
              aria-label="Filter transactions"
              onClick={handleFilterToggle}
              title={filterType ? `Filter: ${filterType} (click to cycle)` : 'Filter transactions'}
            >
              ▽
            </button>
            <button
              aria-label="Download transactions"
              onClick={handleLedgerDownload}
              title="Download as CSV"
            >
              ↓
            </button>
          </div>
        </div>

        <div className={styles.table}>
          <div className={`${styles.tableRow} ${styles.tableHeader}`}>
            <span>DATE</span>
            <span>TIME</span>
            <span>TYPE</span>
            <span>DESCRIPTION</span>
            <span>MODE</span>
            <span>AMOUNT</span>
            <span>ACTIONS</span>
          </div>

          {displayedTransactions.length > 0 ? (
            displayedTransactions.map((transaction) => (
              <div className={styles.tableRow} key={transaction.id}>
                <span>{transaction.date}</span>
                <span>{transaction.time}</span>
                <span>{transaction.type}</span>
                <span>{transaction.description}</span>
                <span>{transaction.mode}</span>
                <span>{transaction.amount}</span>
                <span>•••</span>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>▧</div>
              <h3>No transactions recorded for this period.</h3>
              <p>
                Use the action buttons above to record new hotel
                <br />
                financial activity.
              </p>
            </div>
          )}
        </div>

        <div className={styles.ledgerFooter}>
          <span>
            Showing {displayedTransactions.length} of {transactions.length} transactions
          </span>

          <div className={styles.pagination}>
            <button disabled>Previous</button>
            <button disabled>Next</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2024 Grand Horizon Luxury Resort. All rights reserved.</span>

        <div>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Financial Compliance</span>
        </div>
      </footer>
    </div>
  );
}