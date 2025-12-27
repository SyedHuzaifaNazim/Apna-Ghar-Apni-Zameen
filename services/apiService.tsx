import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  timestamp: string;
}

// Configuration
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://apna-ghar-apni-zameen.vercel.app',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Auth token management
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

class ApiService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add timestamp for cache busting
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              this.onRefreshToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await this.clearTokens();
            this.onRefreshTokenFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        console.error('❌ Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || error.response.data.error || 'An error occurred',
        code: error.response.data.code || 'UNKNOWN_ERROR',
        status: error.response.status,
        timestamp: new Date().toISOString(),
      };
    }

    if (error.request) {
      return {
        message: 'Network error: Unable to connect to server',
        code: 'NETWORK_ERROR',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: 500,
      timestamp: new Date().toISOString(),
    };
  }

  // Token Management
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  }

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY]);
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      await this.setToken(accessToken);
      return accessToken;
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  private onRefreshToken(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private onRefreshTokenFailure() {
    this.refreshSubscribers = [];
    // Emit event or trigger logout
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.get(url, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.post(url, data, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.put(url, data, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.patch(url, data, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.delete(url, config);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  // File Upload
  async uploadFile<T = any>(
    url: string, 
    file: any, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: AxiosResponse = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  // Batch requests
  async all<T = any>(requests: Promise<ApiResponse<T>>[]): Promise<ApiResponse<T>[]> {
    return Promise.all(requests);
  }

  // Cancel token for request cancellation
  createCancelToken() {
    return axios.CancelToken.source();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Property-specific API methods
export const propertyApi = {
  // Properties
  getProperties: (params?: any) => 
    apiService.get('/properties', { params }),

  getProperty: (id: string | number) => 
    apiService.get(`/properties/${id}`),

  createProperty: (data: any) => 
    apiService.post('/properties', data),

  updateProperty: (id: string | number, data: any) => 
    apiService.put(`/properties/${id}`, data),

  deleteProperty: (id: string | number) => 
    apiService.delete(`/properties/${id}`),

  // Search
  searchProperties: (query: string, filters?: any) => 
    apiService.get('/properties/search', { 
      params: { q: query, ...filters } 
    }),

  // Favorites
  getFavorites: () => 
    apiService.get('/favorites'),

  addToFavorites: (propertyId: string | number) => 
    apiService.post('/favorites', { propertyId }),

  removeFromFavorites: (propertyId: string | number) => 
    apiService.delete(`/favorites/${propertyId}`),

  // Similar properties
  getSimilarProperties: (propertyId: string | number) => 
    apiService.get(`/properties/${propertyId}/similar`),
};

export const authApi = {
  login: (email: string, password: string) => 
    apiService.post('/auth/login', { email, password }),

  register: (userData: any) => 
    apiService.post('/auth/register', userData),

  logout: () => 
    apiService.post('/auth/logout'),

  forgotPassword: (email: string) => 
    apiService.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) => 
    apiService.post('/auth/reset-password', { token, newPassword }),

  verifyEmail: (token: string) => 
    apiService.post('/auth/verify-email', { token }),

  getProfile: () => 
    apiService.get('/auth/profile'),

  updateProfile: (data: any) => 
    apiService.put('/auth/profile', data),
};

export const userApi = {
  getPreferences: () => 
    apiService.get('/user/preferences'),

  updatePreferences: (data: any) => 
    apiService.put('/user/preferences', data),

  getSearchHistory: () => 
    apiService.get('/user/search-history'),

  clearSearchHistory: () => 
    apiService.delete('/user/search-history'),

  getViewedProperties: () => 
    apiService.get('/user/viewed-properties'),
};

export const agentApi = {
  getAgents: (params?: any) => 
    apiService.get('/agents', { params }),

  getAgent: (id: string | number) => 
    apiService.get(`/agents/${id}`),

  contactAgent: (agentId: string | number, message: string) => 
    apiService.post(`/agents/${agentId}/contact`, { message }),

  scheduleViewing: (propertyId: string | number, dateTime: string, message?: string) => 
    apiService.post('/viewings/schedule', { propertyId, dateTime, message }),
};

export default apiService;