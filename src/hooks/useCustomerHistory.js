/**
 * @file useCustomerHistory.js
 * @description Hook managing local state for a specific customer's full history (Stays, Invoices, Payments, Loyalty).
 */
import { useMemo } from 'react';
import useInvoices from './useInvoices';
import usePayments from './usePayments';
import useCustomerLoyalty from './useCustomerLoyalty';

const DUMMY_STAYS = [
  {
    id: 'RES-5001',
    customerName: 'Ayesha Khan',
    room: 'Deluxe Suite (201)',
    checkIn: '2026-07-30T14:00:00.000Z',
    checkOut: '2026-08-01T11:00:00.000Z',
    status: 'COMPLETED',
  },
  {
    id: 'RES-5002',
    customerName: 'Ayesha Khan',
    room: 'Standard Room (105)',
    checkIn: '2026-06-15T14:00:00.000Z',
    checkOut: '2026-06-18T11:00:00.000Z',
    status: 'COMPLETED',
  },
  {
    id: 'RES-5003',
    customerName: 'TechNova Corp',
    room: 'Corporate Block (5 Rooms)',
    checkIn: '2026-08-12T14:00:00.000Z',
    checkOut: '2026-08-15T11:00:00.000Z',
    status: 'ACTIVE',
  },
];

export default function useCustomerHistory(customerName) {
  const { invoices } = useInvoices();
  const { payments } = usePayments();
  const { transactions } = useCustomerLoyalty();

  return useMemo(() => {
    if (!customerName) {
      return {
        stays: [],
        invoices: [],
        payments: [],
        loyalty: [],
      };
    }

    return {
      stays: DUMMY_STAYS.filter((s) => s.customerName === customerName),
      invoices: invoices.filter((i) => i.guestName === customerName),
      payments: payments.filter((p) => p.guestName === customerName),
      loyalty: transactions.filter((t) => t.customerName === customerName),
    };
  }, [customerName, invoices, payments, transactions]);
}
