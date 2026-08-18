/**
 * @file mockKdsData.js
 * @description Mock Kitchen Display System (KDS) data matching backend API specs (14-orders-kitchen.md).
 */

export const KDS_STATIONS = [
  { id: 'st-all', name: 'All Stations', code: 'ALL' },
  { id: 'st-hot', name: 'Hot Kitchen', code: 'HOT_KITCHEN' },
  { id: 'st-cold', name: 'Cold Prep', code: 'COLD_PREP' },
  { id: 'st-bar', name: 'Bar & Beverages', code: 'BAR' },
];

export const INITIAL_KITCHEN_ORDERS = [
  {
    id: 'kot-501',
    kotNumber: 'KOT-8042-1',
    orderId: 'ord-9001',
    orderNumber: 'ORD-20260813-0001',
    tableLabel: 'Table 02',
    orderType: 'DINE_IN',
    station: 'HOT_KITCHEN',
    status: 'QUEUED',
    priority: 'RUSH',
    elapsedSeconds: 420, // ~7 mins
    firedAt: new Date(Date.now() - 420 * 1000).toISOString(),
    items: [
      {
        id: 'koi-1',
        name: 'Grand Horizon Wagyu Burger',
        quantity: 2,
        note: 'Medium rare, no onions',
        status: 'QUEUED',
        modifiers: ['Medium Rare', 'Extra Cheddar'],
      },
      {
        id: 'koi-2',
        name: 'Crispy Calamari Rings',
        quantity: 1,
        note: 'Extra marinara sauce',
        status: 'QUEUED',
        modifiers: [],
      },
    ],
  },
  {
    id: 'kot-502',
    kotNumber: 'KOT-7119-1',
    orderId: 'ord-9002',
    orderNumber: 'ORD-20260813-0002',
    tableLabel: 'VIP Lounge 02',
    orderType: 'DINE_IN',
    station: 'HOT_KITCHEN',
    status: 'PREPARING',
    priority: 'NORMAL',
    elapsedSeconds: 780, // ~13 mins
    firedAt: new Date(Date.now() - 780 * 1000).toISOString(),
    items: [
      {
        id: 'koi-3',
        name: 'Pan-Seared Garlic Butter Scallops',
        quantity: 2,
        note: 'Medium spice level',
        status: 'PREPARING',
        modifiers: ['Medium'],
      },
      {
        id: 'koi-4',
        name: 'Grilled Norwegian Salmon',
        quantity: 1,
        note: 'Dill cream on side',
        status: 'PREPARING',
        modifiers: [],
      },
    ],
  },
  {
    id: 'kot-503',
    kotNumber: 'KOT-4022-1',
    orderId: 'ord-9003',
    orderNumber: 'ORD-20260813-0003',
    tableLabel: 'Takeaway Counter',
    orderType: 'TAKEAWAY',
    station: 'BAR',
    status: 'QUEUED',
    priority: 'NORMAL',
    elapsedSeconds: 180, // ~3 mins
    firedAt: new Date(Date.now() - 180 * 1000).toISOString(),
    items: [
      {
        id: 'koi-5',
        name: 'Garden Mint & Cucumber Gin Fizz',
        quantity: 2,
        note: 'Extra ice',
        status: 'QUEUED',
        modifiers: [],
      },
      {
        id: 'koi-6',
        name: 'Passionfruit Elderflower Mocktail',
        quantity: 1,
        note: '',
        status: 'QUEUED',
        modifiers: [],
      },
    ],
  },
  {
    id: 'kot-504',
    kotNumber: 'KOT-3301-1',
    orderId: 'ord-9004',
    orderNumber: 'ORD-20260813-0004',
    tableLabel: 'Table 05 (Window)',
    orderType: 'DINE_IN',
    station: 'COLD_PREP',
    status: 'READY',
    priority: 'NORMAL',
    elapsedSeconds: 1100, // ~18 mins
    firedAt: new Date(Date.now() - 1100 * 1000).toISOString(),
    items: [
      {
        id: 'koi-7',
        name: 'Truffle Burrata Salad',
        quantity: 1,
        note: 'Dressing on side',
        status: 'READY',
        modifiers: [],
      },
      {
        id: 'koi-8',
        name: 'Signature Artisan Tiramisu',
        quantity: 2,
        note: '',
        status: 'READY',
        modifiers: [],
      },
    ],
  },
];
