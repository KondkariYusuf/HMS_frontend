/**
 * @file Auth/Register/Index.jsx
 * @description Tenant property registration screen stub.
 * @figmaFrame Figma frame: Auth - Organization Register
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from '../Login/Index.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className={styles.container} data-testid="register-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Grand Horizon</h1>
          <p className={styles.subtitle}>Register your Property / Hotel</p>
        </div>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Property / Hotel Name</label>
            <input
              type="text"
              placeholder="e.g. Horizon Beach Resort"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Work Email</label>
            <input
              type="email"
              placeholder="admin@hotel.com"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={styles.input}
              required
            />
          </div>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Create Account
          </Button>
        </form>
        <p className={styles.footerText}>
          Already registered?{' '}
          <Link to="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
