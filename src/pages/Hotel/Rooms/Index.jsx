/**
 * @file Hotel/Rooms/Index.jsx
 * @description Room Management dashboard & inventory interface for SyncStays platform.
 * Connected strictly to live backend APIs:
 * - GET /api/room
 * - GET /api/room/:id
 * - POST /api/room
 * - PUT /api/room/:id
 * - DELETE /api/room/:id
 * - Live Room Types from GET /api/room-type
 * - Live Amenities from GET /api/amenity
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import Toast from '@components/Toast/Toast';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import roomService from '@services/roomService';
import roomTypeService from '@services/roomTypeService';
import amenityService from '@services/amenityService';
import styles from './Index.module.css';

function StatusBadge({ status }) {
  const normStatus = (status || 'AVAILABLE').toUpperCase();
  const isAvailable = normStatus === 'AVAILABLE' || normStatus === 'VACANT';
  const isOccupied = normStatus === 'OCCUPIED';
  const isCheckout = normStatus === 'CHECKOUT' || normStatus === 'DIRTY' || normStatus === 'CLEANING';

  const label = isAvailable
    ? 'Available'
    : isOccupied
    ? 'Occupied'
    : isCheckout
    ? 'Checkout / Dirty'
    : normStatus;

  const styleClass = isAvailable
    ? styles.available
    : isOccupied
    ? styles.occupied
    : styles.checkout;

  return (
    <span className={`${styles.statusBadge} ${styleClass}`}>
      {label}
    </span>
  );
}

function RoomCard({ room }) {
  const normStatus = (room.status || 'AVAILABLE').toUpperCase();
  const isAvailable = normStatus === 'AVAILABLE' || normStatus === 'VACANT';

  return (
    <article className={styles.roomCard}>
      <div className={styles.roomCardHeader}>
        <h3 className={styles.roomNumber}>{room.roomNumber}</h3>
        <StatusBadge status={room.status} />
      </div>

      {isAvailable ? (
        <>
          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Room Type</span>
            <strong className={styles.infoValue}>
              {room.roomTypeName || 'Standard Room'}
            </strong>
          </div>

          <div className={styles.roomCardFooter}>
            <span>{room.rateText || `Rate: ₹${room.effectiveRate || room.rateOverride || 0}`}</span>
            <span className={styles.readyIcon}>✓</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Guest / Status</span>
            <strong className={styles.infoValue}>
              {room.guestName || room.status}
            </strong>
          </div>

          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Room Category</span>
            <span className={styles.infoValue}>{room.roomTypeName || 'Room'}</span>
          </div>
        </>
      )}
    </article>
  );
}

function FloorSection({ floor }) {
  return (
    <section className={styles.floorSection}>
      <div className={styles.floorHeader}>
        <span className={styles.floorAccent} />
        <h2 className={styles.floorTitle}>{floor.floorName}</h2>
        <span className={styles.floorMeta}>
          {floor.rooms.length} Units • {floor.occupiedCount} Occupied
        </span>
      </div>

      <div className={styles.roomsGrid}>
        {floor.rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}

function KpiCard({ item }) {
  return (
    <article className={`${styles.kpiCard} ${styles[`kpi-${item.type}`]}`}>
      <div className={styles.kpiTopAccent} />
      <div className={styles.kpiContent}>
        <div>
          <span className={styles.kpiLabel}>{item.label}</span>
          <strong className={styles.kpiValue}>{item.value}</strong>
        </div>
        <div className={`${styles.kpiIcon} ${styles[`icon-${item.type}`]}`}>
          {item.icon}
        </div>
      </div>
      <span className={`${styles.kpiSecondary} ${item.type === 'checkout' ? styles.urgentText : ''}`}>
        {item.secondary}
      </span>
    </article>
  );
}

export default function HotelRoomsPage() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'TABLE'

  // Real Backend State
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal Control States
  const [isFloorModalOpen, setFloorModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);

  // Form Field State for Add/Edit
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '1',
    roomTypeId: '',
    rateOverride: '',
    isSmoking: false,
    status: 'AVAILABLE',
    amenityIds: [],
  });

  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Fetch room types & amenities for dropdowns and lookup maps
   */
  const fetchDependencies = useCallback(async () => {
    try {
      const [rtRes, amRes] = await Promise.all([
        roomTypeService.getAll(),
        amenityService.getAll(),
      ]);

      let rtList = [];
      if (Array.isArray(rtRes?.data)) rtList = rtRes.data;
      else if (rtRes?.data && Array.isArray(rtRes.data.roomTypes)) rtList = rtRes.data.roomTypes;
      else if (rtRes?.data && Array.isArray(rtRes.data.data)) rtList = rtRes.data.data;
      else if (Array.isArray(rtRes)) rtList = rtRes;

      let amList = [];
      if (Array.isArray(amRes?.data)) amList = amRes.data;
      else if (amRes?.data && Array.isArray(amRes.data.amenities)) amList = amRes.data.amenities;
      else if (amRes?.data && Array.isArray(amRes.data.data)) amList = amRes.data.data;
      else if (Array.isArray(amRes)) amList = amRes;

      setRoomTypes(
        rtList.map((item, idx) => ({
          id: item.id || item._id || `rt-${idx}`,
          name: item.name || item.title || 'Room Type',
          code: item.code || item.typeCode || '',
          baseRate: item.baseRate || item.price || 0,
        }))
      );

      setAmenities(
        amList.map((item, idx) => ({
          id: item.id || item._id || `am-${idx}`,
          name: item.name || item.title || 'Amenity',
          code: item.code || '',
        }))
      );
    } catch (err) {
      console.warn('Unable to load dependencies for Room management:', err);
    }
  }, []);

  // Room Type Lookup Map
  const roomTypesMap = useMemo(() => {
    const map = {};
    roomTypes.forEach((rt) => {
      map[rt.id] = rt;
    });
    return map;
  }, [roomTypes]);

  // Amenity Lookup Map
  const amenitiesMap = useMemo(() => {
    const map = {};
    amenities.forEach((am) => {
      map[am.id] = am;
    });
    return map;
  }, [amenities]);

  /**
   * Fetch rooms from backend GET /api/room
   */
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomService.getAll();

      let roomsData = [];
      if (Array.isArray(response?.data)) {
        roomsData = response.data;
      } else if (response?.data && Array.isArray(response.data.rooms)) {
        roomsData = response.data.rooms;
      } else if (response?.data && Array.isArray(response.data.data)) {
        roomsData = response.data.data;
      } else if (Array.isArray(response)) {
        roomsData = response;
      }

      const normalizedRooms = roomsData.map((item, index) => {
        const id = item.id || item._id || `rm-${index}`;
        const roomNumber = String(item.roomNumber || item.number || item.id || index + 101);
        const floor = String(item.floor || 'Floor 01');
        const roomTypeId =
          item.roomTypeId ||
          item.roomType?.id ||
          (typeof item.roomType === 'string' ? item.roomType : '');

        const typeObj = typeof item.roomType === 'object' ? item.roomType : roomTypesMap[roomTypeId];
        const roomTypeName = typeObj?.name || item.roomTypeName || 'Standard Room';

        const rateOverride = item.rateOverride || item.effectiveRate || typeObj?.baseRate || 0;
        const isSmoking = Boolean(item.isSmoking);
        const status = (item.status || 'AVAILABLE').toUpperCase();

        let roomAmenityIds = [];
        if (Array.isArray(item.amenityIds)) roomAmenityIds = item.amenityIds;
        else if (Array.isArray(item.amenities)) {
          roomAmenityIds = item.amenities.map((a) => (typeof a === 'string' ? a : a.id));
        }

        return {
          id,
          roomNumber,
          floor: floor.startsWith('Floor') ? floor : `Floor ${floor.padStart(2, '0')}`,
          roomTypeId,
          roomTypeName,
          rateOverride,
          isSmoking,
          status,
          amenityIds: roomAmenityIds,
          rawItem: item,
        };
      });

      setRooms(normalizedRooms);
    } catch (err) {
      console.error('API Error fetching rooms:', err);
      setError(
        err.message || 'Failed to communicate with backend server (http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  }, [roomTypesMap]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // ==========================================
  // DYNAMIC KPI CALCULATIONS FROM BACKEND DATA
  // ==========================================
  const kpiData = useMemo(() => {
    const total = rooms.length;
    const vacantCount = rooms.filter(
      (r) => r.status === 'AVAILABLE' || r.status === 'VACANT'
    ).length;
    const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length;
    const checkoutCount = rooms.filter(
      (r) => r.status === 'DIRTY' || r.status === 'CLEANING' || r.status === 'CHECKOUT'
    ).length;
    const maintenanceCount = rooms.filter(
      (r) => r.status === 'OUT_OF_ORDER' || r.status === 'BLOCKED'
    ).length;

    const occPct = total > 0 ? ((occupiedCount / total) * 100).toFixed(1) : '0';

    return [
      {
        label: 'Vacant / Available',
        value: String(vacantCount),
        secondary: `${total - occupiedCount} rooms ready`,
        icon: '▥',
        type: 'vacant',
      },
      {
        label: 'Occupied',
        value: String(occupiedCount),
        secondary: `${occPct}% total occupancy`,
        icon: '♙',
        type: 'occupied',
      },
      {
        label: 'Housekeeping / Dirty',
        value: String(checkoutCount),
        secondary: 'Pending inspection',
        icon: '↪',
        type: 'checkout',
      },
      {
        label: 'Maintenance / Out of Order',
        value: String(maintenanceCount),
        secondary: 'Under service',
        icon: '▣',
        type: 'tomorrow',
      },
    ];
  }, [rooms]);

  // ==========================================
  // DYNAMIC FLOOR GROUPINGS FOR DASHBOARD
  // ==========================================
  const floorGroups = useMemo(() => {
    const groups = {};

    rooms.forEach((rm) => {
      const flName = rm.floor;
      if (!groups[flName]) {
        groups[flName] = {
          floorName: flName,
          rooms: [],
          occupiedCount: 0,
        };
      }
      groups[flName].rooms.push(rm);
      if (rm.status === 'OCCUPIED') {
        groups[flName].occupiedCount += 1;
      }
    });

    // Filter rooms by search, room type filter, and status filter
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return Object.values(groups)
      .map((flGroup) => {
        const filteredRooms = flGroup.rooms.filter((rm) => {
          const matchesSearch =
            !normalizedSearch ||
            rm.roomNumber.toLowerCase().includes(normalizedSearch) ||
            rm.roomTypeName.toLowerCase().includes(normalizedSearch);

          const matchesType =
            roomTypeFilter === 'ALL' || rm.roomTypeId === roomTypeFilter;

          const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'available' && (rm.status === 'AVAILABLE' || rm.status === 'VACANT')) ||
            (statusFilter === 'occupied' && rm.status === 'OCCUPIED');

          return matchesSearch && matchesType && matchesStatus;
        });

        return {
          ...flGroup,
          rooms: filteredRooms,
        };
      })
      .filter((flGroup) => flGroup.rooms.length > 0);
  }, [rooms, searchTerm, roomTypeFilter, statusFilter]);

  // Filtered Rooms for Data Table View
  const filteredTableRooms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return rooms.filter((rm) => {
      const matchesSearch =
        !normalizedSearch ||
        rm.roomNumber.toLowerCase().includes(normalizedSearch) ||
        rm.roomTypeName.toLowerCase().includes(normalizedSearch);
      const matchesType =
        roomTypeFilter === 'ALL' || rm.roomTypeId === roomTypeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available' && (rm.status === 'AVAILABLE' || rm.status === 'VACANT')) ||
        (statusFilter === 'occupied' && rm.status === 'OCCUPIED');
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, searchTerm, roomTypeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTableRooms.length / pageSize) || 1;
  const paginatedTableRooms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTableRooms.slice(start, start + pageSize);
  }, [filteredTableRooms, currentPage, pageSize]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    const defaultRoomTypeId = roomTypes.length > 0 ? roomTypes[0].id : '';
    setFormData({
      roomNumber: '',
      floor: 'Floor 01',
      roomTypeId: defaultRoomTypeId,
      rateOverride: '',
      isSmoking: false,
      status: 'AVAILABLE',
      amenityIds: [],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = async (roomItem) => {
    try {
      const res = await roomService.getById(roomItem.id);
      const data = res?.data || roomItem;
      setEditingRoom(roomItem);
      setFormData({
        roomNumber: data.roomNumber || roomItem.roomNumber,
        floor: data.floor || roomItem.floor || 'Floor 01',
        roomTypeId: data.roomTypeId || roomItem.roomTypeId || (roomTypes.length > 0 ? roomTypes[0].id : ''),
        rateOverride: data.rateOverride ? String(data.rateOverride) : String(roomItem.rateOverride || ''),
        isSmoking: Boolean(data.isSmoking || roomItem.isSmoking),
        status: data.status || roomItem.status || 'AVAILABLE',
        amenityIds: data.amenityIds || roomItem.amenityIds || [],
      });
    } catch {
      setEditingRoom(roomItem);
      setFormData({
        roomNumber: roomItem.roomNumber,
        floor: roomItem.floor || 'Floor 01',
        roomTypeId: roomItem.roomTypeId || (roomTypes.length > 0 ? roomTypes[0].id : ''),
        rateOverride: roomItem.rateOverride ? String(roomItem.rateOverride) : '',
        isSmoking: roomItem.isSmoking,
        status: roomItem.status || 'AVAILABLE',
        amenityIds: roomItem.amenityIds || [],
      });
    }
  };

  /**
   * Save Room Handler (Connected to POST /api/room & PUT /api/room/:id)
   */
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber.trim()) {
      showToast('Room number is required.', 'error');
      return;
    }
    if (!formData.roomTypeId) {
      showToast('Room Type selection is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      roomNumber: formData.roomNumber.trim(),
      floor: formData.floor.trim() || 'Floor 01',
      roomTypeId: formData.roomTypeId,
      rateOverride: formData.rateOverride ? Number(formData.rateOverride) : null,
      isSmoking: formData.isSmoking,
      status: formData.status,
      amenityIds: formData.amenityIds,
    };

    try {
      if (editingRoom) {
        const response = await roomService.update(editingRoom.id, payload);
        showToast(
          response?.message || `Room ${formData.roomNumber} updated successfully.`,
          'success'
        );
        setEditingRoom(null);
        setFormData({
          roomNumber: '',
          floor: 'Floor 01',
          roomTypeId: '',
          rateOverride: '',
          isSmoking: false,
          status: 'AVAILABLE',
          amenityIds: [],
        });
        await fetchRooms();
      } else {
        const response = await roomService.create(payload);
        showToast(
          response?.message || `Room ${formData.roomNumber} created successfully.`,
          'success'
        );
        setIsAddModalOpen(false);
        setFormData({
          roomNumber: '',
          floor: 'Floor 01',
          roomTypeId: '',
          rateOverride: '',
          isSmoking: false,
          status: 'AVAILABLE',
          amenityIds: [],
        });
        await fetchRooms();
      }
    } catch (err) {
      console.error(`API Error ${editingRoom ? 'updating' : 'creating'} room:`, err);
      showToast(
        err.message || `Failed to ${editingRoom ? 'update' : 'create'} room on the server.`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Delete Room Handler (Connected to DELETE /api/room/:id)
   */
  const handleDeleteConfirm = async () => {
    if (!deletingRoom) return;
    setIsSubmitting(true);
    try {
      const response = await roomService.delete(deletingRoom.id);
      showToast(
        response?.message || `Room ${deletingRoom.roomNumber} deleted successfully.`,
        'success'
      );
      setDeletingRoom(null);
      await fetchRooms();
    } catch (err) {
      console.error('API Error deleting room:', err);
      showToast(
        err.message || 'Failed to delete room on the server.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAmenitySelection = (amenityId) => {
    setFormData((prev) => {
      const exists = prev.amenityIds.includes(amenityId);
      return {
        ...prev,
        amenityIds: exists
          ? prev.amenityIds.filter((id) => id !== amenityId)
          : [...prev.amenityIds, amenityId],
      };
    });
  };

  return (
    <div className={styles.page} data-testid="hotel-rooms-page">
      {/* Toast Notification Banner */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Mobile Search */}
      <div className={styles.topSearchMobile}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search rooms, types..."
          className={styles.searchInput}
        />
      </div>

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Room Management & Inventory</h1>
          <p className={styles.subtitle}>
            Monitor floor-level room status, occupancy, and manage property inventory.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.configureButton}
            onClick={() => setFloorModalOpen(true)}
          >
            Configure Floors
          </button>
          <Button variant="primary" onClick={handleOpenAddModal}>
            + Add Room
          </Button>
        </div>
      </header>

      {/* Tab View Switcher */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'OVERVIEW' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setActiveTab('OVERVIEW')}
        >
          🏢 Floor Overview & KPIs
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'TABLE' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setActiveTab('TABLE')}
        >
          📋 Room Inventory Table ({rooms.length})
        </button>
      </div>

      {/* Dynamic KPI Summary Cards */}
      <section className={styles.kpiGrid} aria-label="Room summary">
        {kpiData.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      {/* Controls Bar: Search & Category Filters */}
      <section className={styles.filters}>
        <div className={styles.roomTypeFilters}>
          <button
            type="button"
            onClick={() => setRoomTypeFilter('ALL')}
            className={`${styles.filterButton} ${
              roomTypeFilter === 'ALL' ? styles.activeFilter : ''
            }`}
          >
            All Room Types
          </button>
          {roomTypes.map((rt) => (
            <button
              key={rt.id}
              type="button"
              onClick={() => setRoomTypeFilter(rt.id)}
              className={`${styles.filterButton} ${
                roomTypeFilter === rt.id ? styles.activeFilter : ''
              }`}
            >
              {rt.name}
            </button>
          ))}
        </div>

        <div className={styles.statusFilters}>
          <button
            type="button"
            onClick={() =>
              setStatusFilter((current) =>
                current === 'available' ? 'all' : 'available'
              )
            }
            className={`${styles.statusFilterButton} ${
              statusFilter === 'available' ? styles.activeStatusFilter : ''
            }`}
          >
            <span className={`${styles.filterDot} ${styles.availableDot}`} />
            Available
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter((current) =>
                current === 'occupied' ? 'all' : 'occupied'
              )
            }
            className={`${styles.statusFilterButton} ${
              statusFilter === 'occupied' ? styles.activeStatusFilter : ''
            }`}
          >
            <span className={`${styles.filterDot} ${styles.occupiedDot}`} />
            Occupied
          </button>
        </div>
      </section>

      {/* VIEW 1: FLOOR OVERVIEW & KPIS */}
      {activeTab === 'OVERVIEW' && (
        <div className={styles.floorList}>
          {loading ? (
            <div className={styles.emptyState}>
              <h3>Fetching rooms from backend (http://localhost:5000/api/room)...</h3>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <h3 style={{ color: 'var(--color-error)' }}>⚠️ {error}</h3>
              <Button variant="secondary" size="sm" onClick={fetchRooms}>
                Retry Connection
              </Button>
            </div>
          ) : floorGroups.length > 0 ? (
            floorGroups.map((floor) => (
              <FloorSection key={floor.floorName} floor={floor} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No rooms found</h3>
              <p>Try changing your search or room filters.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ROOM INVENTORY DATA TABLE */}
      {activeTab === 'TABLE' && (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Room Number</th>
                  <th className={styles.th}>Floor</th>
                  <th className={styles.th}>Room Type</th>
                  <th className={styles.th}>Rate / Override</th>
                  <th className={styles.th}>Amenities</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      Fetching room inventory from backend (http://localhost:5000/api/room)...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }}>
                        ⚠️ {error}
                      </div>
                      <Button variant="secondary" size="sm" onClick={fetchRooms}>
                        Retry Connection
                      </Button>
                    </td>
                  </tr>
                ) : paginatedTableRooms.length > 0 ? (
                  paginatedTableRooms.map((rm) => (
                    <tr key={rm.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles.codeBadge}>{rm.roomNumber}</span>
                      </td>
                      <td className={styles.td}>
                        <span>{rm.floor}</span>
                      </td>
                      <td className={styles.td}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {rm.roomTypeName}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                          ₹{Number(rm.rateOverride).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {rm.amenityIds && rm.amenityIds.length > 0 ? (
                            rm.amenityIds.map((amId, idx) => (
                              <Badge key={idx} variant="secondary">
                                {amenitiesMap[amId]?.name || amId}
                              </Badge>
                            ))
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>
                              Default amenities
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <StatusBadge status={rm.status} />
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionsCell}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEditModal(rm)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ color: 'var(--color-error)' }}
                            onClick={() => setDeletingRoom(rm)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      No rooms match the selected filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          {!loading && !error && (
            <div className={styles.paginationBar}>
              <div className={styles.paginationInfo}>
                Showing{' '}
                {filteredTableRooms.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}{' '}
                to {Math.min(currentPage * pageSize, filteredTableRooms.length)} of{' '}
                {filteredTableRooms.length} rooms
              </div>
              <div className={styles.paginationControls}>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span
                  style={{
                    fontSize: 'var(--font-size-md)',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        className={styles.quickReservationButton}
        onClick={handleOpenAddModal}
        aria-label="Create room"
      >
        <span className={styles.plusIcon}>+</span>
        Add Room
      </button>

      {/* Floor Configuration Modal */}
      <FloorConfigurationModal
        isOpen={isFloorModalOpen}
        onClose={() => setFloorModalOpen(false)}
        onSave={() => setFloorModalOpen(false)}
      />

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingRoom}
        onClose={() => {
          if (isSubmitting) return;
          setIsAddModalOpen(false);
          setEditingRoom(null);
        }}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoom(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSaveRoom}
            >
              {isSubmitting
                ? 'Saving...'
                : editingRoom
                ? 'Save Changes'
                : 'Create Room'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveRoom} className={styles.formGrid}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Room Number *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. 101, 204"
                value={formData.roomNumber}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Floor</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Floor 01, 2"
                value={formData.floor}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Room Type *</label>
              <select
                className={styles.formSelect}
                value={formData.roomTypeId}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, roomTypeId: e.target.value })
                }
                required
              >
                <option value="">Select Room Type...</option>
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name} ({rt.code})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rate Override (₹)</label>
              <input
                type="number"
                min="0"
                className={styles.formInput}
                placeholder="Optional override price"
                value={formData.rateOverride}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, rateOverride: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Operational Status *</label>
              <select
                className={styles.formSelect}
                value={formData.status}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="DIRTY">DIRTY</option>
                <option value="CLEANING">CLEANING</option>
                <option value="OUT_OF_ORDER">OUT OF ORDER</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Smoking Allowed</label>
              <select
                className={styles.formSelect}
                value={formData.isSmoking ? 'true' : 'false'}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, isSmoking: e.target.value === 'true' })
                }
              >
                <option value="false">Non-Smoking</option>
                <option value="true">Smoking Room</option>
              </select>
            </div>
          </div>

          {amenities.length > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Amenity Overrides</label>
              <div className={styles.amenityCheckboxGrid}>
                {amenities.map((am) => (
                  <label key={am.id} className={styles.amenityCheckboxItem}>
                    <input
                      type="checkbox"
                      checked={formData.amenityIds.includes(am.id)}
                      disabled={isSubmitting}
                      onChange={() => toggleAmenitySelection(am.id)}
                    />
                    <span>{am.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Room Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingRoom}
        onClose={() => {
          if (isSubmitting) return;
          setDeletingRoom(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message={`Are you sure you want to delete room ${deletingRoom?.roomNumber}?`}
        isDestructive={true}
      />
    </div>
  );
}