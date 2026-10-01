import { STORAGE_KEYS } from '@/app/const/storageKeys';
import en from '@/locales/en/common.json';
import myAdditions from '@/locales/my/additions.json';
import my from '@/locales/my/common.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, my: { translation: { ...my, ...myAdditions } } },
  lng: localStorage.getItem(STORAGE_KEYS.language) || 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: { escapeValue: false },
});
i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEYS.language, language);
  document.documentElement.lang = language;
});
document.documentElement.lang = i18n.language || 'en';
