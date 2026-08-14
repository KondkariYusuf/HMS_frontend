import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './PurchaseOrderFormModal.module.css';
import { mockProducts, mockSuppliers } from '../../mockData';

export default function PurchaseOrderFormModal({ isOpen, onClose, onSave, purchaseOrder }) {
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    poNumber: '',
    orderedAt: '',
    expectedAt: '',
    status: 'DRAFT',
    notes: '',
    items: []
  });

  useEffect(() => {
    if (isOpen) {
      if (purchaseOrder) {
        setFormData({
          ...purchaseOrder,
          orderedAt: purchaseOrder.orderedAt ? purchaseOrder.orderedAt.split('T')[0] : '',
          expectedAt: purchaseOrder.expectedAt ? purchaseOrder.expectedAt.split('T')[0] : '',
        });
      } else {
        setFormData({
          supplierId: '',
          supplierName: '',
          poNumber: `PO-NEW-${Math.floor(Math.random() * 1000)}`,
          orderedAt: new Date().toISOString().split('T')[0],
          expectedAt: '',
          status: 'DRAFT',
          notes: '',
          items: []
        });
      }
    }
  }, [isOpen, purchaseOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'supplierId') {
      const sup = mockSuppliers.find(s => s.id === value);
      setFormData(prev => ({
        ...prev,
        supplierId: value,
        supplierName: sup ? sup.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `temp-${Date.now()}`, productId: '', productName: '', orderedQty: 1, unitCost: 0, lineTotal: 0 }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const item = { ...newItems[index] };

      if (field === 'productId') {
        const prod = mockProducts.find(p => p.id === value);
        item.productId = value;
        item.productName = prod ? prod.name : '';
        item.unitCost = prod ? prod.currentCost : 0;
      } else if (field === 'orderedQty') {
        item.orderedQty = parseInt(value) || 0;
      } else if (field === 'unitCost') {
        item.unitCost = parseFloat(value) * 100 || 0; // Assuming minor units input simplified for demo, or keep as is. Let's assume input is in major units and we convert to minor.
      }

      item.lineTotal = item.orderedQty * item.unitCost;
      newItems[index] = item;

      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subTotal = formData.items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    const taxTotal = subTotal * 0.05; // 5% dummy tax
    const grandTotal = subTotal + taxTotal;
    return { subTotal, taxTotal, grandTotal };
  };

  const totals = calculateTotals();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      window.alert('Please add at least one item to the purchase order.');
      return;
    }

    // Convert dates back to ISO if needed, or leave as YYYY-MM-DD for dummy
    const saveData = {
      ...formData,
      id: purchaseOrder ? purchaseOrder.id : `pur-new-${Date.now()}`,
      subTotal: totals.subTotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      orderedAt: formData.orderedAt ? new Date(formData.orderedAt).toISOString() : null,
      expectedAt: formData.expectedAt ? new Date(formData.expectedAt).toISOString() : null,
    };

    onSave(saveData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={purchaseOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}
      size="large"
      footer={
        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="po-form" variant="primary">
            {purchaseOrder ? 'Save Changes' : 'Create Purchase Order'}
          </Button>
        </div>
      }
    >
      <form id="po-form" onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Info</h3>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Supplier <span className={styles.required}>*</span></label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value="">Select a supplier</option>
                {mockSuppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>PO Number <span className={styles.required}>*</span></label>
              <input type="text" name="poNumber" value={formData.poNumber} onChange={handleChange} required className={styles.input} />
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Order Date <span className={styles.required}>*</span></label>
              <input type="date" name="orderedAt" value={formData.orderedAt} onChange={handleChange} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Expected Delivery</label>
              <input type="date" name="expectedAt" value={formData.expectedAt} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Status <span className={styles.required}>*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} required className={styles.input}>
                <option value="DRAFT">Draft</option>
                <option value="ORDERED">Ordered</option>
                <option value="PARTIALLY_RECEIVED">Partially Received</option>
                <option value="RECEIVED">Received</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.itemsHeader}>
            <h3 className={styles.sectionTitle}>Items</h3>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddItem}>+ Add Item</Button>
          </div>

          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Product *</th>
                <th>Quantity *</th>
                <th>Unit Price (INR) *</th>
                <th>Line Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => (
                <tr key={item.id}>
                  <td>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                      required
                      className={styles.input}
                    >
                      <option value="">Select product</option>
                      {mockProducts.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.orderedQty}
                      onChange={(e) => handleItemChange(idx, 'orderedQty', e.target.value)}
                      required
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitCost / 100} // Display as major units
                      onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                      required
                      className={styles.input}
                    />
                  </td>
                  <td>
                    {((item.lineTotal || 0) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </td>
                  <td>
                    <button type="button" className={styles.removeItemBtn} onClick={() => handleRemoveItem(idx)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              {formData.items.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>
                    No items added yet. Click &quot;+ Add Item&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {formData.items.length > 0 && (
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>{(totals.subTotal / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax (5%)</span>
                <span>{(totals.taxTotal / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
              <div className={styles.grandTotalRow}>
                <span>Grand Total</span>
                <span>{(totals.grandTotal / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Additional Information</h3>
          <div className={styles.formGroup}>
            <label>Notes / Delivery Instructions</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Any specific instructions for the supplier..."
            />
          </div>
        </div>

      </form>
    </Modal>
  );
}
