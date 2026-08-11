/**
 * @file KpiCard.jsx
 * @description Flexible KPI Metric Card matching the exact visual specs of Frame 1 (Refined Teal Hospitality Dashboard).
 * Supports standard metrics, segmented stat columns, and progress indicators.
 * @reference Figma frame: Dashboard - KPI Card (frames/refined teal hospitality dashboard.jpeg)
 *
 * @param {Object} props
 * @param {string} [props.icon='📊'] - Metric header icon
 * @param {string} [props.label='REVENUE'] - Uppercase title
 * @param {React.ReactNode} [props.headerAction] - Action element on the right of header
 * @param {string | number} [props.value] - Primary value text
 * @param {string} [props.subtext] - Secondary subtext label
 * @param {string} [props.delta] - Trend delta pill text
 * @param {boolean} [props.isPositive=true] - Trend flag
 * @param {React.ReactNode} [props.children] - Custom body content overlay
 */
import React from 'react';
import styles from './KpiCard.module.css';

export default function KpiCard({
  icon = '📊',
  label = 'REVENUE',
  headerAction,
  value,
  subtext,
  delta,
  isPositive = true,
  children,
}) {
  return (
    <div className={styles.card} data-testid="kpi-card">
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </div>
        {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
      </div>

      {children ? (
        <div className={styles.customBody}>{children}</div>
      ) : (
        <div className={styles.body}>
          <div className={styles.valueRow}>
            {value && <div className={styles.value}>{value}</div>}
            {delta && (
              <div
                className={`${styles.delta} ${
                  isPositive ? styles.positive : styles.negative
                }`}
              >
                {delta}
              </div>
            )}
          </div>
          {subtext && <div className={styles.subtext}>{subtext}</div>}
        </div>
      )}
    </div>
  );
}
