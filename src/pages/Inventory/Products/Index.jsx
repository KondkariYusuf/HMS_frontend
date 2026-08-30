/**
 * @file Inventory/Products/Index.jsx
 * @description Product catalog, SKU categories, and brand management.
 */
import React, { useState } from 'react';
import Button from '@components/Button/Button';
import Toast from '@components/Toast/Toast';
import InventoryTabs from '../components/InventoryTabs';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';

// Mock Data
import { mockProducts, mockCategories, mockBrands, mockProductTypes, mockUnits } from '../mockData';
import styles from './Index.module.css';

export default function InventoryProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.categoryId === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      setToastMessage('Product updated successfully');
    } else {
      setProducts(prev => [productData, ...prev]);
      setToastMessage('Product added successfully');
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setToastMessage('Product deleted successfully');
    }
    setIsDeleteOpen(false);
  };

  return (
    <div className={styles.page} data-testid="inventory-products-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>Manage product catalog and track inventory levels.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" onClick={handleAddClick}>+ Add Product</Button>
        </div>
      </header>
      
      <InventoryTabs />

      <div className={styles.filtersBar}>
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className={styles.searchInput}
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Categories</option>
          {mockCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.content}>
        <ProductTable 
          products={filteredProducts} 
          categories={mockCategories}
          brands={mockBrands}
          productTypes={mockProductTypes}
          units={mockUnits}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
        />
      </div>

      <ProductFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={mockCategories}
        brands={mockBrands}
        productTypes={mockProductTypes}
        units={mockUnits}
      />

      <ProductDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
        categories={mockCategories}
        brands={mockBrands}
        productTypes={mockProductTypes}
      />

      <ConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${selectedProduct?.name}? This action cannot be undone.`}
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
