/**
 * @file KpiCard.jsx
 * @description Card component displaying metric icon, uppercase label, primary value, and percentage delta indicator.
 * @figmaFrame Figma frame: Dashboard - KPI Card
 *
 * @param {Object} props
 * @param {string} [props.icon='📊'] - Metric icon or element
 * @param {string} [props.label='REVENUE'] - Metric uppercase title label
 * @param {string | number} [props.value='$12,450'] - Primary stat value
 * @param {string} [props.delta='+14.2%'] - Change metric text
 * @param {boolean} [props.isPositive=true] - Positive or negative trend flag
 */
import React from 'react';
import styles from './KpiCard.module.css';

export default function KpiCard({
  icon = '📊',
  label = 'TOTAL REVENUE',
  value = '$24,500',
  delta = '+12.5%',
  isPositive = true,
}) {
  return (
    <div className={styles.card} data-testid="kpi-card">
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.value}>{value}</div>
        <div
          className={`${styles.delta} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {delta}
        </div>
      </div>
    </div>
  );
}
