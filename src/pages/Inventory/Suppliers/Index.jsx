/**
 * @file Inventory/Suppliers/Index.jsx
 * @description Manage suppliers/vendors and their contacts/payment terms.
 */
import React, { useState } from 'react';
import Button from '@components/Button/Button';
import Toast from '@components/Toast/Toast';
import InventoryTabs from '../components/InventoryTabs';
import SupplierTable from './components/SupplierTable';
import SupplierFormModal from './components/SupplierFormModal';
import SupplierDetailsModal from './components/SupplierDetailsModal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';

// Mock Data
import { mockSuppliers } from '../mockData';
import styles from './Index.module.css';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Filtering
  const filteredSuppliers = suppliers.filter(s => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(searchLower) || 
      (s.contactPerson && s.contactPerson.toLowerCase().includes(searchLower)) ||
      (s.email && s.email.toLowerCase().includes(searchLower)) ||
      (s.phone && s.phone.toLowerCase().includes(searchLower));
      
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddClick = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleSaveSupplier = (supplierData) => {
    if (selectedSupplier) {
      setSuppliers(prev => prev.map(s => s.id === supplierData.id ? supplierData : s));
      setToastMessage('Supplier updated successfully');
    } else {
      setSuppliers(prev => [supplierData, ...prev]);
      setToastMessage('Supplier added successfully');
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      // Typically backend would soft-delete or block. We'll just remove from local array for demo.
      setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
      setToastMessage('Supplier deleted successfully');
    }
    setIsDeleteOpen(false);
  };

  return (
    <div className={styles.page} data-testid="suppliers-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>Manage suppliers, contacts, and payment terms.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" onClick={handleAddClick}>+ Add Supplier</Button>
        </div>
      </header>
      
      <InventoryTabs />

      <div className={styles.filtersBar}>
        <input 
          type="text" 
          placeholder="Search suppliers by name, contact, phone, email..." 
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <div className={styles.content}>
        <SupplierTable 
          suppliers={filteredSuppliers} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
        />
      </div>

      <SupplierFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSupplier}
        supplier={selectedSupplier}
      />

      <SupplierDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        supplier={selectedSupplier}
      />

      <ConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${selectedSupplier?.name}? This action cannot be undone.`}
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
