/**
 * @file useInvoices.js
 * @description Hook managing state for Invoices & Billing Ledger strictly with backend API endpoints.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import invoiceService from '@services/invoiceService';
import paymentService from '@services/paymentService';
import bookingService from '@services/bookingService';

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
      const [invRes, payRes, bookRes] = await Promise.allSettled([
        invoiceService.getAll({ limit: 1000, pageSize: 1000, size: 1000 }),
        paymentService.getAll({ limit: 1000, pageSize: 1000, size: 1000 }),
        bookingService.getAll({ limit: 1000, pageSize: 1000, size: 1000 }),
      ]);

      const getRows = (res) => {
        if (res.status !== 'fulfilled' || !res.value?.data) return [];
        const d = res.value.data;
        return Array.isArray(d)
          ? d
          : Array.isArray(d.responses)
          ? d.responses
          : Array.isArray(d.rows)
          ? d.rows
          : Array.isArray(d.data)
          ? d.data
          : [];
      };

      const rawInvoices = getRows(invRes);
      const rawPayments = getRows(payRes);
      const rawBookings = getRows(bookRes);

      // Build live payment map indexed by bookingId and invoiceId
      const paymentsByBookingId = {};
      const paymentsByInvoiceId = {};

      rawPayments.forEach((p) => {
        const st = (p.status || p.paymentStatus || '').toLowerCase();
        if (st === 'failed' || st === 'refunded' || st === 'void' || st === 'voided') return;

        const amt = Number(p.amount || 0);
        if (amt <= 0) return;

        const bId = p.bookingId || p.booking?.id;
        if (bId) {
          const key = String(bId);
          paymentsByBookingId[key] = (paymentsByBookingId[key] || 0) + amt;
        }

        const iId = p.invoiceId || p.invoice?.id || p.referenceId;
        if (iId) {
          const key = String(iId);
          paymentsByInvoiceId[key] = (paymentsByInvoiceId[key] || 0) + amt;
        }
      });

      const processedKeys = new Set();
      const normalized = [];

      // 1. Process explicit invoices returned by invoiceService
      rawInvoices.forEach((inv) => {
        const invId = String(inv.id || inv.invoiceNumber || 'INV-000');
        processedKeys.add(invId.toLowerCase());
        if (inv.bookingId) processedKeys.add(String(inv.bookingId).toLowerCase());

        const rawG = inv.booking?.primaryGuest || inv.guest || {};
        const computedName =
          rawG.name ||
          (rawG.firstName ? `${rawG.firstName} ${rawG.lastName || ''}`.trim() : (inv.guestName || 'Guest'));

        const gTotal = Number(inv.grandTotal || inv.totalAmount || inv.subtotal || 0);

        // Sum live payment amounts from payments table
        const livePayFromInvoice = paymentsByInvoiceId[invId] || 0;
        const livePayFromBooking = inv.bookingId ? (paymentsByBookingId[String(inv.bookingId)] || 0) : 0;
        const totalLivePayments = Math.max(livePayFromInvoice, livePayFromBooking);

        const pAmt = Math.max(
          Number(inv.paidAmount || inv.amountPaid || 0),
          totalLivePayments
        );

        const dAmt =
          inv.dueAmount !== undefined && totalLivePayments === 0
            ? Number(inv.dueAmount)
            : Math.max(0, gTotal - pAmt);

        const isPaid = (dAmt <= 0.01 && gTotal > 0) || (inv.status || '').toUpperCase() === 'PAID';
        const st = isPaid
          ? 'PAID'
          : (inv.status || inv.invoiceStatus || (pAmt > 0 ? 'PARTIAL' : 'ISSUED')).toUpperCase();

        normalized.push({
          id: invId,
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
        });
      });

      // 2. Synthesize invoices for real backend bookings with payments or charges
      rawBookings.forEach((b) => {
        const bId = String(b.id || '');
        const bRef = b.bookingRef || bId;
        const invId = `#INV-${bRef}`;

        if (processedKeys.has(bId.toLowerCase()) || processedKeys.has(invId.toLowerCase())) {
          return;
        }

        const rawG = b.primaryGuest || b.guest || {};
        const computedName =
          rawG.name ||
          (rawG.firstName ? `${rawG.firstName} ${rawG.lastName || ''}`.trim() : (b.guestName || 'Guest'));

        const folio = b.bookingFolio || b.rawRecord?.bookingFolio || {};
        const gTotal =
          Number(folio.totalCharges || 0) ||
          Number(b.grandTotal || b.subtotal || b.totalAmount || b.amount || 0);

        const livePayFromBooking = paymentsByBookingId[bId] || 0;
        const folioPayments = Number(folio.totalPayments || 0);
        const bookingPaidAmt = Number(b.paidAmount || 0);

        const pAmt = Math.max(livePayFromBooking, folioPayments, bookingPaidAmt);
        const dAmt = Math.max(0, gTotal - pAmt);

        const isPaid = (dAmt <= 0.01 && gTotal > 0) || (b.status || '').toUpperCase() === 'CHECKED_OUT';
        const st = isPaid
          ? 'PAID'
          : b.status === 'CANCELLED'
          ? 'CANCELLED'
          : pAmt > 0
          ? 'PARTIAL'
          : 'ISSUED';

        normalized.push({
          id: invId,
          bookingId: bId,
          type: 'HOTEL_FOLIO',
          guestName: computedName,
          guestId: b.primaryGuestId || rawG.id || '',
          status: st,
          subTotal: gTotal,
          taxTotal: 0,
          grandTotal: gTotal,
          amountPaid: pAmt,
          amountDue: dAmt,
          currency: b.currencyCode || 'INR',
          issueDate: b.checkIn || b.createdAt || new Date().toISOString(),
          dueDate: b.checkOut || '',
          items: [],
          rawRecord: b,
        });
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
