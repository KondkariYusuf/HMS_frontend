/**
 * @file Analytics/Index.jsx
 * @description Yearly Salary Summary screen.
 * @figmaFrame Figma frame: Yearly Salary Summary
 */

import React, { useState } from 'react';
import styles from './Index.module.css';

const employees = [
  {
    name: 'Elena Rodriguez',
    role: 'Operations Director',
    salary: ['$8.5k', '$8.5k', '$8.7k', '$8.5k', '$8.5k', '$8.5k', '$9.2k', '$8.5k', '$8.5k', '$8.5k', '$8.5k', '$8.5k'],
    total: '$77,400.00',
  },
  {
    name: 'Marcus Chen',
    role: 'Concierge Manager',
    salary: ['$5.2k', '$5.2k', '$5.2k', '$5.2k', '$5.8k', '$5.2k', '$5.2k', '$5.2k', '$5.4k', '$5.2k', '$5.2k', '$5.2k'],
    total: '$47,600.00',
  },
  {
    name: 'Julian Vane',
    role: 'Executive Chef',
    salary: ['$7.1k', '$7.1k', '$7.1k', '$7.1k', '$7.1k', '$7.1k', '$7.9k', '$7.1k', '$7.1k', '$7.1k', '$7.1k', '$7.1k'],
    total: '$64,700.00',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Guest Services',
    salary: ['$3.8k', '$3.8k', '$3.8k', '$3.8k', '$3.8k', '$4.2k', '$3.8k', '$3.8k', '$3.8k', '$3.8k', '$3.8k', '$3.8k'],
    total: '$34,600.00',
  },
];

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

const monthlyTotals = [
  '$24.6k',
  '$24.6k',
  '$24.8k',
  '$24.6k',
  '$25.2k',
  '$25.0k',
  '$26.1k',
  '$24.6k',
  '$24.8k',
  '$24.6k',
  '$24.6k',
  '$24.6k',
];

const roles = [
  'All Roles',
  'Management',
  'Front Desk',
  'Housekeeping',
  'F&B Staff',
  'Maintenance',
];

export default function AnalyticsPage() {
  const [activeRole, setActiveRole] = useState('All Roles');

  return (
    <div className={styles.page}>
      <section className={styles.topSection}>
        <div className={styles.headingBlock}>
          <h1 className={styles.title}>Yearly Salary Summary</h1>

          <p className={styles.subtitle}>
            12-month salary and attendance overview for the 2026 fiscal year.
          </p>
        </div>

        <div className={styles.topActions}>
          <button className={styles.yearSelector}>
            <span>Fiscal Year 2026</span>
            <span className={styles.chevron}>⌄</span>
          </button>

          <button className={styles.downloadButton} aria-label="Download report">
            ↓
          </button>
        </div>
      </section>

      <section className={styles.filterSummaryRow}>
        <div className={styles.roleFilters}>
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              className={`${styles.roleButton} ${
                activeRole === role ? styles.activeRole : ''
              }`}
              onClick={() => setActiveRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <div className={styles.payrollCard}>
          <div className={styles.payrollContent}>
            <span className={styles.payrollLabel}>2026 NET PAYROLL</span>
            <strong className={styles.payrollAmount}>$1,428,290.00</strong>
          </div>

          <div className={styles.payrollIcon}>
            $
          </div>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.salaryTable}>
            <thead>
              <tr>
                <th className={styles.employeeHeader}>EMPLOYEE</th>

                {months.map((month) => (
                  <th
                    key={month}
                    className={month === 'SEP' ? styles.highlightHeader : ''}
                  >
                    {month}
                  </th>
                ))}

                <th className={styles.totalHeader}>TOTAL GROSS</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.name}>
                  <td className={styles.employeeCell}>
                    <div className={styles.employeeName}>
                      {employee.name}
                    </div>

                    <div className={styles.employeeRole}>
                      {employee.role}
                    </div>
                  </td>

                  {employee.salary.map((amount, index) => (
                    <td
                      key={`${employee.name}-${months[index]}`}
                      className={
                        months[index] === 'SEP'
                          ? styles.highlightCell
                          : styles.salaryCell
                      }
                    >
                      {amount}
                    </td>
                  ))}

                  <td className={styles.totalCell}>
                    {employee.total}
                  </td>
                </tr>
              ))}

              <tr className={styles.totalRow}>
                <td className={styles.monthlyTotalLabel}>
                  <span>Monthly</span>
                  <span>Totals</span>
                </td>

                {monthlyTotals.map((total, index) => (
                  <td
                    key={`total-${months[index]}`}
                    className={
                      months[index] === 'SEP'
                        ? styles.highlightTotal
                        : styles.monthlyTotal
                    }
                  >
                    {total}
                  </td>
                ))}

                <td className={styles.grandTotal}>$224,300.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing 1-4 of 48 employees</span>

          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageArrow}
              aria-label="Previous page"
            >
              ‹
            </button>

            <button
              type="button"
              className={`${styles.pageNumber} ${styles.currentPage}`}
            >
              1
            </button>

            <button type="button" className={styles.pageNumber}>
              2
            </button>

            <button type="button" className={styles.pageNumber}>
              3
            </button>

            <span className={styles.morePages}>...</span>

            <button
              type="button"
              className={styles.pageArrow}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <div className={styles.engineFooter}>
        <span className={styles.engineIcon}>▣</span>
        <span>LuxeOps Analytics Engine</span>
      </div>
    </div>
  );
}