/**
 * @file DataTable.jsx
 * @description Standardized data table component rendering rich guest/reservation rows with avatar, tag badges, status, and action buttons.
 * @figmaFrame Figma frame: Shared - Data Table
 *
 * @param {Object} props
 * @param {Array<{key: string, title: string}>} [props.columns] - Column definitions
 * @param {Array<Object>} [props.data] - Row data objects
 * @param {Function} [props.onActionClick] - Row action button handler
 */
import React from 'react';
import Avatar from '@components/Avatar/Avatar';
import Badge from '@components/Badge/Badge';
import styles from './DataTable.module.css';

export default function DataTable({
  columns = [
    { key: 'guest', title: 'Guest' },
    { key: 'room', title: 'Room / Type' },
    { key: 'dates', title: 'Check In / Out' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' },
  ],
  data = [
    {
      id: 'res-101',
      guest: { name: 'Eleanor Vance', tag: 'VIP Member' },
      room: 'Room 304 (Deluxe Suite)',
      dates: 'Aug 10 - Aug 15',
      status: 'in-house',
    },
    {
      id: 'res-102',
      guest: { name: 'Marcus Brody', tag: 'Standard' },
      room: 'Room 108 (Single King)',
      dates: 'Aug 11 - Aug 14',
      status: 'arriving',
    },
  ],
  onActionClick,
}) {
  return (
    <div className={styles.tableWrapper} data-testid="data-table">
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className={styles.tr}>
              {columns.map((col) => {
                if (col.key === 'guest') {
                  return (
                    <td key={col.key} className={styles.td}>
                      <div className={styles.guestCell}>
                        <Avatar name={row.guest?.name} size="sm" />
                        <div className={styles.guestInfo}>
                          <span className={styles.guestName}>{row.guest?.name}</span>
                          {row.guest?.tag && (
                            <span className={styles.guestTag}>{row.guest?.tag}</span>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                }
                if (col.key === 'status') {
                  return (
                    <td key={col.key} className={styles.td}>
                      <Badge variant={row.status}>{row.status}</Badge>
                    </td>
                  );
                }
                if (col.key === 'actions') {
                  return (
                    <td key={col.key} className={styles.td}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onActionClick && onActionClick(row)}
                        aria-label="Actions"
                      >
                        •••
                      </button>
                    </td>
                  );
                }
                return (
                  <td key={col.key} className={styles.td}>
                    {row[col.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
