import React from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import styles from './SupplierDetailsModal.module.css';

export default function SupplierDetailsModal({ isOpen, onClose, supplier }) {
  if (!supplier) return null;

  let variant = 'default';
  if (supplier.status === 'ACTIVE') variant = 'success';
  if (supplier.status === 'INACTIVE') variant = 'warning';
  if (supplier.status === 'BLOCKED') variant = 'danger';

  const outstandingFormatted = (supplier.outstanding / 100).toFixed(2);
  const creditLimitFormatted = (supplier.creditLimit / 100).toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supplier Details" size="large">
      <div className={styles.container}>
        
        <div className={styles.header}>
          <div>
            <h2 className={styles.supplierName}>{supplier.name}</h2>
            <p className={styles.supplierCode}>{supplier.code}</p>
          </div>
          <Badge variant={variant}>{supplier.status}</Badge>
        </div>

        <div className={styles.contentGrid}>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.detailRow}>
              <span className={styles.label}>Contact Person:</span>
              <span className={styles.value}>{supplier.contactPerson || '-'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{supplier.phone || '-'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{supplier.email || '-'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>GSTIN:</span>
              <span className={styles.value}>{supplier.gstin || '-'}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Financials</h3>
            <div className={styles.detailRow}>
              <span className={styles.label}>Payment Terms:</span>
              <span className={styles.value}>{supplier.paymentTermsDays} days</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Credit Limit:</span>
              <span className={styles.value}>{supplier.currency} {creditLimitFormatted}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Outstanding:</span>
              <span className={styles.value} style={{ fontWeight: '600' }}>
                {supplier.currency} {outstandingFormatted}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Created At:</span>
              <span className={styles.value}>{new Date(supplier.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

        </div>

        <div className={styles.contentGrid}>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Billing Address</h3>
            {supplier.billingAddress ? (
              <div className={styles.addressBlock}>
                {supplier.billingAddress.line1 && <div>{supplier.billingAddress.line1}</div>}
                <div>
                  {supplier.billingAddress.city}{supplier.billingAddress.city && supplier.billingAddress.state ? ', ' : ''}
                  {supplier.billingAddress.state} {supplier.billingAddress.postalCode}
                </div>
                {supplier.billingAddress.country && <div>{supplier.billingAddress.country}</div>}
              </div>
            ) : (
              <span className={styles.value}>-</span>
            )}
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Bank Details</h3>
            {supplier.bank ? (
              <>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Account Name:</span>
                  <span className={styles.value}>{supplier.bank.accountName || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Account Number:</span>
                  <span className={styles.value}>{supplier.bank.accountNumber || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>IFSC:</span>
                  <span className={styles.value}>{supplier.bank.ifsc || '-'}</span>
                </div>
              </>
            ) : (
              <span className={styles.value}>-</span>
            )}
          </div>

        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>

      </div>
    </Modal>
  );
}
