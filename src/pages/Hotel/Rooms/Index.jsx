/**
 * @file Hotel/Rooms/Index.jsx
 * @description Room Management dashboard & inventory interface for SyncStays platform.
 * Connected strictly to live backend APIs:
 * - GET /api/room
 * - GET /api/room/:id
 * - POST /api/room
 * - PUT /api/room/:id
 * - DELETE /api/room/:id
 * - POST /api/file (multi-image upload & management)
 * - Live Room Types from GET /api/room-type
 * - Live Amenities from GET /api/amenity
 */

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import Toast from '@components/Toast/Toast';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import roomService from '@services/roomService';
import roomTypeService from '@services/roomTypeService';
import amenityService from '@services/amenityService';
import fileService from '@services/fileService';
import ImageViewerModal from '@components/ImageViewerModal/ImageViewerModal';
import styles from './Index.module.css';

const isValidUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

const formatTimeForApi = (timeStr) => {
  if (!timeStr) return '14:00:00';
  const parts = timeStr.split(':');
  if (parts.length === 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
  if (parts.length === 3) return timeStr;
  return '14:00:00';
};

const parseTimeFromApi = (timeStr, defaultTime = '14:00') => {
  if (!timeStr) return defaultTime;
  const parts = timeStr.split(':');
  if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  return defaultTime;
};

/* ========================================================= */
/* PREMIUM SVG ICON COMPONENTS                               */
/* ========================================================= */
const EyeIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PencilIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const BuildingIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const TableIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
  </svg>
);

const CameraIcon = ({ size = 26, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const AlertCircleIcon = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const XIcon = ({ size = 14, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const UserCheckIcon = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

const SparklesIcon = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

const WrenchIcon = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

function StatusBadge({ status }) {
  const normStatus = (status || 'AVAILABLE').toUpperCase();
  const isAvailable = normStatus === 'AVAILABLE' || normStatus === 'VACANT';
  const isOccupied = normStatus === 'OCCUPIED';
  const isCheckout =
    normStatus === 'CHECKOUT' ||
    normStatus === 'DIRTY' ||
    normStatus === 'CLEANING' ||
    normStatus === 'UNDER_CLEANING';

  const label = isAvailable
    ? 'Available'
    : isOccupied
    ? 'Occupied'
    : isCheckout
    ? (normStatus === 'UNDER_CLEANING' ? 'Under Cleaning' : 'Checkout / Dirty')
    : normStatus === 'OUT_OF_SERVICE'
    ? 'Out of Service'
    : normStatus === 'RESERVED'
    ? 'Reserved'
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

function RoomCard({ room, onSelect }) {
  const normStatus = (room.status || 'AVAILABLE').toUpperCase();
  const isAvailable = normStatus === 'AVAILABLE' || normStatus === 'VACANT';
  const coverImage = room.images && room.images.length > 0 ? room.images[0].url : null;

  return (
    <article
      className={`${styles.roomCard} ${styles.clickableCard}`}
      onClick={() => onSelect && onSelect(room)}
      role="button"
      tabIndex={0}
      title="Click to view full room specifications"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(room);
        }
      }}
    >
      {coverImage && (
        <img
          src={coverImage}
          alt={`Room ${room.roomNumber}`}
          className={styles.roomCardThumbBanner}
        />
      )}

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
            <span>
              ₹{Number(room.rateOverride || 0).toLocaleString('en-IN')} / night
            </span>
            <span className={styles.readyIcon} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <CheckCircleIcon size={14} />
            </span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Status / Guest</span>
            <strong className={styles.infoValue}>
              {room.guestName || room.status}
            </strong>
          </div>

          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Room Type</span>
            <span className={styles.infoValue}>{room.roomTypeName || 'Room'}</span>
          </div>

          <div className={styles.roomCardFooter}>
            <span>₹{Number(room.rateOverride || 0).toLocaleString('en-IN')} / night</span>
          </div>
        </>
      )}
    </article>
  );
}

function FloorSection({ floor, onSelectRoom }) {
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
          <RoomCard key={room.id} room={room} onSelect={onSelectRoom} />
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

const defaultInitialFormData = {
  title: '',
  roomNumber: '',
  floorNumber: 1,
  roomTypeId: '',
  pricePerNight: '250',
  checkInTime: '14:00',
  checkOutTime: '11:00',
  maxGuestAdultAllowed: 2,
  maxGuestChildAllowed: 1,
  maxGuestInfantAllowed: 1,
  baseGuestInBasePriceAdult: 2,
  baseGuestInBasePriceChild: 0,
  extraFeesPerAdult: 0,
  extraFeesPerChild: 0,
  noOfBedRooms: 1,
  noOfWashRooms: 1,
  noOfLivingRooms: 1,
  sizeInSqft: 350,
  status: 'available',
  mealsAvailable: false,
  isSmoking: false,
  description: '',
  amenityIds: [],
  images: [], // [{ id, url, name, isUploading }]
};

export default function HotelRoomsPage() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'TABLE'

  // Real Backend State
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
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
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Lightbox Image Viewer State
  const [viewerImages, setViewerImages] = useState([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
  const [viewerTitle, setViewerTitle] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Form Field State for Add/Edit (Strictly 19+ backend fields + image upload)
  const [formData, setFormData] = useState(defaultInitialFormData);
  const roomFileInputRef = useRef(null);

  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleSelectRoom = (roomId) => {
    setSelectedRoomIds((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

  const toggleSelectAllRooms = () => {
    if (selectedRoomIds.size === paginatedTableRooms.length && paginatedTableRooms.length > 0) {
      setSelectedRoomIds(new Set());
    } else {
      setSelectedRoomIds(new Set(paginatedTableRooms.map((r) => r.id)));
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedRoomIds.size === 0) return;
    setIsSubmitting(true);
    try {
      const roomIds = Array.from(selectedRoomIds);
      const res = await roomService.bulkDelete(roomIds);
      showToast(res?.message || `Successfully deleted ${roomIds.length} rooms.`, 'success');
      setSelectedRoomIds(new Set());
      setShowBulkDeleteModal(false);
      await fetchRooms();
    } catch (err) {
      console.error('API Error bulk deleting rooms:', err);
      showToast(err.message || 'Failed to bulk delete rooms.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Fetch room types & amenities for dropdowns and lookup maps.
   */
  const fetchDependencies = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        roomTypeService.getAll(),
        amenityService.getAll(),
      ]);

      const rtRes = results[0].status === 'fulfilled' ? results[0].value : null;
      const amRes = results[1].status === 'fulfilled' ? results[1].value : null;

      if (rtRes) {
        const rtRaw = rtRes?.data;
        const rtList = Array.isArray(rtRaw)
          ? rtRaw
          : Array.isArray(rtRaw?.responses)
          ? rtRaw.responses
          : Array.isArray(rtRaw?.rows)
          ? rtRaw.rows
          : Array.isArray(rtRaw?.roomTypes)
          ? rtRaw.roomTypes
          : Array.isArray(rtRaw?.data)
          ? rtRaw.data
          : Array.isArray(rtRes)
          ? rtRes
          : [];

        const mappedRoomTypes = rtList.map((item, idx) => ({
          id: item.id || item._id || `rt-${idx}`,
          name: item.type || item.name || item.title || 'Room Type',
          type: item.type || item.name || 'Room Type',
          iconUrl: item.icon?.url || null,
          rawItem: item,
        }));
        setRoomTypes(mappedRoomTypes);
      }

      if (amRes) {
        const amRaw = amRes?.data;
        const amList = Array.isArray(amRaw)
          ? amRaw
          : Array.isArray(amRaw?.responses)
          ? amRaw.responses
          : Array.isArray(amRaw?.rows)
          ? amRaw.rows
          : Array.isArray(amRaw?.amenities)
          ? amRaw.amenities
          : Array.isArray(amRaw?.data)
          ? amRaw.data
          : Array.isArray(amRes)
          ? amRes
          : [];

        const mappedAmenities = amList.map((item, idx) => ({
          id: item.id || item._id || `am-${idx}`,
          name: item.name || item.title || 'Amenity',
          code: item.code || '',
          rawItem: item,
        }));
        setAmenities(mappedAmenities);
      }
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

      const resRaw = response?.data;
      const roomsData = Array.isArray(resRaw)
        ? resRaw
        : Array.isArray(resRaw?.responses)
        ? resRaw.responses
        : Array.isArray(resRaw?.rows)
        ? resRaw.rows
        : Array.isArray(resRaw?.rooms)
        ? resRaw.rooms
        : Array.isArray(resRaw?.data)
        ? resRaw.data
        : Array.isArray(response)
        ? response
        : [];

      const normalizedRooms = roomsData.map((item, index) => {
        const id = item.id || item._id || `rm-${index}`;
        const roomNumber = String(item.roomNumber || item.number || item.id || index + 101);
        
        const rawFloor = item.floorNumber !== undefined && item.floorNumber !== null 
          ? item.floorNumber 
          : item.floor || 1;
        const floorStr = String(rawFloor);
        const floor = floorStr.startsWith('Floor') ? floorStr : `Floor ${floorStr.padStart(2, '0')}`;

        const roomTypeId =
          item.roomTypeId ||
          item.roomType?.id ||
          (typeof item.roomType === 'string' ? item.roomType : '');

        const typeObj = typeof item.roomType === 'object' ? item.roomType : roomTypesMap[roomTypeId];
        const roomTypeName = typeObj?.name || typeObj?.type || item.roomTypeName || 'Standard Room';

        const rateOverride = item.pricePerNight !== undefined && item.pricePerNight !== null
          ? Number(item.pricePerNight)
          : item.rateOverride || item.effectiveRate || 0;

        const isSmoking = Boolean(item.isSmoking);
        const status = (item.status || 'AVAILABLE').toUpperCase();

        let roomAmenityIds = [];
        if (Array.isArray(item.amenityIds)) {
          roomAmenityIds = item.amenityIds;
        } else if (Array.isArray(item.roomAmenities)) {
          roomAmenityIds = item.roomAmenities.map((a) => a.amenityId || a.amenity?.id || (typeof a === 'string' ? a : a.id)).filter(Boolean);
        } else if (Array.isArray(item.amenities)) {
          roomAmenityIds = item.amenities.map((a) => (typeof a === 'string' ? a : a.id));
        }

        let roomImages = [];
        if (Array.isArray(item.roomImages)) {
          roomImages = item.roomImages
            .map((ri, idx) => ({
              id: ri.fileId || ri.file?.id || ri.id || `img-${idx}`,
              url: ri.file?.url || ri.url,
              name: ri.file?.originalName || `Photo ${idx + 1}`,
            }))
            .filter((x) => x.url || x.id);
        }

        return {
          id,
          roomNumber,
          floor,
          floorNumber: typeof rawFloor === 'number' ? rawFloor : parseInt(String(rawFloor).replace(/\D/g, ''), 10) || 1,
          roomTypeId,
          roomTypeName,
          rateOverride,
          pricePerNight: rateOverride,
          isSmoking,
          status,
          amenityIds: roomAmenityIds,
          images: roomImages,
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

  // Dynamic KPI Calculations with clean SVG icons
  const kpiData = useMemo(() => {
    const total = rooms.length;
    const vacantCount = rooms.filter(
      (r) => r.status === 'AVAILABLE' || r.status === 'VACANT'
    ).length;
    const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length;
    const checkoutCount = rooms.filter(
      (r) => r.status === 'DIRTY' || r.status === 'CLEANING' || r.status === 'CHECKOUT' || r.status === 'UNDER_CLEANING'
    ).length;
    const maintenanceCount = rooms.filter(
      (r) => r.status === 'OUT_OF_ORDER' || r.status === 'BLOCKED' || r.status === 'OUT_OF_SERVICE'
    ).length;

    const occPct = total > 0 ? ((occupiedCount / total) * 100).toFixed(1) : '0';

    return [
      {
        label: 'Vacant / Available',
        value: String(vacantCount),
        secondary: `${total - occupiedCount} rooms ready`,
        icon: <CheckCircleIcon size={22} />,
        type: 'vacant',
      },
      {
        label: 'Occupied',
        value: String(occupiedCount),
        secondary: `${occPct}% total occupancy`,
        icon: <UserCheckIcon size={22} />,
        type: 'occupied',
      },
      {
        label: 'Housekeeping / Dirty',
        value: String(checkoutCount),
        secondary: 'Pending inspection',
        icon: <SparklesIcon size={22} />,
        type: 'checkout',
      },
      {
        label: 'Maintenance / Out of Order',
        value: String(maintenanceCount),
        secondary: 'Under service',
        icon: <WrenchIcon size={22} />,
        type: 'tomorrow',
      },
    ];
  }, [rooms]);

  // Dynamic Floor Groupings for Dashboard
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
            (statusFilter === 'occupied' && rm.status === 'OCCUPIED') ||
            (statusFilter === 'checkout' && (rm.status === 'DIRTY' || rm.status === 'CLEANING' || rm.status === 'CHECKOUT' || rm.status === 'UNDER_CLEANING'));

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
        (statusFilter === 'occupied' && rm.status === 'OCCUPIED') ||
        (statusFilter === 'checkout' && (rm.status === 'DIRTY' || rm.status === 'CLEANING' || rm.status === 'CHECKOUT' || rm.status === 'UNDER_CLEANING'));
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, searchTerm, roomTypeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTableRooms.length / pageSize) || 1;
  const paginatedTableRooms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTableRooms.slice(start, start + pageSize);
  }, [filteredTableRooms, currentPage, pageSize]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = async () => {
    if (roomTypes.length === 0) {
      await fetchDependencies();
    }
    const defaultRt = roomTypes.length > 0 ? roomTypes[0] : null;
    const defaultRtId = defaultRt ? defaultRt.id : '';

    setFormData({
      ...defaultInitialFormData,
      roomTypeId: defaultRtId,
      images: [],
    });
    setEditingRoom(null);
    if (roomFileInputRef.current) {
      roomFileInputRef.current.value = '';
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = async (roomItem) => {
    try {
      const res = await roomService.getById(roomItem.id);
      const data = res?.data || roomItem.rawItem || roomItem;
      setEditingRoom(roomItem);

      const rawFloor = data.floorNumber !== undefined && data.floorNumber !== null
        ? Number(data.floorNumber)
        : Number(String(roomItem.floor || '1').replace(/\D/g, '')) || 1;

      let roomAmenityIds = [];
      if (Array.isArray(data.amenityIds)) {
        roomAmenityIds = data.amenityIds;
      } else if (Array.isArray(data.roomAmenities)) {
        roomAmenityIds = data.roomAmenities
          .map((a) => a.amenityId || a.amenity?.id || (typeof a === 'string' ? a : a.id))
          .filter(Boolean);
      } else if (Array.isArray(roomItem.amenityIds)) {
        roomAmenityIds = roomItem.amenityIds;
      }

      let existingImages = [];
      if (Array.isArray(data.roomImages)) {
        existingImages = data.roomImages
          .map((ri, idx) => ({
            id: ri.fileId || ri.file?.id || ri.id,
            url: ri.file?.url || ri.url,
            name: ri.file?.originalName || `Photo ${idx + 1}`,
          }))
          .filter((x) => x.id);
      } else if (Array.isArray(roomItem.images)) {
        existingImages = roomItem.images;
      }

      setFormData({
        title: data.title || `Room ${data.roomNumber || roomItem.roomNumber}`,
        roomNumber: String(data.roomNumber || roomItem.roomNumber || ''),
        floorNumber: rawFloor,
        roomTypeId: data.roomTypeId || roomItem.roomTypeId || (roomTypes.length > 0 ? roomTypes[0].id : ''),
        pricePerNight: data.pricePerNight !== undefined && data.pricePerNight !== null
          ? String(data.pricePerNight)
          : String(roomItem.rateOverride || '250'),
        checkInTime: parseTimeFromApi(data.checkInTime, '14:00'),
        checkOutTime: parseTimeFromApi(data.checkOutTime, '11:00'),
        maxGuestAdultAllowed: data.maxGuestAdultAllowed ?? 2,
        maxGuestChildAllowed: data.maxGuestChildAllowed ?? 1,
        maxGuestInfantAllowed: data.maxGuestInfantAllowed ?? 1,
        baseGuestInBasePriceAdult: data.baseGuestInBasePriceAdult ?? 2,
        baseGuestInBasePriceChild: data.baseGuestInBasePriceChild ?? 0,
        extraFeesPerAdult: data.extraFeesPerAdult ?? 0,
        extraFeesPerChild: data.extraFeesPerChild ?? 0,
        noOfBedRooms: data.noOfBedRooms ?? 1,
        noOfWashRooms: data.noOfWashRooms ?? 1,
        noOfLivingRooms: data.noOfLivingRooms ?? 1,
        sizeInSqft: data.sizeInSqft ?? 350,
        status: (data.status || roomItem.status || 'available').toLowerCase(),
        mealsAvailable: Boolean(data.mealsAvailable),
        isSmoking: Boolean(data.isSmoking || roomItem.isSmoking),
        description: data.description || '',
        amenityIds: roomAmenityIds,
        images: existingImages,
      });
    } catch (err) {
      console.warn('Failed to fetch full room by ID, fallback to row values:', err);
      setEditingRoom(roomItem);
      const floorNum = Number(String(roomItem.floor || '1').replace(/\D/g, '')) || 1;
      setFormData({
        ...defaultInitialFormData,
        title: `Room ${roomItem.roomNumber}`,
        roomNumber: String(roomItem.roomNumber || ''),
        floorNumber: floorNum,
        roomTypeId: roomItem.roomTypeId || (roomTypes.length > 0 ? roomTypes[0].id : ''),
        pricePerNight: roomItem.rateOverride ? String(roomItem.rateOverride) : '250',
        status: (roomItem.status || 'available').toLowerCase(),
        amenityIds: roomItem.amenityIds || [],
        images: roomItem.images || [],
      });
    }
  };

  /**
   * Multi-image upload handler
   */
  const handleImagesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Generate temporary preview objects for instant feedback
    const tempNewImages = files.map((file) => ({
      id: null,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isUploading: true,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...tempNewImages],
    }));

    setIsUploadingImages(true);

    try {
      const res = await fileService.uploadMultiple(files);
      if (res.success && Array.isArray(res.fileIds) && res.fileIds.length > 0) {
        setFormData((prev) => {
          const updatedImages = [...prev.images];
          let fileIdIndex = 0;

          for (let i = 0; i < updatedImages.length; i++) {
            if (updatedImages[i].isUploading && fileIdIndex < res.fileIds.length) {
              updatedImages[i] = {
                ...updatedImages[i],
                id: res.fileIds[fileIdIndex],
                isUploading: false,
              };
              fileIdIndex++;
            }
          }
          return { ...prev, images: updatedImages };
        });
        showToast(`${res.fileIds.length} photo(s) uploaded successfully!`, 'success');
      } else {
        showToast(res.message || 'Failed to upload photos', 'error');
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((img) => !img.isUploading),
        }));
      }
    } catch (err) {
      console.error('Error uploading room photos:', err);
      showToast(err.message || 'Failed to upload photos', 'error');
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => !img.isUploading),
      }));
    } finally {
      setIsUploadingImages(false);
      if (roomFileInputRef.current) {
        roomFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  /**
   * Save Room Handler (Connected to POST /api/room & PUT /api/room/:id)
   * Sends all 19+ fields strictly compliant with backend schema validator including imageIds.
   */
  const handleSaveRoom = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.roomNumber.trim()) {
      showToast('Room number is required.', 'error');
      return;
    }
    if (!formData.roomTypeId) {
      showToast('Room Type selection is required.', 'error');
      return;
    }
    const parsedPrice = parseFloat(formData.pricePerNight);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('Please enter a valid price per night greater than 0.', 'error');
      return;
    }

    setIsSubmitting(true);

    let userOrgId = localStorage.getItem('syncstays_org_id');
    let userBranchId = localStorage.getItem('syncstays_branch_id');
    try {
      const rawUser = localStorage.getItem('syncstays_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        userOrgId = userOrgId || u.organizationId;
        userBranchId = userBranchId || u.organizationBranchId;
      }
    } catch (err) {}

    let orgId = isValidUUID(userOrgId) ? userOrgId : null;
    let branchId = isValidUUID(userBranchId) ? userBranchId : null;

    if (!orgId) {
      orgId = rooms.find((r) => isValidUUID(r.rawItem?.organizationId))?.rawItem?.organizationId ||
              roomTypes.find((rt) => isValidUUID(rt.rawItem?.organizationId))?.rawItem?.organizationId;
    }
    if (!branchId) {
      branchId = rooms.find((r) => isValidUUID(r.rawItem?.organizationBranchId))?.rawItem?.organizationBranchId ||
                 roomTypes.find((rt) => isValidUUID(rt.rawItem?.organizationBranchId))?.rawItem?.organizationBranchId;
    }

    const selectedTypeObj = roomTypes.find((rt) => rt.id === formData.roomTypeId);
    const selectedTypeName = selectedTypeObj?.name || 'Room';
    const floorNum = parseInt(formData.floorNumber, 10) || 1;

    const normStatus = (formData.status || 'available').toLowerCase();
    const validStatus = ['available', 'reserved', 'occupied', 'under_cleaning', 'out_of_service'].includes(normStatus)
      ? normStatus
      : 'available';

    // Collect valid image UUIDs
    const validImageIds = (formData.images || [])
      .map((img) => img.id)
      .filter((id) => isValidUUID(id));

    const payload = {
      title: formData.title.trim() || `Room ${formData.roomNumber.trim()} - ${selectedTypeName}`,
      roomNumber: formData.roomNumber.trim(),
      description: formData.description.trim() || `${selectedTypeName} - Floor ${floorNum}`,
      roomTypeId: formData.roomTypeId,
      floorNumber: floorNum,
      pricePerNight: parsedPrice,
      checkInTime: formatTimeForApi(formData.checkInTime),
      checkOutTime: formatTimeForApi(formData.checkOutTime),
      maxGuestAdultAllowed: parseInt(formData.maxGuestAdultAllowed, 10) || 2,
      maxGuestChildAllowed: parseInt(formData.maxGuestChildAllowed, 10) || 0,
      maxGuestInfantAllowed: parseInt(formData.maxGuestInfantAllowed, 10) || 0,
      baseGuestInBasePriceAdult: parseInt(formData.baseGuestInBasePriceAdult, 10) || 2,
      baseGuestInBasePriceChild: parseInt(formData.baseGuestInBasePriceChild, 10) || 0,
      extraFeesPerAdult: parseFloat(formData.extraFeesPerAdult) || 0,
      extraFeesPerChild: parseFloat(formData.extraFeesPerChild) || 0,
      noOfLivingRooms: parseInt(formData.noOfLivingRooms, 10) || 0,
      noOfBedRooms: parseInt(formData.noOfBedRooms, 10) || 1,
      noOfWashRooms: parseInt(formData.noOfWashRooms, 10) || 1,
      sizeInSqft: parseInt(formData.sizeInSqft, 10) || 300,
      status: validStatus,
      mealsAvailable: Boolean(formData.mealsAvailable),
      amenityIds: formData.amenityIds || [],
      imageIds: validImageIds,
      ...(orgId ? { organizationId: orgId } : {}),
      ...(branchId ? { organizationBranchId: branchId } : {}),
    };

    try {
      if (editingRoom) {
        const response = await roomService.update(editingRoom.id, payload);
        showToast(
          response?.message || `Room ${formData.roomNumber} updated successfully.`,
          'success'
        );
        setEditingRoom(null);
        setFormData(defaultInitialFormData);
        await fetchRooms();
      } else {
        const response = await roomService.create(payload);
        showToast(
          response?.message || `Room ${formData.roomNumber} created successfully.`,
          'success'
        );
        setIsAddModalOpen(false);
        setFormData(defaultInitialFormData);
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
            Monitor floor-level room status, occupancy, photo galleries, and inventory.
          </p>
        </div>

        <div className={styles.headerActions}>
          {selectedRoomIds.size > 0 && (
            <button
              type="button"
              className={styles.configureButton}
              onClick={() => setShowBulkDeleteModal(true)}
              style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fee2e2' }}
            >
              Bulk Delete ({selectedRoomIds.size})
            </button>
          )}
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

      {/* Tab View Switcher with sleek SVG icons */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'OVERVIEW' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setActiveTab('OVERVIEW')}
        >
          <BuildingIcon size={16} />
          <span>Floor Overview & KPIs</span>
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'TABLE' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setActiveTab('TABLE')}
        >
          <TableIcon size={16} />
          <span>Room Inventory Table ({rooms.length})</span>
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
              <FloorSection
                key={floor.floorName}
                floor={floor}
                onSelectRoom={(r) => setSelectedRoomDetail(r)}
              />
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
                  <th className={styles.th} style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={paginatedTableRooms.length > 0 && selectedRoomIds.size === paginatedTableRooms.length}
                      onChange={toggleSelectAllRooms}
                    />
                  </th>
                  <th className={styles.th}>Room Number</th>
                  <th className={styles.th}>Floor</th>
                  <th className={styles.th}>Room Type</th>
                  <th className={styles.th}>Rate / Night</th>
                  <th className={styles.th}>Amenities</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th} style={{ width: '130px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyState}>
                      Fetching room inventory from backend (http://localhost:5000/api/room)...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyState}>
                      <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircleIcon size={18} />
                        <span>{error}</span>
                      </div>
                      <Button variant="secondary" size="sm" onClick={fetchRooms}>
                        Retry Connection
                      </Button>
                    </td>
                  </tr>
                ) : paginatedTableRooms.length > 0 ? (
                  paginatedTableRooms.map((rm) => (
                    <tr
                      key={rm.id}
                      className={`${styles.tr} ${styles.clickableRow}`}
                      onClick={() => setSelectedRoomDetail(rm)}
                      title="Click row to view full room specifications"
                    >
                      <td className={styles.td} style={{ width: '40px' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRoomIds.has(rm.id)}
                          onChange={() => toggleSelectRoom(rm.id)}
                        />
                      </td>
                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {rm.images && rm.images.length > 0 ? (
                            <img
                              src={rm.images[0].url}
                              alt=""
                              className={styles.tableThumb}
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewerImages(rm.images);
                                setViewerInitialIndex(0);
                                setViewerTitle(`Room ${rm.roomNumber} - Photos`);
                                setIsViewerOpen(true);
                              }}
                              title="Click to view & zoom photos"
                            />
                          ) : null}
                          <span className={styles.codeBadge}>{rm.roomNumber}</span>
                        </div>
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
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                              Default amenities
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <StatusBadge status={rm.status} />
                      </td>
                      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actionsCell} style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className={styles.actionBtnView}
                            title="View Details"
                            aria-label="View Details"
                            onClick={() => setSelectedRoomDetail(rm)}
                          >
                            <EyeIcon size={16} />
                          </button>
                          <button
                            type="button"
                            className={styles.actionBtnEdit}
                            title="Edit Room"
                            aria-label="Edit Room"
                            onClick={() => handleOpenEditModal(rm)}
                          >
                            <PencilIcon size={16} />
                          </button>
                          <button
                            type="button"
                            className={styles.actionBtnDelete}
                            title="Delete Room"
                            aria-label="Delete Room"
                            onClick={() => setDeletingRoom(rm)}
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className={styles.emptyState}>
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

      {/* ========================================================= */}
      {/* REAL ADD / EDIT ROOM MODAL (Multi-Section Live Form)       */}
      {/* ========================================================= */}
      <Modal
        isOpen={isAddModalOpen || !!editingRoom}
        maxWidth="760px"
        onClose={() => {
          if (isSubmitting || isUploadingImages) return;
          setIsAddModalOpen(false);
          setEditingRoom(null);
        }}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting || isUploadingImages}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoom(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting || isUploadingImages}
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
        <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* SECTION 1: Basic Information */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span>Basic Information</span>
            </div>
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
                <label className={styles.formLabel}>Floor Number *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={styles.formInput}
                  placeholder="e.g. 1, 2"
                  value={formData.floorNumber}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, floorNumber: e.target.value })
                  }
                  required
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
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title / Label</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. Deluxe Suite 101"
                  value={formData.title}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                className={styles.formTextarea}
                rows={2}
                placeholder="Optional notes or description for this specific room..."
                value={formData.description}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* SECTION 2: Room Photos & Gallery */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span>Room Photos & Gallery ({formData.images.length})</span>
            </div>

            <input
              type="file"
              ref={roomFileInputRef}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImagesSelect}
            />

            <div
              className={styles.imageUploadZone}
              onClick={() => !isUploadingImages && !isSubmitting && roomFileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <span className={styles.uploadIcon}>
                <CameraIcon size={28} />
              </span>
              <span className={styles.uploadPrompt}>
                {isUploadingImages ? 'Uploading photos...' : 'Click to select multiple photos'}
              </span>
              <span className={styles.uploadSubtext}>
                Supports JPG, PNG, WEBP. You can select multiple images at once to upload directly.
              </span>
            </div>

            {formData.images.length > 0 && (
              <div className={styles.imageGalleryGrid}>
                {formData.images.map((img, idx) => (
                  <div key={idx} className={styles.imageCard}>
                    <img
                      src={img.url}
                      alt={img.name || `Room image ${idx + 1}`}
                      className={styles.imageThumb}
                    />
                    <button
                      type="button"
                      className={styles.imageRemoveBtn}
                      title="Remove photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                    >
                      <XIcon size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: Pricing & Timing */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span>Pricing & Check-In/Out Timings</span>
            </div>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price Per Night (₹) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className={styles.formInput}
                  placeholder="e.g. 2500"
                  value={formData.pricePerNight}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerNight: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Check-In Time *</label>
                <input
                  type="time"
                  className={styles.formInput}
                  value={formData.checkInTime}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, checkInTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Check-Out Time *</label>
                <input
                  type="time"
                  className={styles.formInput}
                  value={formData.checkOutTime}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOutTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Extra Fee Per Adult (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.formInput}
                  placeholder="e.g. 500"
                  value={formData.extraFeesPerAdult}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, extraFeesPerAdult: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Extra Fee Per Child (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.formInput}
                  placeholder="e.g. 250"
                  value={formData.extraFeesPerChild}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, extraFeesPerChild: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Capacity & Layout Specifications */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span>Capacity & Layout Specifications</span>
            </div>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Max Adults *</label>
                <input
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={formData.maxGuestAdultAllowed}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, maxGuestAdultAllowed: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Max Children</label>
                <input
                  type="number"
                  min="0"
                  className={styles.formInput}
                  value={formData.maxGuestChildAllowed}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, maxGuestChildAllowed: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Max Infants</label>
                <input
                  type="number"
                  min="0"
                  className={styles.formInput}
                  value={formData.maxGuestInfantAllowed}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, maxGuestInfantAllowed: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bedrooms *</label>
                <input
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={formData.noOfBedRooms}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, noOfBedRooms: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bathrooms *</label>
                <input
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={formData.noOfWashRooms}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, noOfWashRooms: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Living Rooms</label>
                <input
                  type="number"
                  min="0"
                  className={styles.formInput}
                  value={formData.noOfLivingRooms}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, noOfLivingRooms: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Size (Sq. Ft.) *</label>
                <input
                  type="number"
                  min="50"
                  className={styles.formInput}
                  placeholder="e.g. 350"
                  value={formData.sizeInSqft}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, sizeInSqft: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Base Adults in Price</label>
                <input
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={formData.baseGuestInBasePriceAdult}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, baseGuestInBasePriceAdult: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Policies & Amenities */}
          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <span>Status, Policies & Amenities</span>
            </div>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Operational Status *</label>
                <select
                  className={styles.formSelect}
                  value={formData.status}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                  <option value="under_cleaning">Under Cleaning</option>
                  <option value="out_of_service">Out of Service</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meals Available</label>
                <select
                  className={styles.formSelect}
                  value={formData.mealsAvailable ? 'true' : 'false'}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    setFormData({ ...formData, mealsAvailable: e.target.value === 'true' })
                  }
                >
                  <option value="false">No Meals Included</option>
                  <option value="true">Meals Available</option>
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
                  <option value="false">Non-Smoking Room</option>
                  <option value="true">Smoking Allowed</option>
                </select>
              </div>
            </div>

            {amenities.length > 0 && (
              <div className={styles.formGroup} style={{ marginTop: 'var(--space-md)' }}>
                <label className={styles.formLabel}>Assigned Amenities</label>
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
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* ROOM DETAILS INSPECTION MODAL (No Raw IDs Exposed)        */}
      {/* ========================================================= */}
      <Modal
        isOpen={!!selectedRoomDetail}
        maxWidth="740px"
        onClose={() => setSelectedRoomDetail(null)}
        title={selectedRoomDetail ? `Room ${selectedRoomDetail.roomNumber} - Specifications` : 'Room Details'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                const target = selectedRoomDetail;
                setSelectedRoomDetail(null);
                handleOpenEditModal(target);
              }}
            >
              Edit Room
            </Button>
            <Button variant="primary" onClick={() => setSelectedRoomDetail(null)}>
              Done
            </Button>
          </>
        }
      >
        {selectedRoomDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Top Badge Banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Room {selectedRoomDetail.roomNumber}
                </span>
                <span style={{ marginLeft: '10px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  ({selectedRoomDetail.roomTypeName})
                </span>
              </div>
              <StatusBadge status={selectedRoomDetail.status} />
            </div>

            {/* Room Photos Gallery in Detail View */}
            {selectedRoomDetail.images && selectedRoomDetail.images.length > 0 && (
              <div className={styles.detailSection}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 className={styles.sectionTitle} style={{ margin: 0 }}>Room Photos ({selectedRoomDetail.images.length})</h4>
                  <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 500 }}>
                    Click photo to zoom & inspect
                  </span>
                </div>
                <div className={styles.imageGalleryGrid}>
                  {selectedRoomDetail.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`${styles.imageCard} ${styles.zoomableImageCard}`}
                      onClick={() => {
                        setViewerImages(selectedRoomDetail.images);
                        setViewerInitialIndex(idx);
                        setViewerTitle(`Room ${selectedRoomDetail.roomNumber} - Photo ${idx + 1}`);
                        setIsViewerOpen(true);
                      }}
                      title="Click to view & zoom photo"
                    >
                      <img src={img.url} alt={img.name || `Photo ${idx + 1}`} className={styles.imageThumb} />
                      <span className={styles.imageZoomOverlay}>
                        <EyeIcon size={18} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Dimensions & Layout */}
            <div className={styles.detailSection}>
              <h4 className={styles.sectionTitle}>Room Specifications & Layout</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Floor</span>
                  <span className={styles.detailValue}>{selectedRoomDetail.floor}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Size</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.sizeInSqft || 350} sq. ft.
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Bedrooms</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.noOfBedRooms || 1}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Bathrooms</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.noOfWashRooms || 1}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Living Rooms</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.noOfLivingRooms || 0}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Smoking Policy</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.isSmoking || selectedRoomDetail.rawItem?.isSmoking ? 'Smoking Allowed' : 'Non-Smoking'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & Timing */}
            <div className={styles.detailSection}>
              <h4 className={styles.sectionTitle}>Pricing & Timings</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Base Rate / Night</span>
                  <span className={styles.detailValue} style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    ₹{Number(selectedRoomDetail.rateOverride || selectedRoomDetail.pricePerNight || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Check-In Time</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.checkInTime || '14:00:00'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Check-Out Time</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.checkOutTime || '11:00:00'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Extra Fee / Adult</span>
                  <span className={styles.detailValue}>
                    ₹{selectedRoomDetail.rawItem?.extraFeesPerAdult || 0}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Extra Fee / Child</span>
                  <span className={styles.detailValue}>
                    ₹{selectedRoomDetail.rawItem?.extraFeesPerChild || 0}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Meals Service</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.mealsAvailable ? 'Meals Available' : 'No Meals Included'}
                  </span>
                </div>
              </div>
            </div>

            {/* Occupancy Limits */}
            <div className={styles.detailSection}>
              <h4 className={styles.sectionTitle}>Guest Occupancy Rules</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Max Adults</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.maxGuestAdultAllowed || 2} Adults
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Max Children</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.maxGuestChildAllowed || 0} Children
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Max Infants</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.maxGuestInfantAllowed || 0} Infants
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Base Adults In Rate</span>
                  <span className={styles.detailValue}>
                    {selectedRoomDetail.rawItem?.baseGuestInBasePriceAdult || 2} Adults
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className={styles.detailSection}>
              <h4 className={styles.sectionTitle}>Assigned Amenities</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedRoomDetail.amenityIds && selectedRoomDetail.amenityIds.length > 0 ? (
                  selectedRoomDetail.amenityIds.map((amId, idx) => (
                    <Badge key={idx} variant="primary">
                      {amenitiesMap[amId]?.name || amId}
                    </Badge>
                  ))
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    No specific amenity overrides. Inherits standard room type amenities.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
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

      {/* Bulk Delete Rooms Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => {
          if (isSubmitting) return;
          setShowBulkDeleteModal(false);
        }}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Rooms"
        message={`Are you sure you want to permanently delete ${selectedRoomIds.size} selected rooms? This action cannot be undone.`}
        isDestructive={true}
      />

      {/* Lightbox Image Viewer Modal with Zoom In/Out & Pan */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        images={viewerImages}
        initialIndex={viewerInitialIndex}
        title={viewerTitle}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}