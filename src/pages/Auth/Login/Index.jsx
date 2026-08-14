/**
 * @file Auth/Login/Index.jsx
 * @description Login screen stub for user authentication.
 * @figmaFrame Figma frame: Auth - Login
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className={styles.container} data-testid="login-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Grand Hotel</h1>
          <p className={styles.subtitle}>Sign in to your HMS account</p>
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="operator@grandhorizon.com"
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
          <div className={styles.linksRow}>
            <Link to="/forgot-password" className={styles.link}>
              Forgot Password?
            </Link>
          </div>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>
        <p className={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register Property
          </Link>
        </p>
      </div>
    </div>
  );
}
