import { defineDict } from "..";

type ProfileCopy = {
  guestTitle: string; guestBody: string; signIn: string;
  birthDetails: string; edit: string; addDetails: string; noDetails: string; dob: string; time: string; timeUnknown: string; place: string;
  sun: string; moon: string; lagna: string; nakshatra: string; pada: (n: number) => string;
  language: string; orders: string; noOrders: string; shop: string; loadingOrders: string; chats: string; chatsBody: string; signOut: string;
  notFoundTitle: string; notFoundBody: string; goHome: string;
};

export const profileText = defineDict<ProfileCopy>({
  en: {
    guestTitle: "You are not signed in", guestBody: "Sign in to keep your chart, chats and orders safe on every device.", signIn: "Sign in",
    birthDetails: "Birth details", edit: "Edit", addDetails: "Add birth details", noDetails: "No birth details yet.", dob: "Date of birth", time: "Birth time", timeUnknown: "Not known", place: "Birthplace",
    sun: "Sun sign", moon: "Moon sign", lagna: "Rising sign", nakshatra: "Moon star", pada: (n) => `Pada ${n}`,
    language: "Language", orders: "My orders", noOrders: "No orders yet.", shop: "Visit the Store", loadingOrders: "Loading your orders...", chats: "My AI chats", chatsBody: "Open your conversation", signOut: "Sign out",
    notFoundTitle: "Page not found", notFoundBody: "This page is not in the stars. Let us take you home.", goHome: "Go home",
  },
  hi: {
    guestTitle: "आप साइन इन नहीं हैं", guestBody: "अपनी कुंडली, बातचीत और ऑर्डर हर डिवाइस पर सुरक्षित रखने के लिए साइन इन करें।", signIn: "साइन इन",
    birthDetails: "जन्म जानकारी", edit: "बदलें", addDetails: "जन्म जानकारी जोड़ें", noDetails: "अभी कोई जन्म जानकारी नहीं है।", dob: "जन्म तिथि", time: "जन्म का समय", timeUnknown: "पता नहीं", place: "जन्म स्थान",
    sun: "सूर्य राशि", moon: "चंद्र राशि", lagna: "लग्न", nakshatra: "चंद्र नक्षत्र", pada: (n) => `पद ${n}`,
    language: "भाषा", orders: "मेरे ऑर्डर", noOrders: "अभी कोई ऑर्डर नहीं है।", shop: "स्टोर देखें", loadingOrders: "आपके ऑर्डर लोड हो रहे हैं...", chats: "मेरी AI बातचीत", chatsBody: "अपनी बातचीत खोलें", signOut: "साइन आउट",
    notFoundTitle: "पेज नहीं मिला", notFoundBody: "यह पेज तारों में नहीं है। चलिए आपको होम पर ले चलते हैं।", goHome: "होम पर जाएँ",
  },
  hinglish: {
    guestTitle: "Aap sign in nahi ho", guestBody: "Apni kundli, chats aur orders har device par safe rakhne ke liye sign in karo.", signIn: "Sign in",
    birthDetails: "Janam details", edit: "Badlo", addDetails: "Janam details jodo", noDetails: "Abhi koi janam details nahi hain.", dob: "Janam tithi", time: "Janam ka time", timeUnknown: "Pata nahi", place: "Janam sthaan",
    sun: "Surya rashi", moon: "Chandra rashi", lagna: "Lagna", nakshatra: "Chandra nakshatra", pada: (n) => `Pada ${n}`,
    language: "Bhasha", orders: "Mere orders", noOrders: "Abhi koi order nahi hai.", shop: "Store dekho", loadingOrders: "Aapke orders load ho rahe hain...", chats: "Meri AI chats", chatsBody: "Apni chat kholo", signOut: "Sign out",
    notFoundTitle: "Page nahi mila", notFoundBody: "Yeh page taaron mein nahi hai. Chalo aapko home le chalte hain.", goHome: "Home jao",
  },
  kn: {
    guestTitle: "ನೀವು ಸೈನ್ ಇನ್ ಆಗಿಲ್ಲ", guestBody: "ನಿಮ್ಮ ಜಾತಕ, ಚಾಟ್ ಮತ್ತು ಆರ್ಡರ್‌ಗಳನ್ನು ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಇಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.", signIn: "ಸೈನ್ ಇನ್",
    birthDetails: "ಜನ್ಮ ವಿವರ", edit: "ಬದಲಿಸಿ", addDetails: "ಜನ್ಮ ವಿವರ ಸೇರಿಸಿ", noDetails: "ಇನ್ನೂ ಜನ್ಮ ವಿವರ ಇಲ್ಲ.", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", time: "ಹುಟ್ಟಿದ ಸಮಯ", timeUnknown: "ಗೊತ್ತಿಲ್ಲ", place: "ಹುಟ್ಟಿದ ಸ್ಥಳ",
    sun: "ಸೂರ್ಯ ರಾಶಿ", moon: "ಚಂದ್ರ ರಾಶಿ", lagna: "ಲಗ್ನ", nakshatra: "ಚಂದ್ರ ನಕ್ಷತ್ರ", pada: (n) => `ಪಾದ ${n}`,
    language: "ಭಾಷೆ", orders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು", noOrders: "ಇನ್ನೂ ಯಾವುದೇ ಆರ್ಡರ್ ಇಲ್ಲ.", shop: "ಸ್ಟೋರ್ ನೋಡಿ", loadingOrders: "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...", chats: "ನನ್ನ AI ಚಾಟ್", chatsBody: "ನಿಮ್ಮ ಸಂಭಾಷಣೆ ತೆರೆಯಿರಿ", signOut: "ಸೈನ್ ಔಟ್",
    notFoundTitle: "ಪುಟ ಸಿಗಲಿಲ್ಲ", notFoundBody: "ಈ ಪುಟ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ಇಲ್ಲ. ನಿಮ್ಮನ್ನು ಮುಖಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತೇವೆ.", goHome: "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ",
  },
});
