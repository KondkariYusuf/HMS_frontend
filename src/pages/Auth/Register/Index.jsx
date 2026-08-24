/**
 * @file Auth/Register/Index.jsx
 * @description User registration screen aligned with HMS backend user model.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from '../Login/Index.module.css';
import { registerUser } from '../../../services/authService';
import { organizationService } from '../../../services/organizationService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await organizationService.getAll();
        const list = res?.data?.rows || res?.data?.responses || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(list) && list.length > 0) {
          setOrganizations(list);
          if (list[0]?.id) setOrganizationId(list[0].id);
        }
      } catch (err) {
        console.warn('Could not load organizations list:', err);
      }
    }
    fetchOrgs();
  }, []);

  const parseErrorMessage = (res) => {
    if (typeof res === 'string') return res;
    if (res?.message) return res.message;
    if (res?.errors && Array.isArray(res.errors)) {
      return res.errors.map(e => e.msg || e.message).join('. ');
    }
    return 'Registration failed. Please check input values.';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters and include uppercase (A-Z), lowercase (a-z), number (0-9), and special character (@$!%*?&). Example: Password123!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(fullName, email, phone, password, organizationId || undefined);
      setLoading(false);

      if (result.statusCode === 201 || result.statusCode === 200 || result.success) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(parseErrorMessage(result));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration error occurred.');
    }
  };

  return (
    <div className={styles.container} data-testid="register-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>SyncStays HMS</h1>
          <p className={styles.subtitle}>Create your user account</p>
        </div>

        {message && (
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-tint)', padding: '10px 14px', borderRadius: '6px', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '6px', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className={styles.form}>
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
            <label className={styles.label}>Email Address</label>
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

          {organizations.length > 0 && (
            <div className={styles.field}>
              <label className={styles.label}>Select Organization</label>
              <select
                className={styles.input}
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name || org.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`${styles.input} ${styles.passwordInput}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Must contain 8+ chars, uppercase, lowercase, number & special char (e.g. Password123!)
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`${styles.input} ${styles.passwordInput}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating Account...' : 'Register Account'}
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
