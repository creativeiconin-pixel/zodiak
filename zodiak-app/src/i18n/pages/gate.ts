import { defineDict } from "..";

export type GateFeature = "kundli" | "horoscope" | "milan" | "palm" | "profile" | "credits" | "birth" | "home";

type GateCopy = {
  titles: Record<GateFeature, string>;
  body: string; offer: (n: number) => string; signup: string; login: string; perks: string[]; homeTitle: string; homeBody: string;
};

export const gateText = defineDict<GateCopy>({
  en: {
    titles: {
      kundli: "Log in to see your Kundli", horoscope: "Log in to see your horoscope", milan: "Log in for Kundli matching", palm: "Log in for your palm reading",
      profile: "Log in to see your profile", credits: "Log in to see your credits", birth: "Log in to save your birth details", home: "Welcome to Zodiak",
    },
    body: "Make a free account with your phone number. Your OTP comes on screen — no waiting.",
    offer: (n) => `Get ${n} free credits when you sign up`,
    signup: "Sign up free", login: "I have an account — Log in",
    perks: ["Your own Kundli and daily horoscope", "Palm reading from a photo", "Ask Pandit Jii anything"],
    homeTitle: "Sign up to unlock everything", homeBody: "Kundli, horoscope, palm reading and Pandit Jii are for signed-in members.",
  },
  hi: {
    titles: {
      kundli: "अपनी कुंडली देखने के लिए लॉग इन करें", horoscope: "अपना राशिफल देखने के लिए लॉग इन करें", milan: "कुंडली मिलान के लिए लॉग इन करें", palm: "हाथ पढ़वाने के लिए लॉग इन करें",
      profile: "अपनी प्रोफ़ाइल देखने के लिए लॉग इन करें", credits: "अपने क्रेडिट देखने के लिए लॉग इन करें", birth: "जन्म की जानकारी सेव करने के लिए लॉग इन करें", home: "Zodiak में स्वागत है",
    },
    body: "अपने फ़ोन नंबर से मुफ़्त खाता बनाएँ। OTP स्क्रीन पर ही आ जाता है — कोई इंतज़ार नहीं।",
    offer: (n) => `साइन अप करने पर ${n} मुफ़्त क्रेडिट पाएँ`,
    signup: "मुफ़्त साइन अप करें", login: "मेरा खाता है — लॉग इन करें",
    perks: ["आपकी अपनी कुंडली और रोज़ का राशिफल", "फ़ोटो से हाथ पढ़ना", "पंडित जी से कुछ भी पूछें"],
    homeTitle: "सब कुछ खोलने के लिए साइन अप करें", homeBody: "कुंडली, राशिफल, हस्तरेखा और पंडित जी सिर्फ़ साइन इन किए सदस्यों के लिए हैं।",
  },
  hinglish: {
    titles: {
      kundli: "Apni kundli dekhne ke liye log in karo", horoscope: "Apna rashifal dekhne ke liye log in karo", milan: "Kundli milan ke liye log in karo", palm: "Haath padhwane ke liye log in karo",
      profile: "Apni profile dekhne ke liye log in karo", credits: "Apne credits dekhne ke liye log in karo", birth: "Janam ki jaankari save karne ke liye log in karo", home: "Zodiak mein swagat hai",
    },
    body: "Apne phone number se free account banao. OTP screen par hi aa jaata hai — koi wait nahi.",
    offer: (n) => `Sign up karne par ${n} free credits pao`,
    signup: "Free sign up karo", login: "Mera account hai — Log in karo",
    perks: ["Aapki apni kundli aur roz ka rashifal", "Photo se haath padhna", "Pandit Jii se kuch bhi poocho"],
    homeTitle: "Sab kuch kholne ke liye sign up karo", homeBody: "Kundli, rashifal, haath padhna aur Pandit Jii sirf signed-in members ke liye hain.",
  },
  kn: {
    titles: {
      kundli: "ನಿಮ್ಮ ಜಾತಕ ನೋಡಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ", horoscope: "ನಿಮ್ಮ ರಾಶಿಫಲ ನೋಡಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ", milan: "ಜಾತಕ ಹೊಂದಾಣಿಕೆಗೆ ಲಾಗ್ ಇನ್ ಮಾಡಿ", palm: "ಹಸ್ತ ಓದಿಸಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ",
      profile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನೋಡಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ", credits: "ನಿಮ್ಮ ಕ್ರೆಡಿಟ್ ನೋಡಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ", birth: "ಹುಟ್ಟಿನ ವಿವರ ಉಳಿಸಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ", home: "Zodiak ಗೆ ಸ್ವಾಗತ",
    },
    body: "ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್‌ನಿಂದ ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ. OTP ಪರದೆಯ ಮೇಲೆಯೇ ಬರುತ್ತದೆ — ಕಾಯಬೇಕಿಲ್ಲ.",
    offer: (n) => `ಸೈನ್ ಅಪ್ ಮಾಡಿದರೆ ${n} ಉಚಿತ ಕ್ರೆಡಿಟ್ ಪಡೆಯಿರಿ`,
    signup: "ಉಚಿತ ಸೈನ್ ಅಪ್", login: "ನನಗೆ ಖಾತೆ ಇದೆ — ಲಾಗ್ ಇನ್",
    perks: ["ನಿಮ್ಮದೇ ಜಾತಕ ಮತ್ತು ದಿನದ ರಾಶಿಫಲ", "ಫೋಟೋದಿಂದ ಹಸ್ತ ಓದುವಿಕೆ", "ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಿ"],
    homeTitle: "ಎಲ್ಲವನ್ನೂ ತೆರೆಯಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ", homeBody: "ಜಾತಕ, ರಾಶಿಫಲ, ಹಸ್ತ ಓದುವಿಕೆ ಮತ್ತು ಪಂಡಿತ್ ಜೀ ಸೈನ್ ಇನ್ ಆದ ಸದಸ್ಯರಿಗೆ ಮಾತ್ರ.",
  },
});
