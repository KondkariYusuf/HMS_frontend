/**
 * @file Index.jsx
 * @description Refined Housekeeping Management Dashboard.
 * @figmaFrame Refined Housekeeping Management Dashboard
 */

import React from 'react';
import styles from './Index.module.css';

// ─── Summary Data ─────────────────────────────────────────────────────────────

const summaryCards = [
    {
        id: 'tasks',
        label: 'TOTAL TASKS',
        value: '42',
        detail: '60% Done',
        variant: 'tasks',
    },
    {
        id: 'staff',
        label: 'AVAILABLE STAFF',
        value: '12',
        detail: 'On Duty',
        variant: 'staff',
    },
    {
        id: 'rooms',
        label: 'READY ROOMS',
        value: '18',
        detail: 'Inspected',
        variant: 'rooms',
    },
    {
        id: 'urgent',
        label: 'URGENT ACTIONS',
        value: '3',
        detail: 'Priority Cleans',
        variant: 'urgent',
    },
];

// ─── Cleaning Tasks ───────────────────────────────────────────────────────────

const cleaningTasks = [
    {
        id: 'room-502',
        room: 'Room 502',
        roomType: '5B',
        guest: 'Prabal Singh',
        status: 'VACATED — AWAITING FIRST CLEAN',
        statusType: 'vacated',
        updateLabel: 'LAST UPDATE',
        updateValue: '12:56 by Dashboard',
        action: 'edit',
    },
    {
        id: 'room-101',
        room: 'Room 101',
        roomType: '2B',
        guest: 'Elena Rodriguez',
        status: 'DEEP CLEAN REQUIRED',
        statusType: 'urgent',
        updateLabel: 'STATUS',
        updateValue: 'Urgent - Changeover',
        action: 'edit',
    },
    {
        id: 'room-304',
        room: 'Room 304',
        roomType: '4B',
        guest: 'Johnathan Marsh',
        status: 'READY FOR INSPECTION',
        statusType: 'ready',
        updateLabel: 'ASSIGNEE',
        updateValue: 'Sarah Jenkins',
        action: 'check',
    },
    {
        id: 'room-412',
        room: 'Room 412',
        roomType: '2B',
        guest: 'Wei Chen',
        status: 'OCCUPIED — DAILY REFRESH',
        statusType: 'occupied',
        updateLabel: 'PREFERENCES',
        updateValue: 'Extra pillows requested',
        action: 'edit',
    },
];

// ─── Active Staff ─────────────────────────────────────────────────────────────

const activeStaff = [
    {
        id: 'staff-101',
        name: 'Sarah Jenkins',
        status: 'WORKING - ROOM 304',
        type: 'working',
    },
    {
        id: 'staff-102',
        name: 'Marco Varela',
        status: 'BREAK - RETURNS 14:00',
        type: 'break',
    },
    {
        id: 'staff-103',
        name: 'Lydia Thorne',
        status: 'SUPERVISOR - ON FLOOR 2',
        type: 'supervisor',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HousekeepingDashboard() {
    return (
        <div className={styles.page}>

            {/* ── Page Header ── */}
            <header className={styles.header}>
                <div>
                    <div className={styles.breadcrumb}>
                        Home / Housekeeping
                    </div>

                    <h1 className={styles.title}>
                        Housekeeping Management
                    </h1>
                </div>

                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.filterButton}
                    >
                        ☰ &nbsp; Filters
                    </button>

                    <button
                        type="button"
                        className={styles.printButton}
                    >
                        ▣ &nbsp; Print List
                    </button>
                </div>
            </header>

            {/* ── Summary Cards ── */}
            <section className={styles.summaryGrid}>
                {summaryCards.map((card) => (
                    <article
                        key={card.id}
                        className={`${styles.summaryCard} ${styles[card.variant]}`}
                    >
                        <span className={styles.summaryLabel}>
                            {card.label}
                        </span>

                        <div className={styles.summaryValueRow}>
                            <strong className={styles.summaryValue}>
                                {card.value}
                            </strong>

                            <span className={styles.summaryDetail}>
                                {card.detail}
                            </span>
                        </div>
                    </article>
                ))}
            </section>

            {/* ── Today's Cleaning Tasks ── */}
            <section className={styles.tasksCard}>

                <div className={styles.tasksHeader}>
                    <div className={styles.tasksTitle}>
                        <span className={styles.cleaningIcon}>
                            ♧
                        </span>

                        <h2>Today’s Cleaning Tasks</h2>
                    </div>

                    <div className={styles.taskLegend}>
                        <span>
                            <i className={styles.vacatedDot} />
                            VACATED
                        </span>

                        <span>
                            <i className={styles.occupiedDot} />
                            OCCUPIED
                        </span>
                    </div>
                </div>

                <div className={styles.taskList}>
                    {cleaningTasks.map((task) => (
                        <article
                            key={task.id}
                            className={`${styles.taskRow} ${styles[task.statusType]}`}
                        >
                            <div className={styles.taskAccent} />

                            <div className={styles.taskMain}>
                                <div className={styles.roomHeading}>
                                    <h3>{task.room}</h3>

                                    <span className={styles.roomType}>
                                        {task.roomType}
                                    </span>
                                </div>

                                <p className={styles.guestName}>
                                    Guest: {task.guest}
                                </p>

                                <span
                                    className={`${styles.taskStatus} ${styles[`${task.statusType}Status`]
                                        }`}
                                >
                                    • {task.status}
                                </span>
                            </div>

                            <div className={styles.taskMeta}>
                                <span className={styles.metaLabel}>
                                    {task.updateLabel}
                                </span>

                                <span className={styles.metaValue}>
                                    {task.updateValue}
                                </span>
                            </div>

                            <button
                                type="button"
                                className={styles.taskAction}
                                aria-label={`Action for ${task.room}`}
                            >
                                {task.action === 'check' ? '☑' : '✎'}
                            </button>
                        </article>
                    ))}
                </div>

                <button
                    type="button"
                    className={styles.viewAllButton}
                >
                    VIEW ALL HOUSEKEEPING TASKS
                    <span>→</span>
                </button>

            </section>

            {/* ── Bottom Dashboard Area ── */}
            <section className={styles.bottomGrid}>

                {/* Housekeeping Activity */}
                <article className={styles.activityCard}>

                    <div className={styles.panelHeader}>
                        <h2>Housekeeping Activity</h2>

                        <div className={styles.activityDots}>
                            <span className={styles.activeDot} />
                            <span />
                            <span />
                        </div>
                    </div>

                    <div className={styles.activityChart}>

                        <div className={styles.chartLine} />

                        <div className={styles.timeLabels}>
                            <span>08:00</span>
                            <span>10:00</span>
                            <span className={styles.currentTime}>12:00</span>
                            <span>14:00</span>
                            <span>16:00</span>
                            <span>18:00</span>
                        </div>

                    </div>

                </article>

                {/* Active Staff */}
                <article className={styles.activeStaffCard}>

                    <div className={styles.panelHeader}>
                        <h2>Active Staff</h2>

                        <button
                            type="button"
                            className={styles.moreButton}
                            aria-label="More staff options"
                        >
                            •••
                        </button>
                    </div>

                    <div className={styles.staffList}>
                        {activeStaff.map((staff) => (
                            <div
                                key={staff.id}
                                className={`${styles.staffItem} ${styles[staff.type]
                                    }`}
                            >
                                <strong>{staff.name}</strong>

                                <span>{staff.status}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className={styles.assignButton}
                    >
                        + ASSIGN NEW TASK
                    </button>

                </article>

            </section>

        </div>
    );
}