/**
 * @file Hotel/Reservations/UpcomingBookings.jsx
 * @description Premium reservations management with Lucide icons, accurate OTA/Direct filtering, per-room stay schedule editing, room availability conflict validation, bold room name & price formatting, Toast notifications, and real-time Vacant / Available Rooms calculation.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Calendar,
  BedDouble,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Eye,
  Edit3,
  User,
  Plus,
  Trash2,
  X,
  Clock,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';

import useBookings from '@hooks/useBookings';
import hotelGuestService from '@services/hotelGuestService';
import { backendApi } from '@utils/backendApiClient';
import { getPermissionHeaders } from '@utils/permissionHeaders';
import Button from '@components/Button/Button';
import Avatar from '@components/Avatar/Avatar';
import Toast from '@components/Toast/Toast';
import FutureBookingModal from '@components/FutureBookingModal/FutureBookingModal';
import styles from './UpcomingBookings.module.css';

const ITEMS_PER_PAGE = 10;

export default function UpcomingBookings() {
  const {
    upcomingBookings,
    upcomingSummary,
    loading,
    error,
    refetch,
    createBooking,
    updateBookingStatus,
    updateBooking,
  } = useBookings();

  // State Management
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('NEWEST');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Available rooms for editing room assignment
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    async function loadRooms() {
      try {
        const permHeaders = getPermissionHeaders(['ROOM_READALL', 'ROOM_READ']);
        const res = await backendApi.get('/api/room', { headers: permHeaders });
        const roomList = res?.data?.data?.responses || res?.data?.responses || res?.data?.data || [];
        if (Array.isArray(roomList)) {
          setAvailableRooms(roomList);
        }
      } catch (err) {
        console.warn('Could not fetch room list for edit modal.', err);
      }
    }
    loadRooms();
  }, []);

  // Calculate Vacant / Available Rooms count for Card 4
  const vacantRoomsCount = useMemo(() => {
    if (!availableRooms || availableRooms.length === 0) return 0;
    const reservedRoomIds = new Set();
    upcomingBookings.forEach((b) => {
      const st = (b.status || b.rawRecord?.bookingStatus || '').toUpperCase();
      if (st === 'CANCELLED' || st === 'CHECKED_OUT') return;
      const rList = b.rawRecord?.bookingRooms || b.rooms || [];
      rList.forEach((r) => {
        if (r.roomId) reservedRoomIds.add(String(r.roomId));
        if (r.room?.id) reservedRoomIds.add(String(r.room.id));
      });
      if (b.assignedRoom) {
        availableRooms.forEach((ar) => {
          if (ar.roomNumber && String(b.assignedRoom).includes(String(ar.roomNumber))) {
            reservedRoomIds.add(String(ar.id));
          }
        });
      }
    });

    const vacantList = availableRooms.filter((ar) => !reservedRoomIds.has(String(ar.id)));
    return vacantList.length;
  }, [availableRooms, upcomingBookings]);

  // Global ESC Key dismiss listener for all modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedBooking(null);
        setEditingBooking(null);
        setIsFilterModalOpen(false);
        setIsNewBookingModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Robust helper to get active reservation for a room
  const getActiveBookingForRoom = (room, currentBookingId = null) => {
    if (!room) return null;
    return upcomingBookings.find((b) => {
      if (currentBookingId && String(b.id) === String(currentBookingId)) return false;
      const st = (b.status || b.rawRecord?.bookingStatus || '').toUpperCase();
      if (st === 'CANCELLED' || st === 'CHECKED_OUT') return false;

      const rList = b.rawRecord?.bookingRooms || b.rooms || [];
      const matchByRoomId = rList.some((br) => {
        const brId = br.roomId || br.room?.id || br.id;
        return brId && String(brId) === String(room.id);
      });
      const matchByRoomNumber = rList.some((br) => {
        const brNum = br.room?.roomNumber || br.roomNumber;
        return brNum && room.roomNumber && String(brNum) === String(room.roomNumber);
      });
      const matchByAssignedRoom = b.assignedRoom && (
        (room.roomNumber && String(b.assignedRoom).includes(String(room.roomNumber))) ||
        (room.title && String(b.assignedRoom).toLowerCase().includes(String(room.title).toLowerCase()))
      );

      return matchByRoomId || matchByRoomNumber || matchByAssignedRoom;
    });
  };

  // Room date conflict detector helper
  const checkRoomConflict = (roomId, checkIn, checkOut, excludeBookingId) => {
    if (!roomId || !checkIn || !checkOut) return null;
    const targetStart = new Date(checkIn).getTime();
    const targetEnd = new Date(checkOut).getTime();
    if (isNaN(targetStart) || isNaN(targetEnd) || targetStart >= targetEnd) return null;

    for (const b of upcomingBookings) {
      if (String(b.id) === String(excludeBookingId)) continue;
      const status = (b.status || b.rawRecord?.bookingStatus || '').toUpperCase();
      if (status === 'CANCELLED' || status === 'CHECKED_OUT') continue;

      const rawRooms = b.rawRecord?.bookingRooms || b.rooms || [];
      for (const r of rawRooms) {
        const rId = r.roomId || r.room?.id;
        const rNum = r.room?.roomNumber || r.roomNumber;
        const targetRoomObj = availableRooms.find((ar) => String(ar.id) === String(roomId));

        const isSameRoom = (rId && String(rId) === String(roomId)) ||
          (rNum && targetRoomObj?.roomNumber && String(rNum) === String(targetRoomObj.roomNumber)) ||
          (b.assignedRoom && targetRoomObj?.roomNumber && String(b.assignedRoom).includes(String(targetRoomObj.roomNumber)));

        if (isSameRoom) {
          const startExist = new Date(r.checkInDateTime || b.checkIn).getTime();
          const endExist = new Date(r.checkOutDateTime || b.checkOut).getTime();

          if (!isNaN(startExist) && !isNaN(endExist)) {
            if (Math.max(targetStart, startExist) < Math.min(targetEnd, endExist)) {
              return {
                guestName: b.guest?.name || 'Guest',
                bookingRef: b.bookingRef,
                checkIn: (r.checkInDateTime || b.checkIn || '').split('T')[0],
                checkOut: (r.checkOutDateTime || b.checkOut || '').split('T')[0],
              };
            }
          }
        }
      }
    }
    return null;
  };

  // Helper to format room option status in select dropdown
  const getRoomOptionLabel = (r, currentBookingId) => {
    const activeBooking = getActiveBookingForRoom(r, currentBookingId);
    const numStr = r.roomNumber ? `#${r.roomNumber}` : '';
    const titleStr = r.title || r.roomType?.type || 'Room';
    const priceStr = `₹${r.pricePerNight || 250}/night`;

    if (activeBooking) {
      return `Room ${numStr} - ${titleStr} | ${priceStr} (Reserved: ${activeBooking.checkIn} to ${activeBooking.checkOut})`;
    }
    return `Room ${numStr} - ${titleStr} | ${priceStr} (Available)`;
  };

  // Edit Booking & Guest State
  const [editingBooking, setEditingBooking] = useState(null);
  const [editBookingForm, setEditBookingForm] = useState({
    guestId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idProofType: 'passport',
    idNumber: '',
    rooms: [],
    bookingStatus: 'confirmed',
    bookingSource: 'walk_in',
    discountPercent: 0,
    taxPercent: 0,
    specialRequest: '',
    remarks: '',
  });
  const [isSavingBookingEdit, setIsSavingBookingEdit] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState('');

  // Robust Filtered and Sorted Dataset
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...upcomingBookings];

    if (activeFilter === 'OTA') {
      result = result.filter((b) => {
        const src = (b.source || b.bookingSource || b.sourceType || b.channel || '').toUpperCase();
        return src === 'OTHER' || src === 'OTA' || src === 'EXPEDIA' || src === 'BOOKING.COM' || src === 'AGODA';
      });
    } else if (activeFilter === 'DIRECT') {
      result = result.filter((b) => {
        const src = (b.source || b.bookingSource || b.sourceType || b.channel || '').toUpperCase();
        return src === 'WALK_IN' || src === 'WALK-IN' || src === 'DIRECT' || src === 'PHONE' || src === 'WEBSITE';
      });
    } else if (activeFilter === 'PENDING') {
      result = result.filter((b) => {
        const st = (b.status || b.rawRecord?.bookingStatus || '').toUpperCase();
        return st === 'PENDING_ALLOTMENT' || st === 'DRAFT';
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => {
        const nameMatch = b.guest?.name?.toLowerCase().includes(q);
        const emailMatch = b.guest?.email?.toLowerCase().includes(q);
        const refMatch = b.bookingRef?.toLowerCase().includes(q);
        const roomMatch = b.roomType?.toLowerCase().includes(q);
        return nameMatch || emailMatch || refMatch || roomMatch;
      });
    }

    if (sortBy === 'NEWEST') {
      result.sort((a, b) => new Date(b.rawRecord?.createdAt || 0) - new Date(a.rawRecord?.createdAt || 0));
    } else if (sortBy === 'OLDEST') {
      result.sort((a, b) => new Date(a.rawRecord?.createdAt || 0) - new Date(b.rawRecord?.createdAt || 0));
    } else if (sortBy === 'AMOUNT_HIGH') {
      result.sort((a, b) => (b.rawRecord?.grandTotal || 0) - (a.rawRecord?.grandTotal || 0));
    } else if (sortBy === 'AMOUNT_LOW') {
      result.sort((a, b) => (a.rawRecord?.grandTotal || 0) - (b.rawRecord?.grandTotal || 0));
    }

    return result;
  }, [upcomingBookings, activeFilter, searchQuery, sortBy]);

  const totalItems = filteredAndSortedBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedBookings, currentPage]);

  const rangeText = useMemo(() => {
    if (totalItems === 0) return 'Showing 0 of 0 entries';
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    return `Showing ${start} - ${end} of ${totalItems} entries`;
  }, [currentPage, totalItems]);

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleBookingCreated = (newPayload) => {
    if (createBooking) {
      createBooking(newPayload);
    }
    if (refetch) refetch();
  };

  const handleOpenEditBooking = (booking) => {
    setEditErrorMsg('');
    const raw = booking.rawRecord || booking;
    const primaryGuest = raw.primaryGuest || booking.guest || {};
    const rawRooms = raw.bookingRooms || raw.rooms || [];

    const roomsList = (rawRooms.length > 0 ? rawRooms : [{}]).map((r, idx) => {
      let formattedCheckIn = '';
      if (r.checkInDateTime || raw.checkInDateTime || booking.checkIn) {
        try {
          const d = new Date(r.checkInDateTime || raw.checkInDateTime || booking.checkIn);
          if (!isNaN(d.getTime())) formattedCheckIn = d.toISOString().slice(0, 16);
        } catch {}
      }
      if (!formattedCheckIn) {
        const d = new Date();
        d.setHours(14, 0, 0, 0);
        formattedCheckIn = d.toISOString().slice(0, 16);
      }

      let formattedCheckOut = '';
      if (r.checkOutDateTime || raw.checkOutDateTime || booking.checkOut) {
        try {
          const d = new Date(r.checkOutDateTime || raw.checkOutDateTime || booking.checkOut);
          if (!isNaN(d.getTime())) formattedCheckOut = d.toISOString().slice(0, 16);
        } catch {}
      }
      if (!formattedCheckOut) {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        d.setHours(11, 0, 0, 0);
        formattedCheckOut = d.toISOString().slice(0, 16);
      }

      return {
        id: r.id || `edit-room-${idx}`,
        roomId: r.roomId || r.room?.id || '',
        checkInTime: formattedCheckIn,
        checkOutTime: formattedCheckOut,
        noOfAdults: Number(r.noOfAdults || 2),
        noOfChild: Number(r.noOfChild || 0),
      };
    });

    setEditingBooking(booking);
    setEditBookingForm({
      guestId: primaryGuest.id || raw.primaryGuestId || '',
      firstName: primaryGuest.firstName || primaryGuest.name?.split(' ')[0] || '',
      lastName: primaryGuest.lastName || primaryGuest.name?.split(' ').slice(1).join(' ') || '',
      phone: primaryGuest.phoneNumber || primaryGuest.phone || '',
      email: primaryGuest.email || '',
      idProofType: (primaryGuest.idProofType || primaryGuest.idType || 'passport').toLowerCase(),
      idNumber: primaryGuest.idNumber || primaryGuest.idProofNumber || '',
      rooms: roomsList,
      bookingStatus: (raw.bookingStatus || booking.status || 'confirmed').toLowerCase(),
      bookingSource: (raw.bookingSource || 'walk_in').toLowerCase(),
      discountPercent: Number(raw.discountPercent || 0),
      taxPercent: Number(raw.taxPercent || 0),
      specialRequest: raw.specialRequest || '',
      remarks: raw.remarks || '',
    });
  };

  const handleEditRoomChange = (index, field, value) => {
    setEditBookingForm((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r, idx) => (idx === index ? { ...r, [field]: value } : r)),
    }));
  };

  const handleSaveBookingEdit = async () => {
    if (!editingBooking) return;
    setEditErrorMsg('');

    // Check for room date conflicts
    for (let i = 0; i < editBookingForm.rooms.length; i++) {
      const roomItem = editBookingForm.rooms[i];
      if (roomItem.roomId) {
        const conflict = checkRoomConflict(roomItem.roomId, roomItem.checkInTime, roomItem.checkOutTime, editingBooking.id);
        if (conflict) {
          const err = `Date Conflict on Room Selection #${i + 1}: Reserved by ${conflict.guestName} (${conflict.checkIn} to ${conflict.checkOut}).`;
          setEditErrorMsg(err);
          showToast(err, 'error');
          return;
        }
      }
    }

    setIsSavingBookingEdit(true);
    try {
      if (editBookingForm.guestId) {
        const guestPayload = {
          firstName: editBookingForm.firstName?.trim() || 'Guest',
          lastName: editBookingForm.lastName?.trim() || undefined,
          email: editBookingForm.email?.trim() || undefined,
          phoneNumber: editBookingForm.phone?.trim() || undefined,
          idProofType: editBookingForm.idProofType || 'passport',
          idNumber: editBookingForm.idNumber?.trim() || undefined,
        };
        try {
          await hotelGuestService.update(editBookingForm.guestId, guestPayload);
        } catch (gErr) {
          console.warn('Guest details update failed:', gErr);
        }
      }

      const bookingPayload = {
        bookingStatus: editBookingForm.bookingStatus,
        bookingSource: editBookingForm.bookingSource,
        discountPercent: Number(editBookingForm.discountPercent || 0),
        taxPercent: Number(editBookingForm.taxPercent || 0),
        specialRequest: editBookingForm.specialRequest?.trim() || undefined,
        remarks: editBookingForm.remarks?.trim() || undefined,
        rooms: editBookingForm.rooms.map((r) => ({
          roomId: r.roomId || undefined,
          checkInDateTime: r.checkInTime ? new Date(r.checkInTime).toISOString() : undefined,
          checkOutDateTime: r.checkOutTime ? new Date(r.checkOutTime).toISOString() : undefined,
          noOfAdults: Number(r.noOfAdults || 2),
          noOfChild: Number(r.noOfChild || 0),
        })),
      };

      await updateBooking(editingBooking.id, bookingPayload);

      showToast(`Reservation ${editingBooking.bookingRef} updated successfully!`, 'success');
      setEditingBooking(null);
      setSelectedBooking(null);
      if (refetch) refetch();
    } catch (err) {
      console.error('Failed to update reservation details:', err);
      showToast('Failed to update reservation details. Please check connection.', 'error');
    } finally {
      setIsSavingBookingEdit(false);
    }
  };

  const handleUpdateStatusWithToast = async (bookingId, newStatus, label) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      showToast(`Reservation status updated to ${label}!`, 'success');
    } catch (err) {
      showToast(`Failed to update status to ${label}.`, 'error');
    }
  };

  return (
    <div className={styles.container} data-testid="upcoming-bookings-page">
      {/* Toast Notification Banner */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconCircleTitle} style={{ background: 'var(--color-primary-light, #e0f2fe)', color: 'var(--color-primary, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '10px' }}>
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 className={styles.title}>Reservations & Upcoming Stays</h1>
            <p className={styles.subtitle}>
              Manage advance bookings, OTA channels, and guest arrivals.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsNewBookingModalOpen(true)}
          data-testid="new-reservation-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> New Reservation
        </Button>
      </div>

      {/* Metric Cards Row */}
      <div className={styles.summaryGrid}>
        {/* Card 1: TOTAL ARRIVALS */}
        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>TOTAL ARRIVALS TODAY</span>
            <div className={styles.cardValue}>{upcomingSummary.totalArrivals || 0}</div>
            <span className={styles.cardSubtext}>{upcomingSummary.checkInWindow || '0 Arrivals Scheduled'}</span>
          </div>
          <div className={styles.iconCircle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
        </div>

        {/* Card 2: ROOMS RESERVED */}
        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>ROOMS RESERVED</span>
            <div className={styles.cardValue}>{upcomingSummary.roomsReserved || 0}</div>
            <span className={styles.cardSubtext}>✓ {upcomingSummary.occupancyPercent || 'Active Bookings'}</span>
          </div>
          <div className={styles.iconCircle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BedDouble size={22} />
          </div>
        </div>

        {/* Card 3: FROM OTAs */}
        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>FROM OTAS</span>
            <div className={styles.cardValue}>{upcomingSummary.otaCount || 0}</div>
            <span className={styles.cardSubtext}>{upcomingSummary.otaChannels || 'Direct Only'}</span>
          </div>
          <div className={styles.iconCircle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={22} />
          </div>
        </div>

        {/* Card 4: PENDING ALLOTMENT */}
        <div className={styles.summaryCard}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>PENDING ALLOTMENT</span>
            <div className={styles.cardValue}>{upcomingSummary.pendingCount || 0}</div>
            {upcomingSummary.pendingCount > 0 ? (
              <span className={styles.cardAlertText} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontSize: '12px', fontWeight: 600 }}>
                <AlertTriangle size={14} /> {upcomingSummary.pendingCount} Pending Allotment(s)
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> All Clear (All Rooms Allotted)
              </span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: upcomingSummary.pendingCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(22, 163, 74, 0.15)',
              color: upcomingSummary.pendingCount > 0 ? '#d97706' : '#16a34a',
            }}
          >
            {upcomingSummary.pendingCount > 0 ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
          </div>
        </div>
      </div>

      {/* Control Row */}
      <div className={styles.controlRow}>
        <div className={styles.pillsGroup}>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'ALL' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('ALL')}
          >
            All
          </button>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'OTA' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('OTA')}
          >
            OTA
          </button>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'DIRECT' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('DIRECT')}
          >
            Walk-in / Direct
          </button>
          <button
            className={`${styles.pillBtn} ${activeFilter === 'PENDING' ? styles.activePill : ''}`}
            onClick={() => handleFilterChange('PENDING')}
          >
            Pending Allotment <span className={styles.badgeCount}>{upcomingSummary.pendingCount || 0}</span>
          </button>
        </div>

        <div className={styles.searchFilterGroup}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon} style={{ display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, ID or room..."
              value={searchQuery}
              onChange={handleSearchChange}
              data-testid="search-input"
            />
          </div>
          <button
            className={styles.filterIconButton}
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Filter & Sort Options"
            title="Sort & Filter Settings"
            data-testid="filter-settings-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer} data-testid="upcoming-loading">
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Fetching upcoming bookings from server...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorAlert} data-testid="upcoming-error">
          <AlertTriangle size={20} className={styles.errorIcon} />
          <div className={styles.errorContent}>
            <h4 className={styles.errorTitle}>Error Loading Reservations</h4>
            <p className={styles.errorMessage}>{error.message}</p>
          </div>
          <Button variant="secondary" onClick={refetch}>
            Retry API Request
          </Button>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <>
          {paginatedBookings.length > 0 ? (
            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>GUEST</th>
                    <th className={styles.th}>CHECK-IN</th>
                    <th className={styles.th}>CHECK-OUT</th>
                    <th className={styles.th}>TYPE / ROOM</th>
                    <th className={styles.th}>SOURCE / CHANNEL</th>
                    <th className={styles.th}>BOOKING ID</th>
                    <th className={styles.th}>AMOUNT</th>
                    <th className={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((b) => (
                    <tr
                      key={b.id}
                      className={styles.tr}
                    >
                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <div className={styles.guestCell}>
                          <Avatar name={b.guest?.name || 'Guest'} size="sm" />
                          <div className={styles.guestInfo}>
                            <span className={styles.guestName}>{b.guest?.name || 'Guest'}</span>
                            <span className={styles.guestEmail}>{b.guest?.email || ''}</span>
                          </div>
                        </div>
                      </td>

                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <span className={styles.dateText}>{b.checkIn}</span>
                      </td>

                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <span className={styles.dateText}>{b.checkOut}</span>
                      </td>

                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <span className={styles.roomTypeBadge}>{b.roomType}</span>
                      </td>

                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <div className={styles.channelCell}>
                          <span className={styles.channelIcon} style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <Globe size={14} />
                          </span>
                          <span className={styles.channelName}>{b.channel || 'Direct'}</span>
                        </div>
                      </td>

                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <span className={styles.bookingIdText}>{b.bookingRef}</span>
                      </td>

                      <td className={styles.td} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                        <span className={styles.amountText}>{b.amount}</span>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className={styles.pillBtn}
                            onClick={() => setSelectedBooking(b)}
                            title="View Details"
                            style={{ display: 'inline-flex', alignItems: 'center', padding: '6px' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles.pillBtn}
                            onClick={() => handleOpenEditBooking(b)}
                            title="Edit"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table Footer */}
              <div className={styles.tableFooter}>
                <span className={styles.paginationInfo} data-testid="pagination-range">
                  {rangeText}
                </span>
                <div className={styles.paginationControls}>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous Page"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      className={`${styles.pageBtn} ${
                        currentPage === num ? styles.activePageBtn : ''
                      }`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next Page"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState} data-testid="upcoming-empty">
              <p className={styles.emptyTitle}>No matching upcoming reservations found</p>
              <p className={styles.emptySubtitle}>
                Try adjusting your search query or filter category.
              </p>
            </div>
          )}
        </>
      )}

      {/* Selected Booking Details & Actions Modal */}
      {selectedBooking && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedBooking(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Reservation Details</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedBooking(null)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>Booking Ref:</strong> {selectedBooking.bookingRef}</p>
              <p><strong>Guest:</strong> {selectedBooking.guest?.name} ({selectedBooking.guest?.email})</p>
              <p><strong>Phone:</strong> {selectedBooking.guest?.phone || 'N/A'}</p>
              <p><strong>Room Category:</strong> {selectedBooking.roomType}</p>
              <p><strong>Check-In:</strong> {selectedBooking.checkIn}</p>
              <p><strong>Check-Out:</strong> {selectedBooking.checkOut}</p>
              <p><strong>Channel:</strong> {selectedBooking.channel}</p>
              <p><strong>Total Amount:</strong> {selectedBooking.amount}</p>
              <p><strong>Current Status:</strong> {selectedBooking.status}</p>
            </div>
            <div className={styles.modalFooter} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  handleOpenEditBooking(selectedBooking);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit3 size={15} /> Edit
              </Button>
              {selectedBooking.status !== 'CHECKED_IN' && selectedBooking.status !== 'CHECKED_OUT' && selectedBooking.status !== 'CANCELLED' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateStatusWithToast(selectedBooking.id, 'CHECKED_IN', 'Checked-In');
                    setSelectedBooking(null);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Clock size={15} /> Check-In
                </Button>
              )}
              {selectedBooking.status === 'CHECKED_IN' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateStatusWithToast(selectedBooking.id, 'CHECKED_OUT', 'Checked-Out');
                    setSelectedBooking(null);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Clock size={15} /> Check-Out
                </Button>
              )}
              {selectedBooking.status !== 'CHECKED_OUT' && selectedBooking.status !== 'CANCELLED' && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleUpdateStatusWithToast(selectedBooking.id, 'CANCELLED', 'Cancelled');
                    setSelectedBooking(null);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking, Per-Room Schedules & Guest Details Modal */}
      {editingBooking && (
        <div className={styles.modalBackdrop} onClick={() => setEditingBooking(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Reservation - {editingBooking.bookingRef}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setEditingBooking(null)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {editErrorMsg && (
                <div className={styles.errorAlert} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <AlertTriangle size={18} />
                  <span>{editErrorMsg}</span>
                </div>
              )}

              {/* Section 1: Primary Guest Details */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> Primary Guest Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>FIRST NAME *</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.firstName}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>LAST NAME</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.lastName}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, lastName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>PHONE NUMBER</label>
                    <input
                      type="tel"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.phone}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.email}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ID PROOF TYPE</label>
                    <select
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.idProofType}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, idProofType: e.target.value })}
                    >
                      <option value="passport">Passport</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="license">Driving License</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ID PROOF NUMBER</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.idNumber}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, idNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Per-Room Selection & Stay Schedules */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BedDouble size={16} /> Assigned Rooms & Per-Room Stay Schedules ({editBookingForm.rooms.length})
                </h4>

                {editBookingForm.rooms.map((room, idx) => {
                  const conflict = checkRoomConflict(room.roomId, room.checkInTime, room.checkOutTime, editingBooking.id);
                  const selectedRoomObj = availableRooms.find((r) => String(r.id) === String(room.roomId));
                  const activeBookingForSelected = selectedRoomObj ? getActiveBookingForRoom(selectedRoomObj, editingBooking.id) : null;

                  return (
                    <div key={room.id} style={{ border: conflict ? '1px solid #fca5a5' : '1px solid var(--color-border)', borderRadius: '6px', padding: '12px', marginBottom: '12px', background: conflict ? '#fff5f5' : '#fff' }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: conflict ? '#b91c1c' : 'var(--color-primary)', marginBottom: '8px' }}>
                        ROOM SELECTION #{idx + 1} {conflict ? '(DATE CONFLICT)' : ''}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ASSIGNED ROOM</label>
                          <select
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            value={room.roomId}
                            onChange={(e) => handleEditRoomChange(idx, 'roomId', e.target.value)}
                          >
                            <option value="">-- Unassigned (Pending Room Allotment) --</option>
                            {availableRooms.map((r) => (
                              <option key={r.id} value={r.id}>
                                {getRoomOptionLabel(r, editingBooking.id)}
                              </option>
                            ))}
                          </select>

                          {/* Formatting: Bold Room Name & Price, Normal Reserved Time */}
                          {selectedRoomObj && (
                            <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                              <span style={{ fontWeight: 700, color: 'var(--color-text-main, #0f172a)' }}>
                                Room #{selectedRoomObj.roomNumber || selectedRoomObj.title} - {selectedRoomObj.title || selectedRoomObj.roomType?.type} (₹{selectedRoomObj.pricePerNight || 250}/night)
                              </span>
                              {activeBookingForSelected ? (
                                <span style={{ fontWeight: 400, color: '#475569' }}>
                                  — Reserved: {activeBookingForSelected.checkIn} to {activeBookingForSelected.checkOut}
                                </span>
                              ) : (
                                <span style={{ fontWeight: 400, color: '#16a34a' }}>
                                  — Available
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ROOM CHECK-IN DATE & TIME</label>
                          <input
                            type="datetime-local"
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            value={room.checkInTime}
                            onChange={(e) => handleEditRoomChange(idx, 'checkInTime', e.target.value)}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ROOM CHECK-OUT DATE & TIME</label>
                          <input
                            type="datetime-local"
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            value={room.checkOutTime}
                            onChange={(e) => handleEditRoomChange(idx, 'checkOutTime', e.target.value)}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>NO. OF ADULTS</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            value={room.noOfAdults}
                            onChange={(e) => handleEditRoomChange(idx, 'noOfAdults', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>NO. OF CHILDREN</label>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            value={room.noOfChild}
                            onChange={(e) => handleEditRoomChange(idx, 'noOfChild', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      {/* Conflict Notice Warning */}
                      {conflict && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', marginTop: '12px', fontWeight: 500 }}>
                          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                          <span>
                            <strong>SCHEDULE CONFLICT:</strong> Room is already reserved by <strong>{conflict.guestName}</strong> from <strong>{conflict.checkIn}</strong> to <strong>{conflict.checkOut}</strong>. Please change dates or select a different room.
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Section 3: Booking Options Edit */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Booking & Financial Options
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>BOOKING STATUS</label>
                    <select
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.bookingStatus}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, bookingStatus: e.target.value })}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="checked_in">Checked In</option>
                      <option value="checked_out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No Show</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>BOOKING SOURCE</label>
                    <select
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.bookingSource}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, bookingSource: e.target.value })}
                    >
                      <option value="walk_in">Walk-in</option>
                      <option value="website">Website</option>
                      <option value="phone">Phone</option>
                      <option value="other">OTA / Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>DISCOUNT PERCENT (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.discountPercent}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, discountPercent: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>TAX PERCENT (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      value={editBookingForm.taxPercent}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, taxPercent: Number(e.target.value) })}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>SPECIAL REQUESTS</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      placeholder="e.g. Early check-in, high floor"
                      value={editBookingForm.specialRequest}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, specialRequest: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>REMARKS</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      placeholder="Staff remarks or internal notes"
                      value={editBookingForm.remarks}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, remarks: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setEditingBooking(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveBookingEdit} disabled={isSavingBookingEdit}>
                {isSavingBookingEdit ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sort Settings Modal */}
      {isFilterModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsFilterModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Sort & Filter Settings</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setIsFilterModalOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>SORT ORDER</label>
                <select
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="OLDEST">Oldest First</option>
                  <option value="AMOUNT_HIGH">Amount (High to Low)</option>
                  <option value="AMOUNT_LOW">Amount (Low to High)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>FILTER CATEGORY</label>
                <select
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  value={activeFilter}
                  onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">All Reservations</option>
                  <option value="OTA">OTA Channels</option>
                  <option value="DIRECT">Walk-in / Direct</option>
                  <option value="PENDING">Pending Allotment</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setIsFilterModalOpen(false)}>Close</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsFilterModalOpen(false);
                  showToast('Sort and filter preferences applied.', 'info');
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal Overlay */}
      {isNewBookingModalOpen && (
        <FutureBookingModal
          isOpen={isNewBookingModalOpen}
          onClose={() => setIsNewBookingModalOpen(false)}
          onBookingCreated={handleBookingCreated}
          onToast={showToast}
        />
      )}
    </div>
  );
}
