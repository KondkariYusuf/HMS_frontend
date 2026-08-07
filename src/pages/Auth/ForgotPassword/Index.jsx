/**
 * @file Auth/ForgotPassword/Index.jsx
 * @description Password recovery screen stub.
 * @figmaFrame Figma frame: Auth - Forgot Password
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from '../Login/Index.module.css';

export default function ForgotPasswordPage() {
  return (
    <div className={styles.container} data-testid="forgot-password-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            Enter your email to receive recovery instructions
          </p>
        </div>
        <form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Registered Email</label>
            <input
              type="email"
              placeholder="operator@grandhorizon.com"
              className={styles.input}
              required
            />
          </div>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Send Recovery Email
          </Button>
        </form>
        <p className={styles.footerText}>
          Remembered password?{' '}
          <Link to="/login" className={styles.link}>
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
