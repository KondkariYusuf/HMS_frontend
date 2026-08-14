import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './SupplierFormModal.module.css';

export default function SupplierFormModal({ isOpen, onClose, onSave, supplier }) {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstin: '',
    paymentTermsDays: 30,
    creditLimit: 0,
    status: 'ACTIVE',
    billingAddress: { line1: '', city: '', state: '', postalCode: '', country: '' },
    bank: { accountName: '', accountNumber: '', ifsc: '' }
  });

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        setFormData({
          ...supplier,
          // Ensure nested objects exist to prevent uncontrolled input errors
          billingAddress: supplier.billingAddress || { line1: '', city: '', state: '', postalCode: '', country: '' },
          bank: supplier.bank || { accountName: '', accountNumber: '', ifsc: '' }
        });
      } else {
        setFormData({
          name: '',
          contactPerson: '',
          phone: '',
          email: '',
          gstin: '',
          paymentTermsDays: 30,
          creditLimit: 0,
          status: 'ACTIVE',
          billingAddress: { line1: '', city: '', state: '', postalCode: '', country: '' },
          bank: { accountName: '', accountNumber: '', ifsc: '' }
        });
      }
    }
  }, [isOpen, supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'paymentTermsDays' || name === 'creditLimit' ? parseInt(value) || 0 : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: supplier ? supplier.id : `sup-new-${Date.now()}`,
      code: supplier ? supplier.code : `SUP-TEMP-${Math.floor(Math.random() * 1000)}`,
      currency: 'INR',
      outstanding: supplier ? supplier.outstanding : 0,
      createdAt: supplier ? supplier.createdAt : new Date().toISOString()
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={supplier ? 'Edit Supplier' : 'Add Supplier'} 
      size="large"
      footer={
        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="supplier-form" variant="primary">{supplier ? 'Save Changes' : 'Add Supplier'}</Button>
        </div>
      }
    >
      <form id="supplier-form" onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Info</h3>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Supplier Name <span className={styles.required}>*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Status <span className={styles.required}>*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} required className={styles.input}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Contact Person</label>
              <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>GSTIN</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Financials</h3>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Payment Terms (Days)</label>
              <input type="number" name="paymentTermsDays" value={formData.paymentTermsDays} onChange={handleChange} min="0" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Credit Limit (Minor Units)</label>
              <input type="number" name="creditLimit" value={formData.creditLimit} onChange={handleChange} min="0" className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Billing Address</h3>
          <div className={styles.formGroup}>
            <label>Address Line 1</label>
            <input type="text" value={formData.billingAddress.line1} onChange={(e) => handleNestedChange('billingAddress', 'line1', e.target.value)} className={styles.input} />
          </div>
          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>City</label>
              <input type="text" value={formData.billingAddress.city} onChange={(e) => handleNestedChange('billingAddress', 'city', e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>State</label>
              <input type="text" value={formData.billingAddress.state} onChange={(e) => handleNestedChange('billingAddress', 'state', e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Postal Code</label>
              <input type="text" value={formData.billingAddress.postalCode} onChange={(e) => handleNestedChange('billingAddress', 'postalCode', e.target.value)} className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Bank Details</h3>
          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Account Name</label>
              <input type="text" value={formData.bank.accountName} onChange={(e) => handleNestedChange('bank', 'accountName', e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Account Number</label>
              <input type="text" value={formData.bank.accountNumber} onChange={(e) => handleNestedChange('bank', 'accountNumber', e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>IFSC</label>
              <input type="text" value={formData.bank.ifsc} onChange={(e) => handleNestedChange('bank', 'ifsc', e.target.value)} className={styles.input} />
            </div>
          </div>
        </div>

      </form>
    </Modal>
  );
}
