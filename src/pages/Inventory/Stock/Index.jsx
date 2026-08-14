/**
 * @file Inventory/Stock/Index.jsx
 * @description Real-time stock levels, adjustments, and re-order triggers.
 */
import React, { useState } from 'react';
import Toast from '@components/Toast/Toast';
import InventoryTabs from '../components/InventoryTabs';
import StockTable from './components/StockTable';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import WastageModal from './components/WastageModal';

// Mock Data
import { mockStock } from '../mockData';
import styles from './Index.module.css';

export default function InventoryStockPage() {
  const [stockData, setStockData] = useState(mockStock);
  const [search, setSearch] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isWastageOpen, setIsWastageOpen] = useState(false);

  const [selectedStock, setSelectedStock] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Filtering
  const filteredStock = stockData.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (stockStatusFilter === 'HEALTHY') matchesStatus = item.onHand > item.reorderLevel;
    if (stockStatusFilter === 'LOW') matchesStatus = item.onHand <= item.reorderLevel && item.onHand > 0;
    if (stockStatusFilter === 'OUT') matchesStatus = item.onHand === 0;

    // We don't have category ID in stock mock directly (would normally join), so we skip category filtering for now
    // or we'd map it from products. Let's assume search + status is enough for this screen.
    return matchesSearch && matchesStatus;
  });

  const handleAdjustClick = (stockItem) => {
    setSelectedStock(stockItem);
    setIsAdjustOpen(true);
  };

  const handleWastageClick = (stockItem) => {
    setSelectedStock(stockItem);
    setIsWastageOpen(true);
  };

  const handleSaveAdjustment = (adjustData) => {
    setStockData(prev => prev.map(item => {
      if (item.productId === adjustData.productId) {
        let newStock = item.onHand;
        if (adjustData.mode === 'SET') {
          newStock = adjustData.quantity;
        } else {
          newStock += adjustData.quantity;
        }
        return { ...item, onHand: newStock, lastTransactionAt: new Date().toISOString() };
      }
      return item;
    }));
    setToastMessage('Stock adjusted successfully');
    setIsAdjustOpen(false);
  };

  const handleSaveWastage = (wastageData) => {
    setStockData(prev => prev.map(item => {
      if (item.productId === wastageData.productId) {
        return { ...item, onHand: item.onHand - wastageData.quantity, lastTransactionAt: new Date().toISOString() };
      }
      return item;
    }));
    setToastMessage('Wastage recorded successfully');
    setIsWastageOpen(false);
  };

  return (
    <div className={styles.page} data-testid="inventory-stock-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>Monitor stock levels, set re-order triggers, and perform adjustments.</p>
        </div>
      </header>

      <InventoryTabs />

      <div className={styles.filtersBar}>
        <input
          type="text"
          placeholder="Search stock by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Stock Levels</option>
          <option value="HEALTHY">Healthy</option>
          <option value="LOW">Low Stock</option>
          <option value="OUT">Out of Stock</option>
        </select>
      </div>

      <div className={styles.content}>
        <StockTable
          stockData={filteredStock}
          onAdjust={handleAdjustClick}
          onWastage={handleWastageClick}
        />
      </div>

      <StockAdjustmentModal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        onSave={handleSaveAdjustment}
        stockItem={selectedStock}
      />

      <WastageModal
        isOpen={isWastageOpen}
        onClose={() => setIsWastageOpen(false)}
        onSave={handleSaveWastage}
        stockItem={selectedStock}
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
