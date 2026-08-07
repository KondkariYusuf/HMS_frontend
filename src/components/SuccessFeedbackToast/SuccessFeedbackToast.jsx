/**
 * @file SuccessFeedbackToast.jsx
 * @description Preset success feedback notification component for actions like guest check-in or room assignment.
 * @figmaFrame Figma frame: Overlays - Success Feedback Toast
 *
 * @param {Object} props
 * @param {string} [props.message='Reservation successfully confirmed!'] - Success message text
 * @param {Function} [props.onClose] - Close handler
 */
import React from 'react';
import Toast from '@components/Toast/Toast';
import styles from './SuccessFeedbackToast.module.css';

export default function SuccessFeedbackToast({
  message = 'Reservation successfully saved!',
  onClose,
}) {
  return (
    <div className={styles.wrapper} data-testid="success-feedback-toast">
      <Toast message={message} type="success" onClose={onClose} />
    </div>
  );
}
