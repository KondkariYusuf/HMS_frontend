/**
 * @file useCustomers.js
 * @description Hook managing local state for the Customer CRM Directory.
 * Provides dummy data conforming to the backend customer schema (backendMD/15-customers.md),
 * along with search, filtering, and customer creation logic.
 */
import { useState, useMemo } from 'react';

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-300',
    name: 'Ayesha Khan',
    phone: '+91 98123 45678',
    email: 'ayesha@example.com',
    type: 'VIP',
    loyaltyPoints: 1240,
    visitCount: 18,
    lifetimeSpend: 452000,
    currency: 'INR',
    lastVisitAt: '2026-08-01T19:30:00.000Z',
    createdAt: '2025-11-02T10:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'cust-301',
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    email: 'rohan.s@example.com',
    type: 'REGULAR',
    loyaltyPoints: 450,
    visitCount: 6,
    lifetimeSpend: 125000,
    currency: 'INR',
    lastVisitAt: '2026-08-10T14:15:00.000Z',
    createdAt: '2026-01-15T09:20:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'cust-302',
    name: 'TechNova Corp',
    phone: '+91 80 4123 4567',
    email: 'admin@technovacorp.in',
    type: 'CORPORATE',
    loyaltyPoints: 8500,
    visitCount: 42,
    lifetimeSpend: 1560000,
    currency: 'INR',
    lastVisitAt: '2026-08-12T09:00:00.000Z',
    createdAt: '2024-06-10T11:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'cust-303',
    name: 'Meera Desai',
    phone: '+91 99887 76655',
    email: 'meera.d@example.com',
    type: 'WALK_IN',
    loyaltyPoints: 50,
    visitCount: 1,
    lifetimeSpend: 8500,
    currency: 'INR',
    lastVisitAt: '2026-08-13T13:45:00.000Z',
    createdAt: '2026-08-13T12:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'cust-304',
    name: 'Vikram Singh',
    phone: '+91 91234 56789',
    email: 'vikram.s@example.com',
    type: 'REGULAR',
    loyaltyPoints: 120,
    visitCount: 3,
    lifetimeSpend: 45000,
    currency: 'INR',
    lastVisitAt: '2026-07-25T18:30:00.000Z',
    createdAt: '2026-03-22T15:10:00.000Z',
    status: 'INACTIVE',
  },
];

export default function useCustomers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // All, VIP, REGULAR, CORPORATE, WALK_IN

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query);

      // 2. Type Filter
      const matchesType =
        typeFilter === 'All' ||
        customer.type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, typeFilter]);

  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `cust-${Math.floor(Math.random() * 900) + 100}`,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || '',
      type: customerData.type,
      loyaltyPoints: 0,
      visitCount: 0,
      lifetimeSpend: 0,
      currency: 'INR',
      lastVisitAt: null,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  return {
    customers: filteredCustomers,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    addCustomer,
    totalCustomers: customers.length,
  };
}
