/**
 * @file Admin/RBAC/Index.jsx
 * @description Role-Based Access Control (RBAC) permission matrix & role definitions.
 * @figmaFrame Figma frame: Admin - Roles & Permissions (05-rbac.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function AdminRBACPage() {
  return (
    <div className={styles.page} data-testid="admin-rbac-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Roles & RBAC Permissions Matrix</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: RBAC (05-rbac.md) ]
          </p>
        </div>
        <Button variant="primary">+ Create Custom Role</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ RBAC Module Permissions Grid & Role Assignment Interface Stub ]
        </div>
      </div>
    </div>
  );
}
