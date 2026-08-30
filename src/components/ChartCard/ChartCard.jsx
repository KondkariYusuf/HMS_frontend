/**
 * @file ChartCard.jsx
 * @description Card container housing smooth SVG Booking Analytics chart with timeframe toggle controls (Daily, Weekly, Monthly).
 * @reference Figma frame: Dashboard - Chart Card (frames/refined teal hospitality dashboard.jpeg)
 *
 * @param {Object} props
 * @param {string} [props.title='Booking Analytics'] - Card header title
 * @param {string} [props.subtitle='Reservation volume over 30 days'] - Subtitle description
 * @param {'Daily' | 'Weekly' | 'Monthly'} [props.timeframe='Daily'] - Selected period
 * @param {Function} [props.onTimeframeChange] - Period toggle handler
 */
import React, { useState } from 'react';
import styles from './ChartCard.module.css';

export default function ChartCard({
  title = 'Booking Analytics',
  subtitle = 'Reservation volume over 30 days',
  timeframe: initialTimeframe = 'Daily',
  onTimeframeChange,
}) {
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const periods = ['DAILY', 'WEEKLY', 'MONTHLY'];

  const handleToggle = (p) => {
    setTimeframe(p);
    if (onTimeframeChange) onTimeframeChange(p);
  };

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
              onClick={() => handleToggle(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <svg
          className={styles.svgChart}
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="600" y2="40" className={styles.gridLine} />
          <line x1="0" y1="90" x2="600" y2="90" className={styles.gridLine} />
          <line x1="0" y1="140" x2="600" y2="140" className={styles.gridLine} />

          {/* Area Fill */}
          <path
            d="M 0,140 Q 120,110 200,90 T 350,110 T 500,40 L 600,100 L 600,180 L 0,180 Z"
            fill="url(#chartGradient)"
          />

          {/* Curved Line */}
          <path
            d="M 0,140 Q 120,110 200,90 T 350,110 T 500,40 L 600,100"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          <circle cx="200" cy="90" r="4" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
          <circle cx="350" cy="110" r="4" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
          <circle cx="500" cy="40" r="4" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
        </svg>

        {/* X-Axis Date Labels */}
        <div className={styles.xAxisLabels}>
          <span>OCT 01</span>
          <span>OCT 08</span>
          <span>OCT 15</span>
          <span>OCT 22</span>
          <span>OCT 30</span>
        </div>
      </div>
    </div>
  );
}
