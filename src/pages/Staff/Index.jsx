/**
 * @file Staff/Index.jsx
 * @description Staff directory, shift management, and duty assignment screen.
 * @figmaFrame Figma frame: Staff - Staff Directory
 *
 * Components integrated (stubs): DataTable, Button, Avatar
 */
import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function StaffPage() {
  const staffColumns = [
    { key: 'guest', title: 'Staff Member' },
    { key: 'room', title: 'Department / Role' },
    { key: 'dates', title: 'Shift Schedule' },
    { key: 'status', title: 'Duty Status' },
    { key: 'actions', title: 'Actions' },
  ];

  const staffData = [
    {
      id: 'st-1',
      guest: { name: 'Sarah Connor', tag: 'Shift Supervisor' },
      room: 'Front Desk Operations',
      dates: '07:00 AM - 03:00 PM',
      status: 'in-house',
    },
    {
      id: 'st-2',
      guest: { name: 'David Miller', tag: 'Senior Housekeeper' },
      room: 'Housekeeping & Maintenance',
      dates: '08:00 AM - 04:00 PM',
      status: 'in-house',
    },
  ];

  return (
    <div className={styles.page} data-testid="staff-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Staff & Shift Directory</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — Figma Frame: Staff - Staff Directory ]
          </p>
        </div>
        <Button variant="primary">+ Add Staff Member</Button>
      </header>

      <div className={styles.contentCard}>
        <DataTable columns={staffColumns} data={staffData} />
      </div>
    </div>
  );
}
