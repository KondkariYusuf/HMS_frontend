/**
 * @file FloorConfigurationModal.jsx
 * @description Floor configuration modal for managing floor details,
 * room numbers, room types, and capacity.
 * @figmaFrame Refined Floor Configuration Modal
 */

import React, { useEffect, useState } from 'react';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import styles from './FloorConfigurationModal.module.css';

const ROOM_TYPES = [
  'Deluxe Suite',
  'Executive Twin',
  'Single King',
  'Deluxe Ocean View',
  'Executive King',
];

const DEFAULT_ROOMS = [
  {
    id: 1,
    roomNumber: '401',
    roomType: 'Deluxe Suite',
    capacity: 2,
  },
  {
    id: 2,
    roomNumber: '402',
    roomType: 'Executive Twin',
    capacity: 2,
  },
  {
    id: 3,
    roomNumber: '403',
    roomType: 'Single King',
    capacity: 2,
  },
  {
    id: 4,
    roomNumber: '404',
    roomType: 'Deluxe Suite',
    capacity: 2,
  },
];

export default function FloorConfigurationModal({
  isOpen = false,
  onClose,
  onSave,
}) {
  const [floorName, setFloorName] = useState('Floor 04');
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);

  useEffect(() => {
    if (!isOpen) return;

    setFloorName('Floor 04');
    setRooms(DEFAULT_ROOMS);
  }, [isOpen]);

  const updateRoom = (id, field, value) => {
    setRooms((currentRooms) =>
      currentRooms.map((room) =>
        room.id === id
          ? {
            ...room,
            [field]:
              field === 'capacity'
                ? Math.max(1, Number(value) || 1)
                : value,
          }
          : room,
      ),
    );
  };

  const addRoom = () => {
    const numericRoomNumbers = rooms
      .map((room) => Number(room.roomNumber))
      .filter((roomNumber) => !Number.isNaN(roomNumber));

    const nextRoomNumber =
      numericRoomNumbers.length > 0
        ? Math.max(...numericRoomNumbers) + 1
        : 401;

    setRooms((currentRooms) => [
      ...currentRooms,
      {
        id: Date.now(),
        roomNumber: String(nextRoomNumber),
        roomType: 'Deluxe Suite',
        capacity: 2,
      },
    ]);
  };

  const removeRoom = (id) => {
    setRooms((currentRooms) =>
      currentRooms.filter((room) => room.id !== id),
    );
  };

  const handleSave = () => {
    const configuration = {
      floorName: floorName.trim(),
      totalRooms: rooms.length,
      rooms,
    };

    if (onSave) {
      onSave(configuration);
    }
  };

  const footerContent = (
    <div className={styles.footerActions}>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>

      <Button variant="primary" onClick={handleSave}>
        Save Configuration
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Floor Configuration"
      footer={footerContent}
    >
      <div
        className={styles.container}
        data-testid="floor-configuration-modal"
      >
        <div className={styles.intro}>
          <h3 className={styles.sectionTitle}>Configure Floor Layout</h3>
          <p className={styles.sectionDescription}>
            Manage the floor name, room numbers, room types and guest
            capacity.
          </p>
        </div>

        <div className={styles.floorSettings}>
          <div className={styles.formGroup}>
            <label htmlFor="floor-name" className={styles.label}>
              Floor Name
            </label>

            <input
              id="floor-name"
              type="text"
              value={floorName}
              onChange={(event) => setFloorName(event.target.value)}
              placeholder="e.g. Floor 04"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="total-rooms" className={styles.label}>
              Total Rooms
            </label>

            <input
              id="total-rooms"
              type="text"
              value={rooms.length}
              className={`${styles.input} ${styles.readOnlyInput}`}
              readOnly
            />
          </div>
        </div>

        <div className={styles.roomsHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Rooms</h3>
            <p className={styles.sectionDescription}>
              Configure individual rooms on this floor.
            </p>
          </div>

          <button
            type="button"
            className={styles.addRoomButton}
            onClick={addRoom}
          >
            <span className={styles.plus}>+</span>
            Add Room
          </button>
        </div>

        <div className={styles.roomTable}>
          <div className={styles.tableHeader}>
            <span>Room Number</span>
            <span>Room Type</span>
            <span>Capacity</span>
            <span aria-hidden="true" />
          </div>

          <div className={styles.roomRows}>
            {rooms.map((room) => (
              <div className={styles.roomRow} key={room.id}>
                <input
                  type="text"
                  value={room.roomNumber}
                  onChange={(event) =>
                    updateRoom(
                      room.id,
                      'roomNumber',
                      event.target.value,
                    )
                  }
                  className={styles.roomInput}
                  aria-label={`Room ${room.roomNumber} number`}
                />

                <select
                  value={room.roomType}
                  onChange={(event) =>
                    updateRoom(
                      room.id,
                      'roomType',
                      event.target.value,
                    )
                  }
                  className={styles.roomSelect}
                  aria-label={`Room ${room.roomNumber} type`}
                >
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <div className={styles.capacityControl}>
                  <button
                    type="button"
                    className={styles.capacityButton}
                    onClick={() =>
                      updateRoom(
                        room.id,
                        'capacity',
                        room.capacity - 1,
                      )
                    }
                    aria-label={`Decrease capacity for room ${room.roomNumber}`}
                  >
                    −
                  </button>

                  <span className={styles.capacityValue}>
                    {room.capacity}
                  </span>

                  <button
                    type="button"
                    className={styles.capacityButton}
                    onClick={() =>
                      updateRoom(
                        room.id,
                        'capacity',
                        room.capacity + 1,
                      )
                    }
                    aria-label={`Increase capacity for room ${room.roomNumber}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeRoom(room.id)}
                  aria-label={`Remove room ${room.roomNumber}`}
                  disabled={rooms.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.summary}>
          <div>
            <span className={styles.summaryLabel}>Floor</span>
            <strong>{floorName || 'Unnamed Floor'}</strong>
          </div>

          <div>
            <span className={styles.summaryLabel}>Rooms</span>
            <strong>{rooms.length}</strong>
          </div>

          <div>
            <span className={styles.summaryLabel}>Total Capacity</span>
            <strong>
              {rooms.reduce(
                (total, room) => total + room.capacity,
                0,
              )}{' '}
              Guests
            </strong>
          </div>
        </div>
      </div>
    </Modal>
  );
}