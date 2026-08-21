import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '@utils/apiClient';

const NotificationContext = createContext(null);

const normalizeNotification = (notification, index) => {
  if (!notification || typeof notification !== 'object') {
    return null;
  }

  return {
    ...notification,
    id: notification.id ?? null,
    type: String(notification.type || 'SYSTEM'),
    title: String(notification.title || 'Notification'),
    body: String(notification.body || notification.message || ''),
    isRead: Boolean(notification.isRead),
    createdAt: notification.createdAt || null,
    _key: notification.id ? String(notification.id) : `notification-${index}`,
  };
};

const getErrorMessage = (error) =>
  error?.message || 'Unable to load notifications right now.';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingIds, setMarkingIds] = useState(() => new Set());

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/notifications?page=1&limit=100&sortBy=createdAt&sortOrder=desc');
      const records = Array.isArray(response?.data)
        ? response.data.map(normalizeNotification).filter(Boolean)
        : [];
      const responseUnreadCount = Number(response?.meta?.unreadCount);

      setNotifications(records);
      setUnreadCount(Number.isFinite(responseUnreadCount)
        ? Math.max(0, responseUnreadCount)
        : records.filter((notification) => !notification.isRead).length);

      try {
        const unreadResponse = await api.get('/notifications/unread-count');
        const count = Number(unreadResponse?.data?.unreadCount);

        if (Number.isFinite(count)) {
          setUnreadCount(Math.max(0, count));
        }
      } catch {
        // The list response already provides a reliable fallback count.
      }
    } catch (requestError) {
      setNotifications([]);
      setUnreadCount(0);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId || markingAll || markingIds.has(String(notificationId))) {
      return false;
    }

    const id = String(notificationId);
    const previousNotifications = notifications;
    const target = previousNotifications.find(
      (notification) => String(notification.id) === id
    );

    if (!target || target.isRead) {
      return true;
    }

    setActionError(null);
    setMarkingIds((current) => new Set(current).add(id));
    setNotifications((current) => current.map((notification) =>
      String(notification.id) === id
        ? { ...notification, isRead: true }
        : notification
    ));
    setUnreadCount((current) => Math.max(0, current - 1));

    try {
      await api.post(`/notifications/${encodeURIComponent(id)}/read`);
      return true;
    } catch (requestError) {
      setNotifications(previousNotifications);
      setUnreadCount((current) => current + 1);
      setActionError(getErrorMessage(requestError));
      return false;
    } finally {
      setMarkingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }, [markingAll, markingIds, notifications]);

  const markAllAsRead = useCallback(async () => {
    if (markingAll || unreadCount === 0) {
      return true;
    }

    const previousNotifications = notifications;
    const previousUnreadCount = unreadCount;

    setActionError(null);
    setMarkingAll(true);
    setNotifications((current) => current.map((notification) => ({
      ...notification,
      isRead: true,
    })));
    setUnreadCount(0);

    try {
      await api.post('/notifications/read-all');
      return true;
    } catch (requestError) {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      setActionError(getErrorMessage(requestError));
      return false;
    } finally {
      setMarkingAll(false);
    }
  }, [markingAll, notifications, unreadCount]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    error,
    actionError,
    markingAll,
    markingIds,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
  }), [
    actionError,
    error,
    loadNotifications,
    loading,
    markingAll,
    markingIds,
    markAllAsRead,
    markAsRead,
    notifications,
    unreadCount,
  ]);

  return React.createElement(
    NotificationContext.Provider,
    { value },
    children
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
}
