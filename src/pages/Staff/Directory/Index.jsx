/**
 * @file Index.jsx
 * @description Staff Directory page — displays a list of hotel staff members
 * with their department, shift schedule, and duty status.
 * @figmaFrame Frame 2 — Staff Directory
 */
import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const staffColumns = [
    { key: 'guest', title: 'Staff Member' },
    { key: 'room', title: 'Department / Role' },
    { key: 'dates', title: 'Shift Schedule' },
    { key: 'status', title: 'Duty Status' },
    { key: 'actions', title: 'Actions' },
];

const staffData = [
    {
        id: 'st-101',
        guest: { name: 'Sarah Connor', tag: 'Shift Supervisor' },
        room: 'Front Desk Operations',
        dates: '07:00 AM - 03:00 PM',
        status: 'in-house',
    },
    {
        id: 'st-102',
        guest: { name: 'David Miller', tag: 'Senior Housekeeper' },
        room: 'Housekeeping & Maintenance',
        dates: '08:00 AM - 04:00 PM',
        status: 'in-house',
    },
    {
        id: 'st-103',
        guest: { name: 'Mark Davis', tag: 'Front Desk Associate' },
        room: 'Front Desk',
        dates: '09:00 AM - 05:00 PM',
        status: 'in-house',
    },
    {
        id: 'st-104',
        guest: { name: 'Lina Zhang', tag: 'Restaurant Associate' },
        room: 'F&B Service',
        dates: '10:00 AM - 06:00 PM',
        status: 'away',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StaffDirectory() {
    return (
        <div className={styles.page}>

            {/* ── Page Header ── */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Staff Directory</h1>
                    <p className={styles.subtitle}>
                        Manage employees, roles, departments, and shift schedules.
                    </p>
                </div>

                <Button variant="primary" size="md">
                    + Add Staff Member
                </Button>
            </div>

            {/* ── Staff Table ── */}
            <DataTable columns={staffColumns} data={staffData} />

        </div>
    );
}
