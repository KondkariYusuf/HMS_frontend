/**
 * @file useRestaurantOrders.js
 * @description Custom React hook managing live food orders queue, status tab filtering, and kitchen metrics.
 * @reference Frame: Redefined food order dashboard.jpeg
 */
import { useState, useMemo, useCallback } from 'react';

const INITIAL_ORDERS = [
  {
    id: 'order-4402',
    tableNumber: '3',
    orderNumber: '#4402',
    time: '12:45 PM',
    status: 'COMPLETED',
    items: [
      { name: 'Dahi', quantity: 1, price: 125 },
      { name: 'Dahl', quantity: 1, price: 230 },
    ],
    total: 355,
  },
  {
    id: 'order-4405',
    tableNumber: '12',
    orderNumber: '#4405',
    time: '01:05 PM',
    status: 'IN PROGRESS',
    items: [
      { name: 'Paneer Tikka', quantity: 2, price: 480 },
      { name: 'Garlic Naan', quantity: 3, price: 135 },
      { name: 'Butter Chicken', quantity: 1, price: 390 },
    ],
    total: 1005,
  },
  {
    id: 'order-4408',
    tableNumber: '8',
    orderNumber: '#4408',
    time: '01:12 PM',
    status: 'PENDING',
    items: [
      { name: 'Fruit Platter', quantity: 1, price: 210 },
      { name: 'Fresh Orange Juice', quantity: 2, price: 300 },
    ],
    total: 510,
  },
  {
    id: 'order-4410',
    tableNumber: '5',
    orderNumber: '#4410',
    time: '01:15 PM',
    status: 'COMPLETED',
    items: [
      { name: 'Club Sandwich', quantity: 2, price: 550 },
      { name: 'French Fries', quantity: 1, price: 120 },
    ],
    total: 670,
  },
  {
    id: 'order-4412',
    tableNumber: '1',
    orderNumber: '#4412',
    time: '01:20 PM',
    status: 'PENDING',
    items: [
      { name: 'Veg Biryani', quantity: 1, price: 320 },
      { name: 'Raita', quantity: 1, price: 80 },
      { name: 'Cooler Mint', quantity: 1, price: 150 },
    ],
    total: 550,
  },
  {
    id: 'order-4415',
    tableNumber: '15',
    orderNumber: '#4415',
    time: '01:30 PM',
    status: 'IN PROGRESS',
    items: [
      { name: 'Coffee Latte', quantity: 4, price: 640 },
      { name: 'Croissants', quantity: 2, price: 280 },
    ],
    total: 920,
  },
];

const FILTER_STATUSES = ['All', 'Pending', 'In Progress', 'Completed'];

export function useRestaurantOrders() {
  const [orders] = useState(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders;
    return orders.filter(
      (order) =>
        order.status.toUpperCase() === activeFilter.toUpperCase()
    );
  }, [orders, activeFilter]);

  const refreshOrders = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }, []);

  return {
    orders: filteredOrders,
    allOrders: orders,
    activeFilter,
    filterStatuses: FILTER_STATUSES,
    isRefreshing,
    setActiveFilter,
    refreshOrders,
  };
}

export default useRestaurantOrders;
