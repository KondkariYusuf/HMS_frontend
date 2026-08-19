import React from 'react';
import Badge from '@components/Badge/Badge';
import Button from '@components/Button/Button';
import styles from './StockTable.module.css';

export default function StockTable({ stockData, onAdjust, onWastage, onViewDetails }) {
  
  const columns = [
    {
      header: 'Product',
      accessor: (row) => (
        <div className={styles.productCell}>
          <span className={styles.productName}>{row.productName}</span>
          <span className={styles.productSku}>{row.sku}</span>
        </div>
      )
    },
    {
      header: 'Current Stock',
      accessor: (row) => (
        <span className={styles.onHand}>
          {row.onHand} {row.stockUnitCode}
        </span>
      )
    },
    {
      header: 'Reorder Level',
      accessor: (row) => `${row.reorderLevel} ${row.stockUnitCode}`
    },
    {
      header: 'Status',
      accessor: (row) => {
        let variant = 'success';
        let label = 'Healthy';
        
        if (row.onHand === 0) {
          variant = 'danger';
          label = 'Out of Stock';
        } else if (row.onHand <= row.reorderLevel) {
          variant = 'warning';
          label = 'Low Stock';
        }
        
        return <Badge variant={variant}>{label}</Badge>;
      }
    },
    {
      header: 'Preferred Supplier',
      accessor: (row) => row.preferredSupplierName || '-'
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className={styles.actionsCell}>
          <Button variant="secondary" size="small" onClick={() => onAdjust(row)}>Adjust</Button>
          <Button variant="danger" size="small" onClick={() => onWastage(row)}>Wastage</Button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stockData.map((row) => (
            <tr
              key={row.productId}
              className={styles.tr}
              onClick={() => onViewDetails(row)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onViewDetails(row);
                }
              }}
              tabIndex="0"
              role="button"
              aria-label={`View details for ${row.productName}`}
            >
              {columns.map((col, idx) => (
                <td key={idx} className={styles.td}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
          {stockData.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: '1rem', textAlign: 'center' }}>
                No stock data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

