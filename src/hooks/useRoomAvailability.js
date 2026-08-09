/**
 * @file useRoomAvailability.js
 * @description React hook for checking room availability and listing physical rooms.
 * Conforms to backendMD/11-bookings-folio.md & backendMD/09-rooms-setup.md.
 */
import { useState, useCallback } from 'react';
import api, { ApiError } from '@utils/apiClient';

/**
 * Custom hook to search available room types and physical rooms
 * @returns {Object} { checkAvailability, fetchPhysicalRooms, roomTypes, physicalRooms, loading, error }
 */
export default function useRoomAvailability() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [physicalRooms, setPhysicalRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(async ({ checkIn, checkOut, adults = 1, children = 0 }) => {
    if (!checkIn || !checkOut) return [];

    setLoading(true);
    setError(null);

    try {
      const queryParams = new window.URLSearchParams({
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
      });

      const response = await api.get(`/hotel/bookings/availability?${queryParams.toString()}`);
      const data = response.data?.roomTypes || [];
      setRoomTypes(data);
      return data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Availability search failed.';
      setError(msg);
      setRoomTypes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPhysicalRooms = useCallback(async (status = 'AVAILABLE') => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = status ? `?status=${status}` : '';
      const response = await api.get(`/hotel/rooms${queryParams}`);
      const roomsData = Array.isArray(response.data) ? response.data : [];
      setPhysicalRooms(roomsData);
      return roomsData;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to fetch rooms.';
      setError(msg);
      setPhysicalRooms([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkAvailability,
    fetchPhysicalRooms,
    roomTypes,
    physicalRooms,
    loading,
    error,
  };
}
