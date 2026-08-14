/**
 * @file useInvoices.js
 * @description Hook managing local state for Invoices & Billing Ledger.
 * Provides dummy data conforming to the backend billing schema (backendMD/19-billing.md),
 * along with search and category filtering logic.
 */
import { useState, useMemo } from 'react';

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-0900',
    type: 'HOTEL_FOLIO',
    guestName: 'Ayesha Khan',
    guestId: 'cust-300',
    status: 'PAID',
    subTotal: 15000,
    taxTotal: 2700,
    grandTotal: 17700,
    amountPaid: 17700,
    amountDue: 0,
    currency: 'INR',
    issueDate: '2026-08-01T10:00:00.000Z',
    dueDate: '2026-08-01T12:00:00.000Z',
    items: [
      { description: 'Deluxe Room (2 nights)', quantity: 2, unitPrice: 6000, total: 12000 },
      { description: 'Room Service', quantity: 1, unitPrice: 3000, total: 3000 },
    ],
  },
  {
    id: 'INV-2026-0901',
    type: 'RESTAURANT_ORDER',
    guestName: 'Rohan Sharma',
    guestId: 'cust-301',
    status: 'ISSUED',
    subTotal: 3500,
    taxTotal: 175,
    grandTotal: 3675,
    amountPaid: 0,
    amountDue: 3675,
    currency: 'INR',
    issueDate: '2026-08-13T13:30:00.000Z',
    dueDate: '2026-08-13T14:00:00.000Z',
    items: [
      { description: 'Lunch Buffet', quantity: 2, unitPrice: 1500, total: 3000 },
      { description: 'Beverages', quantity: 2, unitPrice: 250, total: 500 },
    ],
  },
  {
    id: 'INV-2026-0902',
    type: 'HOTEL_FOLIO',
    guestName: 'TechNova Corp',
    guestId: 'cust-302',
    status: 'DRAFT',
    subTotal: 45000,
    taxTotal: 8100,
    grandTotal: 53100,
    amountPaid: 10000,
    amountDue: 43100,
    currency: 'INR',
    issueDate: '2026-08-12T09:00:00.000Z',
    dueDate: '2026-08-15T12:00:00.000Z',
    items: [
      { description: 'Conference Hall Booking', quantity: 1, unitPrice: 25000, total: 25000 },
      { description: 'Corporate Stay (5 Rooms)', quantity: 1, unitPrice: 20000, total: 20000 },
    ],
  },
  {
    id: 'INV-2026-0903',
    type: 'PURCHASE_INVOICE',
    guestName: 'Fresh Farms Supplier',
    guestId: 'sup-005',
    status: 'CANCELLED',
    subTotal: 12000,
    taxTotal: 600,
    grandTotal: 12600,
    amountPaid: 0,
    amountDue: 0,
    currency: 'INR',
    issueDate: '2026-08-10T11:00:00.000Z',
    dueDate: '2026-08-25T00:00:00.000Z',
    items: [
      { description: 'Vegetable Supply', quantity: 100, unitPrice: 120, total: 12000 },
    ],
  },
];

export default function useInvoices() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Search logic
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        inv.id.toLowerCase().includes(query) ||
        inv.guestName.toLowerCase().includes(query);

      // Category logic
      let matchesCategory = true;
      if (categoryFilter === 'Hotel Stays') {
        matchesCategory = inv.type === 'HOTEL_FOLIO';
      } else if (categoryFilter === 'Restaurant') {
        matchesCategory = inv.type === 'RESTAURANT_ORDER';
      } else if (categoryFilter === 'Purchases') {
        matchesCategory = inv.type === 'PURCHASE_INVOICE';
      }

      return matchesSearch && matchesCategory;
    });
  }, [invoices, searchQuery, categoryFilter]);

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
  };

  return {
    invoices: filteredInvoices,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    updateInvoiceStatus,
    totalInvoices: invoices.length,
  };
}
