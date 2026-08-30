import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './StockAdjustmentModal.module.css';

export default function StockAdjustmentModal({ isOpen, onClose, onSave, stockItem }) {
  const [formData, setFormData] = useState({
    mode: 'DELTA', // SET or DELTA
    quantity: 0,
    reason: 'STOCK_TAKE',
    note: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        mode: 'DELTA',
        quantity: 0,
        reason: 'STOCK_TAKE',
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
      mode: formData.mode,
      quantity: formData.quantity,
      unitId: stockItem.stockUnitId,
      reason: formData.reason,
      note: formData.note
    });
  };

  const calculatedNewStock = formData.mode === 'SET' 
    ? formData.quantity 
    : stockItem.onHand + formData.quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Stock" size="medium">
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
          <label>Adjustment Type <span className={styles.required}>*</span></label>
          <select name="mode" value={formData.mode} onChange={handleChange} required className={styles.input}>
            <option value="DELTA">Relative Adjustment (+/-)</option>
            <option value="SET">Set Exact Count</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Quantity ({stockItem.stockUnitCode}) <span className={styles.required}>*</span></label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={handleChange} 
            required 
            className={styles.input} 
          />
          <p className={styles.hint}>
            New calculated stock will be: <strong>{calculatedNewStock} {stockItem.stockUnitCode}</strong>
          </p>
        </div>

        <div className={styles.formGroup}>
          <label>Reason <span className={styles.required}>*</span></label>
          <select name="reason" value={formData.reason} onChange={handleChange} required className={styles.input}>
            <option value="STOCK_TAKE">Stock Take / Count</option>
            <option value="CORRECTION">Correction</option>
            <option value="DAMAGE">Damage</option>
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
            placeholder="Optional reason for adjustment..."
          />
        </div>

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Confirm Adjustment</Button>
        </div>
      </form>
    </Modal>
  );
}
