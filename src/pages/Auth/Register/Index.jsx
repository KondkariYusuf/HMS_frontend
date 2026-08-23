/**
 * @file Auth/Register/Index.jsx
 * @description User registration screen.
 * @figmaFrame Figma frame: Auth - Register
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from '../Login/Index.module.css'; // Reusing Login styles for consistency
import { registerUser } from '../../../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = registerUser(fullName, email, phone, password);
    if (result.success) {
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.container} data-testid="register-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Grand Hotel</h1>
          <p className={styles.subtitle}>Create your account</p>
        </div>
        <form onSubmit={handleRegister} className={styles.form}>
          {error && <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>{error}</div>}
          
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gmail</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Register
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
