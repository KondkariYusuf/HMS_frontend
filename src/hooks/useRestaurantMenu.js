/**
 * @file useRestaurantMenu.js
 * @description Custom React hook managing menu catalog items, category filtering, URL generator state, and item updates.
 * @reference Frame: Redefined food Menu Management Dashboard.jpeg
 */
import { useState, useCallback } from 'react';

const DEFAULT_MENU_ITEMS = [
  {
    id: 'item-1',
    name: 'Premium Paneer Tikka',
    price: 340,
    category: 'Starters',
    description: 'Marinated cottage cheese cooked in clay oven with spices.',
  },
  {
    id: 'item-2',
    name: 'Dal Makhani Signature',
    price: 280,
    category: 'Main Course',
    description: 'Slow-cooked black lentils with cream and aromatic spices.',
  },
  {
    id: 'item-3',
    name: 'Truffle Mushroom Soup',
    price: 195,
    category: 'Starters',
    description: 'Creamy forest mushrooms infused with white truffle oil.',
  },
];

const CATEGORY_OPTIONS = [
  'Starters',
  'Main Course',
  'Beverages',
  'Desserts',
  'Soups & Salads',
  'Specials',
];

export function useRestaurantMenu() {
  const [items, setItems] = useState(DEFAULT_MENU_ITEMS);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const menuUrl = 'https://www.syncstays.com/food?h=ip0gh0f7&room={roomId}';

  const copyMenuUrl = useCallback(() => {
    navigator.clipboard.writeText(menuUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [menuUrl]);

  const updateItem = useCallback((id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const deleteItem = useCallback((id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback(() => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: 'New Menu Dish',
      price: 0,
      category: 'Main Course',
      description: 'Enter item description...',
    };
    setItems((prevItems) => [...prevItems, newItem]);
  }, []);

  const saveChanges = useCallback(() => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, []);

  return {
    items,
    menuUrl,
    copied,
    saveSuccess,
    categoryOptions: CATEGORY_OPTIONS,
    copyMenuUrl,
    updateItem,
    deleteItem,
    addItem,
    saveChanges,
  };
}

export default useRestaurantMenu;
