/**
 * @file Index.jsx
 * @description Professional Monthly Salary dashboard for payroll tracking,
 * deductions, staff payments, and payroll register management.
 * @figmaFrame Figma frame: Professional monthly salary dashboard
 *
 * @returns {JSX.Element} Monthly salary dashboard screen.
 */

import React, { useMemo, useState } from 'react';
import styles from './Index.module.css';

const departments = ['All Staff', 'Housekeeping', 'Reception', 'Kitchen', 'Security'];

const staffMembers = [
  {
    id: 'staff-001',
    name: 'Sarah Johnson',
    role: 'Housekeeping Supervisor',
    present: '26',
    double: '02',
    leave: '02',
    absent: '00',
    daily: '$120',
    gross: '$3,600',
    advance: '$200',
    net: '$3,400',
  },
  {
    id: 'staff-002',
    name: 'Mark Davies',
    role: 'Front Desk Lead',
    present: '24',
    double: '04',
    leave: '01',
    absent: '01',
    daily: '$145',
    gross: '$4,350',
    advance: '—',
    net: '$4,350',
  },
  {
    id: 'staff-003',
    name: 'Lina Zhang',
    role: 'Pastry Chef',
    present: '28',
    double: '00',
    leave: '02',
    absent: '00',
    daily: '$160',
    gross: '$4,800',
    advance: '$1,200',
    net: '$3,600',
  },
  {
    id: 'staff-004',
    name: 'James Wilson',
    role: 'Security Lead',
    present: '30',
    double: '06',
    leave: '00',
    absent: '00',
    daily: '$110',
    gross: '$3,960',
    advance: '—',
    net: '$3,960',
  },
];

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.cardIconSvg}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5V3h10v2" />
      <path d="M15 10h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
      <circle cx="15.5" cy="12.5" r="0.8" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.cardIconSvg}
    >
      <path d="m4 7 6 6 4-4 6 6" />
      <path d="M15 15h5v-5" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.cardIconSvg}
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 9h.01M18 15h.01" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.calendarIcon}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.actionIcon}
    >
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.tableActionIcon}
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.tableActionIcon}
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function ChevronIcon({ direction = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.chevronIcon}
    >
      <path d={direction === 'left' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'} />
    </svg>
  );
}

function SalaryCard({
  type,
  label,
  amount,
  badge,
  badgeType = 'neutral',
}) {
  const icons = {
    gross: <WalletIcon />,
    deductions: <TrendDownIcon />,
    net: <MoneyIcon />,
  };

  return (
    <article className={`${styles.salaryCard} ${styles[type]}`}>
      <div className={styles.cardTop}>
        <div className={styles.cardIcon}>{icons[type]}</div>

        <span className={`${styles.cardBadge} ${styles[badgeType]}`}>
          {badge}
        </span>
      </div>

      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardAmount}>{amount}</div>
    </article>
  );
}

function StaffAvatar() {
  return <span className={styles.staffAvatar} aria-hidden="true" />;
}

export default function MonthlySalary() {
  const [activeDepartment, setActiveDepartment] = useState('All Staff');
  const [activePage, setActivePage] = useState(1);

  const filteredStaff = useMemo(() => {
    if (activeDepartment === 'All Staff') {
      return staffMembers;
    }

    return staffMembers.filter((member) => {
      const role = member.role.toLowerCase();
      return role.includes(activeDepartment.toLowerCase());
    });
  }, [activeDepartment]);

  const handleDepartmentChange = (department) => {
    setActiveDepartment(department);
    setActivePage(1);
  };

  return (
    <main className={styles.page}>
      <section className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Monthly Salary</h1>
          <p className={styles.subtitle}>
            Track payroll, deductions, and staff payments for the current
            cycle.
          </p>
        </div>

        <button type="button" className={styles.printButton}>
          <PrinterIcon />
          <span>Print All Receipts</span>
        </button>
      </section>

      <section className={styles.filters} aria-label="Payroll filters">
        <button type="button" className={styles.monthSelector}>
          <CalendarIcon />
          <span>October 2023</span>
          <span className={styles.monthChevron} aria-hidden="true">
            ˅
          </span>
        </button>

        <span className={styles.filterDivider} aria-hidden="true" />

        <div className={styles.departmentFilters}>
          {departments.map((department) => (
            <button
              type="button"
              key={department}
              className={
                activeDepartment === department
                  ? `${styles.departmentButton} ${styles.departmentActive}`
                  : styles.departmentButton
              }
              onClick={() => handleDepartmentChange(department)}
            >
              {department}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.salaryCards} aria-label="Salary summary">
        <SalaryCard
          type="gross"
          label="GROSS PAYABLE"
          amount="$142,500.00"
          badge="+4.2%"
          badgeType="positive"
        />

        <SalaryCard
          type="deductions"
          label="TOTAL DEDUCTIONS"
          amount="$8,420.50"
          badge="12 Staff"
          badgeType="error"
        />

        <SalaryCard
          type="net"
          label="NET PAYABLE"
          amount="$134,079.50"
          badge="Payout in 3 Days"
          badgeType="neutral"
        />
      </section>

      <section className={styles.registerCard}>
        <header className={styles.registerHeader}>
          <h2 className={styles.registerTitle}>Payroll Register</h2>

          <div className={styles.tableActions}>
            <button
              type="button"
              className={styles.tableActionButton}
              aria-label="Filter payroll register"
            >
              <FilterIcon />
            </button>

            <button
              type="button"
              className={styles.tableActionButton}
              aria-label="Download payroll register"
            >
              <DownloadIcon />
            </button>
          </div>
        </header>

        <div className={styles.tableWrapper}>
          <table className={styles.payrollTable}>
            <thead>
              <tr>
                <th className={styles.staffColumn}>STAFF MEMBER</th>
                <th>PRES</th>
                <th>DBL</th>
                <th>LEAVE</th>
                <th>ABS</th>
                <th>DAILY</th>
                <th className={styles.grossColumn}>GROSS</th>
                <th>ADVANCE</th>
                <th className={styles.netColumn}>NET</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member.id}>
                  <td className={styles.staffCell}>
                    <StaffAvatar />

                    <div className={styles.staffInfo}>
                      <strong>{member.name}</strong>
                      <span>{member.role}</span>
                    </div>
                  </td>

                  <td>
                    <span className={styles.presentBadge}>
                      {member.present}
                    </span>
                  </td>

                  <td>
                    <span className={styles.doubleBadge}>{member.double}</span>
                  </td>

                  <td>{member.leave}</td>
                  <td>{member.absent}</td>
                  <td className={styles.moneyCell}>{member.daily}</td>
                  <td className={styles.grossColumn}>{member.gross}</td>

                  <td className={member.advance !== '—' ? styles.advance : ''}>
                    {member.advance}
                  </td>

                  <td className={styles.netColumn}>{member.net}</td>
                  <td className={styles.actionCell} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className={styles.registerFooter}>
          <span>
            Showing 1 to {filteredStaff.length} of 120 staff members
          </span>

          <nav className={styles.pagination} aria-label="Payroll pages">
            <button
              type="button"
              className={styles.pageArrow}
              aria-label="Previous page"
              disabled={activePage === 1}
              onClick={() => setActivePage((page) => Math.max(1, page - 1))}
            >
              <ChevronIcon direction="left" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                type="button"
                key={page}
                className={
                  activePage === page
                    ? `${styles.pageNumber} ${styles.pageNumberActive}`
                    : styles.pageNumber
                }
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className={styles.pageArrow}
              aria-label="Next page"
              onClick={() => setActivePage((page) => Math.min(3, page + 1))}
            >
              <ChevronIcon />
            </button>
          </nav>
        </footer>
      </section>
    </main>
  );
}