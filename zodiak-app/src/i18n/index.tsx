import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { setApiLanguage } from "../lib/api";

export const LANGUAGES = [
  { code: "en", name: "English", htmlLang: "en" },
  { code: "hi", name: "हिंदी", htmlLang: "hi" },
  { code: "hinglish", name: "Hinglish", htmlLang: "hi-Latn" },
  { code: "kn", name: "ಕನ್ನಡ", htmlLang: "kn" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

/** A dictionary has one entry per language, each with exactly the shape of the English one. */
export type Dict<T> = { en: T } & Record<Exclude<Lang, "en">, T>;

export function defineDict<T>(dict: Dict<T>): Dict<T> {
  return dict;
}

const STORAGE_KEY = "zodiak.lang";

function initialLanguage(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.some((l) => l.code === saved)) return saved as Lang;
  } catch {
    // ignore unavailable storage
  }
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("kn")) return "kn";
  if (browser.startsWith("hi")) return "hi";
  return "en";
}

type LanguageContextValue = { lang: Lang; setLang: (lang: Lang) => void };

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = LANGUAGES.find((l) => l.code === lang)!.htmlLang;
    setApiLanguage(lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore unavailable storage
    }
  }, []);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return value;
}

/** Pick the current language's strings from a page dictionary. */
export function useT<T>(dict: Dict<T>): T {
  return dict[useLanguage().lang];
}
