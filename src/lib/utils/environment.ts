import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Environment = 'production' | 'canary' | 'development' | 'unknown';

export interface EnvironmentInfo {
  environment: Environment;
  siteUrl: string;
  siteVersion: string;
  hostname: string;
  isProduction: boolean;
  isCanary: boolean;
  isDevelopment: boolean;
  isUnknown: boolean;
}

async function fetchSiteVersion(): Promise<string> {
  if (!browser) return '';
  
  try {
    const response = await fetch('/data/version/env.ver');
    if (!response.ok) {
      throw new Error(`Failed to fetch version: ${response.status}`);
    }
    const version = await response.text();
    return version.trim();
  } catch (error) {
    console.error('Error fetching site version:', error);
    throw error;
  }
}

function createEnvironmentStore() {
  const { subscribe, set } = writable<EnvironmentInfo>({
    environment: 'unknown',
    siteUrl: '',
    siteVersion: '',
    hostname: '',
    isProduction: false,
    isCanary: false,
    isDevelopment: false,
    isUnknown: true
  });

  async function detectEnvironment(): Promise<EnvironmentInfo> {
    let environment: Environment = 'unknown';
    let hostname = '';
    let siteUrl = '';
    
    if (browser) {
      hostname = window.location.hostname;
      siteUrl = import.meta.env.VITE_SITE_URL || "";
      
      if (hostname === "new.electris.net") {
        environment = "production";
      } else if (hostname === "canary.new.electris.net") {
        environment = "canary";
      } else if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "testing.new.electris.net") {
        environment = "development";
      } else {
        environment = "unknown";
      }
    }

    const siteVersion = await fetchSiteVersion();

    const envInfo: EnvironmentInfo = {
      environment,
      siteUrl,
      siteVersion,
      hostname,
      isProduction: environment === 'production',
      isCanary: environment === 'canary',
      isDevelopment: environment === 'development',
      isUnknown: environment === 'unknown'
    };

    return envInfo;
  }

  async function initialize() {
    if (browser) {
      try {
        const envInfo = await detectEnvironment();
        set(envInfo);
      } catch (error) {
        console.error('Failed to initialize environment store:', error);
        set({
          environment: 'unknown',
          siteUrl: '',
          siteVersion: 'v0',
          hostname: browser ? window.location.hostname : '',
          isProduction: false,
          isCanary: false,
          isDevelopment: false,
          isUnknown: true
        });
      }
    }
  }

  initialize();

  return {
    subscribe,
    refresh: initialize,
    detectEnvironment
  };
}

export const environmentStore = createEnvironmentStore();

export const currentEnvironment = derived(environmentStore, $env => $env.environment);
export const siteVersion = derived(environmentStore, $env => $env.siteVersion);
export const siteUrl = derived(environmentStore, $env => $env.siteUrl);
export const hostname = derived(environmentStore, $env => $env.hostname);

export function getCurrentEnvironment(): Environment {
  if (!browser) return 'unknown';

  const hostname = window.location.hostname;
  
  if (hostname === "new.electris.net") {
    return "production";
  } else if (hostname === "canary-new.electris.net") {
    return "canary";
  } else if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "testing-new.electris.net") {
    return "development";
  } else {
    return "unknown";
  }
}

export async function getEnvironmentInfo(): Promise<EnvironmentInfo> {
  if (!browser) {
    return {
      environment: 'unknown',
      siteUrl: '',
      siteVersion: '',
      hostname: '',
      isProduction: false,
      isCanary: false,
      isDevelopment: false,
      isUnknown: true
    };
  }
  return await environmentStore.detectEnvironment();
}

export function getEnvironmentDisplayName(env?: Environment): string {
  const environment = env || getCurrentEnvironment();
  
  switch (environment) {
    case 'canary':
      return 'canary';
    case 'production':
      return 'production';
    case 'development':
      return 'development';
    default:
      return 'unknown';
  }
}