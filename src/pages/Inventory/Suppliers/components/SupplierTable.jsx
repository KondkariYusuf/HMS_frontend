import React from 'react';
import Badge from '@components/Badge/Badge';
import Button from '@components/Button/Button';
import styles from './SupplierTable.module.css';

export default function SupplierTable({ suppliers, onEdit, onDelete, onViewDetails }) {
  const columns = [
    {
      header: 'Supplier',
      accessor: (row) => (
        <div className={styles.supplierCell} onClick={() => onViewDetails(row)}>
          <span className={styles.supplierName}>{row.name}</span>
          <span className={styles.supplierCode}>{row.code}</span>
        </div>
      )
    },
    {
      header: 'Contact Person',
      accessor: (row) => row.contactPerson || '-'
    },
    {
      header: 'Phone / Email',
      accessor: (row) => (
        <div className={styles.contactCell}>
          <span className={styles.phone}>{row.phone || '-'}</span>
          <span className={styles.email}>{row.email || '-'}</span>
        </div>
      )
    },
    {
      header: 'Outstanding',
      accessor: (row) => {
        // Simple formatting for minor units -> major units
        const formatted = (row.outstanding / 100).toFixed(2);
        return `${row.currency} ${formatted}`;
      }
    },
    {
      header: 'Status',
      accessor: (row) => {
        let variant = 'default';
        if (row.status === 'ACTIVE') variant = 'success';
        if (row.status === 'INACTIVE') variant = 'warning';
        if (row.status === 'BLOCKED') variant = 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className={styles.actionsCell}>
          <Button variant="secondary" size="small" onClick={(e) => { e.stopPropagation(); onEdit(row); }}>Edit</Button>
          <Button variant="danger" size="small" onClick={(e) => { e.stopPropagation(); onDelete(row); }}>Delete</Button>
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
          {suppliers.map((row) => (
            <tr key={row.id} className={styles.tr}>
              {columns.map((col, idx) => (
                <td key={idx} className={styles.td}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: '1rem', textAlign: 'center' }}>
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
