"use client";

import { useEffect, useState, ReactNode } from "react";
import { useTranslation } from "@/lib/translations";

interface AutoTranslateProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "li";
}

export function AutoTranslate({ 
  children, 
  className = "", 
  as: Component = "span" 
}: AutoTranslateProps) {
  const { language } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      const text = typeof children === "string" ? children : "";
      
      if (!text || language === "en") {
        setTranslatedContent(text);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            targetLang: language === "hi" ? "hi" : "en",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTranslatedContent(data.translatedText || text);
        } else {
          setTranslatedContent(text);
        }
      } catch (error) {
        console.error("Auto-translate error:", error);
        setTranslatedContent(text);
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [children, language]);

  // For non-string children, just render as-is
  if (typeof children !== "string") {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component className={className}>
      {translatedContent || children}
    </Component>
  );
}

// Simplified hook for direct text translation
export function useAutoTranslate(text: string): string {
  const { language } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    const translate = async () => {
      if (!text || language === "en") {
        setTranslated(text);
        return;
      }

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            targetLang: language === "hi" ? "hi" : "en",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTranslated(data.translatedText || text);
        } else {
          setTranslated(text);
        }
      } catch (error) {
        setTranslated(text);
      }
    };

    translate();
  }, [text, language]);

  return translated;
}
