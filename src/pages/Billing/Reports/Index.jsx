/**
 * @file Billing/Reports/Index.jsx
 * @description Revenue breakdown, tax reports, and multi-currency analytics.
 * @figmaFrame Figma frame: Billing - Financial Reports (19-billing.md, 08-currency.md)
 */
import React, { useState, useMemo } from 'react';
import Button from '@components/Button/Button';
import KpiCard from '@components/KpiCard/KpiCard';
import ChartCard from '@components/ChartCard/ChartCard';
import DataTable from '@components/DataTable/DataTable';
import styles from './Index.module.css';

// Dummy data for the Revenue Reports
const INITIAL_TRANSACTIONS = [
  { id: 'tx-100', guest: { name: 'Eleanor Vance', tag: 'VIP Member' }, category: 'Room', branch: 'Main Resort', date: '2026-08-10', amount: 450, paymentMethod: 'Credit Card', status: 'completed' },
  { id: 'tx-101', guest: { name: 'Marcus Brody', tag: 'Standard' }, category: 'F&B', branch: 'Main Resort', date: '2026-08-11', amount: 120, paymentMethod: 'Room Charge', status: 'completed' },
  { id: 'tx-102', guest: { name: 'Sarah Jenkins', tag: 'Corporate' }, category: 'Room', branch: 'Downtown Annex', date: '2026-08-12', amount: 890, paymentMethod: 'Bank Transfer', status: 'pending' },
  { id: 'tx-103', guest: { name: 'David Cho', tag: 'Standard' }, category: 'Spa', branch: 'Main Resort', date: '2026-08-12', amount: 200, paymentMethod: 'Credit Card', status: 'completed' },
  { id: 'tx-104', guest: { name: 'Emily Blunt', tag: 'VIP Member' }, category: 'F&B', branch: 'Downtown Annex', date: '2026-08-13', amount: 85, paymentMethod: 'Cash', status: 'completed' },
  { id: 'tx-105', guest: { name: 'Tech Solutions Inc.', tag: 'Corporate' }, category: 'Events', branch: 'Main Resort', date: '2026-08-13', amount: 2500, paymentMethod: 'Bank Transfer', status: 'completed' },
];

export default function BillingReportsPage() {
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState('Daily');

  const handleExport = () => {
    console.log('Exporting Revenue Report to PDF/CSV...');
    window.alert('Report export initiated.');
  };

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) || tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = branchFilter === 'All' || tx.branch === branchFilter;
      const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      const matchesDate = !dateFilter || tx.date === dateFilter;
      return matchesSearch && matchesBranch && matchesCategory && matchesDate;
    });
  }, [transactions, searchQuery, branchFilter, categoryFilter, dateFilter]);

  // Aggregate KPI Data
  const totalRevenue = useMemo(() => filteredData.filter(tx => tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0), [filteredData]);
  const pendingRevenue = useMemo(() => filteredData.filter(tx => tx.status === 'pending').reduce((sum, tx) => sum + tx.amount, 0), [filteredData]);
  const txCount = filteredData.length;

  const tableColumns = [
    { key: 'guest', title: 'Guest / Company' },
    { key: 'category', title: 'Category' },
    { key: 'branch', title: 'Branch' },
    { key: 'date', title: 'Date' },
    { key: 'amount', title: 'Amount' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' },
  ];

  const tableData = filteredData.map(tx => ({
    id: tx.id,
    guest: tx.guest,
    category: tx.category,
    branch: tx.branch,
    date: tx.date,
    amount: `$${tx.amount.toFixed(2)}`,
    status: tx.status,
  }));

  return (
    <div className={styles.page} data-testid="billing-reports-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Revenue Reports</h1>
          <p className={styles.subtitle}>
            Analyze financial performance, transactions, and revenue distribution.
          </p>
        </div>
        <Button variant="secondary" onClick={handleExport}>Export PDF / CSV</Button>
      </header>

      {/* KPI Section */}
      <div className={styles.kpiGrid}>
        <KpiCard
          icon="💵"
          label="TOTAL REVENUE"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtext="Completed transactions"
          delta="+8.2%"
          isPositive={true}
        />
        <KpiCard
          icon="⏳"
          label="PENDING PAYMENTS"
          value={`$${pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtext="Awaiting settlement"
          delta="-2.1%"
          isPositive={true}
        />
        <KpiCard
          icon="🧾"
          label="TRANSACTION VOLUME"
          value={txCount.toString()}
          subtext="Total matched records"
        />
      </div>

      {/* Filters Section */}
      <div className={styles.controlsGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search</label>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Guest name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Branch</label>
          <select className={styles.filterSelect} value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="All">All Branches</option>
            <option value="Main Resort">Main Resort</option>
            <option value="Downtown Annex">Downtown Annex</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category</label>
          <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Room">Room</option>
            <option value="F&B">F&B</option>
            <option value="Spa">Spa</option>
            <option value="Events">Events</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Specific Date</label>
          <input
            type="date"
            className={styles.filterInput}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <ChartCard
          title="Revenue Trend"
          subtitle="Revenue distribution over selected timeframe"
          timeframe={chartTimeframe}
          onTimeframeChange={setChartTimeframe}
        />
      </div>

      {/* Detailed Transactions Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Transaction Details</h3>
        </div>
        {tableData.length > 0 ? (
          <DataTable
            columns={tableColumns}
            data={tableData}
            onActionClick={(row) => console.log('View details for', row.id)}
          />
        ) : (
          <div className={styles.emptyState}>
            No transactions found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
