/**
 * @file Analytics/Index.jsx
 * @description Revenue performance and operational analytics overview screen.
 * @figmaFrame Figma frame: Analytics - Overview
 *
 * Components integrated (stubs): KpiCard, ChartCard
 */
import React from 'react';
import KpiCard from '@components/KpiCard/KpiCard';
import ChartCard from '@components/ChartCard/ChartCard';
import styles from './Index.module.css';

export default function AnalyticsPage() {
  return (
    <div className={styles.page} data-testid="analytics-page">
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics & Financial Overview</h1>
        <p className={styles.subtitle}>
          [ Screen Stub — Figma Frame: Analytics - Overview ]
        </p>
      </header>

      <section className={styles.kpiGrid}>
        <KpiCard label="RevPAR" value="$145.20" delta="+8.3%" />
        <KpiCard
          label="ADR (AVERAGE DAILY RATE)"
          value="$172.00"
          delta="+3.5%"
        />
        <KpiCard label="TOTAL BOOKINGS" value="482" delta="+15.0%" />
      </section>

      <section className={styles.chartsGrid}>
        <ChartCard title="Monthly Revenue Growth" timeframe="Monthly" />
        <ChartCard
          title="Channel Distribution (OTA vs Direct)"
          timeframe="Weekly"
        />
      </section>
    </div>
  );
}
