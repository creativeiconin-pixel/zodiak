import { defineDict } from "..";

type ProductCopy = {
  header: string; loading: string; off: (n: number) => string; mrp: string;
  benefitsTitle: string; originTitle: string; specTitle: string; orderNow: string;
  promiseTitle: string; promiseBody: string; stepsTitle: string; steps: [string, string][];
  askTitle: string; askBody: string; share: string;
};

export const productText = defineDict<ProductCopy>({
  en: {
    header: "Product details", loading: "Opening the product...", off: (n) => `${n}% off`, mrp: "MRP",
    benefitsTitle: "How it helps", originTitle: "Where it comes from", specTitle: "What you get", orderNow: "Order now",
    promiseTitle: "Our promise", promiseBody: "A Pandit checks this remedy against your birth chart first. If it does not suit you, you get all your money back.",
    stepsTitle: "How we bless it", steps: [["Good time", "Picked from your chart"], ["108 mantras", "Chanted by a Pandit"], ["Sealed safely", "With holy Ganga water"]],
    askTitle: "Not sure if it suits you?", askBody: "Ask Pandit Jii. He reads your own chart.", share: "Share",
  },
  hi: {
    header: "सामान की जानकारी", loading: "सामान खुल रहा है...", off: (n) => `${n}% छूट`, mrp: "MRP",
    benefitsTitle: "यह कैसे मदद करता है", originTitle: "यह कहाँ से आता है", specTitle: "आपको क्या मिलेगा", orderNow: "अभी ऑर्डर करें",
    promiseTitle: "हमारा वादा", promiseBody: "पहले एक पंडित आपकी कुंडली से इस उपाय की जाँच करते हैं। अगर यह आपके लिए सही नहीं है, तो पूरे पैसे वापस।",
    stepsTitle: "हम इसे कैसे पूजते हैं", steps: [["शुभ समय", "आपकी कुंडली से चुना"], ["108 मंत्र", "पंडित द्वारा जाप"], ["सुरक्षित बंद", "गंगाजल के साथ"]],
    askTitle: "पक्का नहीं कि यह आपके लिए सही है?", askBody: "पंडित जी से पूछें। वे आपकी अपनी कुंडली पढ़ते हैं।", share: "शेयर करें",
  },
  hinglish: {
    header: "Product ki jaankari", loading: "Product khul raha hai...", off: (n) => `${n}% chhoot`, mrp: "MRP",
    benefitsTitle: "Yeh kaise madad karta hai", originTitle: "Yeh kahan se aata hai", specTitle: "Aapko kya milega", orderNow: "Abhi order karo",
    promiseTitle: "Hamara vaada", promiseBody: "Pehle ek Pandit aapki kundli se is upay ko check karte hain. Agar yeh aapke liye sahi nahi hai, toh poore paise wapas.",
    stepsTitle: "Hum ise kaise poojte hain", steps: [["Shubh samay", "Aapki kundli se chuna"], ["108 mantra", "Pandit dwara jaap"], ["Safe band", "Gangajal ke saath"]],
    askTitle: "Pakka nahi ki yeh aapke liye sahi hai?", askBody: "Pandit Jii se poocho. Woh aapki apni kundli padhte hain.", share: "Share karo",
  },
  kn: {
    header: "ವಸ್ತುವಿನ ವಿವರ", loading: "ವಸ್ತು ತೆರೆಯುತ್ತಿದೆ...", off: (n) => `${n}% ರಿಯಾಯಿತಿ`, mrp: "MRP",
    benefitsTitle: "ಇದು ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ", originTitle: "ಇದು ಎಲ್ಲಿಂದ ಬರುತ್ತದೆ", specTitle: "ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ", orderNow: "ಈಗ ಆರ್ಡರ್ ಮಾಡಿ",
    promiseTitle: "ನಮ್ಮ ಭರವಸೆ", promiseBody: "ಮೊದಲು ಒಬ್ಬ ಪಂಡಿತರು ನಿಮ್ಮ ಜಾತಕದೊಂದಿಗೆ ಈ ಪರಿಹಾರವನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ. ಇದು ನಿಮಗೆ ಸರಿಹೊಂದದಿದ್ದರೆ, ಪೂರ್ತಿ ಹಣ ವಾಪಸ್.",
    stepsTitle: "ನಾವು ಇದನ್ನು ಹೇಗೆ ಪೂಜಿಸುತ್ತೇವೆ", steps: [["ಶುಭ ಸಮಯ", "ನಿಮ್ಮ ಜಾತಕದಿಂದ ಆರಿಸಿದ್ದು"], ["108 ಮಂತ್ರ", "ಪಂಡಿತರಿಂದ ಜಪ"], ["ಸುರಕ್ಷಿತ ಮುದ್ರೆ", "ಗಂಗಾಜಲದೊಂದಿಗೆ"]],
    askTitle: "ಇದು ನಿಮಗೆ ಸರಿಹೊಂದುತ್ತದೆಯೇ ಎಂದು ಖಚಿತವಿಲ್ಲವೇ?", askBody: "ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳಿ. ಅವರು ನಿಮ್ಮ ಜಾತಕವನ್ನೇ ಓದುತ್ತಾರೆ.", share: "ಹಂಚಿಕೊಳ್ಳಿ",
  },
});
