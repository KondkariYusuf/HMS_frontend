/**
 * @file useRestaurantAnalytics.js
 * @description Custom React hook managing food orders analytics metrics, chart details, performance rankings, and transactions.
 * @reference Frame: Professional food order Analytics dashboard.jpeg
 */
import { useState, useMemo, useCallback } from 'react';

const INITIAL_TRANSACTIONS = [
  {
    id: '#ORD-8291',
    location: 'Room 402 (Standard)',
    items: '1x Butter Chicken, 2x Naan',
    amount: 34.5,
    status: 'DELIVERED',
    time: '12:45 PM',
  },
  {
    id: '#ORD-8292',
    location: 'Poolside Cabana 4',
    items: '2x Fruit Platter, 1x Mocktail',
    amount: 28.0,
    status: 'IN KITCHEN',
    time: '1:02 PM',
  },
  {
    id: '#ORD-8293',
    location: 'Room 1102 (Suite)',
    items: '1x Salmon Steak, 1x White Wine',
    amount: 56.2,
    status: 'DELIVERED',
    time: '1:15 PM',
  },
  {
    id: '#ORD-8294',
    location: 'Room 305 (Premium)',
    items: '3x Veg Burgers, 1x Coke',
    amount: 42.0,
    status: 'PENDING',
    time: '1:30 PM',
  },
];

export function useRestaurantAnalytics() {
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (tx) =>
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.items.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const handleExportCSV = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.alert('Exporting Analytics Data to CSV file...');
    }
  }, []);

  return {
    transactions: filteredTransactions,
    searchQuery,
    setSearchQuery,
    handleExportCSV,
  };
}

export default useRestaurantAnalytics;
