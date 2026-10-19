import { useEffect, useState } from 'react';
import translations from './translations.json';

import { LanguageContext } from './useLanguage.js';
const storageKey = 'mathis-portfolio-language';
const title = 'Mathis — Développeur en devenir · Portfolio';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return Object.hasOwn(translations, saved) ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });
  const t = (key, values = {}) => {
    const text = translations[language]?.[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  };
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = translations[language][title];
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${translations[language]["Étudiant en informatique"]} · ${translations[language]["BUT Informatique · 3ᵉ année"]} · ${translations[language]["Stage · 12 à 16 semaines"]} — Mathis Gesson`);
    try { localStorage.setItem(storageKey, language); } catch { /* The selector works when storage is unavailable. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
