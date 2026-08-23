/**
 * @file Auth/Login/Index.jsx
 * @description Login screen for user authentication.
 * @figmaFrame Figma frame: Auth - Login
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from './Index.module.css';
import { loginUser } from '../../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStandardLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const result = loginUser(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.container} data-testid="login-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Grand Hotel</h1>
          <p className={styles.subtitle}>Sign in to your HMS account</p>
        </div>
        
        <div className={styles.viewTransitionWrapper}>
          <form onSubmit={handleStandardLogin} className={styles.form}>
            {error && <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>{error}</div>}
            
            <div className={styles.field}>
              <label className={styles.label}>Gmail Address</label>
              <input
                type="email"
                placeholder="operator@gmail.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.actionButtons}>
              <Button variant="primary" type="submit" style={{ width: '100%' }}>
                Sign In
              </Button>
            </div>
          </form>
        </div>
        
        <p className={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
