import type { OrderStatus } from "../lib/api";
import type { Planet } from "../lib/astro";
import { defineDict } from ".";

type Common = {
  nav: { home: string; kundli: string; ask: string; palm: string; remedies: string; profile: string };
  language: string;
  loading: string;
  tryAgain: string;
  serverDown: string;
  back: string;
  close: string;
  signIn: string;
  signOut: string;
  orderStatus: Record<OrderStatus, string>;
  /** Planet names, then a few words on what each planet looks after. */
  planets: Record<Planet, string>;
  planetMeaning: Record<Planet, string>;
  signs: string[];
  nakshatras: string[];
  lagnaHint: string;
};

const ORDER_STATUS_EN: Record<OrderStatus, string> = {
  payment_pending: "Waiting for payment",
  payment_failed: "Payment did not go through",
  awaiting_approval: "Waiting for Pandit check",
  trial_hold: "Trial first",
  approved: "Approved • Being blessed",
  consecrated: "Blessed",
  shipped: "On the way",
  delivered: "Delivered",
  rejected: "Not suitable • Money returned",
};

export const common = defineDict<Common>({
  en: {
    nav: { home: "Home", kundli: "Kundli", ask: "Pandit Jii", palm: "Palm", remedies: "Store", profile: "Profile" },
    language: "Language",
    loading: "Loading...",
    tryAgain: "Try again",
    serverDown: "We cannot reach the Zodiak server right now. Please try again in a moment.",
    back: "Go back",
    close: "Close",
    signIn: "Sign in",
    signOut: "Sign out",
    orderStatus: ORDER_STATUS_EN,
    planets: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu" },
    planetMeaning: {
      Sun: "self-respect and father",
      Moon: "mind and feelings",
      Mars: "courage and energy",
      Mercury: "studies and speech",
      Jupiter: "wisdom and good luck",
      Venus: "love and comfort",
      Saturn: "hard work and patience",
      Rahu: "big wishes and sudden change",
      Ketu: "letting go and inner peace",
    },
    signs: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    nakshatras: [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
      "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
    ],
    lagnaHint: "Lagna is the sign that was rising in the east when you were born.",
  },
  hi: {
    nav: { home: "होम", kundli: "कुंडली", ask: "पंडित जी", palm: "हस्तरेखा", remedies: "स्टोर", profile: "प्रोफ़ाइल" },
    language: "भाषा",
    loading: "लोड हो रहा है...",
    tryAgain: "फिर से कोशिश करें",
    serverDown: "अभी Zodiak सर्वर से जुड़ नहीं पा रहे। थोड़ी देर बाद फिर कोशिश करें।",
    back: "पीछे जाएँ",
    close: "बंद करें",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    orderStatus: {
      payment_pending: "भुगतान का इंतज़ार",
      payment_failed: "भुगतान नहीं हो पाया",
      awaiting_approval: "पंडित जी जाँच रहे हैं",
      trial_hold: "पहले ट्रायल होगा",
      approved: "मंज़ूर • पूजा हो रही है",
      consecrated: "पूजा हो गई",
      shipped: "रास्ते में है",
      delivered: "पहुँच गया",
      rejected: "आपके लिए सही नहीं • पैसे वापस",
    },
    planets: { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" },
    planetMeaning: {
      Sun: "आत्म-सम्मान और पिता",
      Moon: "मन और भावनाएँ",
      Mars: "हिम्मत और ताक़त",
      Mercury: "पढ़ाई और बोलचाल",
      Jupiter: "ज्ञान और अच्छी किस्मत",
      Venus: "प्यार और आराम",
      Saturn: "मेहनत और धैर्य",
      Rahu: "बड़ी इच्छाएँ और अचानक बदलाव",
      Ketu: "छोड़ना और मन की शांति",
    },
    signs: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
    nakshatras: [
      "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा",
      "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा",
      "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती",
    ],
    lagnaHint: "लग्न वह राशि है जो आपके जन्म के समय पूर्व दिशा में उग रही थी।",
  },
  hinglish: {
    nav: { home: "Home", kundli: "Kundli", ask: "Pandit Jii", palm: "Haath", remedies: "Store", profile: "Profile" },
    language: "Bhasha",
    loading: "Load ho raha hai...",
    tryAgain: "Phir se try karo",
    serverDown: "Abhi Zodiak server se connect nahi ho pa rahe. Thodi der baad try karo.",
    back: "Peeche jao",
    close: "Band karo",
    signIn: "Sign in",
    signOut: "Sign out",
    orderStatus: {
      payment_pending: "Payment ka intezaar",
      payment_failed: "Payment nahi ho paya",
      awaiting_approval: "Pandit ji check kar rahe hain",
      trial_hold: "Pehle trial hoga",
      approved: "Approve • Pooja ho rahi hai",
      consecrated: "Pooja ho gayi",
      shipped: "Raste mein hai",
      delivered: "Pahunch gaya",
      rejected: "Aapke liye sahi nahi • Paise wapas",
    },
    planets: { Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budh", Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu" },
    planetMeaning: {
      Sun: "self-respect aur pitaji",
      Moon: "mann aur feelings",
      Mars: "himmat aur energy",
      Mercury: "padhai aur bolchaal",
      Jupiter: "gyaan aur achhi kismat",
      Venus: "pyaar aur aaram",
      Saturn: "mehnat aur dhairya",
      Rahu: "badi ichhayein aur achanak badlav",
      Ketu: "chhodna aur mann ki shanti",
    },
    signs: ["Mesh", "Vrishabh", "Mithun", "Kark", "Singh", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"],
    nakshatras: [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
      "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Mool", "Purva Ashadha", "Uttara Ashadha", "Shravan", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
    ],
    lagnaHint: "Lagna woh rashi hai jo aapke janam ke time poorab disha mein ug rahi thi.",
  },
  kn: {
    nav: { home: "ಮುಖಪುಟ", kundli: "ಜಾತಕ", ask: "ಪಂಡಿತ್ ಜೀ", palm: "ಹಸ್ತ", remedies: "ಸ್ಟೋರ್", profile: "ಪ್ರೊಫೈಲ್" },
    language: "ಭಾಷೆ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    serverDown: "ಈಗ Zodiak ಸರ್ವರ್ ಸಿಗುತ್ತಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    back: "ಹಿಂದೆ ಹೋಗಿ",
    close: "ಮುಚ್ಚಿ",
    signIn: "ಸೈನ್ ಇನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    orderStatus: {
      payment_pending: "ಪಾವತಿಗಾಗಿ ಕಾಯುತ್ತಿದೆ",
      payment_failed: "ಪಾವತಿ ಆಗಲಿಲ್ಲ",
      awaiting_approval: "ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ",
      trial_hold: "ಮೊದಲು ಪ್ರಯೋಗ",
      approved: "ಒಪ್ಪಿಗೆ • ಪೂಜೆ ನಡೆಯುತ್ತಿದೆ",
      consecrated: "ಪೂಜೆ ಆಯಿತು",
      shipped: "ದಾರಿಯಲ್ಲಿದೆ",
      delivered: "ತಲುಪಿದೆ",
      rejected: "ನಿಮಗೆ ಸರಿಯಲ್ಲ • ಹಣ ವಾಪಸ್",
    },
    planets: { Sun: "ಸೂರ್ಯ", Moon: "ಚಂದ್ರ", Mars: "ಕುಜ", Mercury: "ಬುಧ", Jupiter: "ಗುರು", Venus: "ಶುಕ್ರ", Saturn: "ಶನಿ", Rahu: "ರಾಹು", Ketu: "ಕೇತು" },
    planetMeaning: {
      Sun: "ಆತ್ಮಗೌರವ ಮತ್ತು ತಂದೆ",
      Moon: "ಮನಸ್ಸು ಮತ್ತು ಭಾವನೆಗಳು",
      Mars: "ಧೈರ್ಯ ಮತ್ತು ಶಕ್ತಿ",
      Mercury: "ಓದು ಮತ್ತು ಮಾತು",
      Jupiter: "ಜ್ಞಾನ ಮತ್ತು ಒಳ್ಳೆಯ ಅದೃಷ್ಟ",
      Venus: "ಪ್ರೀತಿ ಮತ್ತು ಸುಖ",
      Saturn: "ಕಠಿಣ ಶ್ರಮ ಮತ್ತು ತಾಳ್ಮೆ",
      Rahu: "ದೊಡ್ಡ ಆಸೆಗಳು ಮತ್ತು ಹಠಾತ್ ಬದಲಾವಣೆ",
      Ketu: "ಬಿಡುವುದು ಮತ್ತು ಮನಶಾಂತಿ",
    },
    signs: ["ಮೇಷ", "ವೃಷಭ", "ಮಿಥುನ", "ಕರ್ಕಾಟಕ", "ಸಿಂಹ", "ಕನ್ಯಾ", "ತುಲಾ", "ವೃಶ್ಚಿಕ", "ಧನು", "ಮಕರ", "ಕುಂಭ", "ಮೀನ"],
    nakshatras: [
      "ಅಶ್ವಿನಿ", "ಭರಣಿ", "ಕೃತ್ತಿಕಾ", "ರೋಹಿಣಿ", "ಮೃಗಶಿರಾ", "ಆರ್ದ್ರಾ", "ಪುನರ್ವಸು", "ಪುಷ್ಯ", "ಆಶ್ಲೇಷಾ",
      "ಮಘಾ", "ಪೂರ್ವ ಫಲ್ಗುಣಿ", "ಉತ್ತರ ಫಲ್ಗುಣಿ", "ಹಸ್ತ", "ಚಿತ್ತಾ", "ಸ್ವಾತಿ", "ವಿಶಾಖಾ", "ಅನುರಾಧಾ", "ಜ್ಯೇಷ್ಠಾ",
      "ಮೂಲಾ", "ಪೂರ್ವಾಷಾಢಾ", "ಉತ್ತರಾಷಾಢಾ", "ಶ್ರವಣ", "ಧನಿಷ್ಠಾ", "ಶತಭಿಷಾ", "ಪೂರ್ವಾಭಾದ್ರಪದ", "ಉತ್ತರಾಭಾದ್ರಪದ", "ರೇವತಿ",
    ],
    lagnaHint: "ಲಗ್ನ ಎಂದರೆ ನೀವು ಹುಟ್ಟಿದಾಗ ಪೂರ್ವ ದಿಕ್ಕಿನಲ್ಲಿ ಉದಯಿಸುತ್ತಿದ್ದ ರಾಶಿ.",
  },
});
