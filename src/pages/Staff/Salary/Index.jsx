/**
 * @file Index.jsx
 * @description Professional Staff & Salary Dashboard.
 * @figmaFrame Professional Staff & Salary Dashboard
 */

import React, { useState } from 'react';
import styles from './Index.module.css';

// ─── Attendance Data ──────────────────────────────────────────────────────────

const INITIAL_ATTENDANCE_DATA = [
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

// Simple Add Employee modal
function AddEmployeeModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && role.trim()) {
      onAdd(name.trim(), role.trim());
      onClose();
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const cardStyle = {
    background: 'var(--color-surface)', borderRadius: 18, padding: '32px 36px',
    width: 400, maxWidth: '92vw', boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
  };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 9, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: 15, boxSizing: 'border-box', marginBottom: 18 };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 24px', fontSize: 20 }}>Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>FULL NAME</label>
          <input style={inputStyle} type="text" placeholder="Employee name..." value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <label style={labelStyle}>ROLE / DEPARTMENT</label>
          <input style={inputStyle} type="text" placeholder="e.g. Housekeeping Supervisor" value={role} onChange={(e) => setRole(e.target.value)} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StaffSalaryDashboard() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [attendanceList, setAttendanceList] = useState(INITIAL_ATTENDANCE_DATA);

  const handleExportReport = () => window.print();

  const handleAddEmployee = (empName, empRole) => {
    const initials = empName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    const checkIn = `${formattedHours}:${minutes} ${ampm}`;

    const newEmp = {
      id: `emp-${Date.now().toString().slice(-3)}`,
      initials: initials || 'EM',
      name: empName,
      role: empRole,
      checkIn,
      status: 'Present',
      statusType: 'present',
    };

    setAttendanceList((prev) => [newEmp, ...prev]);
  };

  const handleOperationClick = (operationId) => {
    const messages = {
      attendance: 'Redirecting to Mark Attendance...',
      salary: 'Redirecting to View Salary...',
      advance: 'Redirecting to Give Advance...',
      staff: 'Opening Add Employee form...',
    };
    if (operationId === 'staff') {
      setShowAddEmployee(true);
    } else {
      window.alert(messages[operationId]);
    }
  };

  const summaryCards = [
    {
      id: 'active-staff',
      icon: '♟',
      label: 'ACTIVE STAFF',
      value: String(24 + (attendanceList.length - INITIAL_ATTENDANCE_DATA.length)),
      badge: '+2 this month',
      variant: 'staff',
    },
    {
      id: 'present-today',
      icon: '✓',
      label: 'PRESENT TODAY',
      value: String(21 + (attendanceList.length - INITIAL_ATTENDANCE_DATA.length)),
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

  return (
    <div className={styles.page}>
      {showAddEmployee && (
        <AddEmployeeModal
          onAdd={handleAddEmployee}
          onClose={() => setShowAddEmployee(false)}
        />
      )}

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
            onClick={handleExportReport}
          >
            ⇩ &nbsp; Export Report
          </button>

          <button
            type="button"
            className={styles.addEmployeeButton}
            onClick={() => setShowAddEmployee(true)}
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
              onClick={() => window.alert('View History — Attendance history log')}
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
                {attendanceList.map((employee) => (
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
                        onClick={() => window.alert(`Options for ${employee.name}: Edit, View Profile, Change Status`)}
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
              <button type="button" onClick={() => window.alert('Payroll Details:\nGross: $142,500\nDeductions: $8,420.50\nNet Payable: $134,079.50\nNext Payout: Aug 01')}>
                Details
              </button>

              <button
                type="button"
                className={styles.printSmallButton}
                aria-label="Print payout details"
                onClick={() => window.print()}
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
              onClick={() => handleOperationClick(operation.id)}
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
