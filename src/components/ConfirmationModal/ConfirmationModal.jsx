/**
 * @file ConfirmationModal.jsx
 * @description Confirmation modal dialog for destructive or high-priority actions (e.g., Cancel Reservation, Remove Staff).
 * @figmaFrame Figma frame: Overlays - Confirmation Modal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility flag
 * @param {Function} props.onClose - Cancel / close handler
 * @param {Function} props.onConfirm - Confirm action handler
 * @param {string} [props.title='Confirm Action'] - Dialog title
 * @param {string} [props.message='Are you sure you want to proceed?'] - Confirmation message
 * @param {boolean} [props.isDestructive=false] - Applies error styling for delete actions
 */
import React from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to cancel this reservation? This action cannot be undone.',
  isDestructive = false,
}) {
  const footerContent = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant={isDestructive ? 'primary' : 'primary'}
        onClick={onConfirm}
        style={isDestructive ? { backgroundColor: 'var(--color-error)' } : {}}
      >
        {isDestructive ? 'Delete' : 'Confirm'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footerContent}
    >
      <div className={styles.container} data-testid="confirmation-modal">
        <p className={styles.message}>{message}</p>
      </div>
    </Modal>
  );
}
