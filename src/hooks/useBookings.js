/**
 * @file useBookings.js
 * @description React hook for fetching and managing paginated booking list data.
 * Conforms to backendMD/11-bookings-folio.md API contract (GET /api/v1/hotel/bookings).
 */
import { useState, useEffect, useCallback } from 'react';
import api, { ApiError } from '@utils/apiClient';

/**
 * Custom hook to list and filter hotel bookings
 *
 * @param {Object} [initialFilters={}]
 * @param {string} [initialFilters.status] - Booking status filter
 * @param {string} [initialFilters.search] - Search string (guest name, phone, bookingRef)
 * @param {string} [initialFilters.checkInFrom] - Date range start (YYYY-MM-DD)
 * @param {string} [initialFilters.checkInTo] - Date range end (YYYY-MM-DD)
 * @param {number} [initialFilters.page=1] - Page number
 * @param {number} [initialFilters.limit=20] - Page size
 * @returns {Object} { bookings, loading, error, meta, filters, setFilters, refetch }
 */
export default function useBookings(initialFilters = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    checkInFrom: '',
    checkInTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new window.URLSearchParams();
      if (filters.page) queryParams.append('page', String(filters.page));
      if (filters.limit) queryParams.append('limit', String(filters.limit));
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.checkInFrom) queryParams.append('checkInFrom', filters.checkInFrom);
      if (filters.checkInTo) queryParams.append('checkInTo', filters.checkInTo);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/hotel/bookings?${queryParams.toString()}`);
      setBookings(Array.isArray(response.data) ? response.data : []);
      setMeta(response.meta || null);
    } catch (err) {
      const errorMsg =
        err instanceof ApiError ? err.message : 'Failed to fetch bookings list.';
      setError(errorMsg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.limit,
    filters.search,
    filters.status,
    filters.checkInFrom,
    filters.checkInTo,
    filters.sortBy,
    filters.sortOrder,
  ]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    meta,
    filters,
    setFilters,
    refetch: fetchBookings,
  };
}
