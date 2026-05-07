"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "./translations";

export function useBodyTranslate(originalText: string): string {
  const { language, translateText } = useTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [hasTranslated, setHasTranslated] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (language === "en") {
        setTranslatedText(originalText);
        return;
      }

      // Only translate once per language change
      if (!hasTranslated || translatedText === originalText) {
        try {
          const result = await translateText(originalText);
          setTranslatedText(result);
          setHasTranslated(true);
        } catch (error) {
          console.error("Body translation error:", error);
          setTranslatedText(originalText);
        }
      }
    };

    translate();
  }, [language, originalText, translateText, hasTranslated, translatedText]);

  return translatedText;
}

// Hook for batch translating multiple texts
export function useBatchTranslate(originalTexts: string[]): string[] {
  const { language, translateText } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState(originalTexts);

  useEffect(() => {
    const translateAll = async () => {
      if (language === "en") {
        setTranslatedTexts(originalTexts);
        return;
      }

      try {
        const results = await Promise.all(
          originalTexts.map((text) => translateText(text))
        );
        setTranslatedTexts(results);
      } catch (error) {
        console.error("Batch translation error:", error);
        setTranslatedTexts(originalTexts);
      }
    };

    translateAll();
  }, [language, originalTexts, translateText]);

  return translatedTexts;
}
