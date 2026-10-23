import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SystemNotification } from '../types';
import { adminService } from '../services/adminService';

interface NotificationContextType {
  notifications: SystemNotification[];
  unreadCount: number;
  systemHealth: 'healthy' | 'degraded' | 'error';
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [systemHealth] = useState<'healthy' | 'degraded' | 'error'>('healthy');

  const fetchNotifications = useCallback(async () => {
    try {
      const items = await adminService.getNotifications();
      setNotifications(items);
    } catch {
      // ignore in silent polling
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        systemHealth,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
