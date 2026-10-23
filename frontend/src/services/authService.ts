import { apiClient, isMockModeActive, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './apiClient';
import { mockService } from '../mocks/mockService';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (isMockModeActive()) {
      const response = await mockService.login(credentials);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      return response;
    }

    const res = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    if (isMockModeActive()) {
      const response = await mockService.register(data);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      return response;
    }

    const res = await apiClient.post<LoginResponse>('/api/auth/register', data);
    if (res.data.access_token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;

    if (isMockModeActive()) {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          // fallback
        }
      }
      return mockService.getCurrentUser(token);
    }

    const res = await apiClient.get<User>('/api/auth/me');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
    return res.data;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
