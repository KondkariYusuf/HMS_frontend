/**
 * @file Dashboard/Index.jsx
 * @description Operational command center for Grand Horizon HMS.
 * @figmaFrame Refined Dashboard Command Center V2
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Index.module.css';

const KPI_DATA = [
  {
    label: 'Vacant Rooms',
    value: '42',
    helper: '12 ready for check-in',
    icon: '▥',
  },
  {
    label: 'Occupied',
    value: '158',
    helper: '79% Occupancy Rate',
    icon: '▰',
  },
  {
    label: 'Checkout Today',
    value: '24',
    helper: '8 pending keys',
    icon: '↪',
    alert: true,
  },
  {
    label: 'Checkout Tomorrow',
    value: '31',
    helper: 'Estimated house turnover',
    icon: '▣',
  },
];

const ACTIONS = [
  {
    title: 'View Rooms',
    description:
      'Real-time floor map and availability status across all wings.',
    icon: '⊞',
    route: '/hotel/rooms',
  },
  {
    title: 'Quick Check-In',
    description:
      'Expedited arrival process for VIPs and pre-registered guests.',
    icon: '♙+',
    route: '/hotel/check-in',
  },
  {
    title: 'Housekeeping',
    description:
      'Manage room status, maintenance requests, and staff assignments.',
    icon: '♜',
  },
  {
    title: 'Reports',
    description:
      'Daily revenue, occupancy analysis, and operational performance.',
    icon: '▥',
    route: '/analytics',
  },
  {
    title: 'Activity Feed',
    description:
      'Live log of all front desk and concierge transactions.',
    icon: '◔',
  },
  {
    title: 'Maintenance',
    description:
      'Track open work orders and technical infrastructure alerts.',
    icon: '⌕',
  },
  {
    title: 'Upcoming Bookings',
    description:
      'Weekly forecast of arrivals and group reservations.',
    icon: '⌄',
    route: '/hotel/reservations',
  },
  {
    title: 'Future Booking',
    description:
      'Block calendars and manage seasonal rate adjustments.',
    icon: '▤+',
    route: '/hotel/reservations',
  },
  {
    title: 'Timeline View',
    description:
      'Visual Gantt chart of room occupancy and turnover schedules.',
    icon: '⌁',
    route: '/hotel/rooms/occupancy-timeline',
  },
];

const RECENT_ARRIVALS = [
  {
    initials: 'JM',
    guest: 'Julianna Meyer',
    room: 'Suite 402',
    status: 'Arrived',
    type: 'arrived',
  },
  {
    initials: 'RK',
    guest: 'Robert Kincaid',
    room: 'Deluxe 108',
    status: 'Check-in Pending',
    type: 'pending',
  },
];

function KpiCard({ item }) {
  return (
    <article className={styles.kpiCard}>
      <div className={styles.kpiIcon}>{item.icon}</div>

      <div>
        <span className={styles.kpiLabel}>{item.label}</span>
        <strong className={styles.kpiValue}>{item.value}</strong>

        <span
          className={`${styles.kpiHelper} ${item.alert ? styles.alertText : ''
            }`}
        >
          {item.helper}
        </span>
      </div>
    </article>
  );
}

function ActionCard({ action, onClick }) {
  return (
    <button
      type="button"
      className={styles.actionCard}
      onClick={onClick}
    >
      <span className={styles.actionIcon}>{action.icon}</span>

      <span className={styles.actionContent}>
        <strong>{action.title}</strong>
        <span>{action.description}</span>
      </span>
    </button>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  return (
    <div className={styles.page} data-testid="dashboard-page">
      <section className={styles.systemBar}>
        <div className={styles.systemStatus}>
          <span className={styles.systemDot} />
          <span>System Online</span>
        </div>

        <span className={styles.backupText}>
          Last backup: 2 mins ago
        </span>

        <div className={styles.activeStaff}>
          <div className={styles.avatarStack}>
            <span />
            <span />
            <span />
            <span className={styles.avatarCount}>+4</span>
          </div>

          <span>Active Staff Members</span>
        </div>
      </section>

      <section className={styles.kpiGrid} aria-label="Property summary">
        {KPI_DATA.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className={styles.actionGrid}>
        {ACTIONS.map((action) => (
          <ActionCard
            key={action.title}
            action={action}
            onClick={() => handleAction(action)}
          />
        ))}
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.arrivalsCard}>
          <div className={styles.cardHeader}>
            <h2>Recent Arrivals</h2>

            <button
              type="button"
              className={styles.viewAllButton}
              onClick={() => navigate('/hotel/reservations')}
            >
              View All
            </button>
          </div>

          <div className={styles.tableHeader}>
            <span>Guest</span>
            <span>Room</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          <div className={styles.arrivalList}>
            {RECENT_ARRIVALS.map((arrival) => (
              <div
                className={styles.arrivalRow}
                key={arrival.guest}
              >
                <div className={styles.guestCell}>
                  <span className={styles.guestAvatar}>
                    {arrival.initials}
                  </span>

                  <span>{arrival.guest}</span>
                </div>

                <span>{arrival.room}</span>

                <span
                  className={`${styles.statusBadge} ${arrival.type === 'arrived'
                      ? styles.arrived
                      : styles.pending
                    }`}
                >
                  {arrival.status}
                </span>

                <button
                  type="button"
                  className={styles.moreButton}
                  aria-label={`More actions for ${arrival.guest}`}
                >
                  •••
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.propertyCard}>
          <div className={styles.cardHeader}>
            <h2>Property Status</h2>
          </div>

          <div className={styles.propertyContent}>
            <div className={styles.propertyIcon}>⌑</div>

            <strong>West Wing Overview</strong>

            <p>
              Floors 4-12 currently under high housekeeping demand.
            </p>

            <div className={styles.efficiencyBar}>
              <div className={styles.efficiencyProgress} />
            </div>

            <div className={styles.efficiencyMeta}>
              <span>Efficiency</span>
              <strong>85%</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}