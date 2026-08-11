/**
 * @file RestaurantOrderModal.jsx
 * @description Interactive POS Table Order overlay modal with room charging, dish selection, and KOT printing.
 * @reference Frame: Redefined Restaurant order models.jpeg
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls overlay modal visibility
 * @param {Function} props.onClose - Dismissal callback handler
 * @param {string} [props.tableNumber] - Target table identifier (e.g. "01")
 */
import React, { useState, useMemo } from 'react';
import styles from './RestaurantOrderModal.module.css';

const MENU_DISHES = [
  {
    id: 'dish-1',
    name: 'Pan-Seared Scallops',
    category: 'Appetizers',
    price: 32.0,
    isSignature: true,
    description:
      'Wild-caught scallops, saffron-infused risotto, citrus herb oil...',
  },
  {
    id: 'dish-2',
    name: 'Horizon Wagyu Burger',
    category: 'Main Course',
    price: 28.0,
    isSignature: false,
    description:
      'Aged wagyu, truffle aioli, caramelized onions, toasted brioche...',
  },
  {
    id: 'dish-3',
    name: 'Heirloom Burrata',
    category: 'Appetizers',
    price: 24.0,
    isSignature: false,
    description:
      'Creamy burrata, colorful heirloom tomatoes, basil oil, balsamic glaze...',
  },
  {
    id: 'dish-4',
    name: 'Garden Gin Fizz',
    category: 'Beverages',
    price: 18.0,
    isSignature: false,
    description:
      'Botanical gin, fresh cucumber, mint, elderflower tonic...',
  },
  {
    id: 'dish-5',
    name: 'Signature Tiramisu',
    category: 'Desserts',
    price: 14.0,
    isSignature: false,
    description:
      'Mascarpone cream, espresso-soaked ladyfingers, cocoa dust...',
  },
  {
    id: 'dish-6',
    name: 'Truffle Parm Fries',
    category: 'Specials',
    price: 12.0,
    isSignature: false,
    description:
      'Hand-cut fries, white truffle oil, grated parmesan, garlic aioli...',
  },
];

const CATEGORY_PILLS = [
  'All Items',
  'Appetizers',
  'Main Course',
  'Beverages',
  'Desserts',
  'Specials',
];

const ROOM_OPTIONS = [
  'Room 402 - Julian Smith',
  'Room 305 - Sarah Jenkins',
  'Room 1102 - Michael Chang',
  'Direct Cash Payment',
];

export default function RestaurantOrderModal({
  isOpen = false,
  onClose,
  tableNumber = '01',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedRoom, setSelectedRoom] = useState('Room 402 - Julian Smith');

  const [cartItems, setCartItems] = useState([
    {
      id: 'dish-1',
      name: 'Pan-Seared Scallops',
      price: 32.0,
      quantity: 1,
      note: '',
    },
    {
      id: 'dish-4',
      name: 'Garden Gin Fizz',
      price: 18.0,
      quantity: 2,
      note: 'Extra mint, No ice',
    },
  ]);

  const filteredDishes = useMemo(() => {
    return MENU_DISHES.filter((dish) => {
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All Items' ||
        dish.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (dish) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === dish.id);
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          note: '',
        },
      ];
    });
  };

  const handleUpdateQuantity = (dishId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (dishId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== dishId));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const serviceCharge = subtotal * 0.1;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + serviceCharge + tax;

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      data-testid="restaurant-order-modal"
    >
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <header className={styles.modalHeader}>
          <div>
            <h3 id="modal-title" className={styles.modalTitle}>
              Table Order {tableNumber ? `- Table ${tableNumber}` : ''}
            </h3>
            <p className={styles.modalSubtitle}>
              Add items and manage the current order
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close Table Order Modal"
          >
            ✕
          </button>
        </header>

        {/* Modal Body Split */}
        <div className={styles.modalBody}>
          {/* Left Menu Section */}
          <section className={styles.leftSection}>
            {/* Search Input */}
            <div className={styles.searchBox}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search dishes, drinks, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search dishes"
              />
            </div>

            {/* Category Pills Bar */}
            <nav className={styles.categoryBar} aria-label="Menu Category Filter">
              {CATEGORY_PILLS.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.catPill} ${
                      isActive ? styles.catPillActive : ''
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={isActive}
                  >
                    {cat}
                  </button>
                );
              })}
            </nav>

            {/* Menu Items Grid */}
            <div className={styles.menuGrid}>
              {filteredDishes.map((dish) => (
                <article key={dish.id} className={styles.dishCard}>
                  {dish.isSignature && (
                    <span className={styles.signatureBadge}>SIGNATURE</span>
                  )}
                  <h4 className={styles.dishTitle}>{dish.name}</h4>
                  <p className={styles.dishDesc}>{dish.description}</p>
                  <footer className={styles.dishFooter}>
                    <span className={styles.dishPrice}>
                      ${dish.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => handleAddToCart(dish)}
                      aria-label={`Add ${dish.name} to order`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          {/* Right Cart Sidebar */}
          <aside className={styles.rightSection}>
            {/* Charge to Room */}
            <div className={styles.fieldGroup}>
              <label htmlFor="room-select" className={styles.fieldLabel}>
                CHARGE TO ROOM
              </label>
              <select
                id="room-select"
                className={styles.roomSelect}
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                {ROOM_OPTIONS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <h4 className={styles.orderHeader}>Current Order</h4>

            {/* Cart List */}
            <div className={styles.cartList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <span className={styles.cartItemTitle}>{item.name}</span>
                    {item.note && (
                      <span className={styles.cartItemNote}>{item.note}</span>
                    )}
                    <div className={styles.quantityControls}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.cartItemRight}>
                    <span className={styles.cartItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className={styles.removeLink}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className={styles.summaryVal}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Service Charge (10%)</span>
                <span className={styles.summaryVal}>
                  ${serviceCharge.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (5%)</span>
                <span className={styles.summaryVal}>${tax.toFixed(2)}</span>
              </div>

              {/* Total Box */}
              <div className={styles.totalHighlightBox}>
                <span className={styles.totalHighlightLabel}>Total</span>
                <span className={styles.totalHighlightVal}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Print KOT Button */}
            <button
              type="button"
              className={styles.kotButton}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.alert(`KOT Saved & Printed for Table ${tableNumber}!`);
                }
                onClose();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Save / Print KOT</span>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
