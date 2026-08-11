/**
 * @file Hotel/Rooms/Index.jsx
 * @description Room management dashboard for monitoring room occupancy,
 * availability, guest stays, and floor-level room status.
 * @figmaFrame Refined Room Management Dashboard
 */

import React, { useMemo, useState } from 'react';
import FloorConfigurationModal from '@components/FloorConfigurationModal/FloorConfigurationModal';
import styles from './Index.module.css';

const ROOM_TYPE_FILTERS = [
  'All Rooms',
  'Deluxe Suite',
  'Executive Twin',
  'Single King',
];

const INITIAL_FLOORS = [
  {
    floor: 'Floor 04',
    units: 24,
    occupied: 18,
    rooms: [
      {
        id: 401,
        status: 'available',
        roomType: 'Deluxe Ocean View',
        note: 'Ready for check-in',
      },
      {
        id: 402,
        status: 'occupied',
        guest: 'Jonathan Everett',
        duration: 'Oct 12 - Oct 18',
        guests: ['JE', 'AE'],
      },
      {
        id: 403,
        status: 'checkout',
        guest: 'Sarah Jenkins',
        action: 'Pending Inspection',
      },
      {
        id: 404,
        status: 'occupied',
        guest: 'Marcus Thorne',
        duration: 'Oct 10 - Oct 14',
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
        status: 'occupied',
        guest: 'Clara Oswald',
        duration: 'Oct 08 - Oct 15',
      },
      {
        id: 302,
        status: 'occupied',
        guest: 'Arthur Williams',
        duration: 'Oct 11 - Oct 20',
      },
      {
        id: 303,
        status: 'available',
        roomType: 'Executive King',
        note: 'Inspected & Sanitized',
      },
      {
        id: 304,
        status: 'occupied',
        guest: 'Elena Martinez',
        duration: 'Oct 12 - Oct 14',
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

function StatusBadge({ status }) {
  const label =
    status === 'available'
      ? 'Available'
      : status === 'occupied'
        ? 'Occupied'
        : 'Checkout';

  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {label}
    </span>
  );
}

function RoomCard({ room }) {
  return (
    <article className={styles.roomCard}>
      <div className={styles.roomCardHeader}>
        <h3 className={styles.roomNumber}>{room.id}</h3>
        <StatusBadge status={room.status} />
      </div>

      {room.status === 'available' ? (
        <>
          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Room Type</span>
            <strong className={styles.infoValue}>{room.roomType}</strong>
          </div>

          <div className={styles.roomCardFooter}>
            <span>{room.note}</span>
            <span className={styles.readyIcon}>✓</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.roomInfoBlock}>
            <span className={styles.infoLabel}>Guest</span>
            <strong className={styles.infoValue}>{room.guest}</strong>
          </div>

          {room.status === 'checkout' ? (
            <div className={styles.roomInfoBlock}>
              <span className={styles.actionRequired}>Action Required</span>
              <span className={styles.pendingText}>{room.action}</span>
            </div>
          ) : (
            <div className={styles.roomInfoBlock}>
              <span className={styles.infoLabel}>Stay Duration</span>

              <div className={styles.durationRow}>
                <span className={styles.infoValue}>{room.duration}</span>

                {room.guests?.length > 0 && (
                  <div className={styles.guestAvatars}>
                    {room.guests.map((guest) => (
                      <span key={guest} className={styles.guestAvatar}>
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
    </article>
  );
}

function FloorSection({ floor }) {
  return (
    <section className={styles.floorSection}>
      <div className={styles.floorHeader}>
        <span className={styles.floorAccent} />

        <h2 className={styles.floorTitle}>{floor.floor}</h2>

        <span className={styles.floorMeta}>
          {floor.units} Units • {floor.occupied} Occupied
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

      <span
        className={`${styles.kpiSecondary} ${item.type === 'checkout' ? styles.urgentText : ''
          }`}
      >
        {item.secondary}
      </span>
    </article>
  );
}

export default function HotelRoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All Rooms');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFloorModalOpen, setFloorModalOpen] = useState(false);

  const filteredFloors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return INITIAL_FLOORS.map((floor) => {
      const filteredRooms = floor.rooms.filter((room) => {
        const matchesSearch =
          !normalizedSearch ||
          String(room.id).includes(normalizedSearch) ||
          room.guest?.toLowerCase().includes(normalizedSearch) ||
          room.roomType?.toLowerCase().includes(normalizedSearch);

        const matchesRoomType =
          roomTypeFilter === 'All Rooms' ||
          room.roomType === roomTypeFilter ||
          (roomTypeFilter === 'Deluxe Suite' &&
            room.roomType?.toLowerCase().includes('deluxe')) ||
          (roomTypeFilter === 'Executive Twin' &&
            room.roomType?.toLowerCase().includes('executive')) ||
          (roomTypeFilter === 'Single King' &&
            room.roomType?.toLowerCase().includes('king'));

        const matchesStatus =
          statusFilter === 'all' || room.status === statusFilter;

        return matchesSearch && matchesRoomType && matchesStatus;
      });

      return {
        ...floor,
        rooms: filteredRooms,
      };
    }).filter((floor) => floor.rooms.length > 0);
  }, [searchTerm, roomTypeFilter, statusFilter]);

  return (
    <div className={styles.page} data-testid="hotel-rooms-page">
      <div className={styles.topSearchMobile}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search rooms, guests..."
          className={styles.searchInput}
        />
      </div>

      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Room Management</h1>
          <p className={styles.subtitle}>
            Monitor occupancy and room status across all floors in real-time.
          </p>
        </div>

        <button
          type="button"
          className={styles.configureButton}
          onClick={() => setFloorModalOpen(true)}
        >
          Configure Floors
        </button>
      </header>

      <section className={styles.kpiGrid} aria-label="Room summary">
        {KPI_DATA.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className={styles.filters}>
        <div className={styles.roomTypeFilters}>
          {ROOM_TYPE_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setRoomTypeFilter(filter)}
              className={`${styles.filterButton} ${roomTypeFilter === filter ? styles.activeFilter : ''
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.statusFilters}>
          <button
            type="button"
            onClick={() =>
              setStatusFilter((current) =>
                current === 'available' ? 'all' : 'available',
              )
            }
            className={`${styles.statusFilterButton} ${statusFilter === 'available' ? styles.activeStatusFilter : ''
              }`}
          >
            <span className={`${styles.filterDot} ${styles.availableDot}`} />
            Available
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter((current) =>
                current === 'occupied' ? 'all' : 'occupied',
              )
            }
            className={`${styles.statusFilterButton} ${statusFilter === 'occupied' ? styles.activeStatusFilter : ''
              }`}
          >
            <span className={`${styles.filterDot} ${styles.occupiedDot}`} />
            Occupied
          </button>
        </div>
      </section>

      <div className={styles.floorList}>
        {filteredFloors.length > 0 ? (
          filteredFloors.map((floor) => (
            <FloorSection key={floor.floor} floor={floor} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <h3>No rooms found</h3>
            <p>Try changing your search or room filters.</p>
          </div>
        )}
      </div>

      <button
        type="button"
        className={styles.quickReservationButton}
        aria-label="Create quick reservation"
      >
        <span className={styles.plusIcon}>+</span>
        Quick Reservation
      </button>

      <FloorConfigurationModal
        isOpen={isFloorModalOpen}
        onClose={() => setFloorModalOpen(false)}
        onSave={() => setFloorModalOpen(false)}
      />
    </div>
  );
}