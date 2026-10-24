import { defineDict } from "..";
import type { CreditReason } from "../../lib/api";

type CreditsCopy = {
  title: string; subtitle: string; balanceLabel: string; chipLabel: (n: number) => string;
  howTitle: string; questionCost: (n: number) => string; palmCost: (n: number) => string; retakeFree: string;
  packsTitle: string; packCredits: (n: number) => string; perCredit: (price: string) => string; bestValue: string; popular: string; buy: string; starting: string;
  rechargeSoon: string; openTitle: string; continuePay: string; checking: string;
  payingFor: (n: number) => string; otherPack: string; credited: (n: number) => string; creditedBody: string;
  historyTitle: string; emptyHistory: string; reasons: Record<CreditReason, string>;
  noCreditsTitle: string; noCreditsBody: (n: number) => string; addCredits: string; costHint: (n: number) => string;
  welcomeTitle: string; welcomeBody: (n: number) => string; welcomeCta: string; welcomeLater: string;
  palmUses: (n: number) => string; signInTitle: string; signInBody: string;
};

export const creditsText = defineDict<CreditsCopy>({
  en: {
    title: "My credits", subtitle: "Credits let you ask Pandit Jii and read your palm.", balanceLabel: "Credits left",
    chipLabel: (n) => `${n} credits left. Tap to add more.`,
    howTitle: "What things cost", questionCost: (n) => `1 answer from Pandit Jii = ${n} ${n === 1 ? "credit" : "credits"}`,
    palmCost: (n) => `1 palm reading = ${n} ${n === 1 ? "credit" : "credits"}`, retakeFree: "If an answer fails or a palm photo is not clear, you get your credits back.",
    packsTitle: "Add more credits", packCredits: (n) => `${n} credits`, perCredit: (price) => `${price} for each credit`,
    bestValue: "Best value", popular: "Most liked", buy: "Buy", starting: "Opening...",
    rechargeSoon: "Buying credits will open soon. Please check again later.",
    openTitle: "Your payment", continuePay: "Pay now", checking: "Checking",
    payingFor: (n) => `Buying ${n} credits`, otherPack: "Choose another pack",
    credited: (n) => `${n} credits added!`, creditedBody: "Thank you. You can ask Pandit Jii now.",
    historyTitle: "Credit history", emptyHistory: "Nothing here yet.",
    reasons: { signup_bonus: "Welcome gift", question: "Asked Pandit Jii", palm_reading: "Palm reading", refund: "Credits returned", recharge: "Bought credits", admin: "From the Zodiak team" },
    noCreditsTitle: "Your credits are over", noCreditsBody: (n) => `Each answer needs ${n} ${n === 1 ? "credit" : "credits"}. Add credits to keep asking Pandit Jii.`,
    addCredits: "Add credits", costHint: (n) => `1 question = ${n} ${n === 1 ? "credit" : "credits"}`,
    welcomeTitle: "A gift for you!", welcomeBody: (n) => `We added ${n} free credits to your account. Ask Pandit Jii anything you like.`,
    welcomeCta: "Ask Pandit Jii", welcomeLater: "Later",
    palmUses: (n) => `Uses ${n} ${n === 1 ? "credit" : "credits"}`, signInTitle: "Sign in to see your credits", signInBody: "New accounts get free credits.",
  },
  hi: {
    title: "मेरे क्रेडिट", subtitle: "क्रेडिट से आप पंडित जी से पूछ सकते हैं और हाथ पढ़वा सकते हैं।", balanceLabel: "बचे हुए क्रेडिट",
    chipLabel: (n) => `${n} क्रेडिट बचे हैं। और जोड़ने के लिए दबाएँ।`,
    howTitle: "किस चीज़ के कितने क्रेडिट", questionCost: (n) => `पंडित जी का 1 जवाब = ${n} क्रेडिट`,
    palmCost: (n) => `1 बार हाथ पढ़ना = ${n} क्रेडिट`, retakeFree: "अगर जवाब नहीं आया या हाथ की फ़ोटो साफ़ नहीं थी, तो क्रेडिट वापस मिल जाते हैं।",
    packsTitle: "और क्रेडिट जोड़ें", packCredits: (n) => `${n} क्रेडिट`, perCredit: (price) => `हर क्रेडिट ${price}`,
    bestValue: "सबसे फ़ायदेमंद", popular: "सबसे पसंदीदा", buy: "खरीदें", starting: "खुल रहा है...",
    rechargeSoon: "क्रेडिट खरीदना जल्द शुरू होगा। कृपया बाद में देखें।",
    openTitle: "आपका भुगतान", continuePay: "अभी भुगतान करें", checking: "जाँच हो रही है",
    payingFor: (n) => `${n} क्रेडिट खरीद रहे हैं`, otherPack: "दूसरा पैक चुनें",
    credited: (n) => `${n} क्रेडिट जुड़ गए!`, creditedBody: "धन्यवाद। अब आप पंडित जी से पूछ सकते हैं।",
    historyTitle: "क्रेडिट का हिसाब", emptyHistory: "अभी कुछ नहीं है।",
    reasons: { signup_bonus: "स्वागत तोहफ़ा", question: "पंडित जी से पूछा", palm_reading: "हाथ पढ़ा", refund: "क्रेडिट वापस", recharge: "क्रेडिट खरीदे", admin: "Zodiak टीम से" },
    noCreditsTitle: "आपके क्रेडिट खत्म हो गए", noCreditsBody: (n) => `हर जवाब के लिए ${n} क्रेडिट चाहिए। पंडित जी से पूछते रहने के लिए क्रेडिट जोड़ें।`,
    addCredits: "क्रेडिट जोड़ें", costHint: (n) => `1 सवाल = ${n} क्रेडिट`,
    welcomeTitle: "आपके लिए तोहफ़ा!", welcomeBody: (n) => `हमने आपके खाते में ${n} मुफ़्त क्रेडिट जोड़े हैं। पंडित जी से जो चाहें पूछें।`,
    welcomeCta: "पंडित जी से पूछें", welcomeLater: "बाद में",
    palmUses: (n) => `${n} क्रेडिट लगेंगे`, signInTitle: "क्रेडिट देखने के लिए साइन इन करें", signInBody: "नए खाते को मुफ़्त क्रेडिट मिलते हैं।",
  },
  hinglish: {
    title: "Mere credits", subtitle: "Credits se aap Pandit Jii se pooch sakte ho aur haath padhwa sakte ho.", balanceLabel: "Bache hue credits",
    chipLabel: (n) => `${n} credits bache hain. Aur jodne ke liye dabao.`,
    howTitle: "Kis cheez ke kitne credits", questionCost: (n) => `Pandit Jii ka 1 jawab = ${n} credit`,
    palmCost: (n) => `1 baar haath padhna = ${n} credits`, retakeFree: "Agar jawab nahi aaya ya haath ki photo saaf nahi thi, toh credits wapas mil jaate hain.",
    packsTitle: "Aur credits jodo", packCredits: (n) => `${n} credits`, perCredit: (price) => `Har credit ${price}`,
    bestValue: "Sabse faydemand", popular: "Sabse pasand", buy: "Kharido", starting: "Khul raha hai...",
    rechargeSoon: "Credits kharidna jaldi shuru hoga. Please baad mein dekho.",
    openTitle: "Aapka payment", continuePay: "Abhi pay karo", checking: "Check ho raha hai",
    payingFor: (n) => `${n} credits kharid rahe ho`, otherPack: "Doosra pack chuno",
    credited: (n) => `${n} credits jud gaye!`, creditedBody: "Thank you. Ab aap Pandit Jii se pooch sakte ho.",
    historyTitle: "Credits ka hisaab", emptyHistory: "Abhi kuch nahi hai.",
    reasons: { signup_bonus: "Welcome gift", question: "Pandit Jii se poocha", palm_reading: "Haath padha", refund: "Credits wapas", recharge: "Credits kharide", admin: "Zodiak team se" },
    noCreditsTitle: "Aapke credits khatam ho gaye", noCreditsBody: (n) => `Har jawab ke liye ${n} credit chahiye. Pandit Jii se poochte rehne ke liye credits jodo.`,
    addCredits: "Credits jodo", costHint: (n) => `1 sawaal = ${n} credit`,
    welcomeTitle: "Aapke liye gift!", welcomeBody: (n) => `Humne aapke account mein ${n} free credits jode hain. Pandit Jii se jo chaho poocho.`,
    welcomeCta: "Pandit Jii se poocho", welcomeLater: "Baad mein",
    palmUses: (n) => `${n} credits lagenge`, signInTitle: "Credits dekhne ke liye sign in karo", signInBody: "Naye account ko free credits milte hain.",
  },
  kn: {
    title: "ನನ್ನ ಕ್ರೆಡಿಟ್", subtitle: "ಕ್ರೆಡಿಟ್‌ನಿಂದ ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳಬಹುದು ಮತ್ತು ಹಸ್ತ ಓದಿಸಬಹುದು.", balanceLabel: "ಉಳಿದ ಕ್ರೆಡಿಟ್",
    chipLabel: (n) => `${n} ಕ್ರೆಡಿಟ್ ಉಳಿದಿದೆ. ಇನ್ನಷ್ಟು ಸೇರಿಸಲು ಒತ್ತಿ.`,
    howTitle: "ಯಾವುದಕ್ಕೆ ಎಷ್ಟು ಕ್ರೆಡಿಟ್", questionCost: (n) => `ಪಂಡಿತ್ ಜೀ ಅವರ 1 ಉತ್ತರ = ${n} ಕ್ರೆಡಿಟ್`,
    palmCost: (n) => `1 ಸಲ ಹಸ್ತ ಓದುವುದು = ${n} ಕ್ರೆಡಿಟ್`, retakeFree: "ಉತ್ತರ ಬರದಿದ್ದರೆ ಅಥವಾ ಹಸ್ತದ ಫೋಟೋ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲದಿದ್ದರೆ, ಕ್ರೆಡಿಟ್ ವಾಪಸ್ ಸಿಗುತ್ತದೆ.",
    packsTitle: "ಇನ್ನಷ್ಟು ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿ", packCredits: (n) => `${n} ಕ್ರೆಡಿಟ್`, perCredit: (price) => `ಪ್ರತಿ ಕ್ರೆಡಿಟ್ ${price}`,
    bestValue: "ಹೆಚ್ಚು ಲಾಭ", popular: "ಹೆಚ್ಚು ಇಷ್ಟ", buy: "ಖರೀದಿಸಿ", starting: "ತೆರೆಯುತ್ತಿದೆ...",
    rechargeSoon: "ಕ್ರೆಡಿಟ್ ಖರೀದಿ ಬೇಗ ಶುರುವಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ನಂತರ ನೋಡಿ.",
    openTitle: "ನಿಮ್ಮ ಪಾವತಿ", continuePay: "ಈಗ ಪಾವತಿಸಿ", checking: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ",
    payingFor: (n) => `${n} ಕ್ರೆಡಿಟ್ ಖರೀದಿಸುತ್ತಿದ್ದೀರಿ`, otherPack: "ಬೇರೆ ಪ್ಯಾಕ್ ಆರಿಸಿ",
    credited: (n) => `${n} ಕ್ರೆಡಿಟ್ ಸೇರಿದೆ!`, creditedBody: "ಧನ್ಯವಾದ. ಈಗ ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳಬಹುದು.",
    historyTitle: "ಕ್ರೆಡಿಟ್ ಲೆಕ್ಕ", emptyHistory: "ಇನ್ನೂ ಏನೂ ಇಲ್ಲ.",
    reasons: { signup_bonus: "ಸ್ವಾಗತ ಉಡುಗೊರೆ", question: "ಪಂಡಿತ್ ಜೀ ಕೇಳಿದ್ದು", palm_reading: "ಹಸ್ತ ಓದಿದ್ದು", refund: "ಕ್ರೆಡಿಟ್ ವಾಪಸ್", recharge: "ಕ್ರೆಡಿಟ್ ಖರೀದಿ", admin: "Zodiak ತಂಡದಿಂದ" },
    noCreditsTitle: "ನಿಮ್ಮ ಕ್ರೆಡಿಟ್ ಮುಗಿದಿದೆ", noCreditsBody: (n) => `ಪ್ರತಿ ಉತ್ತರಕ್ಕೆ ${n} ಕ್ರೆಡಿಟ್ ಬೇಕು. ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳುತ್ತಿರಲು ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿ.`,
    addCredits: "ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿ", costHint: (n) => `1 ಪ್ರಶ್ನೆ = ${n} ಕ್ರೆಡಿಟ್`,
    welcomeTitle: "ನಿಮಗೊಂದು ಉಡುಗೊರೆ!", welcomeBody: (n) => `ನಿಮ್ಮ ಖಾತೆಗೆ ${n} ಉಚಿತ ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿದ್ದೇವೆ. ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಿ.`,
    welcomeCta: "ಪಂಡಿತ್ ಜೀ ಕೇಳಿ", welcomeLater: "ನಂತರ",
    palmUses: (n) => `${n} ಕ್ರೆಡಿಟ್ ಬೇಕು`, signInTitle: "ಕ್ರೆಡಿಟ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ", signInBody: "ಹೊಸ ಖಾತೆಗೆ ಉಚಿತ ಕ್ರೆಡಿಟ್ ಸಿಗುತ್ತದೆ.",
  },
});
