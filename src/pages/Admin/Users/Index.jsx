/**
 * @file Admin/Users/Index.jsx
 * @description Organization user accounts, invitation management, and staff directory.
 * @figmaFrame Figma frame: Admin - User Management (06-users.md)
 */
import React from 'react';
import DataTable from '@components/DataTable/DataTable';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function AdminUsersPage() {
  const staffColumns = [
    { key: 'guest', title: 'User Name & Email' },
    { key: 'room', title: 'Assigned Role' },
    { key: 'dates', title: 'Primary Branch' },
    { key: 'status', title: 'Account Status' },
    { key: 'actions', title: 'Actions' },
  ];

  const staffData = [
    {
      id: 'usr-1',
      guest: { name: 'Sarah Connor', tag: 'sarah@grandhorizon.com' },
      room: 'Front Desk Supervisor',
      dates: 'Main Resort Branch',
      status: 'in-house',
    },
    {
      id: 'usr-2',
      guest: { name: 'David Miller', tag: 'david@grandhorizon.com' },
      room: 'Senior Housekeeper',
      dates: 'Beach Suites Branch',
      status: 'in-house',
    },
  ];

  return (
    <div className={styles.page} data-testid="admin-users-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management & Staff Directory</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Users (06-users.md) ]
          </p>
        </div>
        <Button variant="primary">+ Invite User</Button>
      </header>

      <div className={styles.overviewCard}>
        <DataTable columns={staffColumns} data={staffData} />
      </div>
    </div>
  );
}
