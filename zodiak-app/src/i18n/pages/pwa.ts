import { defineDict } from "..";

type Copy = {
  installTitle: string;
  installBody: string;
  install: string;
  close: string;
  iosTitle: string;
  iosHint: string;
  androidHint: string;
  offline: string;
  backOnline: string;
  updateReady: string;
  refresh: string;
};

export const pwaText = defineDict<Copy>({
  en: {
    installTitle: "Add Zodiak to your phone",
    installBody: "It opens like an app, right from your home screen.",
    install: "Install",
    close: "Close",
    iosTitle: "Add Zodiak to your phone",
    iosHint: "Tap Share, then Add to Home Screen.",
    androidHint: "Tap the ⋮ menu, then \"Add to Home screen\".",
    offline: "You are offline. Some things need internet.",
    backOnline: "You are back online.",
    updateReady: "New version ready",
    refresh: "Refresh",
  },
  hi: {
    installTitle: "Zodiak को अपने फ़ोन में जोड़ें",
    installBody: "यह होम स्क्रीन से सीधे ऐप की तरह खुलेगा।",
    install: "जोड़ें",
    close: "बंद करें",
    iosTitle: "Zodiak को अपने फ़ोन में जोड़ें",
    iosHint: "Share दबाएँ, फिर Add to Home Screen दबाएँ।",
    androidHint: "⋮ मेन्यू दबाएँ, फिर \"Add to Home screen\" दबाएँ।",
    offline: "आप ऑफ़लाइन हैं। कुछ चीज़ों के लिए इंटरनेट चाहिए।",
    backOnline: "आप फिर से ऑनलाइन हैं।",
    updateReady: "नया वर्ज़न तैयार है",
    refresh: "रिफ़्रेश करें",
  },
  hinglish: {
    installTitle: "Zodiak ko apne phone mein jodo",
    installBody: "Yeh home screen se seedha app ki tarah khulega.",
    install: "Jodo",
    close: "Band karo",
    iosTitle: "Zodiak ko apne phone mein jodo",
    iosHint: "Share dabao, phir Add to Home Screen dabao.",
    androidHint: "⋮ menu dabao, phir \"Add to Home screen\" dabao.",
    offline: "Aap offline ho. Kuch cheezon ke liye internet chahiye.",
    backOnline: "Aap phir se online ho.",
    updateReady: "Naya version taiyaar hai",
    refresh: "Refresh karo",
  },
  kn: {
    installTitle: "Zodiak ಅನ್ನು ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಸೇರಿಸಿ",
    installBody: "ಇದು ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ನಿಂದ ಆ್ಯಪ್‌ನಂತೆ ತೆರೆಯುತ್ತದೆ.",
    install: "ಸೇರಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    iosTitle: "Zodiak ಅನ್ನು ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಸೇರಿಸಿ",
    iosHint: "Share ಒತ್ತಿ, ನಂತರ Add to Home Screen ಒತ್ತಿ.",
    androidHint: "⋮ ಮೆನು ಒತ್ತಿ, ನಂತರ \"Add to Home screen\" ಒತ್ತಿ.",
    offline: "ನೀವು ಆಫ್‌ಲೈನ್ ಇದ್ದೀರಿ. ಕೆಲವು ವಿಷಯಗಳಿಗೆ ಇಂಟರ್ನೆಟ್ ಬೇಕು.",
    backOnline: "ನೀವು ಮತ್ತೆ ಆನ್‌ಲೈನ್ ಇದ್ದೀರಿ.",
    updateReady: "ಹೊಸ ಆವೃತ್ತಿ ಸಿದ್ಧವಾಗಿದೆ",
    refresh: "ರಿಫ್ರೆಶ್ ಮಾಡಿ",
  },
});
