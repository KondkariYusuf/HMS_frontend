/**
 * @file useBookingActions.js
 * @description React hook handling booking lifecycle mutations (create, confirm, check-in, check-out, cancel, assign room).
 * Conforms to backendMD/11-bookings-folio.md API contracts.
 */
import { useState, useCallback } from 'react';
import api, { ApiError } from '@utils/apiClient';

/**
 * Custom hook for booking lifecycle actions
 * @returns {Object} { createBooking, confirmBooking, checkInGuest, checkOutGuest, cancelBooking, assignRoom, actionLoading, actionError }
 */
export default function useBookingActions() {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const createBooking = useCallback(async (payload) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await api.post('/hotel/bookings', payload);
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create booking.';
      setActionError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const confirmBooking = useCallback(async (id, depositData = {}) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await api.post(`/hotel/bookings/${id}/confirm`, depositData);
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to confirm booking.';
      setActionError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const checkInGuest = useCallback(async (id, checkInData = {}) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await api.post(`/hotel/bookings/${id}/check-in`, checkInData);
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Check-in failed.';
      setActionError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const checkOutGuest = useCallback(async (id, checkOutData = {}) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await api.post(`/hotel/bookings/${id}/check-out`, checkOutData);
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Check-out failed.';
      setActionError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id, cancelData = {}) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await api.post(`/hotel/bookings/${id}/cancel`, cancelData);
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to cancel booking.';
      setActionError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const assignRoom = useCallback(async (bookingId, bookingRoomId, physicalRoomId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await api.post(
        `/hotel/bookings/${bookingId}/rooms/${bookingRoomId}/assign`,
        { physicalRoomId }
      );
      return response.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to assign physical room.';
      setActionError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    createBooking,
    confirmBooking,
    checkInGuest,
    checkOutGuest,
    cancelBooking,
    assignRoom,
    actionLoading,
    actionError,
  };
}
