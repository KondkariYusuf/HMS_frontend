/**
 * @file Modal.jsx
 * @description Generic accessible overlay modal with backdrop, title bar, body slot, and close trigger.
 * @figmaFrame Figma frame: Overlays - Generic Modal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility state
 * @param {Function} props.onClose - Modal dismissal handler
 * @param {string} [props.title] - Modal header title text
 * @param {React.ReactNode} props.children - Modal inner content slot
 * @param {React.ReactNode} [props.footer] - Optional footer action buttons
 */
import React, { useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({
  isOpen = false,
  onClose,
  title = 'Modal Title',
  children,
  footer,
}) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} data-testid="modal">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
