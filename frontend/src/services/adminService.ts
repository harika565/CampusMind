import { apiClient, isMockModeActive } from './apiClient';
import { mockService } from '../mocks/mockService';
import { DashboardMetrics, SystemLog, SystemNotification, User } from '../types';
import { DEMO_USERS } from '../mocks/mockData';

export const adminService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (isMockModeActive()) {
      return mockService.getDashboardMetrics();
    }

    const res = await apiClient.get<DashboardMetrics>('/api/admin/metrics');
    return res.data;
  },

  async getUsers(): Promise<User[]> {
    if (isMockModeActive()) {
      return Object.values(DEMO_USERS).map(u => u.user);
    }

    const res = await apiClient.get<User[]>('/api/admin/users');
    return res.data;
  },

  async getSystemLogs(): Promise<SystemLog[]> {
    if (isMockModeActive()) {
      return mockService.getSystemLogs();
    }

    const res = await apiClient.get<SystemLog[]>('/api/admin/logs');
    return res.data;
  },

  async getNotifications(): Promise<SystemNotification[]> {
    if (isMockModeActive()) {
      return mockService.getNotifications();
    }

    const res = await apiClient.get<SystemNotification[]>('/api/notifications');
    return res.data;
  },
};
