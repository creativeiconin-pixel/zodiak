import { defineDict } from "..";

type LoginCopy = {
  badge: string; title: string; subtitle: string; phoneTab: string; emailTab: string;
  mobile: string; otpHint: string; country: string; phonePlaceholder: string; sendOtp: string; sending: string;
  codeLabel: string; codeSentTo: (phone: string) => string; changeNumber: string; yourName: string; namePlaceholder: string; verify: string; verifying: string;
  devCode: (code: string) => string; resend: string; newViaPhone: string;
  email: string; password: string; nameLabel: string; signInEmail: string; createAccount: string; newHere: string; haveAccount: string; signUp: string; signInInstead: string;
  orWith: string; google: string; apple: string; socialSoon: string;
  privacyTitle: string; privacyBody: string; footer: string; guest: string; badPhone: string;
  modeSignup: string; modeLogin: string; offer: (n: number) => string; signupLead: string; loginLead: string;
  getOtp: string; otpReady: (code: string) => string; verifySignup: string; verifyLogin: string; nameNeeded: string; signupInstead: string;
};

export const loginText = defineDict<LoginCopy>({
  en: {
    badge: "Vedic maths • AI help", title: "Welcome to Zodiak", subtitle: "Sign in to save your birth chart, ask the AI and track your orders.",
    phoneTab: "Phone number", emailTab: "Email",
    mobile: "Mobile number", otpHint: "We send a 6-digit code", country: "Country code", phonePlaceholder: "98765 43210", sendOtp: "Send OTP", sending: "Sending...",
    codeLabel: "Enter the 6-digit code", codeSentTo: (phone) => `Code sent to ${phone}`, changeNumber: "Change number", yourName: "Your name (for new accounts)", namePlaceholder: "e.g. Ananya Sharma", verify: "Verify and sign in", verifying: "Checking...",
    devCode: (code) => `Demo mode: your code ${code} is filled in for you`, newViaPhone: "New here? Just enter your number — your free account is made for you.",  resend: "Send code again",
    email: "Email address", password: "Password", nameLabel: "Full name", signInEmail: "Sign in", createAccount: "Create account", newHere: "New here?", haveAccount: "Already have an account?", signUp: "Create an account", signInInstead: "Sign in",
    orWith: "Or continue with", google: "Continue with Google", apple: "Continue with Apple", socialSoon: "Google and Apple sign-in will work once the app keys are added. Please use your phone or email for now.",
    privacyTitle: "Private and safe", privacyBody: "Your birth date, time and place are kept private and never sold.", footer: "Lahiri method • Parashara system", guest: "Continue without signing in", badPhone: "Please enter a 10-digit mobile number.",
    modeSignup: "Sign up", modeLogin: "Log in", offer: (n) => `Sign up free and get ${n} credits to ask Pandit Jii`, signupLead: "New here? Make your free account in one minute.", loginLead: "Welcome back! Enter your number to log in.", getOtp: "Get OTP", otpReady: (code) => `Your OTP is ${code}. We filled it in for you — just tap the button.`, verifySignup: "Create my account", verifyLogin: "Log in", nameNeeded: "Please write your name.", signupInstead: "Sign up instead",
  },
  hi: {
    badge: "वैदिक गणित • AI मदद", title: "Zodiak में स्वागत है", subtitle: "अपनी कुंडली सेव करने, AI से पूछने और ऑर्डर देखने के लिए साइन इन करें।",
    phoneTab: "फ़ोन नंबर", emailTab: "ईमेल",
    mobile: "मोबाइल नंबर", otpHint: "हम 6 अंकों का कोड भेजेंगे", country: "देश कोड", phonePlaceholder: "98765 43210", sendOtp: "OTP भेजें", sending: "भेज रहे हैं...",
    codeLabel: "6 अंकों का कोड डालें", codeSentTo: (phone) => `${phone} पर कोड भेजा गया`, changeNumber: "नंबर बदलें", yourName: "आपका नाम (नए खाते के लिए)", namePlaceholder: "जैसे: अनन्या शर्मा", verify: "जाँचें और साइन इन करें", verifying: "जाँच रहे हैं...",
    devCode: (code) => `डेमो मोड: आपका कोड ${code} अपने आप भर दिया गया है`, newViaPhone: "नए हैं? बस अपना नंबर डालें — आपका मुफ़्त खाता अपने आप बन जाएगा।",  resend: "कोड फिर भेजें",
    email: "ईमेल पता", password: "पासवर्ड", nameLabel: "पूरा नाम", signInEmail: "साइन इन", createAccount: "खाता बनाएँ", newHere: "नए हैं?", haveAccount: "पहले से खाता है?", signUp: "खाता बनाएँ", signInInstead: "साइन इन करें",
    orWith: "या इससे जारी रखें", google: "Google से जारी रखें", apple: "Apple से जारी रखें", socialSoon: "Google और Apple साइन-इन ऐप की चाबियाँ जुड़ने के बाद चलेगा। अभी फ़ोन या ईमेल इस्तेमाल करें।",
    privacyTitle: "गोपनीय और सुरक्षित", privacyBody: "आपकी जन्म तिथि, समय और जगह गोपनीय रहती है और कभी बेची नहीं जाती।", footer: "लाहिरी पद्धति • पाराशर प्रणाली", guest: "बिना साइन इन के आगे बढ़ें", badPhone: "कृपया 10 अंकों का मोबाइल नंबर डालें।",
    modeSignup: "साइन अप", modeLogin: "लॉग इन", offer: (n) => `मुफ़्त साइन अप करें और पंडित जी से पूछने के लिए ${n} क्रेडिट पाएँ`, signupLead: "नए हैं? एक मिनट में अपना मुफ़्त खाता बनाएँ।", loginLead: "फिर से स्वागत है! लॉग इन के लिए अपना नंबर डालें।", getOtp: "OTP पाएँ", otpReady: (code) => `आपका OTP ${code} है। हमने इसे भर दिया है — बस बटन दबाएँ।`, verifySignup: "मेरा खाता बनाएँ", verifyLogin: "लॉग इन करें", nameNeeded: "कृपया अपना नाम लिखें।", signupInstead: "साइन अप करें",
  },
  hinglish: {
    badge: "Vedic maths • AI madad", title: "Zodiak mein swagat hai", subtitle: "Apni kundli save karne, AI se poochhne aur orders dekhne ke liye sign in karo.",
    phoneTab: "Phone number", emailTab: "Email",
    mobile: "Mobile number", otpHint: "Hum 6 digit ka code bhejenge", country: "Country code", phonePlaceholder: "98765 43210", sendOtp: "OTP bhejo", sending: "Bhej rahe hain...",
    codeLabel: "6 digit ka code daalo", codeSentTo: (phone) => `${phone} par code bheja gaya`, changeNumber: "Number badlo", yourName: "Aapka naam (naye account ke liye)", namePlaceholder: "Jaise: Ananya Sharma", verify: "Check karke sign in karo", verifying: "Check kar rahe hain...",
    devCode: (code) => `Demo mode: aapka code ${code} apne aap bhar diya gaya hai`, newViaPhone: "Naye ho? Bas apna number daalo — aapka free account apne aap ban jayega.",  resend: "Code phir bhejo",
    email: "Email address", password: "Password", nameLabel: "Poora naam", signInEmail: "Sign in", createAccount: "Account banao", newHere: "Naye ho?", haveAccount: "Pehle se account hai?", signUp: "Account banao", signInInstead: "Sign in karo",
    orWith: "Ya isse continue karo", google: "Google se continue karo", apple: "Apple se continue karo", socialSoon: "Google aur Apple sign-in app keys judne ke baad chalega. Abhi phone ya email use karo.",
    privacyTitle: "Private aur safe", privacyBody: "Aapki janam tithi, time aur jagah private rehti hai aur kabhi bechi nahi jaati.", footer: "Lahiri tareeka • Parashara system", guest: "Bina sign in ke aage badho", badPhone: "Please 10 digit ka mobile number daalo.",
    modeSignup: "Sign up", modeLogin: "Log in", offer: (n) => `Free sign up karo aur Pandit Jii se poochhne ke liye ${n} credits pao`, signupLead: "Naye ho? Ek minute mein apna free account banao.", loginLead: "Welcome back! Log in ke liye apna number daalo.", getOtp: "OTP pao", otpReady: (code) => `Aapka OTP ${code} hai. Humne bhar diya hai — bas button dabao.`, verifySignup: "Mera account banao", verifyLogin: "Log in karo", nameNeeded: "Please apna naam likho.", signupInstead: "Sign up karo",
  },
  kn: {
    badge: "ವೈದಿಕ ಗಣಿತ • AI ಸಹಾಯ", title: "Zodiak ಗೆ ಸ್ವಾಗತ", subtitle: "ನಿಮ್ಮ ಜಾತಕ ಉಳಿಸಲು, AI ಕೇಳಲು ಮತ್ತು ಆರ್ಡರ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    phoneTab: "ಫೋನ್ ನಂಬರ್", emailTab: "ಇಮೇಲ್",
    mobile: "ಮೊಬೈಲ್ ನಂಬರ್", otpHint: "ನಾವು 6 ಅಂಕಿಯ ಕೋಡ್ ಕಳುಹಿಸುತ್ತೇವೆ", country: "ದೇಶದ ಕೋಡ್", phonePlaceholder: "98765 43210", sendOtp: "OTP ಕಳುಹಿಸಿ", sending: "ಕಳುಹಿಸುತ್ತಿದ್ದೇವೆ...",
    codeLabel: "6 ಅಂಕಿಯ ಕೋಡ್ ಹಾಕಿ", codeSentTo: (phone) => `${phone} ಗೆ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ`, changeNumber: "ನಂಬರ್ ಬದಲಿಸಿ", yourName: "ನಿಮ್ಮ ಹೆಸರು (ಹೊಸ ಖಾತೆಗೆ)", namePlaceholder: "ಉದಾ: ಅನನ್ಯಾ ಶರ್ಮಾ", verify: "ಪರಿಶೀಲಿಸಿ ಸೈನ್ ಇನ್ ಮಾಡಿ", verifying: "ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇವೆ...",
    devCode: (code) => `ಡೆಮೊ ಮೋಡ್: ನಿಮ್ಮ ಕೋಡ್ ${code} ತಾನಾಗಿಯೇ ತುಂಬಲಾಗಿದೆ`, newViaPhone: "ಹೊಸಬರೇ? ನಿಮ್ಮ ನಂಬರ್ ಹಾಕಿ — ನಿಮ್ಮ ಉಚಿತ ಖಾತೆ ತಾನಾಗಿಯೇ ತೆರೆಯುತ್ತದೆ.",  resend: "ಕೋಡ್ ಮತ್ತೆ ಕಳುಹಿಸಿ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ", password: "ಪಾಸ್‌ವರ್ಡ್", nameLabel: "ಪೂರ್ಣ ಹೆಸರು", signInEmail: "ಸೈನ್ ಇನ್", createAccount: "ಖಾತೆ ತೆರೆಯಿರಿ", newHere: "ಹೊಸಬರೇ?", haveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?", signUp: "ಖಾತೆ ತೆರೆಯಿರಿ", signInInstead: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    orWith: "ಅಥವಾ ಇದರಿಂದ ಮುಂದುವರಿಸಿ", google: "Google ನಿಂದ ಮುಂದುವರಿಸಿ", apple: "Apple ನಿಂದ ಮುಂದುವರಿಸಿ", socialSoon: "ಆ್ಯಪ್ ಕೀಗಳು ಸೇರಿದ ನಂತರ Google ಮತ್ತು Apple ಸೈನ್-ಇನ್ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ಈಗ ಫೋನ್ ಅಥವಾ ಇಮೇಲ್ ಬಳಸಿ.",
    privacyTitle: "ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತ", privacyBody: "ನಿಮ್ಮ ಹುಟ್ಟಿದ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಖಾಸಗಿಯಾಗಿರುತ್ತದೆ, ಎಂದಿಗೂ ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ.", footer: "ಲಾಹಿರಿ ವಿಧಾನ • ಪರಾಶರ ಪದ್ಧತಿ", guest: "ಸೈನ್ ಇನ್ ಇಲ್ಲದೆ ಮುಂದುವರಿಸಿ", badPhone: "ದಯವಿಟ್ಟು 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ನಂಬರ್ ಹಾಕಿ.",
    modeSignup: "ಸೈನ್ ಅಪ್", modeLogin: "ಲಾಗ್ ಇನ್", offer: (n) => `ಉಚಿತವಾಗಿ ಸೈನ್ ಅಪ್ ಮಾಡಿ, ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳಲು ${n} ಕ್ರೆಡಿಟ್ ಪಡೆಯಿರಿ`, signupLead: "ಹೊಸಬರೇ? ಒಂದು ನಿಮಿಷದಲ್ಲಿ ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ.", loginLead: "ಮತ್ತೆ ಸ್ವಾಗತ! ಲಾಗ್ ಇನ್ ಮಾಡಲು ನಿಮ್ಮ ನಂಬರ್ ಹಾಕಿ.", getOtp: "OTP ಪಡೆಯಿರಿ", otpReady: (code) => `ನಿಮ್ಮ OTP ${code}. ನಾವು ತುಂಬಿದ್ದೇವೆ — ಬಟನ್ ಒತ್ತಿ ಸಾಕು.`, verifySignup: "ನನ್ನ ಖಾತೆ ತೆರೆಯಿರಿ", verifyLogin: "ಲಾಗ್ ಇನ್", nameNeeded: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ಬರೆಯಿರಿ.", signupInstead: "ಸೈನ್ ಅಪ್ ಮಾಡಿ",
  },
});
