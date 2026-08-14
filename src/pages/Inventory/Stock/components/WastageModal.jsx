import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './WastageModal.module.css';

export default function WastageModal({ isOpen, onClose, onSave, stockItem }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    reason: 'EXPIRED',
    note: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        quantity: 1,
        reason: 'EXPIRED',
        note: ''
      });
    }
  }, [isOpen]);

  if (!stockItem) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      productId: stockItem.productId,
      quantity: formData.quantity,
      unitId: stockItem.stockUnitId,
      reason: formData.reason,
      note: formData.note
    });
  };

  const remainingStock = stockItem.onHand - formData.quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Wastage" size="medium">
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.productSummary}>
          <div>
            <p className={styles.productName}>{stockItem.productName}</p>
            <p className={styles.sku}>{stockItem.sku}</p>
          </div>
          <div className={styles.currentStock}>
            <span className={styles.stockLabel}>Current Stock</span>
            <span className={styles.stockValue}>{stockItem.onHand} {stockItem.stockUnitCode}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Wasted Quantity ({stockItem.stockUnitCode}) <span className={styles.required}>*</span></label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={handleChange} 
            required 
            min="1"
            max={stockItem.onHand}
            className={styles.input} 
          />
          <p className={styles.hint}>
            Remaining stock will be: <strong className={remainingStock < 0 ? styles.errorText : ''}>{remainingStock} {stockItem.stockUnitCode}</strong>
          </p>
        </div>

        <div className={styles.formGroup}>
          <label>Reason <span className={styles.required}>*</span></label>
          <select name="reason" value={formData.reason} onChange={handleChange} required className={styles.input}>
            <option value="EXPIRED">Expired</option>
            <option value="SPOILED">Spoiled / Rotten</option>
            <option value="BREAKAGE">Breakage</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Note</label>
          <textarea 
            name="note" 
            value={formData.note} 
            onChange={handleChange} 
            className={styles.textarea} 
            rows="3"
            placeholder="Details about the wastage..."
          />
        </div>

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="danger" disabled={remainingStock < 0}>Record Wastage</Button>
        </div>
      </form>
    </Modal>
  );
}
