/**
 * @file Restaurant/POS/Index.jsx
 * @description Complete interactive Point of Sale (POS) order entry interface for restaurant & room service.
 * @reference Figma frame: Restaurant - POS (14-orders-kitchen.md)
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import Toast from '@components/Toast/Toast';
import {
  RESTAURANT_CATEGORIES,
  TABLES_LIST,
  MENU_ITEMS,
} from './mockPosData';
import styles from './Index.module.css';

export default function RestaurantPOSPage() {
  // POS Order Context State
  const [orderType, setOrderType] = useState('DINE_IN');
  const [selectedTableId, setSelectedTableId] = useState('tbl-01');
  const [guestCount, setGuestCount] = useState(2);

  // Catalog Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  // Cart & Order Items State
  const [cartItems, setCartItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Active Modals & Overlays
  const [customizingItem, setCustomizingItem] = useState(null); // Item being customized
  const [selectedModifiers, setSelectedModifiers] = useState({}); // { mgId: optId }
  const [itemNote, setItemNote] = useState('');

  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [roomNumber, setRoomNumber] = useState('Room 402 - Julian Smith');

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetTableId, setTransferTargetTableId] = useState('');

  // Notification Toast State
  const [toast, setToast] = useState(null);

  // Active Table Details
  const currentTable = useMemo(
    () => TABLES_LIST.find((t) => t.id === selectedTableId) || TABLES_LIST[0],
    [selectedTableId]
  );

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.menuNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Items' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Order Totals Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [cartItems]);

  const discountTotal = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return 0;
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxTotal = Math.round(taxableAmount * 0.05); // 5% GST (CGST 2.5% + SGST 2.5%)
  const grandTotal = taxableAmount + taxTotal;

  // Show temporary toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Add Item to Cart
  const handleAddItem = (item) => {
    // If item has required modifier groups, open customization modal first
    if (item.modifierGroups && item.modifierGroups.length > 0) {
      setCustomizingItem(item);
      const initialMods = {};
      item.modifierGroups.forEach((mg) => {
        if (mg.options && mg.options.length > 0) {
          initialMods[mg.id] = mg.options[0];
        }
      });
      setSelectedModifiers(initialMods);
      setItemNote('');
      return;
    }

    // Direct add for items without modifiers
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.menuItemId === item.id && ci.modifiers.length === 0
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty,
          lineTotal: currentQty * item.price,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItemId: item.id,
          name: item.name,
          unitPrice: item.price,
          quantity: 1,
          modifiers: [],
          note: '',
          lineTotal: item.price,
          kitchenStatus: null,
          fired: false,
        },
      ];
    });
    showToast(`Added "${item.name}" to cart`);
  };

  // Confirm Customization & Add to Cart
  const handleConfirmCustomization = () => {
    if (!customizingItem) return;

    const modifierArray = Object.values(selectedModifiers).filter(Boolean);
    const modifiersDelta = modifierArray.reduce(
      (sum, m) => sum + (m.priceDelta || 0),
      0
    );
    const unitPriceWithMods = customizingItem.price + modifiersDelta;

    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: customizingItem.id,
        name: customizingItem.name,
        unitPrice: unitPriceWithMods,
        quantity: 1,
        modifiers: modifierArray,
        note: itemNote,
        lineTotal: unitPriceWithMods,
        kitchenStatus: null,
        fired: false,
      },
    ]);

    showToast(`Added customized "${customizingItem.name}" to cart`);
    setCustomizingItem(null);
  };

  // Update Cart Item Quantity
  const handleUpdateQuantity = (cartItemId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQty = ci.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...ci,
              quantity: newQty,
              lineTotal: newQty * ci.unitPrice,
            };
          }
          return ci;
        })
        .filter(Boolean);
    });
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (cartItemId) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  // Clear Entire Order
  const handleClearOrder = () => {
    if (cartItems.length === 0) return;
    if (window.confirm('Are you sure you want to clear the current order?')) {
      setCartItems([]);
      setDiscountPercent(0);
      showToast('Current POS order cleared', 'info');
    }
  };

  // Action: FIRE KOT / Send to Kitchen
  const handleFireKot = () => {
    if (cartItems.length === 0) {
      showToast('Cannot fire empty order. Please add menu items.', 'error');
      return;
    }

    if (orderType === 'DINE_IN' && !selectedTableId) {
      showToast('Please select a table for Dine-In orders.', 'error');
      return;
    }

    const kotNumber = `KOT-${Math.floor(1000 + Math.random() * 9000)}-1`;
    const orderNumber = `ORD-20260813-${Math.floor(100 + Math.random() * 900)}`;

    const newOrderPayload = {
      id: `ord-${Date.now()}`,
      orderNumber,
      kotNumber,
      orderType,
      tableId: selectedTableId,
      tableLabel: currentTable ? currentTable.label : 'Counter',
      guestCount,
      status: 'IN_PROGRESS',
      items: cartItems.map((ci) => ({
        ...ci,
        fired: true,
        kitchenStatus: 'QUEUED',
      })),
      subtotal,
      taxTotal,
      discountTotal,
      total: grandTotal,
      currency: 'INR',
      firedAt: new Date().toISOString(),
    };

    // Store in localStorage for KDS module to read
    try {
      const existingStored = JSON.parse(
        localStorage.getItem('syncstays_pos_orders') || '[]'
      );
      localStorage.setItem(
        'syncstays_pos_orders',
        JSON.stringify([newOrderPayload, ...existingStored])
      );
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    // Mark current cart items as fired
    setCartItems((prev) =>
      prev.map((ci) => ({ ...ci, fired: true, kitchenStatus: 'QUEUED' }))
    );

    showToast(`🔥 Order ${kotNumber} fired to kitchen display!`, 'success');
  };

  // Action: Generate Bill & Settle
  const handleSettleOrder = () => {
    if (cartItems.length === 0) {
      showToast('Cart is empty. Add items before generating bill.', 'error');
      return;
    }
    setIsSettleModalOpen(true);
  };

  const handleConfirmSettle = () => {
    const invNumber = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    showToast(
      `Receipt ${invNumber} settled via ${paymentMethod}. Order completed!`,
      'success'
    );
    setIsSettleModalOpen(false);
    setCartItems([]);
    setDiscountPercent(0);
  };

  // Action: Transfer Table
  const handleTransferTable = () => {
    if (orderType !== 'DINE_IN') {
      showToast('Table transfer is only applicable for Dine-In orders.', 'info');
      return;
    }
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!transferTargetTableId) {
      showToast('Please select destination table.', 'error');
      return;
    }
    const destTable = TABLES_LIST.find((t) => t.id === transferTargetTableId);
    setSelectedTableId(transferTargetTableId);
    setIsTransferModalOpen(false);
    showToast(
      `Order transferred successfully to ${destTable ? destTable.label : transferTargetTableId}`,
      'success'
    );
  };

  return (
    <div className={styles.page} data-testid="restaurant-pos-page">
      {/* Toast Notification Container */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* POS Top Navigation Header */}
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>POS Terminal & Order Entry</h1>
          <p>Real-time Restaurant Order Entry, Table Billing & KOT Dispatch</p>
        </div>
        <div className={styles.headerActions}>
          <Badge variant="in-house">Terminal #01 Active</Badge>
          <Link to="/restaurant/kds" className={styles.kdsNavLink} data-testid="link-to-kds">
            Kitchen (KDS) Monitor →
          </Link>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className={styles.posBody}>
        {/* Left Side: Controls & Menu Catalog */}
        <div className={styles.catalogPanel}>
          {/* Order Type & Table Selection Bar */}
          <div className={styles.controlsCard}>
            <div className={styles.orderTypeTabs}>
              <button
                className={`${styles.typeBtn} ${orderType === 'DINE_IN' ? styles.typeBtnActive : ''}`}
                onClick={() => setOrderType('DINE_IN')}
              >
                🍽️ Dine-In
              </button>
              <button
                className={`${styles.typeBtn} ${orderType === 'TAKEAWAY' ? styles.typeBtnActive : ''}`}
                onClick={() => setOrderType('TAKEAWAY')}
              >
                🛍️ Takeaway
              </button>
              <button
                className={`${styles.typeBtn} ${orderType === 'DELIVERY' ? styles.typeBtnActive : ''}`}
                onClick={() => setOrderType('DELIVERY')}
              >
                🛵 Delivery
              </button>
            </div>

            {orderType === 'DINE_IN' && (
              <div className={styles.tableSelectorGroup}>
                <span className={styles.controlLabel}>Table:</span>
                <select
                  className={styles.tableSelect}
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                >
                  {TABLES_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} ({t.capacity} pax) - {t.status}
                    </option>
                  ))}
                </select>

                <div className={styles.guestCounter}>
                  <button
                    className={styles.countBtn}
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                  >
                    -
                  </button>
                  <span className={styles.countValue}>{guestCount} Guests</span>
                  <button
                    className={styles.countBtn}
                    onClick={() => setGuestCount((g) => g + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search & Category Filter Row */}
          <div className={styles.filterRow}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search dish name, code (e.g. APP-01), or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.categoryScroll}>
              {RESTAURANT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.categoryPill} ${selectedCategory === cat.name ? styles.categoryPillActive : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className={styles.menuGrid}>
            {filteredMenuItems.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div>
                  <div className={styles.itemCardHeader}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    {item.isVeg ? (
                      <span className={styles.vegTag} title="Vegetarian">
                        <span className={styles.vegTagInner} />
                      </span>
                    ) : (
                      <span className={styles.nonVegTag} title="Non-Vegetarian">
                        <span className={styles.nonVegTagInner} />
                      </span>
                    )}
                  </div>
                  <p className={styles.itemDesc}>{item.description}</p>
                </div>

                <div className={styles.itemFooter}>
                  <div>
                    <span className={styles.itemPrice}>₹{item.price}</span>
                    {item.modifierGroups && item.modifierGroups.length > 0 && (
                      <div>
                        <span className={styles.customizeBadge}>Customizable</span>
                      </div>
                    )}
                  </div>
                  <button
                    className={styles.addBtn}
                    onClick={() => handleAddItem(item)}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}

            {filteredMenuItems.length === 0 && (
              <div className={styles.emptyGrid} style={{ gridColumn: '1 / -1' }}>
                <p>No dishes found matching &quot;{searchQuery}&quot;.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Cart & Bill Panel */}
        <div className={styles.cartPanel}>
          {/* Cart Header */}
          <div className={styles.cartHeader}>
            <div className={styles.cartTitleRow}>
              <h2 className={styles.cartTitle}>Current Order</h2>
              <Badge variant={cartItems.length > 0 ? 'arriving' : 'checked-out'}>
                {cartItems.length} Items
              </Badge>
            </div>
            <div className={styles.cartSubDetails}>
              <span>
                <strong>Type:</strong> {orderType}
              </span>
              {orderType === 'DINE_IN' && (
                <span>
                  <strong>Table:</strong> {currentTable ? currentTable.label : selectedTableId}
                </span>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div className={styles.cartItemList}>
            {cartItems.map((ci) => (
              <div key={ci.id} className={styles.cartItem}>
                <div className={styles.cartItemHeader}>
                  <span className={styles.cartItemTitle}>{ci.name}</span>
                  <button
                    className={styles.cartItemRemove}
                    onClick={() => handleRemoveCartItem(ci.id)}
                    title="Remove Item"
                  >
                    ✕
                  </button>
                </div>

                {ci.modifiers && ci.modifiers.length > 0 && (
                  <div className={styles.cartItemModifiers}>
                    {ci.modifiers.map((m) => (
                      <span key={m.id}>
                        • {m.name} {m.priceDelta ? `(+₹${m.priceDelta})` : ''}
                      </span>
                    ))}
                  </div>
                )}

                {ci.note && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Note: &quot;{ci.note}&quot;
                  </div>
                )}

                <div className={styles.cartItemRow}>
                  <div className={styles.qtyControls}>
                    <button
                      className={styles.cartQtyBtn}
                      onClick={() => handleUpdateQuantity(ci.id, -1)}
                    >
                      -
                    </button>
                    <span className={styles.cartQtyVal}>{ci.quantity}</span>
                    <button
                      className={styles.cartQtyBtn}
                      onClick={() => handleUpdateQuantity(ci.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.cartItemPrice}>₹{ci.lineTotal}</span>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}>🛒</div>
                <p style={{ margin: 0, fontWeight: 600 }}>Cart is empty</p>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                  Select items from the catalog on the left to start building order.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary & Actions */}
          <div className={styles.cartFooter}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <div className={styles.discountInputRow}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Discount %:</span>
              <input
                type="number"
                min="0"
                max="50"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
                className={styles.discInput}
              />
              {discountTotal > 0 && (
                <span style={{ fontSize: '12px', color: '#16a34a', filter: 'var(--status-green-filter, none)' }}>
                  (-₹{discountTotal})
                </span>
              )}
            </div>

            <div className={styles.summaryRow}>
              <span>GST Tax (5%):</span>
              <span>₹{taxTotal}</span>
            </div>

            <div className={styles.summaryTotalRow}>
              <span>Grand Total:</span>
              <span>₹{grandTotal}</span>
            </div>

            <div className={styles.cartActionGrid}>
              <button
                className={styles.fireKotBtn}
                onClick={handleFireKot}
                disabled={cartItems.length === 0}
                data-testid="fire-kot-btn"
              >
                🔥 Fire KOT to Kitchen
              </button>

              <button
                className={styles.settleBtn}
                onClick={handleSettleOrder}
                disabled={cartItems.length === 0}
              >
                🧾 Generate Bill / Pay
              </button>

              {orderType === 'DINE_IN' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleTransferTable}
                  disabled={cartItems.length === 0}
                >
                  🔄 Transfer Table
                </Button>
              )}

              <button
                className={styles.cancelBtn}
                onClick={handleClearOrder}
                disabled={cartItems.length === 0}
              >
                ❌ Clear Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Item Customization Modal */}
      {customizingItem && (
        <Modal
          isOpen={true}
          onClose={() => setCustomizingItem(null)}
          title={`Customize ${customizingItem.name}`}
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setCustomizingItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmCustomization}>
                Add to Cart
              </Button>
            </div>
          }
        >
          {customizingItem.modifierGroups.map((mg) => (
            <div key={mg.id} className={styles.modGroup}>
              <div className={styles.modGroupName}>{mg.name}:</div>
              <div className={styles.modOptionsList}>
                {mg.options.map((opt) => {
                  const isSelected = selectedModifiers[mg.id]?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`${styles.modOptionItem} ${isSelected ? styles.modOptionSelected : ''}`}
                      onClick={() =>
                        setSelectedModifiers((prev) => ({ ...prev, [mg.id]: opt }))
                      }
                    >
                      <span>{opt.name}</span>
                      <span>
                        {opt.priceDelta ? `+₹${opt.priceDelta}` : 'Included'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Kitchen Special Instructions / Note:
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra crispy, no garlic"
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </Modal>
      )}

      {/* Bill Settlement Modal */}
      {isSettleModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsSettleModalOpen(false)}
          title="Bill Settlement & Payment"
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsSettleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmSettle}>
                Complete Payment (₹{grandTotal})
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--color-hover)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#16a34a' }}>
                  <span>Discount ({discountPercent}%):</span>
                  <span>-₹{discountTotal}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>GST Tax (5%):</span>
                <span>₹{taxTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', color: 'var(--color-primary)', paddingTop: '8px', borderTop: '1px dashed var(--color-border)' }}>
                <span>Total Amount Due:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Select Payment Method:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'CARD', label: '💳 Credit / Debit Card' },
                  { id: 'CASH', label: '💵 Cash Payment' },
                  { id: 'UPI', label: '📱 UPI / QR Code' },
                  { id: 'ROOM', label: '🏨 Post to Guest Room' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: paymentMethod === pm.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: paymentMethod === pm.id ? 'var(--color-row-selected)' : 'var(--color-surface)',
                      color: paymentMethod === pm.id ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'ROOM' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Select Guest Room:
                </label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-primary)' }}
                >
                  <option value="Room 402 - Julian Smith">Room 402 - Julian Smith</option>
                  <option value="Room 305 - Sarah Jenkins">Room 305 - Sarah Jenkins</option>
                  <option value="Room 1102 - Michael Chang">Room 1102 - Michael Chang</option>
                </select>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Transfer Table Modal */}
      {isTransferModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsTransferModalOpen(false)}
          title={`Transfer Order from ${currentTable ? currentTable.label : selectedTableId}`}
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsTransferModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmTransfer}>
                Confirm Transfer
              </Button>
            </div>
          }
        >
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Select Destination Available Table:
            </label>
            <select
              value={transferTargetTableId}
              onChange={(e) => setTransferTargetTableId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-primary)', fontSize: '14px' }}
            >
              <option value="">-- Choose Available Table --</option>
              {TABLES_LIST.filter((t) => t.id !== selectedTableId && t.status === 'AVAILABLE').map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.capacity} pax) - {t.section}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}
