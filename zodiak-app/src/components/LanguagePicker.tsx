import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LANGUAGES, useLanguage, useT, type Lang } from "../i18n";
import { languagePickerText } from "../i18n/pages/languagePicker";

const ENGLISH_NAMES: Record<Lang, string> = { en: "English", hi: "Hindi", hinglish: "Hinglish", kn: "Kannada" };
const SHORT: Record<Lang, string> = { en: "EN", hi: "हिं", hinglish: "Hin", kn: "ಕ" };

/** Globe pill that opens a bottom sheet listing the four supported languages. */
export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const t = useT(languagePickerText);
  const [open, setOpen] = useState(false);

  // Close on Escape and stop the page behind the sheet from scrolling
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.open}
        className="tap-scale min-h-[36px] flex items-center gap-1 px-2.5 rounded-full bg-surface-container-high/80 text-on-surface hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
        {!compact && <span className="font-label-md text-label-md">{SHORT[lang]}</span>}
      </button>
      {/* Portal to <body>: the header's backdrop-blur would otherwise trap this fixed sheet inside the 64px header */}
      {open && createPortal(
        <div className="animate-fade-in fixed inset-0 z-[60] bg-surface-container-lowest/80 backdrop-blur-md flex flex-col justify-end" role="dialog" aria-modal="true" aria-labelledby="lang-title" onClick={() => setOpen(false)}>
          <div className="animate-sheet-up w-full max-w-screen-sm mx-auto bg-surface-container-high rounded-t-2xl p-space-lg pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-outline/40 rounded-full mx-auto mb-space-md" />
            <h2 id="lang-title" className="font-headline-sm text-headline-sm text-on-surface">{t.title}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-md">{t.subtitle}</p>
            <div className="flex flex-col gap-space-xs" role="radiogroup" data-stagger="in" style={{ "--reveal-delay": "120ms", "--stagger-step": "50ms" } as React.CSSProperties}>
              {LANGUAGES.map((option) => {
                const selected = option.code === lang;
                return (
                  <button
                    key={option.code}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    lang={option.htmlLang}
                    onClick={() => {
                      setLang(option.code);
                      setOpen(false);
                    }}
                    className={`tap-scale flex items-center justify-between px-space-md py-3 rounded-xl text-left transition-colors ${selected ? "bg-primary/15 ring-1 ring-primary" : "bg-surface-container hover:bg-surface-container-highest"}`}
                  >
                    <span className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface">{option.name}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {option.code === "hinglish" ? t.hinglishNote : ENGLISH_NAMES[option.code]}
                      </span>
                    </span>
                    {selected && <span className="material-symbols-outlined text-primary animate-pop-in" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
