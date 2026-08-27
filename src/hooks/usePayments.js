/**
 * @file usePayments.js
 * @description Hook managing state for Payment Processing Log.
 * Integrates paymentService API calls with fallback demo data.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import paymentService from '@services/paymentService';

const INITIAL_PAYMENTS = [
  {
    id: 'pay-7701',
    invoiceId: 'INV-2026-0900',
    guestName: 'Ayesha Khan',
    amount: 17700,
    currency: 'INR',
    method: 'CREDIT_CARD',
    utr: 'UTR-CRD-00918239',
    status: 'COMPLETED',
    date: '2026-08-01T12:05:00.000Z',
  },
  {
    id: 'pay-7702',
    invoiceId: 'INV-2026-0902',
    guestName: 'TechNova Corp',
    amount: 10000,
    currency: 'INR',
    method: 'BANK_TRANSFER',
    utr: 'UTR-BNK-99882211',
    status: 'COMPLETED',
    date: '2026-08-12T09:30:00.000Z',
  },
  {
    id: 'pay-7703',
    invoiceId: 'INV-2026-0902',
    guestName: 'TechNova Corp',
    amount: 43100,
    currency: 'INR',
    method: 'UPI',
    utr: 'UTR-UPI-55667788',
    status: 'PENDING',
    date: '2026-08-15T10:15:00.000Z',
  },
  {
    id: 'pay-7704',
    invoiceId: 'INV-2026-0901',
    guestName: 'Rohan Sharma',
    amount: 3675,
    currency: 'INR',
    method: 'CASH',
    utr: 'CASH-RCPT-0045',
    status: 'REFUNDED',
    date: '2026-08-13T13:45:00.000Z',
  },
];

export default function usePayments() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getAll();
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
        const normalized = rawData.map((p) => ({
          id: p.id || 'pay-000',
          invoiceId: p.invoiceId || p.referenceId || '',
          guestName: p.guestName || p.payerName || 'Guest',
          amount: p.amount || 0,
          currency: p.currency || 'INR',
          method: p.paymentMethod || p.method || 'CASH',
          utr: p.transactionRef || p.utr || '',
          status: p.paymentStatus || p.status || 'PENDING',
          date: p.createdAt || p.date || '',
        }));
        setPayments(normalized);
      } else {
        setPayments(INITIAL_PAYMENTS);
      }
    } catch (err) {
      console.warn('Payment API unavailable. Using fallback data.', err);
      setPayments(INITIAL_PAYMENTS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      const query = searchQuery.toLowerCase();
      return (
        (pay.id && pay.id.toLowerCase().includes(query)) ||
        (pay.invoiceId && pay.invoiceId.toLowerCase().includes(query)) ||
        (pay.guestName && pay.guestName.toLowerCase().includes(query)) ||
        (pay.utr && pay.utr.toLowerCase().includes(query))
      );
    });
  }, [payments, searchQuery]);

  const updatePaymentStatus = async (id, newStatus) => {
    try {
      await paymentService.update(id, { paymentStatus: newStatus });
      setPayments((prev) =>
        prev.map((pay) => (pay.id === id ? { ...pay, status: newStatus } : pay))
      );
    } catch (err) {
      console.warn('Updating payment status via API failed, updating locally.', err);
      setPayments((prev) =>
        prev.map((pay) => (pay.id === id ? { ...pay, status: newStatus } : pay))
      );
    }
  };

  return {
    payments: filteredPayments,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    updatePaymentStatus,
    refetch: fetchPayments,
  };
}
