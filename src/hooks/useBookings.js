/**
 * @file useBookings.js
 * @description Custom React hook for managing Front Desk & Bookings domain
 * data, state transitions, API persistence, and frontend demo fallback.
 */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import api from '@utils/apiClient';

/**
 * Demo/fallback bookings.
 *
 * These are used only when the backend API is unavailable.
 * Once the API is available, real API data replaces this data.
 */
const DEMO_BOOKINGS = [
  {
    id: 'demo-001',
    bookingRef: '#BK-1001',

    primaryGuest: {
      name: 'Eleanor Shellstrop',
      email: 'eleanor@example.com',
      phone: '+1 555-0101',
      tag: 'VIP',
    },

    checkIn: '2026-08-18',
    checkOut: '2026-08-21',

    assignedRoom: '301',
    roomCount: 1,
    nights: 3,

    status: 'CONFIRMED',

    source: 'DIRECT',
    channelName: 'Direct',
    channelIcon: '',

    totalAmount: 450,
    paidAmount: 450,
    currencyCode: 'USD',
  },

  {
    id: 'demo-002',
    bookingRef: '#BK-1002',

    primaryGuest: {
      name: 'Marcus Aurelius',
      email: 'marcus@example.com',
      phone: '+1 555-0102',
      tag: 'STANDARD',
    },

    checkIn: '2026-08-20',
    checkOut: '2026-08-24',

    assignedRoom: '205',
    roomCount: 1,
    nights: 4,

    status: 'PENDING_ALLOTMENT',

    source: 'OTA',
    channelName: 'Booking.com',
    channelIcon: '',

    totalAmount: 620,
    paidAmount: 300,
    currencyCode: 'USD',
  },

  {
    id: 'demo-003',
    bookingRef: '#BK-1003',

    primaryGuest: {
      name: 'Chidi Anagonye',
      email: 'chidi@example.com',
      phone: '+1 555-0103',
      tag: 'STANDARD',
    },

    checkIn: '2026-08-15',
    checkOut: '2026-08-17',

    assignedRoom: '402',
    roomCount: 1,
    nights: 2,

    status: 'CHECKED_IN',

    source: 'DIRECT',
    channelName: 'Direct',
    channelIcon: '',

    totalAmount: 300,
    paidAmount: 300,
    currencyCode: 'USD',
  },

  {
    id: 'demo-004',
    bookingRef: '#BK-1004',

    primaryGuest: {
      name: 'Tahani Al-Jamil',
      email: 'tahani@example.com',
      phone: '+1 555-0104',
      tag: 'VIP',
    },

    checkIn: '2026-07-10',
    checkOut: '2026-07-14',

    assignedRoom: '105',
    roomCount: 1,
    nights: 4,

    status: 'CHECKED_OUT',

    source: 'OTA',
    channelName: 'Expedia',
    channelIcon: '',

    totalAmount: 800,
    paidAmount: 800,
    currencyCode: 'USD',
  },

  {
    id: 'demo-005',
    bookingRef: '#BK-1005',

    primaryGuest: {
      name: 'Jason Mendoza',
      email: 'jason@example.com',
      phone: '+1 555-0105',
      tag: 'STANDARD',
    },

    checkIn: '2026-08-22',
    checkOut: '2026-08-25',

    assignedRoom: '210',
    roomCount: 1,
    nights: 3,

    status: 'CONFIRMED',

    source: 'OTA',
    channelName: 'Agoda',
    channelIcon: '',

    totalAmount: 510,
    paidAmount: 510,
    currencyCode: 'USD',
  },
];

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch bookings from the backend.
   *
   * If the backend is unavailable, demo bookings are used instead.
   */
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/hotel/bookings');

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setBookings(data);
    } catch (requestError) {
      console.warn(
        'Bookings API unavailable. Using demo bookings instead.',
        requestError
      );

      // Backend unavailable → continue using frontend demo data.
      setBookings(DEMO_BOOKINGS);

      // Do not expose the API failure as a fatal page error.
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /**
   * Overall booking statistics.
   */
  const dynamicStats = useMemo(() => {
    const totalCount = bookings.length;

    const inHouseCount = bookings.filter(
      (booking) =>
        booking.status === 'CHECKED_IN'
    ).length;

    const arrivalsCount = bookings.filter(
      (booking) =>
        booking.status === 'CONFIRMED' ||
        booking.status === 'PENDING_ALLOTMENT'
    ).length;

    const departuresCount = bookings.filter(
      (booking) =>
        booking.status === 'CHECKED_OUT'
    ).length;

    const totalRooms = bookings.reduce(
      (total, booking) =>
        total + Number(booking.roomCount || 0),
      0
    );

    const totalPaid = bookings.reduce(
      (sum, booking) =>
        sum + Number(booking.paidAmount || 0),
      0
    );

    const occupancyRate =
      totalRooms > 0
        ? Math.round(
          (inHouseCount / totalRooms) * 100
        )
        : 0;

    return {
      totalCount,
      inHouseCount,
      arrivalsCount,
      departuresCount,
      occupiedRooms: inHouseCount,
      totalRooms,
      occupancyRate: `${occupancyRate}%`,

      totalRevenue: totalPaid.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        }
      ),

      dailyAvg:
        totalCount > 0
          ? (
            totalPaid / totalCount
          ).toLocaleString(
            'en-US',
            {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }
          )
          : '$0',
    };
  }, [bookings]);

  /**
   * Upcoming bookings summary.
   */
  const upcomingSummary = useMemo(() => {
    const upcoming = bookings.filter(
      (booking) =>
        booking.status === 'CONFIRMED' ||
        booking.status === 'PENDING_ALLOTMENT' ||
        booking.status === 'CHECKED_IN'
    );

    const otaCount = upcoming.filter(
      (booking) =>
        booking.source === 'OTA'
    ).length;

    const pendingCount = upcoming.filter(
      (booking) =>
        booking.status === 'PENDING_ALLOTMENT'
    ).length;

    const roomsReserved = upcoming.reduce(
      (total, booking) =>
        total + Number(booking.roomCount || 0),
      0
    );

    return {
      upcomingCount:
        upcoming.length.toLocaleString('en-US'),

      upcomingDelta: null,

      roomsReserved:
        roomsReserved.toLocaleString('en-US'),

      occupancyPercent: null,

      otaCount:
        otaCount.toLocaleString('en-US'),

      otaChannels: null,

      pendingCount:
        pendingCount.toLocaleString('en-US'),

      pendingAlert:
        pendingCount > 0
          ? 'Requires attention'
          : 'All clear',
    };
  }, [bookings]);

  /**
   * Past booking archive summary.
   */
  const pastArchiveSummary = useMemo(() => {
    const completedList = bookings.filter(
      (booking) =>
        booking.status === 'CHECKED_OUT'
    );

    const uniqueGuestCount = new Set(
      completedList
        .map(
          (booking) =>
            booking.primaryGuest?.email ||
            booking.primaryGuest?.id
        )
        .filter(Boolean)
    ).size;

    const totalNights = completedList.reduce(
      (total, booking) =>
        total + Number(booking.nights || 0),
      0
    );

    const averageStay =
      completedList.length > 0
        ? totalNights / completedList.length
        : 0;

    return {
      uniqueGuests:
        uniqueGuestCount.toLocaleString('en-US'),

      avgStay:
        averageStay > 0
          ? `${averageStay.toFixed(1)} Days`
          : '0 Days',

      returnRate: null,
    };
  }, [bookings]);

  /**
   * Create a booking.
   *
   * API available:
   *   → save to backend
   *
   * API unavailable:
   *   → create locally so the UI remains functional
   */
  const createBooking = useCallback(
    async (newBookingData) => {
      const payload = {
        ...newBookingData,
        status:
          newBookingData.status ||
          'CONFIRMED',
      };

      try {
        const response = await api.post(
          '/hotel/bookings',
          payload
        );

        const createdRecord =
          response?.data;

        if (createdRecord) {
          setBookings((previous) => [
            createdRecord,
            ...previous,
          ]);

          setError(null);

          return createdRecord;
        }
      } catch (requestError) {
        console.warn(
          'Booking API unavailable. Creating booking locally.',
          requestError
        );

        const timestamp = Date.now();

        const localBooking = {
          ...payload,

          id: `local-${timestamp}`,

          bookingRef:
            payload.bookingRef ||
            `#LOCAL-${timestamp}`,

          primaryGuest:
            payload.primaryGuest || {
              name:
                payload.guestName ||
                'New Guest',

              email:
                payload.email ||
                '',

              phone:
                payload.phone ||
                '',

              tag: 'STANDARD',
            },
        };

        setBookings((previous) => [
          localBooking,
          ...previous,
        ]);

        setError(null);

        return localBooking;
      }

      return null;
    },
    []
  );

  /**
   * Update booking status.
   *
   * API available:
   *   → persist status to backend
   *
   * API unavailable:
   *   → update local state
   */
  const updateBookingStatus = useCallback(
    async (id, newStatus) => {
      try {
        const response = await api.patch(
          `/hotel/bookings/${id}`,
          {
            status: newStatus,
          }
        );

        const updatedBooking =
          response?.data;

        setBookings((previous) =>
          previous.map((booking) =>
            booking.id === id
              ? {
                ...booking,
                ...(updatedBooking || {}),
                status: newStatus,
              }
              : booking
          )
        );

        setError(null);
      } catch (requestError) {
        console.warn(
          'Booking status API unavailable. Updating status locally.',
          requestError
        );

        setBookings((previous) =>
          previous.map((booking) =>
            booking.id === id
              ? {
                ...booking,
                status: newStatus,
              }
              : booking
          )
        );

        setError(null);
      }
    },
    []
  );

  /**
   * Recent guests.
   */
  const recentGuests = useMemo(() => {
    return bookings
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,

        guest: {
          name:
            booking.primaryGuest?.name ||
            'Guest',

          tag:
            booking.primaryGuest?.tag ||
            'STANDARD',
        },

        room:
          booking.assignedRoom ||
          'Unassigned',

        dates: `${booking.checkIn || ''} - ${booking.checkOut || ''}`,

        status:
          booking.status === 'CHECKED_IN'
            ? 'in-house'
            : booking.status === 'CONFIRMED'
              ? 'arriving'
              : 'checked-out',
      }));
  }, [bookings]);

  /**
   * Upcoming booking records formatted for the UI.
   */
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter(
        (booking) =>
          booking.status === 'CONFIRMED' ||
          booking.status === 'PENDING_ALLOTMENT' ||
          booking.status === 'CHECKED_IN'
      )
      .map((booking) => ({
        id: booking.id,

        bookingRef:
          booking.bookingRef ||
          `#${booking.id}`,

        guest: {
          name:
            booking.primaryGuest?.name ||
            'Guest',

          email:
            booking.primaryGuest?.email ||
            '',

          phone:
            booking.primaryGuest?.phone ||
            '',
        },

        checkIn: booking.checkIn,

        checkOut: booking.checkOut,

        roomType:
          booking.assignedRoom ||
          'Unassigned',

        channel:
          booking.channelName ||
          booking.source ||
          'Direct',

        channelIcon:
          booking.channelIcon || '',

        sourceType:
          booking.source || '',

        amount:
          booking.totalAmount != null
            ? Number(
              booking.totalAmount
            ).toLocaleString('en-US', {
              style: 'currency',
              currency:
                booking.currencyCode ||
                'USD',
              minimumFractionDigits: 2,
            })
            : '',

        status: booking.status,

        rawRecord: booking,
      }));
  }, [bookings]);

  /**
   * Past/archive booking records formatted for the UI.
   */
  const pastArchiveBookings = useMemo(() => {
    return bookings
      .filter(
        (booking) =>
          booking.status === 'CHECKED_OUT' ||
          booking.status === 'CANCELLED' ||
          booking.status === 'NO_SHOW'
      )
      .map((booking) => ({
        id: booking.id,

        bookingRef:
          booking.bookingRef ||
          `#${booking.id}`,

        roomNumber:
          booking.assignedRoom ||
          'Unassigned',

        guest: {
          name:
            booking.primaryGuest?.name ||
            'Guest',

          email:
            booking.primaryGuest?.email ||
            '',

          phone:
            booking.primaryGuest?.phone ||
            '',
        },

        stayDates:
          `${booking.checkIn || ''} ➔ ${booking.checkOut || ''}`,

        nightsText:
          booking.nights != null
            ? `${booking.nights} Nights`
            : '',

        roomType:
          booking.assignedRoom ||
          'Unassigned',

        roomTypeBadge:
          booking.roomTypeBadge || '',

        totalPaid:
          booking.totalAmount != null
            ? Number(
              booking.totalAmount
            ).toLocaleString('en-US', {
              style: 'currency',
              currency:
                booking.currencyCode ||
                'USD',
              minimumFractionDigits: 2,
            })
            : '',

        status: booking.status,

        rawRecord: booking,
      }));
  }, [bookings]);

  return {
    bookings,

    stats: dynamicStats,

    upcomingSummary,

    pastArchiveSummary,

    upcomingBookings,

    pastArchiveBookings,

    recentGuests,

    loading,

    error,

    refetch: fetchBookings,

    createBooking,

    updateBookingStatus,
  };
}

export default useBookings;