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
import bookingService from '@services/bookingService';


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
      const response = await bookingService.getAll({ limit: 1000, pageSize: 1000, size: 1000 });

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

      const normalizedData = rawData.map((b) => {
        const primaryGuest = b.primaryGuest || {};
        const guestName = primaryGuest.name ||
          (primaryGuest.firstName ? `${primaryGuest.firstName} ${primaryGuest.lastName || ''}`.trim() : 'Guest');

        const rawStatus = (b.bookingStatus || b.status || 'CONFIRMED').toUpperCase();
        const rawSource = (b.bookingSource || b.source || 'WALK_IN').toUpperCase();

        const bookingRooms = b.bookingRooms || b.rooms || [];
        const firstRoom = bookingRooms[0] || {};
        const roomTitle = firstRoom.room?.title || firstRoom.room?.roomNumber || b.assignedRoom || 'Unassigned';

        return {
          ...b,
          bookingRef: b.bookingNumber || b.bookingRef || `#BK-${b.id?.slice(0, 6)}`,
          status: rawStatus,
          source: rawSource,
          primaryGuest: {
            ...primaryGuest,
            name: guestName,
            email: primaryGuest.email || '',
            phone: primaryGuest.phone || primaryGuest.phoneNumber || '',
            tag: primaryGuest.tag || 'STANDARD',
          },
          checkIn: b.checkIn || firstRoom.checkInDateTime?.split('T')[0] || b.bookingDate?.split('T')[0] || '',
          checkOut: b.checkOut || firstRoom.checkOutDateTime?.split('T')[0] || '',
          assignedRoom: roomTitle,
          totalAmount: b.grandTotal || b.totalAmount || b.subtotal || 0,
        };
      });

      setBookings(normalizedData);
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
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === 'CONFIRMED' ||
        booking.status === 'CHECKED_IN' ||
        booking.status === 'PENDING_ALLOTMENT' ||
        booking.status === 'DRAFT'
    );

    const todayStr = new Date().toISOString().split('T')[0];
    const arrivalsToday = activeBookings.filter((b) => {
      const checkInDate = b.checkIn || (b.rawRecord?.bookingRooms?.[0]?.checkInDateTime || '').split('T')[0];
      return checkInDate === todayStr || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN';
    }).length;

    const totalRoomsCount = activeBookings.reduce((sum, b) => sum + (b.rawRecord?.totalRooms || b.roomCount || 1), 0);

    const otaCount = activeBookings.filter((b) => {
      const src = (b.source || b.bookingSource || b.sourceType || b.channel || '').toUpperCase();
      return src === 'OTHER' || src === 'OTA' || src === 'EXPEDIA' || src === 'BOOKING.COM' || src === 'AGODA';
    }).length;

    const unassignedCount = activeBookings.filter((b) => {
      const roomAssigned = b.assignedRoom;
      const status = (b.status || b.bookingStatus || '').toUpperCase();
      return !roomAssigned || roomAssigned === 'Unassigned' || roomAssigned === 'Undefined' || status === 'PENDING_ALLOTMENT' || status === 'DRAFT';
    }).length;

    return {
      totalArrivals: arrivalsToday,
      checkInWindow: arrivalsToday > 0 ? `${arrivalsToday} Arrivals Scheduled` : '0 Arrivals Scheduled',

      roomsReserved: totalRoomsCount,
      occupancyPercent: `${activeBookings.length} Active Bookings`,

      otaCount: otaCount,
      otaChannels: otaCount > 0 ? `${otaCount} OTA Bookings` : 'Direct Only',

      pendingCount: unassignedCount,
      pendingAlert: unassignedCount > 0 ? `${unassignedCount} Rooms Unassigned` : 'All Rooms Assigned',
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
        const response = await bookingService.create(payload);

        const createdRecord = response?.data;

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
        let response;
        if (newStatus === 'CHECKED_IN') {
          response = await bookingService.checkIn(id);
        } else if (newStatus === 'CHECKED_OUT') {
          response = await bookingService.checkOut(id);
        } else if (newStatus === 'CANCELLED') {
          response = await bookingService.cancel(id);
        } else {
          response = await bookingService.update(id, { bookingStatus: newStatus });
        }

        const rawUpdated = response?.data?.data || response?.data?.response || response?.data;

        setBookings((previous) =>
          previous.map((booking) =>
            booking.id === id
              ? {
                  ...booking,
                  rawRecord: rawUpdated || booking.rawRecord,
                  status: newStatus,
                }
              : booking
          )
        );

        setError(null);
        fetchBookings();
      } catch (requestError) {
        if (requestError.response) {
          const apiMsg =
            requestError.response?.data?.message ||
            requestError.response?.data?.error ||
            `Failed to update booking status (${requestError.response.status}).`;
          console.error('Backend status update error:', apiMsg, requestError);
          throw new Error(apiMsg);
        }

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
      }
    },
    [fetchBookings]
  );

  const updateBooking = useCallback(
    async (id, updateData) => {
      try {
        const response = await bookingService.update(id, updateData);
        const rawUpdated = response?.data?.data || response?.data?.response || response?.data;
        setBookings((previous) =>
          previous.map((b) =>
            b.id === id
              ? {
                  ...b,
                  rawRecord: rawUpdated || b.rawRecord,
                  status: updateData.bookingStatus ? updateData.bookingStatus.toUpperCase() : b.status,
                }
              : b
          )
        );
        fetchBookings();
        return rawUpdated;
      } catch (err) {
        if (err.response) {
          const apiMsg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            `Failed to update booking (${err.response.status}).`;
          console.error('Backend update booking error:', apiMsg, err);
          throw new Error(apiMsg);
        }

        console.warn('Update booking API error, updating state locally.', err);
        setBookings((previous) =>
          previous.map((b) =>
            b.id === id
              ? { ...b, ...updateData, status: updateData.bookingStatus ? updateData.bookingStatus.toUpperCase() : b.status }
              : b
          )
        );
      }
    },
    [fetchBookings]
  );

  /**
   * Fetch single booking by ID directly from backend API
   */
  const getBookingById = useCallback(
    async (id) => {
      try {
        const response = await bookingService.getById(id);
        return response?.data || response;
      } catch (err) {
        console.warn(`Failed to fetch booking ${id} from API:`, err);
        return bookings.find((b) => b.id === id) || null;
      }
    },
    [bookings]
  );

  /**
   * Query real-time room availability from backend API
   */
  const checkAvailability = useCallback(
    async (params) => {
      try {
        const response = await bookingService.getAvailability(params);
        return response?.data || response;
      } catch (err) {
        console.warn('Failed to check availability from API:', err);
        throw err;
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
      .map((booking) => {
        const rawG = booking.primaryGuest || booking.guest || {};
        const computedName = rawG.name || (rawG.firstName ? `${rawG.firstName} ${rawG.lastName || ''}`.trim() : (booking.guestName || 'Guest'));
        const rawAmt = booking.grandTotal || booking.totalAmount || booking.subtotal || 0;
        const formattedAmount = `₹${Number(rawAmt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

        return {
          id: booking.id,

          bookingRef:
            booking.bookingRef ||
            `#${booking.id}`,

          guest: {
            name: computedName,

            email:
              rawG.email ||
              '',

            phone:
              rawG.phone || rawG.phoneNumber ||
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

          amount: formattedAmount,

          status: booking.status,

          rawRecord: booking,
        };
      });
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
      .map((booking) => {
        const rawG = booking.primaryGuest || booking.guest || {};
        const computedName = rawG.name || (rawG.firstName ? `${rawG.firstName} ${rawG.lastName || ''}`.trim() : (booking.guestName || 'Guest'));
        const rawAmt = booking.grandTotal || booking.totalAmount || booking.subtotal || 0;
        const formattedAmount = `₹${Number(rawAmt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

        return {
          id: booking.id,

          bookingRef:
            booking.bookingRef ||
            `#${booking.id}`,

          roomNumber:
            booking.assignedRoom ||
            'Unassigned',

          guest: {
            name: computedName,

            email:
              rawG.email ||
              '',

            phone:
              rawG.phone || rawG.phoneNumber ||
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

          totalPaid: formattedAmount,

          status: booking.status,

          rawRecord: booking,
        };
      });
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

    updateBooking,

    getBookingById,

    checkAvailability,
  };
}

export default useBookings;