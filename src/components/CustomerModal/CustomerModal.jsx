/**
 * @file CustomerModal.jsx
 * @description Modal component to add a new customer to the CRM locally.
 */
import React, { useState } from 'react';
import Modal from '@components/Modal/Modal';
import styles from './CustomerModal.module.css';

export default function CustomerModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'WALK_IN',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.contact = 'Either Phone or Email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      // Reset form
      setFormData({ name: '', phone: '', email: '', type: 'WALK_IN' });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name] || errors.contact) {
      setErrors((prev) => ({ ...prev, [name]: undefined, contact: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer">
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Verma"
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
            />
          </div>
        </div>
        {errors.contact && <span className={styles.errorText}>{errors.contact}</span>}

        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>Customer Type</label>
          <select
            id="type"
            name="type"
            className={styles.select}
            value={formData.type}
            onChange={handleChange}
          >
            <option value="WALK_IN">Walk-In</option>
            <option value="REGULAR">Regular</option>
            <option value="VIP">VIP</option>
            <option value="CORPORATE">Corporate</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Customer
          </button>
        </div>
      </form>
    </Modal>
  );
}
