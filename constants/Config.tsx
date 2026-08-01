import { Platform } from 'react-native';

/**
 * App-wide configuration.
 *
 * Only `EXPO_PUBLIC_*` variables are readable here, and every one of them is
 * inlined into the shipped bundle — never reference a secret from this file.
 */

const APP_VERSION = '1.0.0';

export const AppConfig = {
  name: 'Farsh e Zameen',
  version: APP_VERSION,
  bundleId: 'com.farshezameen.app',
  environment: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  platform: Platform.OS,
} as const;

export const ApiConfig = {
  /**
   * Base URL of the backend. Set via EXPO_PUBLIC_API_URL in `.env`.
   * The fallback is only a dev convenience — on a physical device this must be
   * your machine's LAN IP, not localhost.
   */
  baseUrl: (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/+$/, ''),

  appVersion: APP_VERSION,

  endpoints: {
    auth: {
      login: '/signin',
      register: '/signup',
      profile: '/profile',
    },
    properties: {
      list: '/properties',
      detail: '/properties/:id',
      mine: '/properties/mine',
    },
  },

  settings: {
    timeout: 30_000,
  },
} as const;

/** Validation rules shared by every form in the app. */
export const ValidationRules = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
  },
  // Pakistani mobile numbers: 03XX-XXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX
  phone: {
    regex: /^(?:\+92|0092|92|0)?3\d{2}[\s-]?\d{7}$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
  },
  name: {
    minLength: 2,
    maxLength: 80,
  },
} as const;

export default { AppConfig, ApiConfig, ValidationRules };
