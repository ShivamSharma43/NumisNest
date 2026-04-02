/**
 * Environment Configuration
 * 
 * Centralized configuration for all environment variables.
 * Access these values throughout the app instead of using import.meta.env directly.
 */

export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Feature Flags
  USE_MOCK_FALLBACK: import.meta.env.VITE_USE_MOCK_FALLBACK === 'true',
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV,
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'NumisNest',
  ITEMS_PER_PAGE: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '12', 10),
  
  // External Services
  GA_ID: import.meta.env.VITE_GA_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  
  // Runtime checks
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;

// Type for the environment config
export type EnvConfig = typeof env;
