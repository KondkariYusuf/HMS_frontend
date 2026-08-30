/**
 * @file Restaurant/Menu/Index.jsx
 * @description Refined Food Menu Management Dashboard.
 * @reference Frame: Redefined food Menu Management Dashboard.jpeg
 */

import React from 'react';
import { Link } from 'react-router-dom';
import useRestaurantMenu from '@hooks/useRestaurantMenu';
import styles from './Index.module.css';

export default function RestaurantMenuPage() {
  const {
    items,
    menuUrl,
    copied,
    saveSuccess,
    categoryOptions,
    copyMenuUrl,
    updateItem,
    deleteItem,
    addItem,
    saveChanges,
  } = useRestaurantMenu();

  return (
    <div className={styles.pageContainer} data-testid="restaurant-menu-page">
      {/* Header Section */}
      <header className={styles.headerRow}>
        <div>
          <h1 className={styles.headerTitle}>Food Menu Management</h1>
          <p className={styles.headerSubtitle}>
            Create and manage your room service menu and guest dining experience.
          </p>
        </div>

        <div className={styles.metaBadge}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 10.58 0A4 4 0 0 1 18 13.87" />
            <path d="M3 18h18" />
            <path d="M12 18v3" />
          </svg>

          <span>
            {items.length * 8} menu items · {categoryOptions.length} categories
          </span>
        </div>
      </header>

      {/* Food Ordering URL Banner Card */}
      <section className={`${styles.card} ${styles.urlCard}`}>
        <div className={styles.iconCircle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <div className={styles.urlContent}>
          <span className={styles.urlLabel}>Food Ordering URL</span>

          <p className={styles.urlSubtext}>
            Guests can access this menu directly from their room via this unique identifier.
          </p>

          <div className={styles.urlInputGroup}>
            <input
              type="text"
              readOnly
              value={menuUrl}
              className={styles.urlInput}
              aria-label="Food Ordering URL"
            />

            <button
              type="button"
              className={styles.copyButton}
              onClick={copyMenuUrl}
              aria-label="Copy Food Ordering URL"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>

              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Menu Items Data Table Section */}
      <section className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.menuTable}>
            <thead>
              <tr>
                <th scope="col" style={{ width: '30%' }}>
                  Name
                </th>

                <th scope="col" style={{ width: '15%' }}>
                  Price (₹)
                </th>

                <th scope="col" style={{ width: '20%' }}>
                  Category
                </th>

                <th scope="col" style={{ width: '28%' }}>
                  Description
                </th>

                <th
                  scope="col"
                  style={{ width: '7%', textAlign: 'center' }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
                  {/* Name */}
                  <td className={styles.tableCell}>
                    <input
                      type="text"
                      className={styles.cellInput}
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, 'name', e.target.value)
                      }
                      aria-label={`Item Name for ${item.name}`}
                    />
                  </td>

                  {/* Price */}
                  <td className={styles.tableCell}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.currencySymbol}>₹</span>

                      <input
                        type="number"
                        className={styles.priceInput}
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            'price',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        aria-label={`Price for ${item.name}`}
                      />
                    </div>
                  </td>

                  {/* Category */}
                  <td className={styles.tableCell}>
                    <select
                      className={styles.cellSelect}
                      value={item.category}
                      onChange={(e) =>
                        updateItem(item.id, 'category', e.target.value)
                      }
                      aria-label={`Category for ${item.name}`}
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Description */}
                  <td className={styles.tableCell}>
                    <input
                      type="text"
                      className={styles.cellInput}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'description',
                          e.target.value
                        )
                      }
                      aria-label={`Description for ${item.name}`}
                    />
                  </td>

                  {/* Delete */}
                  <td
                    className={styles.tableCell}
                    style={{ textAlign: 'center' }}
                  >
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => deleteItem(item.id)}
                      title="Delete Item"
                      aria-label={`Delete ${item.name}`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Controls */}
        <div className={styles.tableActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={addItem}
            aria-label="Add New Menu Item"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>

            <span>Add New Item</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}
          >
            {saveSuccess && (
              <span className={styles.toastSuccess}>
                ✓ Menu changes saved successfully!
              </span>
            )}

            <button
              type="button"
              className={styles.saveButton}
              onClick={saveChanges}
              aria-label="Save Menu Changes"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>

              <span>Save Menu Changes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Metadata Info Cards Grid */}
      <div className={styles.bottomGrid}>
        {/* Service Hours Card */}
        <section className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <h3 className={styles.infoCardTitle}>Service Hours</h3>

            <svg
              className={styles.infoIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div className={styles.hoursList}>
            <div className={styles.hoursRow}>
              <span className={styles.hoursLabel}>Breakfast</span>
              <span className={styles.hoursTime}>
                07:00 AM - 11:00 AM
              </span>
            </div>

            <div className={styles.hoursRow}>
              <span className={styles.hoursLabel}>All Day Dining</span>
              <span className={styles.hoursTime}>
                12:00 PM - 11:00 PM
              </span>
            </div>
          </div>
        </section>

        {/* Dining Security Card */}
        <section
          className={`${styles.infoCard} ${styles.securityCard}`}
        >
          <div className={styles.infoCardHeader}>
            <h3 className={styles.infoCardTitle}>
              Dining Security
            </h3>

            <svg
              className={styles.infoIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <p className={styles.infoCardText}>
            Account security and menu access protocols are managed
            centrally to ensure guest privacy.
          </p>

          {/* Correct Restaurant Security Navigation */}
          <Link
            to="/restaurant/security"
            className={styles.infoLink}
            data-testid="dining-security-settings-link"
          >
            <span>View Security Settings</span>

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  );
}