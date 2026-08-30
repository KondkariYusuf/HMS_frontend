export const mockCategories = [
  { id: 'cat-1', name: 'Dairy & Eggs', parentId: null, productCount: 12, createdAt: '2025-10-01T09:00:00.000Z' },
  { id: 'cat-2', name: 'Beverages', parentId: null, productCount: 45, createdAt: '2025-10-01T09:00:00.000Z' },
  { id: 'cat-3', name: 'Groceries', parentId: null, productCount: 120, createdAt: '2025-10-01T09:00:00.000Z' },
  { id: 'cat-4', name: 'Cleaning Supplies', parentId: null, productCount: 30, createdAt: '2025-10-01T09:00:00.000Z' }
];

export const mockBrands = [
  { id: 'brand-1', name: 'Amul', productCount: 8, createdAt: '2025-10-01T09:00:00.000Z' },
  { id: 'brand-2', name: 'Tata', productCount: 15, createdAt: '2025-10-01T09:00:00.000Z' },
  { id: 'brand-3', name: 'Bisleri', productCount: 2, createdAt: '2025-10-01T09:00:00.000Z' },
  { id: 'brand-4', name: 'Diversey', productCount: 10, createdAt: '2025-10-01T09:00:00.000Z' }
];

export const mockUnits = [
  { id: 'unit-l', name: 'Litre', code: 'L', baseUnitId: 'unit-ml', conversionFactor: 1000, isBaseUnit: false },
  { id: 'unit-ml', name: 'Millilitre', code: 'ML', baseUnitId: null, conversionFactor: 1, isBaseUnit: true },
  { id: 'unit-kg', name: 'Kilogram', code: 'KG', baseUnitId: 'unit-g', conversionFactor: 1000, isBaseUnit: false },
  { id: 'unit-g', name: 'Gram', code: 'G', baseUnitId: null, conversionFactor: 1, isBaseUnit: true },
  { id: 'unit-pc', name: 'Piece', code: 'PC', baseUnitId: null, conversionFactor: 1, isBaseUnit: true },
  { id: 'unit-roll', name: 'Roll', code: 'ROLL', baseUnitId: null, conversionFactor: 1, isBaseUnit: true }
];

export const mockProductTypes = [
  { id: 'pt-raw', name: 'Raw Material', kind: 'RAW', isSystem: true },
  { id: 'pt-semi', name: 'Semi Finished', kind: 'SEMI_FINISHED', isSystem: true },
  { id: 'pt-finished', name: 'Finished Product', kind: 'FINISHED', isSystem: true },
  { id: 'pt-service', name: 'Service', kind: 'SERVICE', isSystem: true }
];

export const mockProducts = [
  {
    id: 'prod-100',
    name: 'Full Cream Milk 1L',
    sku: 'MILK-FC-1L',
    barcode: '8901234567890',
    kind: 'RAW',
    categoryId: 'cat-1',
    brandId: 'brand-1',
    productTypeId: 'pt-raw',
    stockUnitId: 'unit-l',
    stockUnitCode: 'L',
    isTracked: true,
    reorderLevel: 24,
    currentCost: 6500, // in minor units, e.g., INR 65.00
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: '2025-10-05T09:00:00.000Z'
  },
  {
    id: 'prod-101',
    name: 'Tea Powder',
    sku: 'TEA-PWD-500G',
    barcode: '8901234567891',
    kind: 'RAW',
    categoryId: 'cat-2',
    brandId: 'brand-2',
    productTypeId: 'pt-raw',
    stockUnitId: 'unit-kg',
    stockUnitCode: 'KG',
    isTracked: true,
    reorderLevel: 5,
    currentCost: 45000,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: '2025-10-06T09:00:00.000Z'
  },
  {
    id: 'prod-102',
    name: 'Mineral Water 1L',
    sku: 'WTR-MIN-1L',
    barcode: '8901234567892',
    kind: 'FINISHED',
    categoryId: 'cat-2',
    brandId: 'brand-3',
    productTypeId: 'pt-finished',
    stockUnitId: 'unit-pc',
    stockUnitCode: 'PC',
    isTracked: true,
    reorderLevel: 100,
    currentCost: 1500,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: '2025-10-07T09:00:00.000Z'
  },
  {
    id: 'prod-103',
    name: 'Basmati Rice',
    sku: 'RICE-BAS-25KG',
    barcode: '8901234567893',
    kind: 'RAW',
    categoryId: 'cat-3',
    brandId: 'brand-2',
    productTypeId: 'pt-raw',
    stockUnitId: 'unit-kg',
    stockUnitCode: 'KG',
    isTracked: true,
    reorderLevel: 50,
    currentCost: 12000,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: '2025-10-08T09:00:00.000Z'
  },
  {
    id: 'prod-104',
    name: 'Tissue Roll',
    sku: 'TSU-RLL-PC',
    barcode: '8901234567894',
    kind: 'FINISHED',
    categoryId: 'cat-4',
    brandId: 'brand-4',
    productTypeId: 'pt-finished',
    stockUnitId: 'unit-roll',
    stockUnitCode: 'ROLL',
    isTracked: true,
    reorderLevel: 200,
    currentCost: 2500,
    currency: 'INR',
    status: 'INACTIVE',
    createdAt: '2025-10-09T09:00:00.000Z'
  },
  {
    id: 'prod-105',
    name: 'Sugar',
    sku: 'SGR-WHT-1KG',
    barcode: '8901234567895',
    kind: 'RAW',
    categoryId: 'cat-3',
    brandId: 'brand-2',
    productTypeId: 'pt-raw',
    stockUnitId: 'unit-kg',
    stockUnitCode: 'KG',
    isTracked: true,
    reorderLevel: 20,
    currentCost: 4000,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: '2025-10-10T09:00:00.000Z'
  }
];

export const mockStock = [
  {
    productId: 'prod-100',
    productName: 'Full Cream Milk 1L',
    sku: 'MILK-FC-1L',
    stockUnitId: 'unit-l',
    stockUnitCode: 'L',
    onHand: 42,
    reorderLevel: 24,
    belowReorder: false,
    avgCost: 6500,
    stockValue: 273000,
    currency: 'INR',
    preferredSupplierId: 'sup-1',
    preferredSupplierName: 'Dairy Co Suppliers',
    lastTransactionAt: '2026-08-05T05:00:00.000Z'
  },
  {
    productId: 'prod-101',
    productName: 'Tea Powder',
    sku: 'TEA-PWD-500G',
    stockUnitId: 'unit-kg',
    stockUnitCode: 'KG',
    onHand: 3,
    reorderLevel: 5,
    belowReorder: true,
    avgCost: 45000,
    stockValue: 135000,
    currency: 'INR',
    preferredSupplierId: 'sup-2',
    preferredSupplierName: 'Tata Consumer',
    lastTransactionAt: '2026-08-04T05:00:00.000Z'
  },
  {
    productId: 'prod-102',
    productName: 'Mineral Water 1L',
    sku: 'WTR-MIN-1L',
    stockUnitId: 'unit-pc',
    stockUnitCode: 'PC',
    onHand: 0,
    reorderLevel: 100,
    belowReorder: true,
    avgCost: 1500,
    stockValue: 0,
    currency: 'INR',
    preferredSupplierId: 'sup-3',
    preferredSupplierName: 'Bisleri Dist',
    lastTransactionAt: '2026-08-10T05:00:00.000Z'
  },
  {
    productId: 'prod-103',
    productName: 'Basmati Rice',
    sku: 'RICE-BAS-25KG',
    stockUnitId: 'unit-kg',
    stockUnitCode: 'KG',
    onHand: 60,
    reorderLevel: 50,
    belowReorder: false,
    avgCost: 12000,
    stockValue: 720000,
    currency: 'INR',
    preferredSupplierId: 'sup-2',
    preferredSupplierName: 'Tata Consumer',
    lastTransactionAt: '2026-08-01T05:00:00.000Z'
  },
  {
    productId: 'prod-104',
    productName: 'Tissue Roll',
    sku: 'TSU-RLL-PC',
    stockUnitId: 'unit-roll',
    stockUnitCode: 'ROLL',
    onHand: 250,
    reorderLevel: 200,
    belowReorder: false,
    avgCost: 2500,
    stockValue: 625000,
    currency: 'INR',
    preferredSupplierId: 'sup-4',
    preferredSupplierName: 'Diversey Supplies',
    lastTransactionAt: '2026-07-25T05:00:00.000Z'
  },
  {
    productId: 'prod-105',
    productName: 'Sugar',
    sku: 'SGR-WHT-1KG',
    stockUnitId: 'unit-kg',
    stockUnitCode: 'KG',
    onHand: 15,
    reorderLevel: 20,
    belowReorder: true,
    avgCost: 4000,
    stockValue: 60000,
    currency: 'INR',
    preferredSupplierId: 'sup-2',
    preferredSupplierName: 'Tata Consumer',
    lastTransactionAt: '2026-08-12T05:00:00.000Z'
  }
];

export const mockSuppliers = [
  {
    id: 'sup-1',
    code: 'SUP-0001',
    name: 'Dairy Co Suppliers',
    contactPerson: 'Amit Sharma',
    phone: '+91-98765-43210',
    email: 'contact@dairyco.example',
    gstin: '27ABCDE1234F1Z5',
    status: 'ACTIVE',
    paymentTermsDays: 15,
    creditLimit: 200000,
    currency: 'INR',
    billingAddress: { line1: '45 MIDC', city: 'Mumbai', state: 'MH', postalCode: '400093', country: 'IN' },
    bank: { accountName: 'Dairy Co Suppliers', accountNumber: '9876543210', ifsc: 'SBIN0001234' },
    outstanding: 54000,
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'sup-2',
    code: 'SUP-0002',
    name: 'Tata Consumer',
    contactPerson: 'Sonia Gandhi', // Just a dummy name
    phone: '+91-91234-56789',
    email: 'sales@tataconsumer.example',
    gstin: '29ABCDE1234F1Z5',
    status: 'ACTIVE',
    paymentTermsDays: 30,
    creditLimit: 1000000,
    currency: 'INR',
    billingAddress: { line1: 'Whitefield', city: 'Bangalore', state: 'KA', postalCode: '560066', country: 'IN' },
    bank: { accountName: 'Tata Consumer', accountNumber: '1231231234', ifsc: 'HDFC0001234' },
    outstanding: 150000,
    createdAt: '2025-02-15T09:30:00.000Z'
  },
  {
    id: 'sup-3',
    code: 'SUP-0003',
    name: 'Bisleri Dist',
    contactPerson: 'Rohan Desai',
    phone: '+91-99887-76655',
    email: 'orders@bisleri.example',
    gstin: '24ABCDE1234F1Z5',
    status: 'INACTIVE',
    paymentTermsDays: 7,
    creditLimit: 50000,
    currency: 'INR',
    billingAddress: { line1: 'GIDC', city: 'Ahmedabad', state: 'GJ', postalCode: '380015', country: 'IN' },
    bank: { accountName: 'Bisleri Dist', accountNumber: '1122334455', ifsc: 'ICIC0001234' },
    outstanding: 0,
    createdAt: '2025-03-20T11:15:00.000Z'
  },
  {
    id: 'sup-4',
    code: 'SUP-0004',
    name: 'Diversey Supplies',
    contactPerson: 'Priya Patel',
    phone: '+91-98111-22334',
    email: 'info@diversey.example',
    gstin: '07ABCDE1234F1Z5',
    status: 'ACTIVE',
    paymentTermsDays: 45,
    creditLimit: 300000,
    currency: 'INR',
    billingAddress: { line1: 'Okhla Ind Area', city: 'New Delhi', state: 'DL', postalCode: '110020', country: 'IN' },
    bank: { accountName: 'Diversey Supplies', accountNumber: '9988776655', ifsc: 'UTIB0001234' },
    outstanding: 12500,
    createdAt: '2025-04-12T14:45:00.000Z'
  },
  {
    id: 'sup-5',
    code: 'SUP-0005',
    name: 'Luxury Linens',
    contactPerson: 'Vikram Singh',
    phone: '+91-90000-11111',
    email: 'contact@luxurylinens.example',
    gstin: '09ABCDE1234F1Z5',
    status: 'BLOCKED',
    paymentTermsDays: 0,
    creditLimit: 0,
    currency: 'INR',
    billingAddress: { line1: 'Sector 62', city: 'Noida', state: 'UP', postalCode: '201301', country: 'IN' },
    bank: { accountName: 'Luxury Linens', accountNumber: '5566778899', ifsc: 'PUNB0001234' },
    outstanding: 85000,
    createdAt: '2025-05-05T16:20:00.000Z'
  }
];

export const mockPurchaseOrders = [
  {
    id: 'pur-1',
    poNumber: 'PO-2026-001',
    supplierId: 'sup-1',
    supplierName: 'Dairy Co Suppliers',
    status: 'RECEIVED',
    currency: 'INR',
    notes: 'Deliver early morning before 6 AM',
    subTotal: 312000,
    taxTotal: 15600,
    grandTotal: 327600,
    orderedAt: '2026-08-01T09:00:00.000Z',
    expectedAt: '2026-08-05T09:00:00.000Z',
    items: [
      {
        id: 'pitem-1-1',
        productId: 'prod-100',
        productName: 'Full Cream Milk 1L',
        unitId: 'unit-l',
        orderedQty: 48,
        receivedQty: 48,
        unitCost: 6500,
        taxRate: 5,
        lineTotal: 312000
      }
    ],
    createdAt: '2026-08-01T08:30:00.000Z',
    updatedAt: '2026-08-05T06:15:00.000Z'
  },
  {
    id: 'pur-2',
    poNumber: 'PO-2026-002',
    supplierId: 'sup-2',
    supplierName: 'Tata Consumer',
    status: 'ORDERED',
    currency: 'INR',
    notes: 'Urgent requirement for banquet',
    subTotal: 1140000,
    taxTotal: 57000,
    grandTotal: 1197000,
    orderedAt: '2026-08-10T10:30:00.000Z',
    expectedAt: '2026-08-15T09:00:00.000Z',
    items: [
      {
        id: 'pitem-2-1',
        productId: 'prod-103',
        productName: 'Basmati Rice',
        unitId: 'unit-kg',
        orderedQty: 50,
        receivedQty: 0,
        unitCost: 12000,
        taxRate: 5,
        lineTotal: 600000
      },
      {
        id: 'pitem-2-2',
        productId: 'prod-101',
        productName: 'Tea Powder',
        unitId: 'unit-kg',
        orderedQty: 12,
        receivedQty: 0,
        unitCost: 45000,
        taxRate: 5,
        lineTotal: 540000
      }
    ],
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:30:00.000Z'
  },
  {
    id: 'pur-3',
    poNumber: 'PO-2026-003',
    supplierId: 'sup-4',
    supplierName: 'Diversey Supplies',
    status: 'DRAFT',
    currency: 'INR',
    notes: 'Restock housekeeping supplies',
    subTotal: 500000,
    taxTotal: 90000,
    grandTotal: 590000,
    orderedAt: null,
    expectedAt: '2026-08-20T09:00:00.000Z',
    items: [
      {
        id: 'pitem-3-1',
        productId: 'prod-104',
        productName: 'Tissue Roll',
        unitId: 'unit-roll',
        orderedQty: 200,
        receivedQty: 0,
        unitCost: 2500,
        taxRate: 18,
        lineTotal: 500000
      }
    ],
    createdAt: '2026-08-12T14:45:00.000Z',
    updatedAt: '2026-08-12T14:45:00.000Z'
  },
  {
    id: 'pur-4',
    poNumber: 'PO-2026-004',
    supplierId: 'sup-2',
    supplierName: 'Tata Consumer',
    status: 'PARTIALLY_RECEIVED',
    currency: 'INR',
    notes: 'Partial delivery agreed',
    subTotal: 80000,
    taxTotal: 4000,
    grandTotal: 84000,
    orderedAt: '2026-08-11T11:00:00.000Z',
    expectedAt: '2026-08-14T09:00:00.000Z',
    items: [
      {
        id: 'pitem-4-1',
        productId: 'prod-105',
        productName: 'Sugar',
        unitId: 'unit-kg',
        orderedQty: 20,
        receivedQty: 10,
        unitCost: 4000,
        taxRate: 5,
        lineTotal: 80000
      }
    ],
    createdAt: '2026-08-11T10:15:00.000Z',
    updatedAt: '2026-08-14T09:30:00.000Z'
  },
  {
    id: 'pur-5',
    poNumber: 'PO-2026-005',
    supplierId: 'sup-5',
    supplierName: 'Luxury Linens',
    status: 'CANCELLED',
    currency: 'INR',
    notes: 'Cancelled due to vendor block',
    subTotal: 150000,
    taxTotal: 27000,
    grandTotal: 177000,
    orderedAt: '2026-08-02T10:00:00.000Z',
    expectedAt: '2026-08-08T09:00:00.000Z',
    items: [
      {
        id: 'pitem-5-1',
        productId: 'prod-999',
        productName: 'Bath Towels (White)',
        unitId: 'unit-pc',
        orderedQty: 100,
        receivedQty: 0,
        unitCost: 1500,
        taxRate: 18,
        lineTotal: 150000
      }
    ],
    createdAt: '2026-08-02T09:30:00.000Z',
    updatedAt: '2026-08-04T12:00:00.000Z'
  }
];
