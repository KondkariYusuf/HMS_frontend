import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './ProductFormModal.module.css';

export default function ProductFormModal({ isOpen, onClose, onSave, product, categories, brands, productTypes, units }) {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    kind: 'RAW',
    categoryId: '',
    brandId: '',
    productTypeId: '',
    stockUnitId: '',
    reorderLevel: 0,
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({ ...product });
      } else {
        setFormData({
          name: '',
          sku: '',
          barcode: '',
          kind: 'RAW',
          categoryId: categories.length > 0 ? categories[0].id : '',
          brandId: '',
          productTypeId: productTypes.length > 0 ? productTypes[0].id : '',
          stockUnitId: units.length > 0 ? units[0].id : '',
          reorderLevel: 0,
          status: 'ACTIVE'
        });
      }
    }
  }, [isOpen, product, categories, productTypes, units]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'reorderLevel' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auto-populate stockUnitCode based on stockUnitId
    const selectedUnit = units.find(u => u.id === formData.stockUnitId);
    
    const productToSave = {
      ...formData,
      stockUnitCode: selectedUnit ? selectedUnit.code : '',
    };
    
    if (!isEditing) {
      productToSave.id = `prod-${Date.now()}`;
      productToSave.createdAt = new Date().toISOString();
      productToSave.isTracked = true;
      productToSave.currentCost = 0;
      productToSave.currency = 'INR';
    }
    
    onSave(productToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Product' : 'Add Product'} size="large">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          
          <div className={styles.formGroup}>
            <label>Product Name <span className={styles.required}>*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label>SKU</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label>Category <span className={styles.required}>*</span></label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className={styles.input}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Brand</label>
            <select name="brandId" value={formData.brandId || ''} onChange={handleChange} className={styles.input}>
              <option value="">No Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Product Type <span className={styles.required}>*</span></label>
            <select name="productTypeId" value={formData.productTypeId} onChange={handleChange} required className={styles.input}>
              {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Kind <span className={styles.required}>*</span></label>
            <select name="kind" value={formData.kind} onChange={handleChange} required className={styles.input}>
              <option value="RAW">Raw Material</option>
              <option value="SEMI_FINISHED">Semi Finished</option>
              <option value="FINISHED">Finished Product</option>
              <option value="SERVICE">Service</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Stock Unit <span className={styles.required}>*</span></label>
            <select name="stockUnitId" value={formData.stockUnitId} onChange={handleChange} required className={styles.input}>
              {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.code})</option>)}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Reorder Level (in stock units)</label>
            <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} min="0" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Barcode</label>
            <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={styles.input}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

        </div>
        
        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Product</Button>
        </div>
      </form>
    </Modal>
  );
}
