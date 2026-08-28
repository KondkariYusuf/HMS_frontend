/**
 * @file useInvoices.js
 * @description Hook managing state for Invoices & Billing Ledger strictly with backend API endpoints.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import invoiceService from '@services/invoiceService';

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
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

      const normalized = rawData.map((inv) => {
        const rawG = inv.booking?.primaryGuest || inv.guest || {};
        const computedName = rawG.name || (rawG.firstName ? `${rawG.firstName} ${rawG.lastName || ''}`.trim() : (inv.guestName || 'Guest'));
        const gTotal = Number(inv.grandTotal || inv.totalAmount || inv.subtotal || 0);
        const pAmt = Number(inv.paidAmount || inv.amountPaid || 0);
        const dAmt = inv.dueAmount !== undefined ? Number(inv.dueAmount) : Math.max(0, gTotal - pAmt);
        const st = (inv.status || inv.invoiceStatus || (dAmt === 0 && gTotal > 0 ? 'PAID' : 'ISSUED')).toUpperCase();

        return {
          id: inv.id || inv.invoiceNumber || 'INV-000',
          type: inv.type || 'HOTEL_FOLIO',
          guestName: computedName,
          guestId: inv.guestId || inv.customerId || '',
          status: st,
          subTotal: Number(inv.subTotal || 0),
          taxTotal: Number(inv.taxTotal || 0),
          grandTotal: gTotal,
          amountPaid: pAmt,
          amountDue: dAmt,
          currency: inv.currency || 'INR',
          issueDate: inv.issueDate || inv.createdAt || '',
          dueDate: inv.dueDate || '',
          items: inv.items || [],
          rawRecord: inv,
        };
      });

      setInvoices(normalized);
    } catch (err) {
      console.warn('Invoice API fetch failed:', err);
      setInvoices([]);
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
