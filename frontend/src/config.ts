// Frontend configuration using Vite environment variables
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // N8N Configuration
  n8nBaseUrl: import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'SmartHaul',
  
  // Development
  isDevelopment: import.meta.env.DEV,
  
  // Feature flags
  features: {
    n8nIntegration: true,
    realTimeUpdates: true,
    documentProcessing: true,
    analytics: true,
  }
} as const;

// Type-safe config access
export type Config = typeof config; 