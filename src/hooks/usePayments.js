/**
 * @file usePayments.js
 * @description Hook managing local state for Payment Processing Log.
 * Conforms to billing API schema for payments.
 */
import { useState } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = payments.filter((pay) => {
    const query = searchQuery.toLowerCase();
    return (
      pay.id.toLowerCase().includes(query) ||
      pay.invoiceId.toLowerCase().includes(query) ||
      pay.guestName.toLowerCase().includes(query) ||
      pay.utr.toLowerCase().includes(query)
    );
  });

  const updatePaymentStatus = (id, newStatus) => {
    setPayments((prev) =>
      prev.map((pay) => (pay.id === id ? { ...pay, status: newStatus } : pay))
    );
  };

  return {
    payments: filteredPayments,
    searchQuery,
    setSearchQuery,
    updatePaymentStatus,
  };
}
