/**
 * @file Dashboard/Index.jsx
 * @description Primary Front Desk & Hospitality Operational Dashboard (Frame 1: Refined Teal Hospitality Dashboard).
 * Implements functional sub-view tab switching (Property View, Front Desk, Housekeeping), dynamic data loading via useBookings,
 * SVG curved analytics chart, and real quick action routing.
 * @reference Figma frame: Refined Teal Hospitality Dashboard (frames/refined teal hospitality dashboard.jpeg)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookings from '@hooks/useBookings';
import KpiCard from '@components/KpiCard/KpiCard';
import ChartCard from '@components/ChartCard/ChartCard';
import AgendaCard from '@components/AgendaCard/AgendaCard';
import DataTable from '@components/DataTable/DataTable';
import QuickActionsGrid from '@components/QuickActionsGrid/QuickActionsGrid';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import Timeline from '@components/Timeline/Timeline';
import styles from './Index.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, recentGuests, loading, error, refetch } = useBookings();
  const [activeTab, setActiveTab] = useState('Property View');

  // Handle Quick Actions routing
  const handleQuickAction = (action) => {
    if (action.id === 'new-booking') {
      navigate('/hotel/reservations');
    } else if (action.id === 'check-in') {
      navigate('/hotel/check-in');
    } else if (action.id === 'room-service') {
      navigate('/hotel/rooms');
    } else if (action.id === 'assign-staff') {
      navigate('/admin/users');
    }
  };

  const tableColumns = [
    { key: 'guest', title: 'GUEST' },
    { key: 'room', title: 'ROOM' },
    { key: 'dates', title: 'STAY DATES' },
    { key: 'status', title: 'STATUS' },
    { key: 'actions', title: 'ACTION' },
  ];

  const housekeepingSegments = [
    { label: 'Occupied (156 Rooms)', value: 78, color: 'var(--color-primary)' },
    { label: 'Vacant Clean (34 Rooms)', value: 17, color: 'var(--color-primary-dark)' },
    { label: 'Dirty / Cleaning Needed (8 Rooms)', value: 4, color: 'var(--color-primary-tint)' },
    { label: 'Maintenance (2 Rooms)', value: 1, color: 'var(--color-error)' },
  ];

  return (
    <div className={styles.page} data-testid="dashboard-page">
      {/* Sub-Header Bar with Title & Functional View Tabs */}
      <div className={styles.subHeader}>
        <div className={styles.titleWithTabs}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <nav className={styles.viewNav} aria-label="Dashboard Views">
            {['Property View', 'Front Desk', 'Housekeeping'].map((tab) => (
              <button
                key={tab}
                className={`${styles.navTab} ${
                  activeTab === tab ? styles.activeNavTab : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer} data-testid="dashboard-loading">
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading Dashboard metrics from server...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorAlert} data-testid="dashboard-error">
          <span className={styles.errorIcon}>⚠️</span>
          <div className={styles.errorContent}>
            <h4 className={styles.errorTitle}>Failed to load metrics</h4>
            <p className={styles.errorMessage}>{error.message}</p>
          </div>
          <button className={styles.retryBtn} onClick={refetch}>
            Retry API Request
          </button>
        </div>
      )}

      {/* Dynamic Content Views */}
      {!loading && !error && (
        <>
          {/* TAB 1: PROPERTY VIEW (Primary Reference Layout) */}
          {activeTab === 'Property View' && (
            <>
              {/* Top 3 KPI Cards Row */}
              <section className={styles.kpiRow}>
                {/* Card 1: RESERVATIONS */}
                <KpiCard
                  icon="📱"
                  label="RESERVATIONS"
                  headerAction={<span className={styles.optionsDot}>•••</span>}
                >
                  <div className={styles.reservationsColumns}>
                    <div className={styles.resCol}>
                      <span className={styles.resLabel}>IN HOUSE</span>
                      <span className={styles.resValue}>{stats.inHouseCount}</span>
                    </div>
                    <div className={styles.resCol}>
                      <span className={styles.resLabel}>ARRIVALS</span>
                      <span className={styles.resValueDown}>↓ {stats.arrivalsCount}</span>
                    </div>
                    <div className={styles.resCol}>
                      <span className={styles.resLabel}>DEPARTURES</span>
                      <span className={styles.resValueUp}>↑ {stats.departuresCount}</span>
                    </div>
                  </div>
                </KpiCard>

                {/* Card 2: OCCUPANCY */}
                <KpiCard
                  icon="📊"
                  label="OCCUPANCY"
                  headerAction={
                    <div className={styles.legendGroup}>
                      <span className={styles.dotOccupied}>● OCCUPIED</span>
                      <span className={styles.dotVacant}>○ VACANT</span>
                    </div>
                  }
                >
                  <div className={styles.occupancyBody}>
                    <div className={styles.occupancyMainRow}>
                      <div>
                        <div className={styles.largeValue}>{stats.occupancyRate}</div>
                        <div className={styles.subtextLabel}>
                          {stats.occupiedRooms} of {stats.totalRooms} Rooms
                        </div>
                      </div>
                      <div className={styles.deltaPill}>+4.2% VS LAST WEEK</div>
                    </div>
                    <div className={styles.trackBar}>
                      <div
                        className={styles.trackFilled}
                        style={{ width: stats.occupancyRate }}
                      />
                    </div>
                  </div>
                </KpiCard>

                {/* Card 3: REVENUE */}
                <KpiCard
                  icon="💵"
                  label="REVENUE"
                  headerAction={<button className={styles.detailsLink} onClick={() => navigate('/billing/invoices')}>DETAILS</button>}
                >
                  <div className={styles.revenueBody}>
                    <div className={styles.largeValue}>{stats.totalRevenue}</div>
                    <div className={styles.avgBadge}>
                      <span className={styles.avgText}>DAILY AVG {stats.dailyAvg}</span>
                      <span className={styles.sparklineIcon}>📈</span>
                    </div>
                  </div>
                </KpiCard>
              </section>

              {/* Main 2-Column Section */}
              <section className={styles.mainGrid}>
                {/* Left Column (65% width) */}
                <div className={styles.leftColumn}>
                  {/* Booking Analytics SVG Chart */}
                  <ChartCard
                    title="Booking Analytics"
                    subtitle="Reservation volume over 30 days"
                  />

                  {/* Recent Guests Table Card */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Recent Guests</h3>
                      <button
                        className={styles.actionLink}
                        onClick={() => navigate('/hotel/reservations')}
                      >
                        VIEW ALL RESERVATIONS
                      </button>
                    </div>
                    {recentGuests.length > 0 ? (
                      <DataTable columns={tableColumns} data={recentGuests} />
                    ) : (
                      <div className={styles.emptyState} data-testid="dashboard-empty">
                        <p className={styles.emptyText}>
                          No guest check-ins or arrivals found in system records.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (35% width) */}
                <div className={styles.rightColumn}>
                  {/* Property Calendar */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Property Calendar</h3>
                      <span className={styles.monthPicker}>&lt; OCT 2023 &gt;</span>
                    </div>
                    <div className={styles.agendaStack}>
                      <AgendaCard
                        date="MON 23"
                        title="VIP Arrival: Julianna Moore"
                        meta="Suite 402 • 2 Guests • 3 Nights"
                        status="confirmed"
                      />
                      <AgendaCard
                        date="TUE 24"
                        title="Event: Tech Summit Dinner"
                        meta="Grand Ballroom • 150 Attendees"
                        status="confirmed"
                      />
                      <AgendaCard
                        date="WED 25"
                        title="Standard Check-out (12)"
                        meta="Various Rooms • Cleaning Scheduled"
                        status="pending"
                      />
                    </div>
                    <button
                      className={styles.scheduleTaskBtn}
                      onClick={() => navigate('/hotel/reservations')}
                    >
                      + SCHEDULE TASK
                    </button>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Quick Actions</h3>
                    <QuickActionsGrid onActionClick={handleQuickAction} />
                  </div>

                  {/* Operations Timeline */}
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Operations Timeline</h3>
                    <Timeline />
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: FRONT DESK VIEW */}
          {activeTab === 'Front Desk' && (
            <div className={styles.subViewContainer} data-testid="front-desk-view">
              <section className={styles.kpiRow}>
                <KpiCard
                  icon="🔑"
                  label="ARRIVALS PENDING"
                  value={stats.arrivalsCount}
                  delta="Today's Check-in Queue"
                />
                <KpiCard
                  icon="🏨"
                  label="IN-HOUSE GUESTS"
                  value={stats.inHouseCount}
                  delta="Active Staying Guests"
                />
                <KpiCard
                  icon="🚪"
                  label="DEPARTURES PENDING"
                  value={stats.departuresCount}
                  delta="Check-out Queue"
                />
              </section>

              <section className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Live Check-In & Arrival Queue</h3>
                      <button
                        className={styles.actionLink}
                        onClick={() => navigate('/hotel/check-in')}
                      >
                        OPEN CHECK-IN MODULE
                      </button>
                    </div>
                    <DataTable columns={tableColumns} data={recentGuests} />
                  </div>
                </div>

                <div className={styles.rightColumn}>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Front Desk Quick Actions</h3>
                    <QuickActionsGrid onActionClick={handleQuickAction} />
                  </div>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Front Desk Duty Stream</h3>
                    <Timeline />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: HOUSEKEEPING VIEW */}
          {activeTab === 'Housekeeping' && (
            <div className={styles.subViewContainer} data-testid="housekeeping-view">
              <section className={styles.kpiRow}>
                <KpiCard
                  icon="✨"
                  label="VACANT CLEAN"
                  value="34 Rooms"
                  delta="Ready for Check-In"
                />
                <KpiCard
                  icon="🧹"
                  label="DIRTY / IN-PROGRESS"
                  value="8 Rooms"
                  delta="Housekeeping Cleaning"
                />
                <KpiCard
                  icon="🛠️"
                  label="MAINTENANCE ALERTS"
                  value="2 Rooms"
                  delta="Out of Order"
                  isPositive={false}
                />
              </section>

              <section className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Room Cleaning Status Breakdown</h3>
                    <ProgressBar segments={housekeepingSegments} showLegend />
                  </div>

                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Housekeeping Duty Logs</h3>
                      <button
                        className={styles.actionLink}
                        onClick={() => navigate('/hotel/rooms')}
                      >
                        MANAGE ROOM INVENTORY
                      </button>
                    </div>
                    <Timeline />
                  </div>
                </div>

                <div className={styles.rightColumn}>
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Quick Front-Desk Actions</h3>
                    <QuickActionsGrid onActionClick={handleQuickAction} />
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
