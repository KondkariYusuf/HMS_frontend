import React from 'react';
import Badge from '@components/Badge/Badge';
import Button from '@components/Button/Button';
import styles from './ProductTable.module.css';

export default function ProductTable({ products, categories, brands, productTypes, units, onEdit, onDelete, onViewDetails }) {
  
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getBrandName = (id) => brands.find(b => b.id === id)?.name || '-';
  const getTypeName = (id) => productTypes.find(t => t.id === id)?.name || 'Unknown';
  
  const columns = [
    {
      header: 'Product Name',
      accessor: (row) => (
        <div className={styles.productCell} onClick={() => onViewDetails(row)}>
          <span className={styles.productName}>{row.name}</span>
          <span className={styles.productSku}>{row.sku}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row) => getCategoryName(row.categoryId)
    },
    {
      header: 'Brand',
      accessor: (row) => getBrandName(row.brandId)
    },
    {
      header: 'Type',
      accessor: (row) => getTypeName(row.productTypeId)
    },
    {
      header: 'Reorder Level',
      accessor: (row) => `${row.reorderLevel} ${row.stockUnitCode}`
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      )
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
          {products.map((row) => (
            <tr key={row.id} className={styles.tr}>
              {columns.map((col, idx) => (
                <td key={idx} className={styles.td}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: '1rem', textAlign: 'center' }}>
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

