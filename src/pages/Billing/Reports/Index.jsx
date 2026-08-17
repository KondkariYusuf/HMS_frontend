/**
 * @file Billing/Reports/Index.jsx
 * @description Revenue breakdown, tax reports, and multi-currency analytics.
 * @figmaFrame Figma frame: Billing - Financial Reports (19-billing.md, 08-currency.md)
 */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Button from '@components/Button/Button';
import KpiCard from '@components/KpiCard/KpiCard';
import ChartCard from '@components/ChartCard/ChartCard';
import DataTable from '@components/DataTable/DataTable';
import Badge from '@components/Badge/Badge';
import styles from './Index.module.css';

// Dummy data for the Revenue Reports
const INITIAL_TRANSACTIONS = [
  { id: 'tx-100', guest: { name: 'Eleanor Vance', tag: 'VIP Member' }, category: 'Room', branch: 'Main Resort', date: '2026-08-10', amount: 450, paymentMethod: 'Credit Card', status: 'completed' },
  { id: 'tx-101', guest: { name: 'Marcus Brody', tag: 'Standard' }, category: 'F&B', branch: 'Main Resort', date: '2026-08-11', amount: 120, paymentMethod: 'Room Charge', status: 'completed' },
  { id: 'tx-102', guest: { name: 'Sarah Jenkins', tag: 'Corporate' }, category: 'Room', branch: 'Downtown Annex', date: '2026-08-12', amount: 890, paymentMethod: 'Bank Transfer', status: 'pending' },
  { id: 'tx-103', guest: { name: 'David Cho', tag: 'Standard' }, category: 'Spa', branch: 'Main Resort', date: '2026-08-12', amount: 200, paymentMethod: 'Credit Card', status: 'completed' },
  { id: 'tx-104', guest: { name: 'Emily Blunt', tag: 'VIP Member' }, category: 'F&B', branch: 'Downtown Annex', date: '2026-08-13', amount: 85, paymentMethod: 'Cash', status: 'completed' },
  { id: 'tx-105', guest: { name: 'Tech Solutions Inc.', tag: 'Corporate' }, category: 'Events', branch: 'Main Resort', date: '2026-08-13', amount: 2500, paymentMethod: 'Bank Transfer', status: 'completed' },
  { id: 'tx-106', guest: { name: 'Amara Osei', tag: 'VIP Member' }, category: 'Room', branch: 'Main Resort', date: '2026-08-14', amount: 760, paymentMethod: 'Credit Card', status: 'completed' },
  { id: 'tx-107', guest: { name: 'Liam Torres', tag: 'Standard' }, category: 'Spa', branch: 'Downtown Annex', date: '2026-08-14', amount: 320, paymentMethod: 'Cash', status: 'completed' },
  { id: 'tx-108', guest: { name: 'Nina Petrova', tag: 'Corporate' }, category: 'F&B', branch: 'Main Resort', date: '2026-08-15', amount: 240, paymentMethod: 'Room Charge', status: 'pending' },
  { id: 'tx-109', guest: { name: 'Grand Corp Ltd.', tag: 'Corporate' }, category: 'Events', branch: 'Downtown Annex', date: '2026-08-15', amount: 1800, paymentMethod: 'Bank Transfer', status: 'completed' },
];

// Category color map
const CATEGORY_COLORS = {
  Room: '#147a7e',
  'F&B': '#0e9f6e',
  Spa: '#8b5cf6',
  Events: '#f59e0b',
};

// --- CSV Export utility ---
function exportToCSV(data, filename = 'revenue-report.csv') {
  const headers = ['ID', 'Guest', 'Tag', 'Category', 'Branch', 'Date', 'Amount', 'Payment Method', 'Status'];
  const rows = data.map(tx => [
    tx.id,
    tx.guest?.name ?? '',
    tx.guest?.tag ?? '',
    tx.category,
    tx.branch,
    tx.date,
    tx.amount != null ? `$${Number(tx.amount).toFixed(2)}` : '',
    tx.paymentMethod,
    tx.status,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BillingReportsPage() {
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState('Daily');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!exportMenuOpen) return;
    function handleClick(e) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [exportMenuOpen]);

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

  // Category breakdown (completed only)
  const categoryTotals = useMemo(() => {
    const map = {};
    filteredData.filter(tx => tx.status === 'completed').forEach(tx => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => ({ cat, amt }));
  }, [filteredData]);

  const categoryMax = useMemo(() => Math.max(...categoryTotals.map(c => c.amt), 1), [categoryTotals]);

  // Table columns
  const tableColumns = [
    { key: 'guest', title: 'Guest / Company' },
    { key: 'category', title: 'Category' },
    { key: 'branch', title: 'Branch' },
    { key: 'date', title: 'Date' },
    { key: 'paymentMethod', title: 'Payment' },
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
    paymentMethod: tx.paymentMethod,
    amount: `$${tx.amount.toFixed(2)}`,
    status: tx.status,
  }));

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredData, 'revenue-report.csv');
    setExportMenuOpen(false);
  };

  const handlePrint = () => {
    setExportMenuOpen(false);
    window.print();
  };

  return (
    <div className={styles.page} data-testid="billing-reports-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Revenue Reports</h1>
          <p className={styles.subtitle}>
            Analyze financial performance, transactions, and revenue distribution.
          </p>
        </div>
        <div className={styles.exportWrapper} ref={exportMenuRef}>
          <Button
            variant="secondary"
            onClick={() => setExportMenuOpen(prev => !prev)}
            aria-haspopup="menu"
            aria-expanded={exportMenuOpen}
          >
            Export ▾
          </Button>
          {exportMenuOpen && (
            <div className={styles.exportMenu} role="menu">
              <button
                type="button"
                className={styles.exportMenuItem}
                role="menuitem"
                onClick={handleExportCSV}
              >
                <span className={styles.exportMenuIcon}>⬇</span>
                Download CSV
              </button>
              <button
                type="button"
                className={styles.exportMenuItem}
                role="menuitem"
                onClick={handlePrint}
              >
                <span className={styles.exportMenuIcon}>🖨</span>
                Print / Save as PDF
              </button>
            </div>
          )}
        </div>
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
          isPositive={false}
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
        {(searchQuery || branchFilter !== 'All' || categoryFilter !== 'All' || dateFilter) && (
          <div className={styles.filterGroup} style={{ justifyContent: 'flex-end' }}>
            <label className={styles.filterLabel}>&nbsp;</label>
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => {
                setSearchQuery('');
                setBranchFilter('All');
                setCategoryFilter('All');
                setDateFilter('');
              }}
            >
              ✕ Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Charts + Category Breakdown Row */}
      <div className={styles.analyticsRow}>
        <div className={styles.chartCell}>
          <ChartCard
            title="Revenue Trend"
            subtitle="Revenue distribution over selected timeframe"
            timeframe={chartTimeframe}
            onTimeframeChange={setChartTimeframe}
          />
        </div>

        {categoryTotals.length > 0 && (
          <div className={styles.categoryBreakdown}>
            <div className={styles.breakdownHeader}>
              <h3 className={styles.breakdownTitle}>Revenue by Category</h3>
              <span className={styles.breakdownSubtitle}>Completed transactions</span>
            </div>
            <div className={styles.breakdownBars}>
              {categoryTotals.map(({ cat, amt }) => (
                <div key={cat} className={styles.breakdownRow}>
                  <span className={styles.breakdownCatLabel}>{cat}</span>
                  <div className={styles.breakdownBarTrack}>
                    <div
                      className={styles.breakdownBarFill}
                      style={{
                        width: `${Math.round((amt / categoryMax) * 100)}%`,
                        backgroundColor: CATEGORY_COLORS[cat] || 'var(--color-primary)',
                      }}
                    />
                  </div>
                  <span className={styles.breakdownAmt}>
                    ${amt.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Transactions Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>
            Transaction Details
            <span className={styles.tableCount}>{txCount} record{txCount !== 1 ? 's' : ''}</span>
          </h3>
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
