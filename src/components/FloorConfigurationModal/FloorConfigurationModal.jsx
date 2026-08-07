/**
 * @file FloorConfigurationModal.jsx
 * @description Specialized modal overlay component for room floor layouts, floor naming, and room assignment configurations.
 * @figmaFrame Figma frame: Overlays - Floor Configuration Modal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility state
 * @param {Function} props.onClose - Close callback
 * @param {Function} [props.onSave] - Save configuration callback
 */
import React from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './FloorConfigurationModal.module.css';

export default function FloorConfigurationModal({
  isOpen = false,
  onClose,
  onSave,
}) {
  const footerContent = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save Floor Plan
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Floor Configuration"
      footer={footerContent}
    >
      <div className={styles.container} data-testid="floor-configuration-modal">
        <div className={styles.formGroup}>
          <label className={styles.label}>Floor Number / Name</label>
          <input
            type="text"
            placeholder="e.g. Floor 4 - Executive Suite Level"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Total Rooms Count</label>
          <input type="number" placeholder="12" className={styles.input} />
        </div>
        <div className={styles.placeholderBlock}>
          [ Interactive Floor Plan Grid Visualizer Stub ]
        </div>
      </div>
    </Modal>
  );
}
