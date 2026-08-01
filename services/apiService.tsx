import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Platform } from 'react-native';

import { ApiConfig } from '@/constants/Config';
import type { Property, PropertyDraft } from '@/types/property';

/**
 * The ONLY boundary between the app and the backend.
 *
 * Nothing else in the app may import from `backend/` or know the server's
 * internals — everything goes through here over HTTP to `ApiConfig.baseUrl`.
 */

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_session';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export interface PropertyPage {
  data: Property[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

/** Normalized error so screens never have to unwrap axios internals. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 0, code = 'UNKNOWN') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const normalizeError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError<{ error?: string; message?: string }>;

  if (axiosError?.isAxiosError) {
    // No response at all -> almost always a wrong/unreachable API base URL.
    if (!axiosError.response) {
      return new ApiError(
        `Can't reach the server at ${ApiConfig.baseUrl}. Check that the backend is running and that EXPO_PUBLIC_API_URL points at this machine's LAN IP.`,
        0,
        'NETWORK'
      );
    }

    const { status, data } = axiosError.response;
    return new ApiError(
      data?.error || data?.message || `Request failed (${status})`,
      status,
      status === 401 ? 'UNAUTHORIZED' : 'HTTP_ERROR'
    );
  }

  return new ApiError((error as Error)?.message || 'Unexpected error');
};

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ApiConfig.baseUrl,
      timeout: ApiConfig.settings.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': ApiConfig.appVersion,
      },
    });

    // Attach the bearer token to every outgoing request.
    this.client.interceptors.request.use(async config => {
      const token = await this.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.client.interceptors.response.use(
      response => response,
      error => Promise.reject(normalizeError(error))
    );
  }

  // ---------------------------------------------------------------- tokens

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Persisting the token was previously missing entirely, which meant the
   * session never survived a restart and every authenticated request went
   * out with no Authorization header.
   */
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }

  // ------------------------------------------------------------------ auth

  async login(email: string, password: string): Promise<AuthResult> {
    const { data } = await this.client.post(ApiConfig.endpoints.auth.login, {
      email: email.trim().toLowerCase(),
      password,
    });

    if (!data?.token || !data?.user) {
      throw new ApiError('Malformed response from server (missing token or user).', 502, 'BAD_RESPONSE');
    }

    await this.setToken(data.token);
    return { user: data.user as AuthUser, token: data.token as string };
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }): Promise<{ message: string }> {
    const { data } = await this.client.post(ApiConfig.endpoints.auth.register, {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });
    return { message: data?.message ?? 'Account created successfully.' };
  }

  async logout(): Promise<void> {
    await this.clearSession();
  }

  async getProfile(): Promise<AuthUser> {
    const { data } = await this.client.get(ApiConfig.endpoints.auth.profile);
    return data.user as AuthUser;
  }

  async updateProfile(updates: { name?: string; phone?: string }): Promise<AuthUser> {
    const { data } = await this.client.put(ApiConfig.endpoints.auth.profile, updates);
    return data.user as AuthUser;
  }

  // -------------------------------------------------------------- properties

  async listProperties(page: number, limit: number): Promise<PropertyPage> {
    const { data } = await this.client.get(ApiConfig.endpoints.properties.list, { params: { page, limit } });
    return data as PropertyPage;
  }

  async getProperty(id: number): Promise<Property> {
    const url = ApiConfig.endpoints.properties.detail.replace(':id', String(id));
    const { data } = await this.client.get(url);
    return data as Property;
  }

  async listMyProperties(): Promise<Property[]> {
    const { data } = await this.client.get(ApiConfig.endpoints.properties.mine);
    return data.data as Property[];
  }

  async createProperty(draft: PropertyDraft): Promise<Property> {
    const { data } = await this.client.post(ApiConfig.endpoints.properties.list, draft);
    return data as Property;
  }

  async updateProperty(id: number, draft: PropertyDraft): Promise<Property> {
    const url = ApiConfig.endpoints.properties.detail.replace(':id', String(id));
    const { data } = await this.client.put(url, draft);
    return data as Property;
  }

  async deleteProperty(id: number): Promise<void> {
    const url = ApiConfig.endpoints.properties.detail.replace(':id', String(id));
    await this.client.delete(url);
  }

  /** Cheap reachability probe used by diagnostics / connection banners. */
  async health(): Promise<boolean> {
    try {
      await this.client.get('/health', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

// Named aliases kept so existing call sites keep reading naturally.
export const authApi = apiService;

export default apiService;
