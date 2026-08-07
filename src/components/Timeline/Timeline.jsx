/**
 * @file Timeline.jsx
 * @description Vertical activity timeline component featuring colored dot markers, timestamps, and activity descriptions.
 * @figmaFrame Figma frame: Dashboard - Recent Activity Timeline
 *
 * @param {Object} props
 * @param {Array<{id: string, time: string, title: string, description: string, type: 'info' | 'success' | 'warning' | 'error'}>} [props.events] - Timeline events
 */
import React from 'react';
import styles from './Timeline.module.css';

export default function Timeline({
  events = [
    {
      id: 'ev-1',
      time: '10 mins ago',
      title: 'Room 204 Checked Out',
      description: 'Housekeeping status updated to cleaning required.',
      type: 'info',
    },
    {
      id: 'ev-2',
      time: '25 mins ago',
      title: 'Payment Confirmed',
      description: 'Reservation #8941 paid $1,200 via Credit Card.',
      type: 'success',
    },
    {
      id: 'ev-3',
      time: '1 hour ago',
      title: 'Maintenance Alert',
      description: 'AC unit issue reported in Penthouse 01.',
      type: 'warning',
    },
  ],
}) {
  return (
    <div className={styles.timeline} data-testid="timeline">
      {events.map((ev) => (
        <div key={ev.id} className={styles.item}>
          <div className={styles.markerContainer}>
            <span className={`${styles.dot} ${styles[ev.type || 'info']}`} />
            <span className={styles.line} />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.title}>{ev.title}</span>
              <span className={styles.time}>{ev.time}</span>
            </div>
            <p className={styles.description}>{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
