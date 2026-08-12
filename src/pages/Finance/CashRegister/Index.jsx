import React, { useState } from 'react';
import styles from './Index.module.css';

const transactions = [];

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

export default function CashRegisterPage() {
  const [selectedDate, setSelectedDate] = useState('30 - 07 - 2026');

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <section className={styles.header}>
        <div>
          <h1 className={styles.title}>Cash Register</h1>
          <p className={styles.subtitle}>
            Track hotel cash flow, expenses, and revenue.
          </p>
        </div>

        <button className={styles.exportButton}>
          <span>＋</span>
          Export CSV
        </button>
      </section>

      {/* Actions + Date */}
      <section className={styles.controls}>
        <div className={styles.actionGroup}>
          <button className={`${styles.actionButton} ${styles.creditButton}`}>
            Add Credit
          </button>

          <button className={`${styles.actionButton} ${styles.expenseButton}`}>
            Add Expense
          </button>

          <button className={`${styles.actionButton} ${styles.withdrawButton}`}>
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

          <button className={styles.todayButton}>Today</button>
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
          <button className={styles.addButton}>+ Add</button>
        </div>
      </section>

      {/* Transaction Ledger */}
      <section className={styles.ledgerCard}>
        <div className={styles.ledgerHeader}>
          <h2>Transaction Ledger</h2>

          <div className={styles.ledgerTools}>
            <button aria-label="Filter transactions">▽</button>
            <button aria-label="Download transactions">↓</button>
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

          {transactions.length > 0 ? (
            transactions.map((transaction) => (
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
          <span>Showing 0 of 0 transactions</span>

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