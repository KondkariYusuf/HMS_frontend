/**
 * @file Index.jsx
 * @description Professional Staff & Salary Dashboard.
 * @figmaFrame Professional Staff & Salary Dashboard
 */

import React from 'react';
import styles from './Index.module.css';

// ─── Summary Data ─────────────────────────────────────────────────────────────

const summaryCards = [
  {
    id: 'active-staff',
    icon: '♟',
    label: 'ACTIVE STAFF',
    value: '24',
    badge: '+2 this month',
    variant: 'staff',
  },
  {
    id: 'present-today',
    icon: '✓',
    label: 'PRESENT TODAY',
    value: '21',
    badge: '87.5%',
    variant: 'present',
  },
  {
    id: 'total-payroll',
    icon: '₹',
    label: 'TOTAL PAYROLL',
    value: '₹1,42,500',
    badge: '+4.2%',
    variant: 'payroll',
  },
  {
    id: 'outstanding',
    icon: '▣',
    label: 'OUTSTANDING ADVANCES',
    value: '₹4,52,100',
    badge: 'Requires review',
    variant: 'outstanding',
  },
];

// ─── Attendance Data ──────────────────────────────────────────────────────────

const attendanceData = [
  {
    id: 'emp-101',
    initials: 'SJ',
    name: 'Sarah Johnson',
    role: 'Housekeeping',
    checkIn: '08:00 AM',
    status: 'Present',
    statusType: 'present',
  },
  {
    id: 'emp-102',
    initials: 'MD',
    name: 'Mark Davis',
    role: 'Front Desk',
    checkIn: '09:15 AM',
    status: 'Present',
    statusType: 'present',
  },
  {
    id: 'emp-103',
    initials: 'LZ',
    name: 'Lina Zhang',
    role: 'F&B Service',
    checkIn: '--',
    status: 'Absent',
    statusType: 'absent',
  },
];

// ─── Staff Distribution ───────────────────────────────────────────────────────

const staffDistribution = [
  {
    id: 'housekeeping',
    department: 'Housekeeping',
    percentage: 45,
  },
  {
    id: 'front-desk',
    department: 'Front Desk',
    percentage: 30,
  },
  {
    id: 'fb',
    department: 'F&B Service',
    percentage: 15,
  },
  {
    id: 'maintenance',
    department: 'Maintenance',
    percentage: 10,
  },
];

// ─── Operations ───────────────────────────────────────────────────────────────

const operations = [
  {
    id: 'attendance',
    icon: '♟',
    label: 'Mark Attendance',
  },
  {
    id: 'salary',
    icon: '▣',
    label: 'View Salary',
  },
  {
    id: 'advance',
    icon: '₹',
    label: 'Give Advance',
  },
  {
    id: 'staff',
    icon: '♟+',
    label: 'Add Staff',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StaffSalaryDashboard() {
  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Staff &amp; Salary</h1>

          <p className={styles.subtitle}>
            Manage employee attendance, payroll, and staff operations.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.exportButton}
          >
            ⇩ &nbsp; Export Report
          </button>

          <button
            type="button"
            className={styles.addEmployeeButton}
          >
            + &nbsp; Add Employee
          </button>
        </div>
      </header>

      {/* ── Summary Cards ── */}
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

            <div className={styles.summaryContent}>
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

      {/* ── Main Content ── */}
      <section className={styles.mainGrid}>

        {/* ── Today's Attendance ── */}
        <article className={styles.attendanceCard}>

          <div className={styles.cardHeader}>
            <div>
              <h2>Today&apos;s Attendance</h2>

              <p>
                Real-time status for July 24, 2024
              </p>
            </div>

            <button
              type="button"
              className={styles.historyButton}
            >
              View History →
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.attendanceTable}>
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>ROLE / DEPARTMENT</th>
                  <th>CHECK-IN</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {attendanceData.map((employee) => (
                  <tr key={employee.id}>

                    <td>
                      <div className={styles.employeeCell}>

                        <div className={styles.avatar}>
                          {employee.initials}
                        </div>

                        <div className={styles.employeeInfo}>
                          <strong>{employee.name}</strong>
                          <span>{employee.id.toUpperCase()}</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className={styles.role}>
                        {employee.role}
                      </span>
                    </td>

                    <td>
                      <span className={styles.checkIn}>
                        {employee.checkIn}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.statusBadge} ${styles[employee.statusType]
                          }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.moreButton}
                        aria-label={`More options for ${employee.name}`}
                      >
                        •••
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </article>

        {/* ── Right Column ── */}
        <div className={styles.rightColumn}>

          {/* Staff Distribution */}
          <article className={styles.distributionCard}>

            <div className={styles.cardHeader}>
              <div>
                <h2>Staff Distribution</h2>

                <p>
                  Team breakdown by department
                </p>
              </div>
            </div>

            <div className={styles.distributionList}>
              {staffDistribution.map((item) => (
                <div
                  key={item.id}
                  className={styles.distributionItem}
                >
                  <div className={styles.distributionHeader}>
                    <span>{item.department}</span>

                    <strong>
                      {item.percentage}%
                    </strong>
                  </div>

                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </article>

          {/* Projected Payroll */}
          <article className={styles.payoutCard}>

            <div className={styles.payoutTop}>
              <span className={styles.payoutIcon}>
                ▣
              </span>

              <span className={styles.payoutBadge}>
                NEXT PAYOUT: AUG 01
              </span>
            </div>

            <div className={styles.payoutContent}>
              <span>
                Projected Next Month
              </span>

              <strong>
                $3,120.00
              </strong>
            </div>

            <div className={styles.payoutActions}>
              <button type="button">
                Details
              </button>

              <button
                type="button"
                className={styles.printSmallButton}
                aria-label="Print payout details"
              >
                ▣
              </button>
            </div>

          </article>

        </div>
      </section>

      {/* ── Operations Hub ── */}
      <section className={styles.operationsSection}>

        <h2 className={styles.operationsTitle}>
          Operations Hub
        </h2>

        <div className={styles.operationsGrid}>
          {operations.map((operation) => (
            <button
              type="button"
              key={operation.id}
              className={styles.operationCard}
            >
              <span className={styles.operationIcon}>
                {operation.icon}
              </span>

              <span className={styles.operationLabel}>
                {operation.label}
              </span>
            </button>
          ))}
        </div>

      </section>

    </div>
  );
}