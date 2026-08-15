/**
 * @file Hotel/Rooms/Index.jsx
 * @description Room management dashboard for monitoring room occupancy,
 * availability, guest stays, and floor-level room status.
 * @figmaFrame Refined Room Management Dashboard
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import styles from './Index.module.css';

const STORAGE_KEY = 'hms-room-management-data';

const ROOM_TYPE_FILTERS = [
  'All Rooms',
  'Deluxe Suite',
  'Executive Twin',
  'Single King',
];

const ROOM_TYPES = [
  'Deluxe Suite',
  'Executive Twin',
  'Single King',
  'Deluxe Ocean View',
  'Executive King',
];

const ROOM_STATUSES = ['available', 'occupied', 'checkout'];

const INITIAL_FLOORS = [
  {
    floor: 'Floor 04',
    units: 24,
    occupied: 18,
    rooms: [
      {
        id: 401,
        roomType: 'Deluxe Ocean View',
        capacity: 2,
        status: 'available',
        note: 'Ready for check-in',
        guest: '',
        duration: '',
        action: '',
        guests: [],
      },
      {
        id: 402,
        roomType: 'Executive Twin',
        capacity: 2,
        status: 'occupied',
        guest: 'Jonathan Everett',
        duration: 'Oct 12 - Oct 18',
        guests: ['JE', 'AE'],
        note: '',
        action: '',
      },
      {
        id: 403,
        roomType: 'Single King',
        capacity: 2,
        status: 'checkout',
        guest: 'Sarah Jenkins',
        action: 'Pending Inspection',
        guests: [],
        note: '',
        duration: '',
      },
      {
        id: 404,
        roomType: 'Deluxe Suite',
        capacity: 2,
        status: 'occupied',
        guest: 'Marcus Thorne',
        duration: 'Oct 10 - Oct 14',
        guests: [],
        note: '',
        action: '',
      },
    ],
  },
  {
    floor: 'Floor 03',
    units: 24,
    occupied: 21,
    rooms: [
      {
        id: 301,
        roomType: 'Deluxe Suite',
        capacity: 2,
        status: 'occupied',
        guest: 'Clara Oswald',
        duration: 'Oct 08 - Oct 15',
        guests: [],
        note: '',
        action: '',
      },
      {
        id: 302,
        roomType: 'Executive Twin',
        capacity: 2,
        status: 'occupied',
        guest: 'Arthur Williams',
        duration: 'Oct 11 - Oct 20',
        guests: [],
        note: '',
        action: '',
      },
      {
        id: 303,
        roomType: 'Executive King',
        capacity: 2,
        status: 'available',
        note: 'Inspected & Sanitized',
        guest: '',
        duration: '',
        action: '',
        guests: [],
      },
      {
        id: 304,
        roomType: 'Deluxe Suite',
        capacity: 2,
        status: 'occupied',
        guest: 'Elena Martinez',
        duration: 'Oct 12 - Oct 14',
        guests: [],
        note: '',
        action: '',
      },
    ],
  },
];

const KPI_DATA = [
  {
    label: 'Vacant',
    value: '42',
    secondary: '12% from yesterday',
    icon: '▥',
    type: 'vacant',
  },
  {
    label: 'Occupied',
    value: '158',
    secondary: '79.0% total occupancy',
    icon: '♙',
    type: 'occupied',
  },
  {
    label: 'Checkout Today',
    value: '24',
    secondary: '8 urgent pending',
    icon: '↪',
    type: 'checkout',
  },
  {
    label: 'Checkout Tomorrow',
    value: '31',
    secondary: 'Forecasted 74% turnover',
    icon: '▣',
    type: 'tomorrow',
  },
];

function loadInitialFloors() {
  if (typeof window === 'undefined') {
    return INITIAL_FLOORS;
  }

  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return INITIAL_FLOORS;
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return INITIAL_FLOORS;
    }

    return parsedData;
  } catch (error) {
    console.error('Failed to load room management data:', error);
    return INITIAL_FLOORS;
  }
}

function saveFloorsToStorage(floors) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(floors),
    );
  } catch (error) {
    console.error('Failed to save room management data:', error);
  }
}

function getStatusLabel(status) {
  if (status === 'available') {
    return 'Available';
  }

  if (status === 'occupied') {
    return 'Occupied';
  }

  return 'Checkout';
}

function StatusBadge({ status }) {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {getStatusLabel(status)}
    </span>
  );
}

function RoomCard({ room, onClick }) {
  return (
    <button
      type="button"
      className={styles.roomCardButton}
      onClick={() => onClick(room)}
      aria-label={`Edit room ${room.id}`}
    >
      <article className={styles.roomCard}>
        <div className={styles.roomCardHeader}>
          <h3 className={styles.roomNumber}>{room.id}</h3>

          <StatusBadge status={room.status} />
        </div>

        {room.status === 'available' ? (
          <>
            <div className={styles.roomInfoBlock}>
              <span className={styles.infoLabel}>Room Type</span>

              <strong className={styles.infoValue}>
                {room.roomType || 'Not specified'}
              </strong>
            </div>

            <div className={styles.roomCardFooter}>
              <span>
                {room.note ||
                  `Capacity: ${room.capacity || 1} guests`}
              </span>

              <span className={styles.readyIcon}>✓</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.roomInfoBlock}>
              <span className={styles.infoLabel}>Guest</span>

              <strong className={styles.infoValue}>
                {room.guest || 'No guest assigned'}
              </strong>
            </div>

            {room.status === 'checkout' ? (
              <div className={styles.roomInfoBlock}>
                <span className={styles.actionRequired}>
                  Action Required
                </span>

                <span className={styles.pendingText}>
                  {room.action || 'Pending Inspection'}
                </span>
              </div>
            ) : (
              <div className={styles.roomInfoBlock}>
                <span className={styles.infoLabel}>
                  Stay Duration
                </span>

                <div className={styles.durationRow}>
                  <span className={styles.infoValue}>
                    {room.duration || 'Not specified'}
                  </span>

                  {room.guests?.length > 0 && (
                    <div className={styles.guestAvatars}>
                      {room.guests.map((guest) => (
                        <span
                          key={guest}
                          className={styles.guestAvatar}
                        >
                          {guest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <span className={styles.editHint}>
          Click to edit
        </span>
      </article>
    </button>
  );
}

function FloorSection({ floor, onRoomClick }) {
  const occupiedCount = floor.rooms.filter(
    (room) => room.status === 'occupied',
  ).length;

  return (
    <section className={styles.floorSection}>
      <div className={styles.floorHeader}>
        <span className={styles.floorAccent} />

        <h2 className={styles.floorTitle}>
          {floor.floor}
        </h2>

        <span className={styles.floorMeta}>
          {floor.units} Units • {occupiedCount} Occupied
        </span>
      </div>

      <div className={styles.roomsGrid}>
        {floor.rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={onRoomClick}
          />
        ))}
      </div>
    </section>
  );
}

function KpiCard({ item }) {
  return (
    <article
      className={`${styles.kpiCard} ${styles[`kpi-${item.type}`]
        }`}
    >
      <div className={styles.kpiTopAccent} />

      <div className={styles.kpiContent}>
        <div>
          <span className={styles.kpiLabel}>
            {item.label}
          </span>

          <strong className={styles.kpiValue}>
            {item.value}
          </strong>
        </div>

        <div
          className={`${styles.kpiIcon} ${styles[`icon-${item.type}`]
            }`}
        >
          {item.icon}
        </div>
      </div>

      <span
        className={`${styles.kpiSecondary} ${item.type === 'checkout'
            ? styles.urgentText
            : ''
          }`}
      >
        {item.secondary}
      </span>
    </article>
  );
}

function EditRoomModal({
  room,
  isOpen,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(null);

  React.useEffect(() => {
    if (!room || !isOpen) {
      return;
    }

    setFormData({
      roomNumber: String(room.id ?? ''),
      roomType:
        room.roomType || ROOM_TYPES[0],
      capacity: room.capacity || 1,
      status:
        room.status || 'available',
      guest: room.guest || '',
      duration: room.duration || '',
      note: room.note || '',
      action: room.action || '',
    });
  }, [room, isOpen]);

  if (!room || !formData) {
    return null;
  }

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const roomNumber =
      formData.roomNumber.trim();

    if (!roomNumber) {
      return;
    }

    const updatedRoom = {
      ...room,
      id: roomNumber,
      roomType: formData.roomType,
      capacity: Math.max(
        1,
        Number(formData.capacity) || 1,
      ),
      status: formData.status,
      guest: formData.guest.trim(),
      duration: formData.duration.trim(),
      note: formData.note.trim(),
      action: formData.action.trim(),
    };

    onSave(updatedRoom);
  };

  const footerContent = (
    <div className={styles.editModalFooter}>
      <Button
        variant="ghost"
        onClick={onClose}
      >
        Cancel
      </Button>

      <Button
        variant="primary"
        onClick={handleSubmit}
      >
        Save Changes
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Room ${room.id}`}
      footer={footerContent}
    >
      <form
        className={styles.editRoomForm}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-number"
              className={styles.formLabel}
            >
              Room Number
            </label>

            <input
              id="edit-room-number"
              type="text"
              value={formData.roomNumber}
              onChange={(event) =>
                updateField(
                  'roomNumber',
                  event.target.value,
                )
              }
              className={styles.formInput}
              placeholder="e.g. 401"
            />
          </div>

          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-type"
              className={styles.formLabel}
            >
              Room Type
            </label>

            <select
              id="edit-room-type"
              value={formData.roomType}
              onChange={(event) =>
                updateField(
                  'roomType',
                  event.target.value,
                )
              }
              className={styles.formInput}
            >
              {ROOM_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-capacity"
              className={styles.formLabel}
            >
              Guest Capacity
            </label>

            <input
              id="edit-room-capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(event) =>
                updateField(
                  'capacity',
                  event.target.value,
                )
              }
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-status"
              className={styles.formLabel}
            >
              Status
            </label>

            <select
              id="edit-room-status"
              value={formData.status}
              onChange={(event) =>
                updateField(
                  'status',
                  event.target.value,
                )
              }
              className={styles.formInput}
            >
              {ROOM_STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.status !== 'available' && (
          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-guest"
              className={styles.formLabel}
            >
              Guest
            </label>

            <input
              id="edit-room-guest"
              type="text"
              value={formData.guest}
              onChange={(event) =>
                updateField(
                  'guest',
                  event.target.value,
                )
              }
              className={styles.formInput}
              placeholder="Guest name"
            />
          </div>
        )}

        {formData.status === 'occupied' && (
          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-duration"
              className={styles.formLabel}
            >
              Stay Duration
            </label>

            <input
              id="edit-room-duration"
              type="text"
              value={formData.duration}
              onChange={(event) =>
                updateField(
                  'duration',
                  event.target.value,
                )
              }
              className={styles.formInput}
              placeholder="e.g. Oct 12 - Oct 18"
            />
          </div>
        )}

        {formData.status === 'available' && (
          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-note"
              className={styles.formLabel}
            >
              Room Note
            </label>

            <input
              id="edit-room-note"
              type="text"
              value={formData.note}
              onChange={(event) =>
                updateField(
                  'note',
                  event.target.value,
                )
              }
              className={styles.formInput}
              placeholder="e.g. Ready for check-in"
            />
          </div>
        )}

        {formData.status === 'checkout' && (
          <div className={styles.formGroup}>
            <label
              htmlFor="edit-room-action"
              className={styles.formLabel}
            >
              Action Required
            </label>

            <input
              id="edit-room-action"
              type="text"
              value={formData.action}
              onChange={(event) =>
                updateField(
                  'action',
                  event.target.value,
                )
              }
              className={styles.formInput}
              placeholder="e.g. Pending Inspection"
            />
          </div>
        )}
      </form>
    </Modal>
  );
}

export default function HotelRoomsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] =
    useState('');

  const [roomTypeFilter, setRoomTypeFilter] =
    useState('All Rooms');

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [floors, setFloors] =
    useState(loadInitialFloors);

  const [isFloorModalOpen, setFloorModalOpen] =
    useState(false);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [isRoomModalOpen, setRoomModalOpen] =
    useState(false);

  const updateFloors = (updatedFloors) => {
    setFloors(updatedFloors);
    saveFloorsToStorage(updatedFloors);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  };

  const handleRoomSave = (updatedRoom) => {
    const updatedFloors = floors.map(
      (floor) => ({
        ...floor,
        rooms: floor.rooms.map(
          (room) =>
            String(room.id) ===
              String(selectedRoom.id)
              ? updatedRoom
              : room,
        ),
      }),
    );

    updateFloors(updatedFloors);

    setSelectedRoom(updatedRoom);
    setRoomModalOpen(false);
  };

  const handleFloorSave = (
    configuration,
  ) => {
    const updatedFloors = floors.map(
      (floor) => {
        if (
          floor.floor !==
          configuration.floorName
        ) {
          return floor;
        }

        const existingRoomsById =
          new Map(
            floor.rooms.map(
              (room) => [
                String(room.id),
                room,
              ],
            ),
          );

        const updatedRooms =
          configuration.rooms.map(
            (room) => {
              const existingRoom =
                existingRoomsById.get(
                  String(
                    room.roomNumber,
                  ),
                );

              return {
                ...(existingRoom || {}),
                id: String(
                  room.roomNumber,
                ),
                roomType:
                  room.roomType,
                capacity:
                  room.capacity,
                status:
                  existingRoom?.status ||
                  'available',
                guest:
                  existingRoom?.guest ||
                  '',
                duration:
                  existingRoom?.duration ||
                  '',
                note:
                  existingRoom?.note ||
                  'Ready for check-in',
                action:
                  existingRoom?.action ||
                  '',
                guests:
                  existingRoom?.guests ||
                  [],
              };
            },
          );

        return {
          ...floor,
          floor:
            configuration.floorName,
          units: Math.max(
            floor.units || 0,
            updatedRooms.length,
          ),
          rooms: updatedRooms,
        };
      },
    );

    updateFloors(updatedFloors);
    setFloorModalOpen(false);
  };

  const filteredFloors = useMemo(() => {
    const normalizedSearch =
      searchTerm
        .trim()
        .toLowerCase();

    return floors
      .map((floor) => {
        const filteredRooms =
          floor.rooms.filter(
            (room) => {
              const roomNumber =
                String(room.id || '');

              const matchesSearch =
                !normalizedSearch ||
                roomNumber.includes(
                  normalizedSearch,
                ) ||
                room.guest
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch,
                  ) ||
                room.roomType
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch,
                  );

              const matchesRoomType =
                roomTypeFilter ===
                'All Rooms' ||
                room.roomType ===
                roomTypeFilter ||
                (roomTypeFilter ===
                  'Deluxe Suite' &&
                  room.roomType
                    ?.toLowerCase()
                    .includes(
                      'deluxe',
                    )) ||
                (roomTypeFilter ===
                  'Executive Twin' &&
                  room.roomType
                    ?.toLowerCase()
                    .includes(
                      'executive',
                    )) ||
                (roomTypeFilter ===
                  'Single King' &&
                  room.roomType
                    ?.toLowerCase()
                    .includes(
                      'king',
                    ));

              const matchesStatus =
                statusFilter ===
                'all' ||
                room.status ===
                statusFilter;

              return (
                matchesSearch &&
                matchesRoomType &&
                matchesStatus
              );
            },
          );

        return {
          ...floor,
          rooms: filteredRooms,
        };
      })
      .filter(
        (floor) =>
          floor.rooms.length > 0,
      );
  }, [
    floors,
    searchTerm,
    roomTypeFilter,
    statusFilter,
  ]);

  return (
    <div
      className={styles.page}
      data-testid="hotel-rooms-page"
    >
      <div className={styles.topSearchMobile}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value,
            )
          }
          placeholder="Search rooms, guests..."
          className={styles.searchInput}
        />
      </div>

      <header
        className={styles.pageHeader}
      >
        <div>
          <h1 className={styles.title}>
            Room Management
          </h1>

          <p className={styles.subtitle}>
            Monitor occupancy and room
            status across all floors in
            real-time.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.configureButton
          }
          onClick={() =>
            setFloorModalOpen(true)
          }
        >
          Configure Floors
        </button>
      </header>

      <section
        className={styles.kpiGrid}
        aria-label="Room summary"
      >
        {KPI_DATA.map((item) => (
          <KpiCard
            key={item.label}
            item={item}
          />
        ))}
      </section>

      <section className={styles.filters}>
        <div
          className={
            styles.roomTypeFilters
          }
        >
          {ROOM_TYPE_FILTERS.map(
            (filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setRoomTypeFilter(
                    filter,
                  )
                }
                className={`${styles.filterButton
                  } ${roomTypeFilter ===
                    filter
                    ? styles.activeFilter
                    : ''
                  }`}
              >
                {filter}
              </button>
            ),
          )}
        </div>

        <div
          className={
            styles.statusFilters
          }
        >
          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                (current) =>
                  current ===
                    'available'
                    ? 'all'
                    : 'available',
              )
            }
            className={`${styles.statusFilterButton
              } ${statusFilter ===
                'available'
                ? styles.activeStatusFilter
                : ''
              }`}
          >
            <span
              className={`${styles.filterDot
                } ${styles.availableDot
                }`}
            />

            Available
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                (current) =>
                  current ===
                    'occupied'
                    ? 'all'
                    : 'occupied',
              )
            }
            className={`${styles.statusFilterButton
              } ${statusFilter ===
                'occupied'
                ? styles.activeStatusFilter
                : ''
              }`}
          >
            <span
              className={`${styles.filterDot
                } ${styles.occupiedDot
                }`}
            />

            Occupied
          </button>
        </div>
      </section>

      <div
        className={styles.floorList}
      >
        {filteredFloors.length > 0 ? (
          filteredFloors.map(
            (floor) => (
              <FloorSection
                key={floor.floor}
                floor={floor}
                onRoomClick={
                  handleRoomClick
                }
              />
            ),
          )
        ) : (
          <div
            className={
              styles.emptyState
            }
          >
            <h3>
              No rooms found
            </h3>

            <p>
              Try changing your search
              or room filters.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        className={
          styles.quickReservationButton
        }
        aria-label="Create quick reservation"
        onClick={() =>
          navigate(
            '/hotel/reservations',
          )
        }
      >
        <span
          className={styles.plusIcon}
        >
          +
        </span>

        Quick Reservation
      </button>

      <FloorConfigurationModal
        isOpen={
          isFloorModalOpen
        }
        onClose={() =>
          setFloorModalOpen(false)
        }
        onSave={
          handleFloorSave
        }
      />

      <EditRoomModal
        room={selectedRoom}
        isOpen={
          isRoomModalOpen
        }
        onClose={() =>
          setRoomModalOpen(false)
        }
        onSave={
          handleRoomSave
        }
      />
    </div>
  );
}