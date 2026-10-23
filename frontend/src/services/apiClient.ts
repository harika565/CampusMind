import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

// Storage keys
export const TOKEN_STORAGE_KEY = 'campusmind_auth_token';
export const USER_STORAGE_KEY = 'campusmind_auth_user';
export const MOCK_MODE_KEY = 'campusmind_mock_mode_override';

// Determine if mock mode is active
export function isMockModeActive(): boolean {
  const localOverride = localStorage.getItem(MOCK_MODE_KEY);
  if (localOverride !== null) {
    return localOverride === 'true';
  }
  return import.meta.env.VITE_USE_MOCKS === 'true';
}

export function setMockModeActive(active: boolean): void {
  localStorage.setItem(MOCK_MODE_KEY, String(active));
  window.dispatchEvent(new Event('campusmind_mock_mode_changed'));
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Uniform error format and 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    if (error.response?.status === 401) {
      // Clear invalid session
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      // Only redirect if not already on public/auth routes
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register') &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login?expired=true';
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.response?.data?.detail || error.message || 'An unexpected error occurred.',
      status_code: error.response?.status,
      detail: error.response?.data?.detail,
    };

    return Promise.reject(apiError);
  }
);
