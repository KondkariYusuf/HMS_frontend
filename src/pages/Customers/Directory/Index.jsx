/**
 * @file Customers/Directory/Index.jsx
 * @description Unified customer directory across hotel and restaurant domains.
 * @figmaFrame Figma frame: Customers - Directory (15-customers.md)
 */
import React, { useState } from 'react';
import useCustomers from '@hooks/useCustomers';
import CustomerModal from '@components/CustomerModal/CustomerModal';
import CustomerDrawer from '@components/CustomerDrawer/CustomerDrawer';
import Avatar from '@components/Avatar/Avatar';
import styles from './Index.module.css';

export default function CustomersDirectoryPage() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    addCustomer,
    totalCustomers,
  } = useCustomers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const CUSTOMER_TYPES = ['All', 'VIP', 'Regular', 'Corporate', 'Walk-in'];

  const handleSaveCustomer = (data) => {
    addCustomer(data);
    setIsModalOpen(false);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const closeDrawer = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className={styles.page} data-testid="customers-directory-page">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Unified Customer Directory</h1>
          <p className={styles.subtitle}>
            Manage all hotel and restaurant patrons. Total customers: {totalCustomers}
          </p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Customer
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, phone, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          {CUSTOMER_TYPES.map((type) => (
            <button
              key={type}
              className={`${styles.filterPill} ${typeFilter === type ? styles.activeFilter : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Metrics</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust.id} className={styles.tableRow} onClick={() => handleRowClick(cust)}>
                    <td>
                      <div className={styles.guestCell}>
                        <Avatar name={cust.name} size="sm" />
                        <div className={styles.guestInfo}>
                          <span className={styles.guestName}>{cust.name}</span>
                          <span className={`${styles.guestType} ${styles[cust.type]}`}>
                            {cust.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactCell}>
                        <span>{cust.phone}</span>
                        {cust.email && <span className={styles.secondaryText}>{cust.email}</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.metricsCell}>
                        <span>{cust.visitCount} stays/visits</span>
                        <span className={styles.secondaryText}>
                          {cust.currency === 'INR' ? '₹' : '$'}{cust.lifetimeSpend.toLocaleString()} spend
                        </span>
                      </div>
                    </td>
                    <td>
                      {cust.lastVisitAt
                        ? new Date(cust.lastVisitAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[cust.status]}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(cust);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
      />

      <CustomerDrawer
        isOpen={!!selectedCustomer}
        onClose={closeDrawer}
        customer={selectedCustomer}
      />
    </div>
  );
}
