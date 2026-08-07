/**
 * @file ProgressBar.jsx
 * @description Multi-segment progress bar component representing occupancy breakdown or multi-categorical ratios.
 * @figmaFrame Figma frame: Dashboard - Progress Bar
 *
 * @param {Object} props
 * @param {Array<{label: string, value: number, color: string}>} [props.segments] - Data segments with percentages and colors
 * @param {boolean} [props.showLegend=true] - Displays ratio legend below bar
 */
import React from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({
  segments = [
    { label: 'Occupied', value: 65, color: 'var(--color-primary)' },
    { label: 'Reserved', value: 20, color: 'var(--color-primary-dark)' },
    { label: 'Available', value: 15, color: 'var(--color-border)' },
  ],
  showLegend = true,
}) {
  return (
    <div className={styles.container} data-testid="progress-bar">
      <div className={styles.barTrack}>
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={styles.segment}
            style={{
              width: `${seg.value}%`,
              backgroundColor: seg.color || 'var(--color-primary)',
            }}
            title={`${seg.label}: ${seg.value}%`}
          />
        ))}
      </div>
      {showLegend && (
        <div className={styles.legendContainer}>
          {segments.map((seg, idx) => (
            <div key={idx} className={styles.legendItem}>
              <span
                className={styles.dot}
                style={{ backgroundColor: seg.color || 'var(--color-primary)' }}
              />
              <span className={styles.legendLabel}>
                {seg.label} ({seg.value}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
