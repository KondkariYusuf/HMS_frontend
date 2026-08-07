/**
 * @file AgendaCard.jsx
 * @description Agenda item card with date badge, title, subtitle meta info, and colored status indicator.
 * @figmaFrame Figma frame: Dashboard - Property Calendar Agenda
 *
 * @param {Object} props
 * @param {string} [props.date='10:30 AM'] - Time or date badge text
 * @param {string} [props.title='Executive Suite VIP Arrival'] - Event or agenda title
 * @param {string} [props.meta='Room 402 • Guest: Alex Morgan'] - Secondary metadata info
 * @param {'confirmed' | 'pending' | 'cancelled'} [props.status='confirmed'] - Event status indicator
 */
import React from 'react';
import styles from './AgendaCard.module.css';

export default function AgendaCard({
  date = '10:30 AM',
  title = 'Executive Suite Check-in',
  meta = 'Room 402 • Guest: Alex Morgan',
  status = 'confirmed',
}) {
  return (
    <div className={styles.card} data-testid="agenda-card">
      <div className={styles.dateBadge}>{date}</div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div
        className={`${styles.statusDot} ${styles[status]}`}
        title={`Status: ${status}`}
      />
    </div>
  );
}
