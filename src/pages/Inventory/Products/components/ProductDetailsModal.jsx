import React from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import styles from './ProductDetailsModal.module.css';

export default function ProductDetailsModal({ isOpen, onClose, product, categories, brands, productTypes }) {
  if (!product) return null;

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || '-';
  const brandName = brands.find(b => b.id === product.brandId)?.name || '-';
  const typeName = productTypes.find(t => t.id === product.productTypeId)?.name || '-';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="medium">
      <div className={styles.detailsContainer}>
        <div className={styles.header}>
          <div className={styles.titleInfo}>
            <h2 className={styles.productName}>{product.name}</h2>
            <p className={styles.sku}>SKU: {product.sku}</p>
          </div>
          <Badge variant={product.status === 'ACTIVE' ? 'success' : 'default'}>{product.status}</Badge>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{categoryName}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Brand</span>
            <span className={styles.value}>{brandName}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Product Type</span>
            <span className={styles.value}>{typeName} ({product.kind})</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Barcode</span>
            <span className={styles.value}>{product.barcode || '-'}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Stock Unit</span>
            <span className={styles.value}>{product.stockUnitCode}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Reorder Level</span>
            <span className={styles.value}>{product.reorderLevel} {product.stockUnitCode}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Tracked in Stock</span>
            <span className={styles.value}>{product.isTracked ? 'Yes' : 'No'}</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.label}>Current Cost</span>
            <span className={styles.value}>{product.currency} {(product.currentCost / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
