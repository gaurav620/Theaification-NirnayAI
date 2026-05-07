"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

interface TranslationCache {
  [key: string]: string;
}

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string) => Promise<string>;
  isReady: boolean;
}

// Static translations for UI elements
const translations: Record<Language, Record<string, string>> = {
  en: {
    "header.title": "NirnayAI",
    "header.subtitle": "Central Reserve Police Force • MHA",
  },
  hi: {
    "header.title": "निर्णयAI",
    "header.subtitle": "केन्द्रीय रिजर्व पुलिस बल • गृह मंत्रालय",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [language, setLanguage] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);
  const [cache, setCache] = useState<TranslationCache>({});

  useEffect(() => {
    const saved = localStorage.getItem("nirnayai-language") as Language;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguage(saved);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("nirnayai-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language][key];
    if (translation) return translation;
    if (fallback) return fallback;
    const englishTranslation = translations.en[key];
    if (englishTranslation) return englishTranslation;
    return key;
  };

  const translateText = async (text: string): Promise<string> => {
    if (!text || text.trim() === "" || language === "en") return text;
    const cacheKey = `${language}:${text}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLang: language === "hi" ? "hi" : "en",
        }),
      });
      if (!response.ok) {
        throw new Error("Translation failed");
      }
      const data = await response.json();
      const translatedText = data.translatedText || text;
      setCache((prev) => ({
        ...prev,
        [cacheKey]: translatedText,
      }));
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  return React.createElement(
    TranslationContext.Provider,
    { value: { language, setLanguage, t, translateText, isReady } },
    children
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

export type { Language };
