/**
 * @file AccessDenied.jsx
 * @description Clean, user-friendly access denied component rendered inside application shell
 * when an authenticated Hotel user lacks specific page-level permissions.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from './AccessDenied.module.css';

export default function AccessDenied({ code }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container} data-testid="access-denied-page">
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.lockIcon}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className={styles.eyebrow}>SECURITY RESTRICTION</div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You do not have permission to view this page.
        </p>

        {code && (
          <div className={styles.permissionBadge}>
            Required Permission: <code>{code}</code>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => navigate('/hotel/dashboard')}
          >
            Return to Dashboard
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
