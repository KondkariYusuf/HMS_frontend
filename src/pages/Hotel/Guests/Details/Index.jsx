/**
 * @file Hotel/Guests/Details/Index.jsx
 * @description Guest profile and stay information screen.
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Avatar from '@components/Avatar/Avatar';

import guestData from '../../../../data/guestData.json';

import styles from './Index.module.css';

export default function GuestDetailsPage() {
  const navigate = useNavigate();
  const { guestId } = useParams();

  const guest = guestData.find((item) => item.id === guestId);

  if (!guest) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Guest Not Found</h1>
          <p>The requested guest profile could not be found.</p>

          <Button
            variant="primary"
            onClick={() => navigate('/hotel/guests')}
          >
            Back to Guest Directory
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${guest.firstName} ${guest.lastName}`;

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate('/hotel/guests')}
      >
        ← Back to Guest Directory
      </button>

      <header className={styles.header}>
        <div className={styles.profileHeader}>
          <Avatar name={fullName} size="lg" />

          <div>
            <h1 className={styles.title}>{fullName}</h1>

            <p className={styles.guestId}>
              Guest ID: {guest.id}
            </p>

            <Badge
              variant={
                guest.status === 'ACTIVE'
                  ? 'in-house'
                  : guest.status === 'BLACKLISTED'
                    ? 'error'
                    : 'regular'
              }
            >
              {guest.status}
            </Badge>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary">Edit Guest</Button>

          <Button
            variant="primary"
            onClick={() => navigate('/hotel/check-in')}
          >
            Express Check-In
          </Button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>TOTAL STAYS</span>
          <strong className={styles.statValue}>
            {guest.totalStays}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>GUEST STATUS</span>
          <strong className={styles.statText}>
            {guest.status}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>ID TYPE</span>
          <strong className={styles.statText}>
            {guest.idType.replaceAll('_', ' ')}
          </strong>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Personal Information</h2>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span>Full Name</span>
              <strong>{fullName}</strong>
            </div>

            <div className={styles.detailItem}>
              <span>Phone</span>
              <strong>{guest.phone}</strong>
            </div>

            <div className={styles.detailItem}>
              <span>Email</span>
              <strong>{guest.email}</strong>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Identity Document</h2>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span>Document Type</span>
              <strong>
                {guest.idType.replaceAll('_', ' ')}
              </strong>
            </div>

            <div className={styles.detailItem}>
              <span>Document Number</span>
              <strong>{guest.idNumber}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Stay History</h2>
            <p>Previous and current guest stays.</p>
          </div>
        </div>

        <div className={styles.historyEmpty}>
          <span className={styles.historyIcon}>▣</span>

          <strong>No detailed stay history available</strong>

          <p>
            Stay history will be connected to the booking API later.
          </p>
        </div>
      </section>
    </div>
  );
}