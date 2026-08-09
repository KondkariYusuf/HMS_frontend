/**
 * @file useGuestLookup.js
 * @description React hook for searching guest profiles and quick-registering guests.
 * Conforms to backendMD/10-hotel-guests.md API contract (GET /api/v1/hotel/guests/lookup, POST /api/v1/hotel/guests).
 */
import { useState, useCallback } from 'react';
import api, { ApiError } from '@utils/apiClient';

/**
 * Custom hook to lookup guests and create guest profiles
 * @returns {Object} { searchGuests, createGuestProfile, guests, loading, error }
 */
export default function useGuestLookup() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchGuests = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setGuests([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/hotel/guests/lookup?search=${encodeURIComponent(query)}`);
      const resultData = Array.isArray(response.data) ? response.data : [];
      setGuests(resultData);
      return resultData;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Guest lookup failed.';
      setError(msg);
      setGuests([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createGuestProfile = useCallback(async (guestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/hotel/guests', guestData);
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create guest profile.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchGuests,
    createGuestProfile,
    guests,
    loading,
    error,
  };
}
