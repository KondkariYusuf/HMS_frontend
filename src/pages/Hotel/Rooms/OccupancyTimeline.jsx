/**
 * @file Hotel/Rooms/OccupancyTimeline.jsx
 * @description Room occupancy timeline showing bookings across rooms and dates.
 * @figmaFrame Refined Room Occupancy Timeline Dashboard
 */

import React, { useState } from 'react';
import styles from './OccupancyTimeline.module.css';

const DAYS = [
    { day: 'WED', date: '14', today: true },
    { day: 'THU', date: '15' },
    { day: 'FRI', date: '16' },
    { day: 'SAT', date: '17' },
    { day: 'SUN', date: '18' },
    { day: 'MON', date: '19' },
    { day: 'TUE', date: '20' },
];

const ROOMS = [
    {
        id: 101,
        type: 'Deluxe King',
    },
    {
        id: 102,
        type: 'Executive Suite',
    },
    {
        id: 103,
        type: 'Superior Twin',
    },
    {
        id: 201,
        type: 'Ocean View King',
    },
    {
        id: 202,
        type: 'Standard Double',
    },
];

const BOOKINGS = [
    {
        id: 1,
        room: 101,
        guest: 'Alexandra Sterling',
        detail: 'Check-in: 14:00 • 3 Nights',
        status: 'occupied',
        start: 2,
        span: 3,
    },
    {
        id: 2,
        room: 102,
        guest: 'Marcus Vane',
        detail: 'Arriving: 15:30 • 2 Nights',
        status: 'pending',
        start: 3,
        span: 2,
    },
    {
        id: 3,
        room: 103,
        guest: 'Elena Moretti & Family',
        detail: 'Planned: Oct 17 • 4 Nights',
        status: 'confirmed',
        start: 6,
        span: 2,
    },
    {
        id: 4,
        room: 201,
        guest: 'Johnathan Reed',
        detail: 'Checking out Today',
        status: 'occupied',
        start: 1,
        span: 2,
    },
];

const LEGEND = [
    {
        label: 'Occupied',
        status: 'occupied',
    },
    {
        label: 'Pending Check-in',
        status: 'pending',
    },
    {
        label: 'Confirmed Upcoming',
        status: 'confirmed',
    },
    {
        label: 'Maintenance / Out of Order',
        status: 'maintenance',
    },
];

function BookingBlock({ booking }) {
    return (
        <div
            className={`${styles.booking} ${styles[booking.status]}`}
            style={{
                gridColumn: `${booking.start + 1} / span ${booking.span}`,
            }}
        >
            <strong className={styles.bookingGuest}>{booking.guest}</strong>

            <span className={styles.bookingDetail}>
                {booking.detail}
            </span>
        </div>
    );
}

function TimelineRoom({ room }) {
    const roomBookings = BOOKINGS.filter(
        (booking) => booking.room === room.id,
    );

    return (
        <div className={styles.timelineRow}>
            <div className={styles.roomDetails}>
                <strong>{room.id}</strong>
                <span>{room.type}</span>
            </div>

            {DAYS.map((day) => (
                <div
                    key={`${room.id}-${day.date}`}
                    className={`${styles.timelineCell} ${day.today ? styles.todayColumn : ''
                        }`}
                />
            ))}

            {roomBookings.map((booking) => (
                <BookingBlock key={booking.id} booking={booking} />
            ))}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    suffix,
    secondary,
    type,
}) {
    return (
        <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{label}</span>

            <div className={styles.summaryValueRow}>
                <strong
                    className={`${styles.summaryValue} ${type ? styles[`summary-${type}`] : ''
                        }`}
                >
                    {value}
                </strong>

                {suffix && (
                    <span className={styles.summarySuffix}>{suffix}</span>
                )}

                {secondary && (
                    <span
                        className={`${styles.summarySecondary} ${type ? styles[`secondary-${type}`] : ''
                            }`}
                    >
                        {secondary}
                    </span>
                )}
            </div>
        </article>
    );
}

export default function OccupancyTimeline() {
    const [period, setPeriod] = useState('today');

    const handlePrevious = () => {
        setPeriod('previous');
    };

    const handleToday = () => {
        setPeriod('today');
    };

    const handleNext = () => {
        setPeriod('next');
    };

    return (
        <div
            className={styles.page}
            data-testid="room-occupancy-timeline"
        >
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        Room Occupancy
                        <br />
                        Timeline
                    </h1>

                    <p className={styles.subtitle}>
                        Monitor room bookings and occupancy across dates.
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.periodSwitcher}>
                        <button
                            type="button"
                            className={
                                period === 'previous'
                                    ? styles.activePeriod
                                    : ''
                            }
                            onClick={handlePrevious}
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            className={
                                period === 'today'
                                    ? styles.activePeriod
                                    : ''
                            }
                            onClick={handleToday}
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            className={
                                period === 'next'
                                    ? styles.activePeriod
                                    : ''
                            }
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>

                    <button
                        type="button"
                        className={styles.dateButton}
                    >
                        <span className={styles.calendarIcon}>□</span>

                        <span>
                            Oct 12 – Oct
                            <br />
                            26, 2023
                        </span>
                    </button>

                    <button
                        type="button"
                        className={styles.newBookingButton}
                    >
                        <span className={styles.plusIcon}>+</span>
                        New Booking
                    </button>
                </div>
            </header>

            <section className={styles.timelineCard}>
                <div className={styles.timelineHeader}>
                    <div className={styles.roomHeader}>
                        Room Details
                    </div>

                    {DAYS.map((day) => (
                        <div
                            key={day.date}
                            className={`${styles.dayHeader} ${day.today ? styles.todayHeader : ''
                                }`}
                        >
                            <span>{day.day}</span>
                            <strong>{day.date}</strong>
                        </div>
                    ))}
                </div>

                <div className={styles.timelineBody}>
                    {ROOMS.map((room) => (
                        <TimelineRoom key={room.id} room={room} />
                    ))}
                </div>

                <footer className={styles.legend}>
                    <span className={styles.legendTitle}>Legend</span>

                    {LEGEND.map((item) => (
                        <div
                            key={item.label}
                            className={styles.legendItem}
                        >
                            <span
                                className={`${styles.legendDot} ${styles[`dot-${item.status}`]
                                    }`}
                            />

                            {item.label}
                        </div>
                    ))}
                </footer>
            </section>

            <section className={styles.summaryGrid}>
                <SummaryCard
                    label="Today's Occupancy"
                    value="84%"
                    secondary="+2.4% vs LY"
                    type="occupancy"
                />

                <SummaryCard
                    label="Check-ins Remaining"
                    value="12"
                    suffix="of 28 Total"
                />

                <SummaryCard
                    label="Avg. Daily Rate"
                    value="$342"
                    secondary="↑ Peak Season"
                    type="rate"
                />

                <SummaryCard
                    label="Housekeeping Alert"
                    value="4"
                    secondary="Late CO's"
                    type="alert"
                />
            </section>

            <button
                type="button"
                className={styles.searchButton}
                aria-label="Search occupancy"
            >
                ⌕
            </button>
        </div>
    );
}