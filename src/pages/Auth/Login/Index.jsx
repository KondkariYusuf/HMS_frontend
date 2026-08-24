/**
 * @file Auth/Login/Index.jsx
 * @description Login & OTP authentication screen aligned with HMS backend requirements.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import styles from './Index.module.css';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../app/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Clear any stale demo tokens on mount so auth guard works correctly
  useEffect(() => {
    const storedToken = localStorage.getItem('syncstays_token');
    if (storedToken === 'demo_token' || storedToken === '') {
      localStorage.removeItem('syncstays_token');
      localStorage.removeItem('syncstays_user');
      localStorage.removeItem('syncstays_branches');
      localStorage.removeItem('syncstays_branch_id');
      localStorage.removeItem('authToken');
    }
  }, []);

  // Mode: 'login' | 'verify_otp' | 'forgot_password' | 'reset_password'
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Extract error message helper
  const parseErrorMessage = (res) => {
    if (typeof res === 'string') return res;
    if (res?.message) return res.message;
    if (res?.errors && Array.isArray(res.errors)) {
      return res.errors.map(e => e.msg || e.message).join('. ');
    }
    return 'Operation failed. Please check input values.';
  };

  // 1. Initial Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      setLoading(false);

      if (res.statusCode === 200 || res.success || res.data?.token || res.token) {
        if (res.data?.token || res.token || res.accessToken) {
          const token = res.data?.token || res.token || res.accessToken;
          const user = res.data?.user || res.user || { email };
          login(user, token);
          setMessage('Login successful!');
          setTimeout(() => navigate('/'), 400);
        } else {
          // Requires OTP
          setMessage(res.message || 'An OTP has been sent to your email address.');
          setMode('verify_otp');
        }
      } else {
        setError(parseErrorMessage(res));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred during login.');
    }
  };

  // 2. OTP Verification Submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.verifyOtp(email, otp, mode === 'reset_password' ? 'FORGOT_PASSWORD' : 'LOGIN');
      setLoading(false);

      if (res.statusCode === 200 || res.success || res.data?.token || res.token) {
        const token = res.data?.token || res.token || res.accessToken;
        const user = res.data?.user || res.user || { email };
        if (token) login(user, token);
        setMessage('OTP Verified! Logging in...');
        setTimeout(() => navigate('/'), 500);
      } else {
        setError(parseErrorMessage(res));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to verify OTP.');
    }
  };

  // 3. Forgot Password Request
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setLoading(false);

      if (res.statusCode === 200 || res.success) {
        setMessage('Password reset OTP has been sent to your Gmail inbox. Please check your email.');
        setOtp('');
        setMode('reset_password');
      } else {
        setError(parseErrorMessage(res));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error requesting password reset.');
    }
  };

  // 4. Reset Password Submission — MUST verify OTP first, then reset
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Step A: Verify OTP first (backend marks it verified: true)
      const verifyRes = await authService.verifyOtp(email, otp, 'FORGOT_PASSWORD');

      if (!(verifyRes.statusCode === 200 || verifyRes.success)) {
        setLoading(false);
        setError(parseErrorMessage(verifyRes) || 'Invalid or expired OTP. Please request a new one.');
        return;
      }

      // Step B: Now reset password (backend checks verified: true)
      const res = await authService.resetPassword(email, otp, newPassword);
      setLoading(false);

      if (res.statusCode === 200 || res.success) {
        setMessage('Password successfully reset! You can now log in.');
        setMode('login');
        setOtp('');
        setNewPassword('');
      } else {
        setError(parseErrorMessage(res));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error completing password reset.');
    }
  };

  return (
    <div className={styles.container} data-testid="login-page">
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>SyncStays HMS</h1>
          <p className={styles.subtitle}>
            {mode === 'login' && 'Sign in to your HMS account'}
            {mode === 'verify_otp' && 'Enter the OTP sent to your email'}
            {mode === 'forgot_password' && 'Enter your email to reset password'}
            {mode === 'reset_password' && 'Reset your password'}
          </p>
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

        <div>
          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Email / Mobile Number</label>
                <input
                  type="text"
                  placeholder="you@example.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

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
              </div>

              <div className={styles.linksRow}>
                <button
                  type="button"
                  onClick={() => { setMode('forgot_password'); setError(''); setMessage(''); }}
                  className={styles.linkButton}
                >
                  Forgot Password?
                </button>
              </div>

              <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* MODE 2: VERIFY OTP */}
          {mode === 'verify_otp' && (
            <form onSubmit={handleOtpSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className={styles.input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className={styles.actionButtons}>
                <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className={styles.linkButton}
                  style={{ textAlign: 'center' }}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.actionButtons}>
                <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Sending OTP...' : 'Send Reset OTP'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className={styles.linkButton}
                  style={{ textAlign: 'center' }}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: RESET PASSWORD */}
          {mode === 'reset_password' && (
            <form onSubmit={handleResetPasswordSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className={styles.input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>New Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Password123!"
                    className={`${styles.input} ${styles.passwordInput}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordBtn}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showNewPassword ? '👁️' : '🙈'}
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Must contain 8+ chars, uppercase, lowercase, number & special char
                </span>
              </div>

              <div className={styles.actionButtons}>
                <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className={styles.linkButton}
                  style={{ textAlign: 'center' }}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
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
