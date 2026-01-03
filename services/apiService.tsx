import { ApiConfig } from '@/constants/Config'; // Import your unified config
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

export interface ApiError {
  message: string;
  code: string;
  status: number;
  timestamp: string;
}

// Auth token management
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

class ApiService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: ApiConfig.baseUrl, // Use the URL from Config.ts
      timeout: ApiConfig.settings.timeout,
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
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
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
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: any): ApiError {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
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

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY]);
  }

  async refreshToken(): Promise<string | null> {
    // Note: Standard JWT Auth plugin for WP often requires a different flow for refresh
    // This is a placeholder for the validate/refresh endpoint
    try {
      const token = await this.getToken();
      if (!token) throw new Error('No token');
      
      const response = await axios.post(`${ApiConfig.baseUrl}${ApiConfig.endpoints.auth.validate}`, {}, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) return token; // Token is still valid
      return null;
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  private onRefreshToken(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse = await this.client.get(url, config);
    return { success: true, data: response.data, statusCode: response.status };
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse = await this.client.post(url, data, config);
    return { success: true, data: response.data, statusCode: response.status };
  }
}

export const apiService = new ApiService();

// --- WORDPRESS SPECIFIC API METHODS ---

export const propertyApi = {
  // Get all properties (using standard WP query params)
  getProperties: (params?: any) => 
    apiService.get(ApiConfig.endpoints.properties.list, { 
      params: { 
        _embed: true, // Crucial for fetching images/author data in one go
        ...params 
      } 
    }),

  getProperty: (id: string | number) => 
    apiService.get(ApiConfig.endpoints.properties.detail.replace(':id', String(id)), {
      params: { _embed: true }
    }),

  // Search uses the list endpoint with ?search=term
  searchProperties: (query: string) => 
    apiService.get(ApiConfig.endpoints.properties.search, { 
      params: { search: query, _embed: true } 
    }),
};

export const authApi = {
  // Standard WP JWT Auth Plugin Login
  login: async (username: string, password: string) => {
    // Note: JWT Auth plugin usually expects 'username' and 'password'
    const res = await apiService.post(ApiConfig.endpoints.auth.login, { username, password });
    if (res.data?.token) {
        await apiService.setToken(res.data.token);
    }
    return res;
  },

  register: (userData: any) => 
    apiService.post(ApiConfig.endpoints.auth.register, userData),

  getProfile: () => 
    apiService.get(ApiConfig.endpoints.auth.profile),
};

export const agentApi = {
  // Agents are users with 'agent' role in WP
  getAgents: () => 
    apiService.get(ApiConfig.endpoints.agents.list),
};

export default apiService;