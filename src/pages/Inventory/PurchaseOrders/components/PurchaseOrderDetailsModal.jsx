import React from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './PurchaseOrderDetailsModal.module.css';

export default function PurchaseOrderDetailsModal({ isOpen, onClose, purchaseOrder }) {
  if (!purchaseOrder) return null;

  const formatCurrency = (minorUnits) => {
    return (minorUnits / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Purchase Order: ${purchaseOrder.poNumber}`} 
      size="large"
      footer={
        <Button variant="secondary" onClick={onClose}>Close</Button>
      }
    >
      <div className={styles.detailsContent}>
        
        <div className={styles.headerGrid}>
          <div className={styles.detailGroup}>
            <span className={styles.detailLabel}>Supplier</span>
            <span className={styles.detailValue}>{purchaseOrder.supplierName}</span>
          </div>
          <div className={styles.detailGroup}>
            <span className={styles.detailLabel}>Status</span>
            <span className={styles.detailValue}>{purchaseOrder.status.replace('_', ' ')}</span>
          </div>
          <div className={styles.detailGroup}>
            <span className={styles.detailLabel}>Order Date</span>
            <span className={styles.detailValue}>{formatDate(purchaseOrder.orderedAt)}</span>
          </div>
          <div className={styles.detailGroup}>
            <span className={styles.detailLabel}>Expected Delivery</span>
            <span className={styles.detailValue}>{formatDate(purchaseOrder.expectedAt)}</span>
          </div>
        </div>

        {purchaseOrder.notes && (
          <div className={styles.notesSection}>
            <strong>Notes:</strong> {purchaseOrder.notes}
          </div>
        )}

        <div>
          <h4 className={styles.sectionTitle}>Order Items</h4>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th className={styles.textRight}>Unit Price</th>
                <th className={styles.textRight}>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrder.items?.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{item.productName}</td>
                  <td>{item.orderedQty}</td>
                  <td className={styles.textRight}>{formatCurrency(item.unitCost)}</td>
                  <td className={styles.textRight}>{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
              {(!purchaseOrder.items || purchaseOrder.items.length === 0) && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    No items in this order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.totalsSection}>
          <div className={styles.totalsBox}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(purchaseOrder.subTotal || 0)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax (Est.)</span>
              <span>{formatCurrency(purchaseOrder.taxTotal || 0)}</span>
            </div>
            <div className={styles.grandTotalRow}>
              <span>Grand Total</span>
              <span>{formatCurrency(purchaseOrder.grandTotal || 0)}</span>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
}
