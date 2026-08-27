/**
 * @file useHotelGuests.js
 * @description Hook managing hotel guest state, backend synchronization with hotelGuestService,
 * and fallback demo guest data.
 */
import { useState, useEffect, useCallback } from 'react';
import hotelGuestService from '@services/hotelGuestService';
import initialGuestData from '../data/guestData.json';

export default function useHotelGuests() {
  const [guests, setGuests] = useState(initialGuestData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hotelGuestService.getAll();
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
        const normalized = rawData.map((g) => ({
          id: g.id || 'guest-000',
          firstName: g.firstName || '',
          lastName: g.lastName || '',
          name: `${g.firstName || ''} ${g.lastName || ''}`.trim() || 'Guest',
          email: g.email || '',
          phone: g.phone || g.phoneNumber || '',
          idType: g.idProofType || g.idType || 'OTHER',
          idNumber: g.idProofNumber || g.idNumber || '',
          status: g.status || 'ACTIVE',
          totalStays: g.totalStays || 0,
        }));
        setGuests(normalized);
      } else {
        setGuests(initialGuestData);
      }
    } catch (err) {
      console.warn('Hotel Guest API unavailable. Using fallback data.', err);
      setGuests(initialGuestData);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

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

  return {
    guests,
    loading,
    error,
    refetch: fetchGuests,
    registerGuest,
  };
}
