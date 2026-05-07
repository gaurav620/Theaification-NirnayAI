"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "./translations";

interface TranslationCache {
  [key: string]: string;
}

export function useGoogleTranslate() {
  const { language } = useTranslation();
  const [cache, setCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const cacheRef = useRef<TranslationCache>({});

  // Update ref when cache changes
  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  const translateText = useCallback(
    async (text: string): Promise<string> => {
      if (!text || text.trim() === "") return text;
      if (language === "en") return text;

      const cacheKey = `${language}:${text}`;
      
      // Check cache first
      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
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

        // Update cache
        setCache((prev) => ({
          ...prev,
          [cacheKey]: translatedText,
        }));

        return translatedText;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      }
    },
    [language]
  );

  const translateMultiple = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (language === "en") return texts;
      
      setIsTranslating(true);
      try {
        const results = await Promise.all(
          texts.map((text) => translateText(text))
        );
        return results;
      } finally {
        setIsTranslating(false);
      }
    },
    [language, translateText]
  );

  return {
    translateText,
    translateMultiple,
    isTranslating,
    currentLanguage: language,
  };
}

// Hook for translating a single piece of text with auto-updates
export function useTranslatedText(originalText: string): string {
  const { language } = useTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);
  const { translateText } = useGoogleTranslate();

  useEffect(() => {
    let mounted = true;

    const doTranslate = async () => {
      if (language === "en") {
        setTranslatedText(originalText);
        return;
      }

      const result = await translateText(originalText);
      if (mounted) {
        setTranslatedText(result);
      }
    };

    doTranslate();

    return () => {
      mounted = false;
    };
  }, [language, originalText, translateText]);

  return translatedText;
}
