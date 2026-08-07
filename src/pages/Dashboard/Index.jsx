/**
 * @file Dashboard/Index.jsx
 * @description Primary reference dashboard screen for Grand Horizon Hotel Management System.
 * @figmaFrame Figma frame: Dashboard - Main (node-id: 1-7)
 *
 * Components integrated (stubs): KpiCard, ProgressBar, ChartCard, AgendaCard, DataTable, QuickActionsGrid, Timeline
 */
import React from 'react';
import KpiCard from '@components/KpiCard/KpiCard';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import ChartCard from '@components/ChartCard/ChartCard';
import AgendaCard from '@components/AgendaCard/AgendaCard';
import DataTable from '@components/DataTable/DataTable';
import QuickActionsGrid from '@components/QuickActionsGrid/QuickActionsGrid';
import Timeline from '@components/Timeline/Timeline';
import styles from './Index.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.page} data-testid="dashboard-page">
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Reference Overview</h1>
        <p className={styles.subtitle}>
          [ Screen Stub — Figma Frame: Dashboard - Main ]
        </p>
      </header>

      {/* KPI Cards Row */}
      <section className={styles.kpiGrid}>
        <KpiCard label="TOTAL REVENUE" value="$38,420" delta="+12.4%" />
        <KpiCard label="OCCUPANCY RATE" value="84%" delta="+5.1%" />
        <KpiCard label="TOTAL RESERVATIONS" value="142" delta="+18.2%" />
        <KpiCard
          label="CHECK-INS TODAY"
          value="28"
          delta="-2.0%"
          isPositive={false}
        />
      </section>

      {/* Main Grid Section */}
      <section className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <ChartCard title="Occupancy & Revenue Forecast" />
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>{"Today's Room Distribution"}</h3>
            <ProgressBar />
          </div>
          <DataTable />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>Quick Front-Desk Actions</h3>
            <QuickActionsGrid />
          </div>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>{"Today's Property Agenda"}</h3>
            <div className={styles.agendaList}>
              <AgendaCard
                date="09:00 AM"
                title="VIP Guest Arrival - Penthouse 02"
              />
              <AgendaCard
                date="11:30 AM"
                title="Staff Shift Handover Meeting"
                status="pending"
              />
            </div>
          </div>
          <div className={styles.sectionCard}>
            <h3 className={styles.cardTitle}>Recent Activity Stream</h3>
            <Timeline />
          </div>
        </div>
      </section>
    </div>
  );
}
