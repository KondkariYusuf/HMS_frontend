/**
 * @file Inventory/PurchaseOrders/Index.jsx
 * @description Purchase orders, goods receipt notes (GRN), and vendor invoices.
 */
import React, { useState } from 'react';
import Button from '@components/Button/Button';
import Toast from '@components/Toast/Toast';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import InventoryTabs from '../components/InventoryTabs';
import PurchaseOrderTable from './components/PurchaseOrderTable';
import PurchaseOrderFormModal from './components/PurchaseOrderFormModal';
import PurchaseOrderDetailsModal from './components/PurchaseOrderDetailsModal';

import { mockPurchaseOrders, mockSuppliers } from '../mockData';
import styles from './Index.module.css';

export default function InventoryPurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Derived Metrics
  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(po => ['DRAFT', 'ORDERED'].includes(po.status)).length;
  const receivedOrders = purchaseOrders.filter(po => ['RECEIVED', 'PARTIALLY_RECEIVED'].includes(po.status)).length;
  const cancelledOrders = purchaseOrders.filter(po => po.status === 'CANCELLED').length;

  // Filtering
  const filteredOrders = purchaseOrders.filter(po => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchLower) || 
      po.supplierName.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter ? po.status === statusFilter : true;
    const matchesSupplier = supplierFilter ? po.supplierId === supplierFilter : true;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const handleAddClick = () => {
    setSelectedPO(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (po) => {
    setSelectedPO(po);
    setIsFormOpen(true);
  };

  const handleViewDetails = (po) => {
    setSelectedPO(po);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (po) => {
    setSelectedPO(po);
    setIsDeleteOpen(true);
  };

  const handleSavePO = (poData) => {
    if (selectedPO) {
      setPurchaseOrders(prev => prev.map(po => po.id === poData.id ? poData : po));
      setToastMessage('Purchase order updated successfully');
    } else {
      setPurchaseOrders(prev => [poData, ...prev]);
      setToastMessage('Purchase order created successfully');
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedPO) {
      setPurchaseOrders(prev => prev.filter(po => po.id !== selectedPO.id));
      setToastMessage('Purchase order deleted successfully');
    }
    setIsDeleteOpen(false);
  };

  return (
    <div className={styles.page} data-testid="inventory-purchase-orders-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Purchase Orders</h1>
          <p className={styles.subtitle}>Create, track, and manage supplier purchase orders.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" onClick={handleAddClick}>+ Create Purchase Order</Button>
        </div>
      </header>
      
      <InventoryTabs />

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total Orders</span>
          <p className={styles.cardValue}>{totalOrders}</p>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Pending / Draft</span>
          <p className={styles.cardValue} style={{ color: 'var(--color-primary)' }}>{pendingOrders}</p>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Received</span>
          <p className={styles.cardValue} style={{ color: 'var(--color-success)' }}>{receivedOrders}</p>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Cancelled</span>
          <p className={styles.cardValue} style={{ color: 'var(--color-error)' }}>{cancelledOrders}</p>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <input 
          type="text" 
          placeholder="Search PO number or supplier..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className={styles.searchInput}
        />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ORDERED">Ordered</option>
          <option value="PARTIALLY_RECEIVED">Partially Received</option>
          <option value="RECEIVED">Received</option>
          <option value="CLOSED">Closed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select 
          value={supplierFilter} 
          onChange={(e) => setSupplierFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Suppliers</option>
          {mockSuppliers.map(sup => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.content}>
        <PurchaseOrderTable 
          purchaseOrders={filteredOrders} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
        />
      </div>

      <PurchaseOrderFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePO}
        purchaseOrder={selectedPO}
      />

      <PurchaseOrderDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        purchaseOrder={selectedPO}
      />

      <ConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete ${selectedPO?.poNumber}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setToastMessage('')} 
        />
      )}
    </div>
  );
}
