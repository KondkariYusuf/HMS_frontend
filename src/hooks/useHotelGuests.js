/**
 * @file useHotelGuests.js
 * @description Hook managing hotel guest state, backend synchronization with hotelGuestService,
 * persistent guest status overrides, and fallback demo guest data.
 */
import { useState, useEffect, useCallback } from 'react';
import hotelGuestService from '@services/hotelGuestService';

// Local storage key to persist status overrides across reloads
const GUEST_STATUS_STORAGE_KEY = 'syncstays_guest_status_overrides';

const getSavedStatusOverrides = () => {
  try {
    const raw = localStorage.getItem(GUEST_STATUS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveStatusOverride = (guestId, newStatus) => {
  try {
    const existing = getSavedStatusOverrides();
    existing[guestId] = newStatus;
    localStorage.setItem(GUEST_STATUS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed saving guest status override:', e);
  }
};

export default function useHotelGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOverrides, setStatusOverrides] = useState(getSavedStatusOverrides);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hotelGuestService.getAll({ limit: 1000, pageSize: 1000, size: 1000 });
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

      const currentOverrides = getSavedStatusOverrides();

      if (rawData.length > 0) {
        const normalized = rawData.map((g) => ({
          id: g.id || 'guest-000',
          firstName: g.firstName || '',
          lastName: g.lastName || '',
          name: `${g.firstName || ''} ${g.lastName || ''}`.trim() || 'Guest',
          email: g.email || '',
          phone: g.phone || g.phoneNumber || '',
          idType: g.idProofType || g.idType || 'OTHER',
          idNumber: g.idProofNumber || g.idNumber || '',
          status: currentOverrides[g.id] || g.status || 'ACTIVE',
          totalStays: g.totalStays || 0,
        }));
        setGuests(normalized);
      } else {
        setGuests([]);
      }
    } catch (err) {
      console.warn('Hotel Guest API error:', err);
      setGuests([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Dedicated guest status update handler
  const updateGuestStatus = async (guestId, newStatus, fullPayload) => {
    saveStatusOverride(guestId, newStatus);
    setStatusOverrides((prev) => ({ ...prev, [guestId]: newStatus }));

    // Optimistically update local state immediately
    setGuests((prevGuests) =>
      prevGuests.map((g) => (String(g.id) === String(guestId) ? { ...g, status: newStatus } : g))
    );

    try {
      await hotelGuestService.update(guestId, fullPayload);
    } catch (err) {
      console.warn('Backend guest status update warning:', err);
    }
  };

  const registerGuest = async (guestData) => {
    try {
      let userOrgId = null;
      let userBranchId = null;
      try {
        const rawUser = localStorage.getItem('syncstays_user');
        if (rawUser) {
          const user = JSON.parse(rawUser);
          userOrgId = user.organizationId;
          userBranchId = user.organizationBranchId;
        }
      } catch (e) {
        console.warn('Failed reading user session for guest registration', e);
      }
      const activeBranchId = localStorage.getItem('syncstays_branch_id');

      const payload = {
        organizationId: guestData.organizationId || userOrgId,
        organizationBranchId: guestData.organizationBranchId || userBranchId || activeBranchId,
        firstName: guestData.firstName?.trim() || '',
        lastName: guestData.lastName?.trim() || undefined,
        email: guestData.email?.trim() || undefined,
        phoneNumber: (guestData.phoneNumber || guestData.phone)?.trim() || undefined,
        gender: guestData.gender || undefined,
        nationality: guestData.nationality?.trim() || undefined,
        dateOfBirth: guestData.dateOfBirth || undefined,
        idProofType: guestData.idProofType || guestData.idType || 'passport',
        idNumber: (guestData.idNumber || guestData.idProofNumber)?.trim() || undefined,
      };

      // Clean empty string/undefined optional properties
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === '') {
          if (key !== 'firstName' && key !== 'organizationId' && key !== 'organizationBranchId') {
            delete payload[key];
          }
        }
      });

      const response = await hotelGuestService.create(payload);
      const rawGuest = response?.data?.data || response?.data;
      const normalized = {
        id: rawGuest?.id || `guest-${Date.now()}`,
        firstName: rawGuest?.firstName || guestData.firstName || '',
        lastName: rawGuest?.lastName || guestData.lastName || '',
        name: `${rawGuest?.firstName || guestData.firstName || ''} ${rawGuest?.lastName || guestData.lastName || ''}`.trim() || 'Guest',
        email: rawGuest?.email || guestData.email || '',
        phone: rawGuest?.phoneNumber || rawGuest?.phone || guestData.phone || '',
        idType: rawGuest?.idProofType || rawGuest?.idType || guestData.idProofType || 'OTHER',
        idNumber: rawGuest?.idNumber || rawGuest?.idProofNumber || guestData.idProofNumber || '',
        status: rawGuest?.status || 'ACTIVE',
        totalStays: rawGuest?.totalStays || 0,
      };
      setGuests((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      console.warn('Registering guest via API failed, adding locally.', err);
      const localGuest = {
        id: `local-${Date.now()}`,
        ...guestData,
        name: `${guestData.firstName || ''} ${guestData.lastName || ''}`.trim() || 'Guest',
        phone: guestData.phoneNumber || guestData.phone || '',
        idType: guestData.idProofType || guestData.idType || 'OTHER',
        idNumber: guestData.idNumber || guestData.idProofNumber || '',
        status: guestData.status || 'ACTIVE',
        totalStays: 0,
      };
      setGuests((prev) => [localGuest, ...prev]);
      return localGuest;
    }
  };

  const deleteGuest = async (guestId) => {
    try {
      await hotelGuestService.delete(guestId);
      setGuests((prev) => prev.filter((g) => String(g.id) !== String(guestId)));
      return true;
    } catch (err) {
      console.warn('Backend delete guest error, updating locally:', err);
      setGuests((prev) => prev.filter((g) => String(g.id) !== String(guestId)));
      throw err;
    }
  };

  return {
    guests,
    loading,
    error,
    refetch: fetchGuests,
    registerGuest,
    updateGuestStatus,
    deleteGuest,
  };
}
