import React from 'react';
import styles from './PurchaseOrderTable.module.css';

export default function PurchaseOrderTable({ purchaseOrders, onEdit, onDelete, onViewDetails }) {
  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>
          <p>No purchase orders found.</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DRAFT': return styles.badgeDraft;
      case 'ORDERED': return styles.badgeOrdered;
      case 'PARTIALLY_RECEIVED': return styles.badgePartiallyReceived;
      case 'RECEIVED': return styles.badgeReceived;
      case 'CLOSED': return styles.badgeClosed;
      case 'CANCELLED': return styles.badgeCancelled;
      default: return styles.badgeDraft;
    }
  };

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
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Supplier</th>
            <th>Order Date</th>
            <th>Expected</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map(po => (
            <tr key={po.id}>
              <td>
                <span className={styles.primaryText}>{po.poNumber}</span>
              </td>
              <td>
                <span className={styles.primaryText}>{po.supplierName}</span>
              </td>
              <td>
                <span className={styles.secondaryText}>{formatDate(po.orderedAt)}</span>
              </td>
              <td>
                <span className={styles.secondaryText}>{formatDate(po.expectedAt)}</span>
              </td>
              <td>
                <span className={styles.secondaryText}>{po.items?.length || 0}</span>
              </td>
              <td>
                <span className={styles.amount}>{formatCurrency(po.grandTotal)}</span>
              </td>
              <td>
                <span className={`${styles.badge} ${getStatusBadgeClass(po.status)}`}>
                  {po.status.replace('_', ' ')}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => onViewDetails(po)}
                    title="View Details"
                  >
                    View
                  </button>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => onEdit(po)}
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => onDelete(po)}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
