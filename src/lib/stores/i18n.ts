import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface LocaleData {
  [key: string]: string;
}

export interface AvailableLocale {
  code: string;
  name: string;
  flag: string;
}

export const availableLocales: AvailableLocale[] = [
  { code: 'ar', name: 'اللغة العربية', flag: '🇪🇬'},
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵'},
  { code: 'ro-RO', name: 'Română', flag: '🇷🇴' }
];

const defaultLocale = 'en-US';

export const currentLocale = writable<string>(defaultLocale);
export const localeData = writable<LocaleData>({});

const localeCache = new Map<string, LocaleData>();
const commonCache = new Map<string, LocaleData>();

function detectBrowserLanguage(): string {
  if (!browser) return defaultLocale;
  
  const browserLang = navigator.language;
  const availableCodes = availableLocales.map(locale => locale.code);
  
  if (availableCodes.includes(browserLang)) {
    return browserLang;
  }
  
  const langFamily = browserLang.split('-')[0];
  const familyMatch = availableCodes.find(code => code.startsWith(langFamily));
  
  return familyMatch || defaultLocale;
}

function parseLocaleFile(content: string): LocaleData {
  const data: LocaleData = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex !== -1) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        let value = trimmedLine.substring(equalIndex + 1).trim();
        
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        data[key] = value;
      }
    }
  }
  
  return data;
}

async function loadCommonData(): Promise<LocaleData> {
  const cacheKey = 'common';
  
  if (commonCache.has(cacheKey)) {
    return commonCache.get(cacheKey)!;
  }
  
  try {
    const response = await fetch('/data/lang/env.lang');
    if (!response.ok) {
      throw new Error('Failed to load common locale data');
    }
    
    const content = await response.text();
    const data = parseLocaleFile(content);
    
    commonCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn('Failed to load common locale data:', error);
    return {};
  }
}

async function loadLanguageData(locale: string): Promise<LocaleData> {
  if (localeCache.has(locale)) {
    return localeCache.get(locale)!;
  }
  
  try {
    const response = await fetch(`/data/lang/env.${locale}.lang`);
    if (!response.ok) {
      throw new Error(`Failed to load locale ${locale}`);
    }
    
    const content = await response.text();
    const data = parseLocaleFile(content);
    
    localeCache.set(locale, data);
    return data;
  } catch (error) {
    console.warn(`Failed to load locale ${locale}:`, error);
    
    if (locale !== defaultLocale) {
      return await loadLanguageData(defaultLocale);
    }
    
    return {};
  }
}

async function getMergedLocaleData(locale: string): Promise<LocaleData> {
  try {
    const [commonData, languageData] = await Promise.all([
      loadCommonData(),
      loadLanguageData(locale)
    ]);
    
    return {
      ...commonData,
      ...languageData
    };
  } catch (error) {
    console.error(`Failed to load locale data for ${locale}:`, error);
    
    if (locale !== defaultLocale) {
      return await getMergedLocaleData(defaultLocale);
    }
    
    return {};
  }
}

export async function loadLocale(locale: string): Promise<void> {
  try {
    const mergedData = await getMergedLocaleData(locale);
    localeData.set(mergedData);
  } catch (error) {
    console.error('Failed to load locale data:', error);
    
    if (locale !== defaultLocale) {
      await loadLocale(defaultLocale);
    }
  }
}

export async function setLocale(locale: string): Promise<void> {
  if (!availableLocales.find(l => l.code === locale)) {
    console.warn(`Locale ${locale} is not available`);
    return;
  }
  
  currentLocale.set(locale);
  await loadLocale(locale);
  
  if (browser) {
    localStorage.setItem('preferred-locale', locale);
  }
}

function getStoredLocale(): string {
  if (!browser) return defaultLocale;
  
  try {
    return localStorage.getItem('preferred-locale') || defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export async function initializeI18n(): Promise<void> {
  let initialLocale = defaultLocale;
  
  if (browser) {
    const storedLocale = getStoredLocale();
    const detectedLocale = detectBrowserLanguage();
    
    initialLocale = storedLocale !== defaultLocale ? storedLocale : detectedLocale;
  }
  
  await setLocale(initialLocale);
}

export const t = derived(
  localeData,
  ($localeData) => {
    return (key: string, fallback?: string, localeOverride?: string): string => {
      if (!localeOverride) {
        const value = $localeData[key];
        if (value !== undefined) {
          return value;
        }
        
        if (fallback !== undefined) {
          return fallback;
        }

        console.warn(`Translation key "${key}" not found`);
        return key;
      }
      
      const overrideLocaleData = localeCache.get(localeOverride);
      const overrideCommonData = commonCache.get('common');
      
      if (overrideLocaleData && overrideCommonData) {
        const mergedOverrideData = {
          ...overrideCommonData,
          ...overrideLocaleData
        };
        
        const value = mergedOverrideData[key];
        if (value !== undefined) {
          return value;
        }
      }
      
      if (fallback !== undefined) {
        return fallback;
      }

      console.warn(`Translation key "${key}" not found for locale override "${localeOverride}"`);
      return key;
    };
  }
);

export async function tAsync(key: string, fallback?: string, localeOverride?: string): Promise<string> {
  if (!localeOverride) {
    const currentData = await new Promise<LocaleData>((resolve) => {
      const unsubscribe = localeData.subscribe((data) => {
        unsubscribe();
        resolve(data);
      });
    });
    
    const value = currentData[key];
    if (value !== undefined) {
      return value;
    }
    
    if (fallback !== undefined) {
      return fallback;
    }

    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  
  try {
    const overrideData = await getMergedLocaleData(localeOverride);
    const value = overrideData[key];
    
    if (value !== undefined) {
      return value;
    }
    
    if (fallback !== undefined) {
      return fallback;
    }

    console.warn(`Translation key "${key}" not found for locale override "${localeOverride}"`);
    return key;
  } catch (error) {
    console.error(`Failed to load locale override "${localeOverride}":`, error);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    return key;
  }
}

export async function preloadLocale(locale: string): Promise<void> {
  if (!availableLocales.find(l => l.code === locale)) {
    console.warn(`Locale ${locale} is not available for preloading`);
    return;
  }
  
  try {
    await getMergedLocaleData(locale);
  } catch (error) {
    console.error(`Failed to preload locale ${locale}:`, error);
  }
}

export const currentLocaleInfo = derived(
  currentLocale,
  ($currentLocale) => {
    return availableLocales.find(locale => locale.code === $currentLocale) || availableLocales[0];
  }
);

export function clearLocaleCache(): void {
  localeCache.clear();
  commonCache.clear();
}