/**
 * @file Customers/Loyalty/Index.jsx
 * @description Customer loyalty points, rewards tier, and redemption rules.
 * @figmaFrame Figma frame: Customers - Loyalty Program (15-customers.md)
 */
import React, { useState } from 'react';
import useCustomerLoyalty from '@hooks/useCustomerLoyalty';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import Toast from '@components/Toast/Toast';
import styles from './Index.module.css';

export default function CustomersLoyaltyPage() {
  const { transactions, typeFilter, setTypeFilter } = useCustomerLoyalty();

  const FILTER_TYPES = ['All', 'EARN', 'REDEEM', 'ADJUST'];

  // Configure Reward Rules Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [ruleConfig, setRuleConfig] = useState({
    earnPointsPer100: '5',
    pointRedeemValue: '0.50',
    minRedeemPoints: '500',
    expiryMonths: '12',
    autoTierUpgrade: true,
  });

  const handleOpenConfig = () => {
    setIsModalOpen(true);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setToast({
        message: 'Reward rules configuration updated successfully!',
        type: 'success',
      });
    }, 400);
  };

  return (
    <div className={styles.page} data-testid="customers-loyalty-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Loyalty Program & Tiers</h1>
          <p className={styles.subtitle}>
            Manage reward points, redemptions, and adjustments across all guests.
          </p>
        </div>
        <button className={styles.configBtn} onClick={handleOpenConfig}>
          Configure Reward Rules
        </button>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>⭐</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Total Points Issued</span>
            <span className={styles.kpiValue}>24,500</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>🎁</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Points Redeemed</span>
            <span className={styles.kpiValue}>8,200</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>📉</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Points Expired</span>
            <span className={styles.kpiValue}>1,150</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBox}>💰</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>Active Liability</span>
            <span className={styles.kpiValue}>15,150</span>
          </div>
        </div>
      </section>

      <section className={styles.ledgerSection}>
        <div className={styles.ledgerHeader}>
          <h2 className={styles.ledgerTitle}>Transaction Ledger</h2>
          <div className={styles.filters}>
            {FILTER_TYPES.map((type) => (
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
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Balance After</th>
                  <th>Reason & Reference</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className={styles.tableRow}>
                      <td className={styles.txId}>{tx.id}</td>
                      <td className={styles.customerName}>{tx.customerName}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${styles[tx.type]}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.points} ${tx.points > 0 ? styles.positivePoints : styles.negativePoints}`}
                        >
                          {tx.points > 0 ? '+' : ''}{tx.points}
                        </span>
                      </td>
                      <td className={styles.balance}>{tx.balanceAfter}</td>
                      <td>
                        <div className={styles.reasonCell}>
                          <span>{tx.reason}</span>
                          <span className={styles.referenceText}>{tx.reference}</span>
                        </div>
                      </td>
                      <td>
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.emptyState}>
                      No loyalty transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Configure Reward Rules Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Configure Loyalty Reward Rules"
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSaveConfig}
            >
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveConfig} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Earn Ratio (Points per ₹100 spent)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className={styles.formInput}
              value={ruleConfig.earnPointsPer100}
              onChange={(e) =>
                setRuleConfig({ ...ruleConfig, earnPointsPer100: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Redemption Value per Point (₹)
            </label>
            <input
              type="number"
              step="0.05"
              min="0.05"
              className={styles.formInput}
              value={ruleConfig.pointRedeemValue}
              onChange={(e) =>
                setRuleConfig({ ...ruleConfig, pointRedeemValue: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Minimum Points Required for Redemption
            </label>
            <input
              type="number"
              step="50"
              min="0"
              className={styles.formInput}
              value={ruleConfig.minRedeemPoints}
              onChange={(e) =>
                setRuleConfig({ ...ruleConfig, minRedeemPoints: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Points Expiry Duration</label>
            <select
              className={styles.formSelect}
              value={ruleConfig.expiryMonths}
              onChange={(e) =>
                setRuleConfig({ ...ruleConfig, expiryMonths: e.target.value })
              }
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="0">Never Expire</option>
            </select>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={ruleConfig.autoTierUpgrade}
                onChange={(e) =>
                  setRuleConfig({ ...ruleConfig, autoTierUpgrade: e.target.checked })
                }
              />
              Enable Automatic Guest Tier Upgrades on Milestone Reach
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}

