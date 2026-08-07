/**
 * @file ChartCard.jsx
 * @description Card container housing analytics charts with timeframe toggle controls (Daily, Weekly, Monthly) and chart area stub.
 * @figmaFrame Figma frame: Dashboard - Chart Card
 *
 * @param {Object} props
 * @param {string} [props.title='Occupancy Rate'] - Card header title
 * @param {string} [props.subtitle='Real-time room status breakdown'] - Subtitle description
 * @param {'Daily' | 'Weekly' | 'Monthly'} [props.timeframe='Weekly'] - Selected period
 * @param {Function} [props.onTimeframeChange] - Period toggle handler
 */
import React from 'react';
import styles from './ChartCard.module.css';

export default function ChartCard({
  title = 'Occupancy Rate Trends',
  subtitle = 'Comparing current period with previous month',
  timeframe = 'Weekly',
  onTimeframeChange,
}) {
  const periods = ['Daily', 'Weekly', 'Monthly'];

  return (
    <div className={styles.card} data-testid="chart-card">
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.toggleGroup}>
          {periods.map((p) => (
            <button
              key={p}
              className={`${styles.toggleBtn} ${
                p === timeframe ? styles.activeToggle : ''
              }`}
              onClick={() => onTimeframeChange && onTimeframeChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chartAreaPlaceholder}>
        <span className={styles.placeholderText}>
          [ Chart Visualisation Placeholder — {timeframe} View ]
        </span>
      </div>
    </div>
  );
}
