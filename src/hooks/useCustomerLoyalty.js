/**
 * @file useCustomerLoyalty.js
 * @description Hook managing local state for the Customer Loyalty Program.
 * Provides dummy data conforming to the backend schema for loyalty transactions
 * (backendMD/15-customers.md).
 */
import { useState } from 'react';

const INITIAL_TRANSACTIONS = [
  {
    id: 'lt-9005',
    customerName: 'Ayesha Khan',
    type: 'EARN',
    points: 120,
    balanceAfter: 1240,
    reason: 'Invoice settled',
    reference: 'INV-2026-0900',
    createdAt: '2026-08-01T19:35:00.000Z',
  },
  {
    id: 'lt-9004',
    customerName: 'TechNova Corp',
    type: 'EARN',
    points: 850,
    balanceAfter: 8500,
    reason: 'Corporate Booking',
    reference: 'INV-2026-0850',
    createdAt: '2026-07-28T14:20:00.000Z',
  },
  {
    id: 'lt-9003',
    customerName: 'Rohan Sharma',
    type: 'REDEEM',
    points: -200,
    balanceAfter: 450,
    reason: 'Redeemed on bill',
    reference: 'INV-2026-0812',
    createdAt: '2026-07-20T20:10:00.000Z',
  },
  {
    id: 'lt-9002',
    customerName: 'Ayesha Khan',
    type: 'EARN',
    points: 300,
    balanceAfter: 1120,
    reason: 'Invoice settled',
    reference: 'INV-2026-0790',
    createdAt: '2026-07-15T18:00:00.000Z',
  },
  {
    id: 'lt-9001',
    customerName: 'Vikram Singh',
    type: 'ADJUST',
    points: -60,
    balanceAfter: 120,
    reason: 'Points expiry (12-month policy)',
    reference: 'SYSTEM',
    createdAt: '2026-07-01T00:00:00.000Z',
  },
];

export default function useCustomerLoyalty() {
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredTransactions = transactions.filter((tx) =>
    typeFilter === 'All' ? true : tx.type === typeFilter
  );

  return {
    transactions: filteredTransactions,
    typeFilter,
    setTypeFilter,
  };
}
