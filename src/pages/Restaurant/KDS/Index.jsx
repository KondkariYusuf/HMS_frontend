/**
 * @file Restaurant/KDS/Index.jsx
 * @description Kitchen Display System (KDS) & KOT order preparation monitor.
 * @reference Figma frame: Restaurant - Kitchen Display (14-orders-kitchen.md)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@components/Badge/Badge';
import Toast from '@components/Toast/Toast';
import { KDS_STATIONS, INITIAL_KITCHEN_ORDERS } from './mockKdsData';
import styles from './Index.module.css';

export default function RestaurantKDSPage() {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [selectedStation, setSelectedStation] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ACTIVE');
  const [toast, setToast] = useState(null);

  // Load Initial KDS Orders + Live POS Fired Orders from localStorage
  useEffect(() => {
    let combined = [...INITIAL_KITCHEN_ORDERS];

    try {
      const posOrdersJson = localStorage.getItem('syncstays_pos_orders');

      if (posOrdersJson) {
        const posOrders = JSON.parse(posOrdersJson);

        const mappedPosKots = posOrders.map((po) => ({
          id: po.id,
          kotNumber: po.kotNumber || `KOT-${po.id.slice(-4)}-1`,
          orderId: po.id,
          orderNumber: po.orderNumber,
          tableLabel: po.tableLabel || 'Counter',
          orderType: po.orderType || 'DINE_IN',
          station: 'HOT_KITCHEN',
          status: 'QUEUED',
          priority: po.guestCount > 4 ? 'RUSH' : 'NORMAL',
          elapsedSeconds: Math.floor(
            (Date.now() - new Date(po.firedAt || Date.now()).getTime()) / 1000
          ),
          firedAt: po.firedAt || new Date().toISOString(),
          items: po.items.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            note: i.note || '',
            status: i.kitchenStatus || 'QUEUED',
            modifiers: (i.modifiers || []).map((m) => m.name),
          })),
        }));

        // Deduplicate
        const existingKotNumbers = new Set(
          combined.map((k) => k.kotNumber)
        );

        mappedPosKots.forEach((mp) => {
          if (!existingKotNumbers.has(mp.kotNumber)) {
            combined.unshift(mp);
          }
        });
      }
    } catch (e) {
      console.warn('Error reading syncstays_pos_orders:', e);
    }

    setKitchenOrders(combined);
  }, []);

  // Update timer every second
  useEffect(() => {
    const timer = window.setInterval(() => {
      setKitchenOrders((prev) =>
        prev.map((kot) => ({
          ...kot,
          elapsedSeconds: kot.elapsedSeconds + 1,
        }))
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Filter KOT Tickets
  const filteredOrders = useMemo(() => {
    return kitchenOrders.filter((kot) => {
      const matchesStation =
        selectedStation === 'ALL' || kot.station === selectedStation;

      let matchesStatus = true;

      if (selectedStatusFilter === 'ACTIVE') {
        matchesStatus =
          kot.status === 'QUEUED' || kot.status === 'PREPARING';
      } else if (selectedStatusFilter === 'READY') {
        matchesStatus = kot.status === 'READY';
      } else if (selectedStatusFilter === 'SERVED') {
        matchesStatus = kot.status === 'SERVED';
      }

      return matchesStation && matchesStatus;
    });
  }, [kitchenOrders, selectedStation, selectedStatusFilter]);

  // Update Whole KOT Status
  const handleUpdateKotStatus = (kotId, newStatus) => {
    setKitchenOrders((prev) => {
      const updated = prev.map((kot) => {
        if (kot.id === kotId) {
          const updatedItems = kot.items.map((item) => ({
            ...item,
            status: newStatus,
          }));

          return {
            ...kot,
            status: newStatus,
            items: updatedItems,
          };
        }

        return kot;
      });

      try {
        const targetKot = updated.find((k) => k.id === kotId);

        showToast(
          `KOT #${targetKot?.kotNumber} status updated to ${newStatus}`,
          'info'
        );
      } catch (e) {
        console.warn(e);
      }

      return updated;
    });
  };

  // Update Individual Item Status
  const handleUpdateItemStatus = (kotId, itemId, newStatus) => {
    setKitchenOrders((prev) => {
      return prev.map((kot) => {
        if (kot.id === kotId) {
          const updatedItems = kot.items.map((i) =>
            i.id === itemId ? { ...i, status: newStatus } : i
          );

          // Check if all items ready or served
          const allReady = updatedItems.every(
            (i) => i.status === 'READY' || i.status === 'SERVED'
          );

          const allServed = updatedItems.every(
            (i) => i.status === 'SERVED'
          );

          let overallKotStatus = kot.status;

          if (allServed) {
            overallKotStatus = 'SERVED';
          } else if (allReady) {
            overallKotStatus = 'READY';
          } else if (
            updatedItems.some((i) => i.status === 'PREPARING')
          ) {
            overallKotStatus = 'PREPARING';
          }

          return {
            ...kot,
            status: overallKotStatus,
            items: updatedItems,
          };
        }

        return kot;
      });
    });
  };

  // Format Timer Display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const getTimerClass = (seconds, priority) => {
    if (priority === 'RUSH' || seconds > 900) {
      return styles.timerRed;
    }

    if (seconds > 300) {
      return styles.timerAmber;
    }

    return styles.timerGreen;
  };

  return (
    <div className={styles.page} data-testid="restaurant-kds-page">
      {/* Toast Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* KDS Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <h1>Kitchen Display System (KDS)</h1>
          <p>
            Live Kitchen Orders (KOT) Preparation & Station Dispatch Monitor
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="vip">Live KDS Feed Active</Badge>

          <Link
            to="/restaurant/pos"
            className={styles.posNavLink}
            data-testid="link-to-pos"
          >
            ← Back to POS Terminal
          </Link>
        </div>
      </header>

      {/* Station & Status Filter Bar */}
      <div className={styles.controlsCard}>
        <div className={styles.stationTabs}>
          {KDS_STATIONS.map((st) => (
            <button
              key={st.id}
              className={`${styles.stationBtn} ${selectedStation === st.code
                  ? styles.stationBtnActive
                  : ''
                }`}
              onClick={() => setSelectedStation(st.code)}
            >
              {st.name}
            </button>
          ))}
        </div>

        <div className={styles.statusFilterGroup}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}
          >
            Filter Status:
          </span>

          {[
            { id: 'ACTIVE', label: 'Active Prep' },
            { id: 'READY', label: 'Ready to Serve' },
            { id: 'SERVED', label: 'Served History' },
            { id: 'ALL', label: 'All Tickets' },
          ].map((f) => (
            <button
              key={f.id}
              className={`${styles.statusPill} ${selectedStatusFilter === f.id
                  ? styles.statusPillActive
                  : ''
                }`}
              onClick={() => setSelectedStatusFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KOT Ticket Grid */}
      <div className={styles.ticketGrid}>
        {filteredOrders.map((kot) => {
          let cardClass = styles.ticketCardQueued;

          if (kot.status === 'PREPARING') {
            cardClass = styles.ticketCardPreparing;
          }

          if (kot.status === 'READY') {
            cardClass = styles.ticketCardReady;
          }

          if (kot.status === 'SERVED') {
            cardClass = styles.ticketCardServed;
          }

          return (
            <div
              key={kot.id}
              className={`${styles.ticketCard} ${cardClass}`}
            >
              {/* Header */}
              <div className={styles.ticketHeader}>
                <div>
                  <h3 className={styles.kotTitle}>
                    {kot.kotNumber}

                    {kot.priority === 'RUSH' && (
                      <span className={styles.rushBadge}>RUSH</span>
                    )}
                  </h3>

                  <div className={styles.tableTag}>
                    📍 {kot.tableLabel} ({kot.orderType})
                  </div>
                </div>

                <div
                  className={`${styles.timerBadge} ${getTimerClass(
                    kot.elapsedSeconds,
                    kot.priority
                  )}`}
                >
                  ⏱️ {formatTimer(kot.elapsedSeconds)}
                </div>
              </div>

              {/* Items Checklist */}
              <div className={styles.itemList}>
                {kot.items.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemRowTop}>
                      <span className={styles.itemQtyName}>
                        <span className={styles.itemQty}>
                          {item.quantity}x
                        </span>

                        {item.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus =
                            item.status === 'QUEUED'
                              ? 'PREPARING'
                              : item.status === 'PREPARING'
                                ? 'READY'
                                : 'SERVED';

                          handleUpdateItemStatus(
                            kot.id,
                            item.id,
                            nextStatus
                          );
                        }}
                        className={`${styles.itemStatusPill} ${item.status === 'QUEUED'
                            ? styles.statusQueued
                            : item.status === 'PREPARING'
                              ? styles.statusPreparing
                              : item.status === 'READY'
                                ? styles.statusReady
                                : styles.statusServed
                          }`}
                      >
                        {item.status} ▶
                      </button>
                    </div>

                    {item.modifiers &&
                      item.modifiers.length > 0 && (
                        <div className={styles.itemModifiers}>
                          Options: {item.modifiers.join(', ')}
                        </div>
                      )}

                    {item.note && (
                      <div className={styles.itemNote}>
                        Note: &quot;{item.note}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className={styles.ticketFooter}>
                {kot.status === 'QUEUED' && (
                  <button
                    className={styles.prepBtn}
                    onClick={() =>
                      handleUpdateKotStatus(
                        kot.id,
                        'PREPARING'
                      )
                    }
                  >
                    ▶ Start Prep
                  </button>
                )}

                {kot.status === 'PREPARING' && (
                  <button
                    className={styles.readyBtn}
                    onClick={() =>
                      handleUpdateKotStatus(
                        kot.id,
                        'READY'
                      )
                    }
                  >
                    ✓ Mark All Ready
                  </button>
                )}

                {kot.status === 'READY' && (
                  <button
                    className={styles.serveBtn}
                    onClick={() =>
                      handleUpdateKotStatus(
                        kot.id,
                        'SERVED'
                      )
                    }
                  >
                    🍽️ Mark Served
                  </button>
                )}

                {kot.status === 'SERVED' && (
                  <div className={styles.completedTag}>
                    ✓ Order Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No Kitchen Tickets</h3>

            <p>
              There are no active orders matching station &quot;
              {selectedStation}&quot; and status &quot;
              {selectedStatusFilter}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}