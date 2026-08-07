/**
 * @file Admin/Branches/Index.jsx
 * @description Organization branches, multi-tenant property locations, and settings.
 * @figmaFrame Figma frame: Admin - Organization Branches (02-organization-tenancy.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function AdminBranchesPage() {
  return (
    <div className={styles.page} data-testid="admin-branches-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Organization & Property Branches</h1>
          <p className={styles.subtitle}>
            [ Screen Stub — API Group: Organization & Tenancy
            (02-organization-tenancy.md) ]
          </p>
        </div>
        <Button variant="primary">+ Add Branch</Button>
      </header>

      <div className={styles.overviewCard}>
        <div className={styles.roomCardStub}>
          [ Organization Multi-Branch Management List Stub ]
        </div>
      </div>
    </div>
  );
}
