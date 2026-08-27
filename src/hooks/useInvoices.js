/**
 * @file useInvoices.js
 * @description Hook managing state for Invoices & Billing Ledger.
 * Integrates invoiceService API calls with fallback demo data.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import invoiceService from '@services/invoiceService';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceService.getAll();
      const resData = response?.data;
      const rawData = Array.isArray(resData)
        ? resData
        : Array.isArray(resData?.responses)
        ? resData.responses
        : Array.isArray(resData?.rows)
        ? resData.rows
        : Array.isArray(resData?.data)
        ? resData.data
        : [];
      if (rawData.length > 0) {
        const normalized = rawData.map((inv) => ({
          id: inv.id || inv.invoiceNumber || 'INV-000',
          type: inv.type || 'HOTEL_FOLIO',
          guestName: inv.guestName || inv.customerName || 'Guest',
          guestId: inv.guestId || inv.customerId || '',
          status: inv.invoiceStatus || inv.status || 'DRAFT',
          subTotal: inv.subTotal || 0,
          taxTotal: inv.taxTotal || 0,
          grandTotal: inv.grandTotal || 0,
          amountPaid: inv.amountPaid || 0,
          amountDue: inv.amountDue || 0,
          currency: inv.currency || 'INR',
          issueDate: inv.issueDate || inv.createdAt || '',
          dueDate: inv.dueDate || '',
          items: inv.items || [],
        }));
        setInvoices(normalized);
      } else {
        setInvoices(INITIAL_INVOICES);
      }
    } catch (err) {
      console.warn('Invoice API unavailable. Using fallback data.', err);
      setInvoices(INITIAL_INVOICES);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        inv.id.toLowerCase().includes(query) ||
        inv.guestName.toLowerCase().includes(query);

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

  const updateInvoiceStatus = async (id, newStatus) => {
    try {
      await invoiceService.update(id, { invoiceStatus: newStatus });
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
    } catch (err) {
      console.warn('Updating invoice status via API failed, updating locally.', err);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
    }
  };

  return {
    invoices: filteredInvoices,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    updateInvoiceStatus,
    refetch: fetchInvoices,
    totalInvoices: invoices.length,
  };
}
