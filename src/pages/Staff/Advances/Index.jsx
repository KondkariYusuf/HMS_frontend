/**
 * @file Index.jsx
 * @description Staff Advances Dashboard — manages employee advances,
 * monthly deductions, outstanding balances, and financial insights.
 * @figmaFrame Professional Staff Advances Dashboard
 */

import React from 'react';
import styles from './Index.module.css';

// ─── Summary Data ─────────────────────────────────────────────────────────────

const summaryCards = [
    {
        id: 'given',
        label: 'GIVEN THIS MONTH',
        value: 'KES 142,500',
        icon: '▣',
        badge: '+12% VS LAST MO',
        variant: 'given',
    },
    {
        id: 'deducted',
        label: 'DEDUCTED THIS MONTH',
        value: 'KES 88,400',
        icon: '▰',
        badge: 'ON TRACK',
        variant: 'deducted',
    },
    {
        id: 'outstanding',
        label: 'TOTAL OUTSTANDING BALANCE',
        value: 'KES 452,100',
        icon: '▥',
        badge: 'REQUIRES REVIEW',
        variant: 'outstanding',
    },
];

// ─── Advance Ledger Data ──────────────────────────────────────────────────────

const advanceLedger = [
    {
        id: 'adv-101',
        name: 'Samuel Mwangi',
        department: 'Housekeeping Department',
        initials: 'SM',
        givenIn: 'May 2024',
        deducted: 'KES 5,000',
        status: 'ACTIVE',
        outstanding: 'KES 15,000',
        cleared: false,
        avatarVariant: 'teal',
    },
    {
        id: 'adv-102',
        name: 'Jane Otieno',
        department: 'Food & Beverage',
        initials: 'JO',
        givenIn: 'June 2024',
        deducted: 'KES 8,500',
        status: 'ACTIVE',
        outstanding: 'KES 42,000',
        cleared: false,
        avatarVariant: 'orange',
    },
    {
        id: 'adv-103',
        name: 'David Kimani',
        department: 'Security',
        initials: 'DK',
        givenIn: 'Jan 2024',
        deducted: 'KES 0',
        status: 'COMPLETED',
        outstanding: 'KES 0',
        cleared: true,
        avatarVariant: 'gray',
    },
    {
        id: 'adv-104',
        name: 'Esther Lokel',
        department: 'Reception',
        initials: 'EL',
        givenIn: 'July 2024',
        deducted: 'KES 12,000',
        status: 'ACTIVE',
        outstanding: 'KES 108,000',
        cleared: false,
        avatarVariant: 'lightTeal',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StaffAdvances() {
    return (
        <div className={styles.page}>

            {/* Page Header */}
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Staff Advances</h1>

                    <p className={styles.subtitle}>
                        Manage employee financial aid and repayment schedules for the
                        current fiscal period.
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <label className={styles.monthSelector}>
                        <span className={styles.calendarIcon}>▣</span>

                        <select
                            className={styles.monthSelect}
                            defaultValue="July 2024"
                        >
                            <option>July 2024</option>
                            <option>June 2024</option>
                            <option>May 2024</option>
                            <option>April 2024</option>
                        </select>
                    </label>

                    <button
                        type="button"
                        className={styles.giveAdvanceButton}
                    >
                        + Give Advance
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <section className={styles.summaryGrid}>
                {summaryCards.map((card) => (
                    <article
                        key={card.id}
                        className={`${styles.summaryCard} ${styles[card.variant]}`}
                    >
                        <div className={styles.summaryTop}>
                            <div className={styles.summaryIcon}>
                                {card.icon}
                            </div>

                            <span className={styles.summaryBadge}>
                                {card.badge}
                            </span>
                        </div>

                        <div className={styles.summaryDetails}>
                            <span className={styles.summaryLabel}>
                                {card.label}
                            </span>

                            <strong className={styles.summaryValue}>
                                {card.value}
                            </strong>
                        </div>
                    </article>
                ))}
            </section>

            {/* Monthly Advance Panels */}
            <section className={styles.monthlyGrid}>

                {/* Given in July */}
                <article className={styles.monthlyCard}>
                    <div className={styles.cardHeader}>
                        <h2>Given in July</h2>

                        <button
                            type="button"
                            className={styles.viewAllButton}
                        >
                            View All
                        </button>
                    </div>

                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            ▤
                        </div>

                        <p>
                            No new advances issued in the
                            <br />
                            last 24 hours.
                        </p>

                        <span>
                            Recent records will appear here as
                            <br />
                            they are processed.
                        </span>
                    </div>
                </article>

                {/* Deducted in July */}
                <article className={styles.monthlyCard}>
                    <div className={styles.cardHeader}>
                        <h2>Deducted in July</h2>

                        <button
                            type="button"
                            className={styles.viewAllButton}
                        >
                            View All
                        </button>
                    </div>

                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            ▤
                        </div>

                        <p>
                            Payroll deductions for July are
                            <br />
                            still pending final approval.
                        </p>

                        <span>
                            Expected completion by the 25th of
                            <br />
                            the month.
                        </span>
                    </div>
                </article>

                {/* How It Works */}
                <article className={styles.howItWorks}>
                    <div className={styles.infoIcon}>
                        i
                    </div>

                    <h2>How it works</h2>

                    <ol className={styles.steps}>
                        <li>
                            <strong>01</strong>

                            <span>
                                Initiate an advance via the
                                “Give Advance” button.
                            </span>
                        </li>

                        <li>
                            <strong>02</strong>

                            <span>
                                Define monthly deductions which
                                will automatically sync with payroll.
                            </span>
                        </li>

                        <li>
                            <strong>03</strong>

                            <span>
                                Track the outstanding balance in
                                the ledger below in real-time.
                            </span>
                        </li>
                    </ol>
                </article>

            </section>

            {/* Advances Ledger */}
            <section className={styles.ledgerCard}>

                <div className={styles.ledgerHeader}>
                    <h2>Advances Ledger</h2>

                    <div className={styles.ledgerActions}>
                        <button
                            type="button"
                            className={styles.iconButton}
                            aria-label="Filter advances"
                        >
                            ≡
                        </button>

                        <button
                            type="button"
                            className={styles.iconButton}
                            aria-label="Download ledger"
                        >
                            ↓
                        </button>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ADVANCE NAME</th>
                                <th>
                                    GIVEN
                                    <br />
                                    IN
                                </th>
                                <th>
                                    DEDUCTED
                                    <br />
                                    (JULY)
                                </th>
                                <th>STATUS</th>
                                <th>OUTSTANDING</th>
                                <th>CLEARED</th>
                            </tr>
                        </thead>

                        <tbody>
                            {advanceLedger.map((advance) => (
                                <tr key={advance.id}>

                                    {/* Employee */}
                                    <td>
                                        <div className={styles.employeeCell}>
                                            <div
                                                className={`${styles.employeeAvatar} ${styles[advance.avatarVariant]
                                                    }`}
                                            >
                                                {advance.initials}
                                            </div>

                                            <div className={styles.employeeInfo}>
                                                <strong>{advance.name}</strong>
                                                <span>{advance.department}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Given In */}
                                    <td>
                                        <span className={styles.givenDate}>
                                            {advance.givenIn}
                                        </span>
                                    </td>

                                    {/* Deducted */}
                                    <td>
                                        <span className={styles.deductedAmount}>
                                            {advance.deducted}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${advance.status === 'ACTIVE'
                                                    ? styles.activeStatus
                                                    : styles.completedStatus
                                                }`}
                                        >
                                            {advance.status}
                                        </span>
                                    </td>

                                    {/* Outstanding */}
                                    <td>
                                        <span
                                            className={
                                                advance.outstanding === 'KES 0'
                                                    ? styles.zeroOutstanding
                                                    : styles.outstandingAmount
                                            }
                                        >
                                            {advance.outstanding}
                                        </span>
                                    </td>

                                    {/* Cleared */}
                                    <td>
                                        <span
                                            className={`${styles.clearIcon} ${advance.cleared
                                                    ? styles.cleared
                                                    : styles.notCleared
                                                }`}
                                        >
                                            ✓
                                        </span>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.ledgerFooter}>
                    <span>
                        Showing 4 of 24 staff members with active advances.
                    </span>

                    <div className={styles.pagination}>
                        <button type="button">
                            Previous
                        </button>

                        <button type="button">
                            Next
                        </button>
                    </div>
                </div>

            </section>

            {/* Financial Insight */}
            <section className={styles.insightSection}>

                <div className={styles.insightContent}>
                    <h2>Financial Insight</h2>

                    <p>
                        Grand Horizon’s financial ecosystem is designed to support our
                        staff’s well-being while maintaining rigorous fiscal discipline.
                        Our advances system ensures that liquidity is available when
                        needed, with automated deductions that prevent overdue balances
                        and simplify month-end reconciliations.
                    </p>

                    <div className={styles.insightStats}>
                        <div>
                            <strong>98%</strong>
                            <span>RECOVERY RATE</span>
                        </div>

                        <div>
                            <strong>4.2h</strong>
                            <span>AVG PROCESSING</span>
                        </div>
                    </div>
                </div>

                <div className={styles.healthCard}>
                    <span className={styles.healthLabel}>
                        REAL-TIME PERFORMANCE
                    </span>

                    <strong>
                        Fiscal Health Dashboard v2.0
                    </strong>
                </div>

            </section>

        </div>
    );
}