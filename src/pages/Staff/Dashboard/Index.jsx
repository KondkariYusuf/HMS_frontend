import React from 'react';
import KpiCard from '@components/KpiCard/KpiCard';
import DataTable from '@components/DataTable/DataTable';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import styles from './Index.module.css';

export default function StaffDashboard() {
  const attendanceColumns = [
    { key: 'guest', title: 'Employee' },
    { key: 'room', title: 'Role / Department' },
    { key: 'dates', title: 'Check-in' },
    { key: 'status', title: 'Status' },
  ];

  const attendanceData = [
    {
      id: 'emp-101',
      guest: {
        name: 'Sarah Johnson',
        tag: 'EMP-101',
      },
      room: 'Housekeeping',
      dates: '08:00 AM',
      status: 'present',
    },
    {
      id: 'emp-102',
      guest: {
        name: 'Mark Davis',
        tag: 'EMP-102',
      },
      room: 'Front Desk',
      dates: '09:15 AM',
      status: 'present',
    },
    {
      id: 'emp-103',
      guest: {
        name: 'Lina Zhang',
        tag: 'EMP-103',
      },
      room: 'F&B Service',
      dates: '--',
      status: 'absent',
    },
  ];

  const distributionSegments = [
    {
      label: 'Housekeeping',
      value: 45,
      color: 'var(--color-primary)',
    },
    {
      label: 'Front Desk',
      value: 30,
      color: 'var(--color-primary-dark)',
    },
    {
      label: 'F&B Service',
      value: 15,
      color: 'var(--color-sidebar-bg)',
    },
    {
      label: 'Maintenance',
      value: 10,
      color: 'var(--color-text-muted)',
    },
  ];

  const quickActions = [
    {
      id: 'mark-attendance',
      label: 'Mark Attendance',
      icon: '📝',
    },
    {
      id: 'view-salary',
      label: 'View Salary',
      icon: '💰',
    },
    {
      id: 'give-advance',
      label: 'Give Advance',
      icon: '💸',
    },
    {
      id: 'add-staff',
      label: 'Add Staff',
      icon: '👤',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Staff & Salary</h1>

        <p className={styles.description}>
          Manage employee attendance, payroll, and staff operations.
        </p>
      </header>

      {/* KPI Cards */}
      <section className={styles.kpiGrid}>
        <KpiCard
          icon="👥"
          label="ACTIVE STAFF"
          value="24"
          delta="+2 this month"
        />

        <KpiCard
          icon="✓"
          label="PRESENT TODAY"
          value="21"
          delta="87.5%"
        />

        <KpiCard
          icon="₹"
          label="TOTAL PAYROLL"
          value="₹1,42,500"
          delta="+4.2%"
        />

        <KpiCard
          icon="💸"
          label="OUTSTANDING ADVANCES"
          value="₹4,52,100"
          delta="Requires review"
          isPositive={false}
        />
      </section>

      {/* Attendance and Staff Distribution */}
      <div className={styles.mainGrid}>
        <section className={styles.attendanceSection}>
          <h2 className={styles.sectionTitle}>
            Today's Attendance
          </h2>

          <div className={styles.card}>
            <DataTable
              columns={attendanceColumns}
              data={attendanceData}
            />
          </div>
        </section>

        <section className={styles.distributionSection}>
          <h2 className={styles.sectionTitle}>
            Staff Distribution
          </h2>

          <div className={styles.card}>
            <ProgressBar
              segments={distributionSegments}
              showLegend={true}
            />
          </div>
        </section>
      </div>

      {/* Operations Hub */}
      <section className={styles.operationsSection}>
        <h2 className={styles.sectionTitle}>
          Operations Hub
        </h2>

        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={styles.actionCard}
            >
              <span className={styles.actionIcon}>
                {action.icon}
              </span>

              <span className={styles.actionLabel}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}