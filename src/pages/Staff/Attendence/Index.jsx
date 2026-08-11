import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import styles from './Index.module.css';

const AttendenceColumns = [
    { key: 'guest', title: 'Employee' },
    { key: 'room', title: 'Department / Role' },
    { key: 'dates', title: 'Check-in / Out' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' },
];

const AttendenceData = [
    {
        id: 'att-101',
        guest: {
            name: 'Sarah Johnson',
            tag: 'EMP-101',
        },
        room: 'Housekeeping',
        dates: '08:00 AM - 05:00 PM',
        status: 'in-house',
    },
    {
        id: 'att-102',
        guest: {
            name: 'Mark Davis',
            tag: 'EMP-102',
        },
        room: 'Front Desk',
        dates: '09:15 AM - 05:30 PM',
        status: 'in-house',
    },
    {
        id: 'att-103',
        guest: {
            name: 'Lina Zhang',
            tag: 'EMP-103',
        },
        room: 'F&B Service',
        dates: '--',
        status: 'absent',
    },
    {
        id: 'att-104',
        guest: {
            name: 'David Miller',
            tag: 'EMP-104',
        },
        room: 'Maintenance',
        dates: '08:30 AM - 05:00 PM',
        status: 'in-house',
    },
    {
        id: 'att-105',
        guest: {
            name: 'Sarah Connor',
            tag: 'EMP-105',
        },
        room: 'Front Desk',
        dates: '07:45 AM - 04:00 PM',
        status: 'in-house',
    },
];

export default function StaffAttendence() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Staff Attendence</h1>

                    <p className={styles.subtitle}>
                        Manage daily staff Attendence and check-in/check-out records.
                    </p>
                </div>
            </header>

            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label className={styles.label} htmlFor="att-date">
                        Date
                    </label>

                    <input
                        id="att-date"
                        type="date"
                        className={styles.input}
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label} htmlFor="att-department">
                        Department
                    </label>

                    <select
                        id="att-department"
                        className={styles.select}
                        defaultValue="all"
                    >
                        <option value="all">All Departments</option>
                        <option value="housekeeping">Housekeeping</option>
                        <option value="front-desk">Front Desk</option>
                        <option value="fnb">F&B Service</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label} htmlFor="att-status">
                        Attendence Status
                    </label>

                    <select
                        id="att-status"
                        className={styles.select}
                        defaultValue="all"
                    >
                        <option value="all">All Statuses</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="away">Away</option>
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label} htmlFor="att-search">
                        Search Staff
                    </label>

                    <input
                        id="att-search"
                        type="text"
                        className={styles.input}
                        placeholder="Search by name or ID..."
                    />
                </div>
            </div>

            <DataTable
                columns={AttendenceColumns}
                data={AttendenceData}
            />
        </div>
    );
}