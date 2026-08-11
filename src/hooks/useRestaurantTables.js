/**
 * @file useRestaurantTables.js
 * @description Custom React hook managing POS table selection grid, floor area filtering, and table order selection.
 * @reference Frame: Redefined Restaurant POS Table Selection.jpeg
 */
import { useState, useMemo, useCallback } from 'react';

const INITIAL_TABLES = [
  {
    id: 'tbl-01',
    number: '01',
    status: 'OCCUPIED',
    floor: 'Dining Hall',
    guests: '4/4 Guests',
    subtext: '$142.50',
    capacity: 4,
  },
  {
    id: 'tbl-02',
    number: '02',
    status: 'AVAILABLE',
    floor: 'Dining Hall',
    guests: 'Up to 6',
    subtext: 'Ready for seating',
    capacity: 6,
  },
  {
    id: 'tbl-03',
    number: '03',
    status: 'OCCUPIED',
    floor: 'Dining Hall',
    guests: '2/2 Guests',
    subtext: '$68.00',
    capacity: 2,
  },
  {
    id: 'tbl-04',
    number: '04',
    status: 'AVAILABLE',
    floor: 'Terrace',
    guests: 'Up to 4',
    subtext: 'Cleaned',
    capacity: 4,
  },
  {
    id: 'tbl-05',
    number: '05',
    status: 'RESERVED',
    floor: 'Dining Hall',
    guests: '"Miller Party"',
    subtext: '19:30',
    capacity: 4,
  },
  {
    id: 'tbl-06',
    number: '06',
    status: 'OCCUPIED',
    floor: 'Bar Area',
    guests: '8/8 Guests',
    subtext: '$412.00',
    capacity: 8,
  },
  {
    id: 'tbl-07',
    number: '07',
    status: 'AVAILABLE',
    floor: 'Terrace',
    guests: 'Up to 2',
    subtext: 'Ready',
    capacity: 2,
  },
  {
    id: 'tbl-08',
    number: '08',
    status: 'AVAILABLE',
    floor: 'Dining Hall',
    guests: 'Up to 4',
    subtext: 'Ready',
    capacity: 4,
  },
  {
    id: 'tbl-09',
    number: '09',
    status: 'OCCUPIED',
    floor: 'Bar Area',
    guests: '3/4 Guests',
    subtext: '$89.20',
    capacity: 4,
  },
  {
    id: 'tbl-10',
    number: '10',
    status: 'AVAILABLE',
    floor: 'Dining Hall',
    guests: 'Up to 12',
    subtext: 'Large Table',
    capacity: 12,
  },
];

const FLOOR_OPTIONS = ['All Floors', 'Dining Hall', 'Terrace', 'Bar Area'];

export function useRestaurantTables() {
  const [tables] = useState(INITIAL_TABLES);
  const [activeFloor, setActiveFloor] = useState('All Floors');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTables = useMemo(() => {
    if (activeFloor === 'All Floors') return tables;
    return tables.filter((t) => t.floor === activeFloor);
  }, [tables, activeFloor]);

  const openTableModal = useCallback((table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  }, []);

  const closeTableModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTable(null);
  }, []);

  return {
    tables: filteredTables,
    allTables: tables,
    activeFloor,
    floorOptions: FLOOR_OPTIONS,
    selectedTable,
    isModalOpen,
    setActiveFloor,
    openTableModal,
    closeTableModal,
  };
}

export default useRestaurantTables;
