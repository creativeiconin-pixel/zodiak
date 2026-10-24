import { defineDict } from "..";

type UpiCopy = {
  title: string; subtitle: (amount: string) => string; badge: string;
  scanHint: string; qrAlt: (amount: string) => string; openApp: string; downloadQr: string;
  payTo: string; upiId: string; amount: string; orderNo: string; copy: string; copied: string;
  stepsTitle: string; steps: (amount: string) => string[];
  utrLabel: string; utrPlaceholder: string; utrHelp: string; utrCount: (n: number) => string;
  utrTooShort: string; utrTooLong: string; utrOnlyDigits: string; submit: string; submitting: string;
  rejectedTitle: string; rejectedReason: (reason: string) => string; rejectedHelp: string;
  pendingTitle: string; pendingUtr: (last4: string) => string; pendingBody: string; pendingAuto: string;
  fixUtr: string; cancel: string; pillChecking: string; safety: string;
  rechargeSubtitle: (amount: string) => string; rechargeNo: string; rechargeStep: (amount: string) => string;
};

export const upiText = defineDict<UpiCopy>({
  en: {
    title: "Pay by UPI", subtitle: (amount) => `Pay ${amount} to confirm your order.`, badge: "Any UPI app",
    scanHint: "Scan with any UPI app", qrAlt: (amount) => `UPI QR code to pay ${amount}`, openApp: "Pay with UPI app", downloadQr: "Save QR",
    payTo: "Pay to", upiId: "UPI ID", amount: "Amount", orderNo: "Order number", copy: "Copy", copied: "Copied",
    stepsTitle: "How to pay",
    steps: (amount) => [
      "Scan this QR in any UPI app, or tap “Pay with UPI app”.",
      `Pay exactly ${amount}. The order number is already filled in.`,
      "After paying, open the payment details in your app. Copy the 12-digit UTR (also called UPI Ref No.).",
      "Type that number below and send it.",
    ],
    utrLabel: "UTR / UPI reference number", utrPlaceholder: "1234 5678 9012",
    utrHelp: "It has 12 numbers. You can find it in your UPI app under payment details.", utrCount: (n) => `${n}/12 numbers`,
    utrTooShort: "Please type all 12 numbers.", utrTooLong: "That is more than 12 numbers. Please check again.", utrOnlyDigits: "Use numbers only.",
    submit: "Send payment number", submitting: "Sending...",
    rejectedTitle: "We could not find your payment", rejectedReason: (reason) => `Reason: ${reason}`, rejectedHelp: "Please check and enter the correct UTR.",
    pendingTitle: "We got your payment number", pendingUtr: (last4) => `UTR •••• ${last4}`,
    pendingBody: "Our team is checking it. This usually takes a few hours.", pendingAuto: "This page will update by itself. You can close it.",
    fixUtr: "Typed a wrong number? Fix it", cancel: "Cancel", pillChecking: "Checking payment",
    safety: "Never share your UPI PIN with anyone. We never ask for it.",
    rechargeSubtitle: (amount) => `Pay ${amount} to get your credits.`, rechargeNo: "Recharge number", rechargeStep: (amount) => `Pay exactly ${amount}. The recharge number is already filled in.`,
  },
  hi: {
    title: "UPI से भुगतान करें", subtitle: (amount) => `ऑर्डर पक्का करने के लिए ${amount} भुगतान करें।`, badge: "कोई भी UPI ऐप",
    scanHint: "किसी भी UPI ऐप से स्कैन करें", qrAlt: (amount) => `${amount} भुगतान करने का UPI QR कोड`, openApp: "UPI ऐप से भुगतान करें", downloadQr: "QR सेव करें",
    payTo: "पैसे पाने वाला", upiId: "UPI ID", amount: "रकम", orderNo: "ऑर्डर नंबर", copy: "कॉपी", copied: "कॉपी हो गया",
    stepsTitle: "भुगतान कैसे करें",
    steps: (amount) => [
      "किसी भी UPI ऐप में यह QR स्कैन करें, या “UPI ऐप से भुगतान करें” दबाएँ।",
      `ठीक ${amount} ही भुगतान करें। ऑर्डर नंबर पहले से भरा है।`,
      "भुगतान के बाद ऐप में भुगतान की जानकारी खोलें। 12 अंकों का UTR नंबर (UPI Ref No.) कॉपी करें।",
      "वह नंबर नीचे लिखें और भेज दें।",
    ],
    utrLabel: "UTR / UPI रेफ़रेंस नंबर", utrPlaceholder: "1234 5678 9012",
    utrHelp: "इसमें 12 अंक होते हैं। यह आपके UPI ऐप में भुगतान की जानकारी में मिलेगा।", utrCount: (n) => `${n}/12 अंक`,
    utrTooShort: "कृपया पूरे 12 अंक लिखें।", utrTooLong: "यह 12 से ज़्यादा अंक हैं। कृपया फिर से देखें।", utrOnlyDigits: "सिर्फ़ अंक लिखें।",
    submit: "भुगतान नंबर भेजें", submitting: "भेजा जा रहा है...",
    rejectedTitle: "हमें आपका भुगतान नहीं मिला", rejectedReason: (reason) => `कारण: ${reason}`, rejectedHelp: "कृपया जाँचें और सही UTR नंबर लिखें।",
    pendingTitle: "हमें आपका भुगतान नंबर मिल गया", pendingUtr: (last4) => `UTR •••• ${last4}`,
    pendingBody: "हमारी टीम इसे जाँच रही है। इसमें आमतौर पर कुछ घंटे लगते हैं।", pendingAuto: "यह पेज अपने-आप बदल जाएगा। आप इसे बंद कर सकते हैं।",
    fixUtr: "गलत नंबर लिख दिया? ठीक करें", cancel: "रहने दें", pillChecking: "भुगतान की जाँच",
    safety: "अपना UPI PIN किसी को न बताएँ। हम कभी PIN नहीं माँगते।",
    rechargeSubtitle: (amount) => `क्रेडिट पाने के लिए ${amount} भुगतान करें।`, rechargeNo: "रिचार्ज नंबर", rechargeStep: (amount) => `ठीक ${amount} ही भुगतान करें। रिचार्ज नंबर पहले से भरा है।`,
  },
  hinglish: {
    title: "UPI se pay karo", subtitle: (amount) => `Order pakka karne ke liye ${amount} pay karo.`, badge: "Koi bhi UPI app",
    scanHint: "Kisi bhi UPI app se scan karo", qrAlt: (amount) => `${amount} pay karne ka UPI QR code`, openApp: "UPI app se pay karo", downloadQr: "QR save karo",
    payTo: "Paise paane wala", upiId: "UPI ID", amount: "Amount", orderNo: "Order number", copy: "Copy", copied: "Copy ho gaya",
    stepsTitle: "Pay kaise karein",
    steps: (amount) => [
      "Kisi bhi UPI app mein yeh QR scan karo, ya “UPI app se pay karo” dabao.",
      `Theek ${amount} hi pay karo. Order number pehle se bhara hai.`,
      "Pay karne ke baad app mein payment details kholo. 12 numbers wala UTR (UPI Ref No.) copy karo.",
      "Woh number neeche likho aur bhej do.",
    ],
    utrLabel: "UTR / UPI reference number", utrPlaceholder: "1234 5678 9012",
    utrHelp: "Ismein 12 numbers hote hain. Yeh aapke UPI app mein payment details mein milega.", utrCount: (n) => `${n}/12 numbers`,
    utrTooShort: "Please poore 12 numbers likho.", utrTooLong: "Yeh 12 se zyada numbers hain. Please phir se check karo.", utrOnlyDigits: "Sirf numbers likho.",
    submit: "Payment number bhejo", submitting: "Bheja ja raha hai...",
    rejectedTitle: "Humein aapka payment nahi mila", rejectedReason: (reason) => `Kaaran: ${reason}`, rejectedHelp: "Please check karo aur sahi UTR number likho.",
    pendingTitle: "Humein aapka payment number mil gaya", pendingUtr: (last4) => `UTR •••• ${last4}`,
    pendingBody: "Hamari team ise check kar rahi hai. Ismein aam taur par kuch ghante lagte hain.", pendingAuto: "Yeh page apne aap update hoga. Aap ise band kar sakte ho.",
    fixUtr: "Galat number likh diya? Theek karo", cancel: "Rehne do", pillChecking: "Payment check ho raha hai",
    safety: "Apna UPI PIN kisi ko mat batao. Hum kabhi PIN nahi maangte.",
    rechargeSubtitle: (amount) => `Credits paane ke liye ${amount} pay karo.`, rechargeNo: "Recharge number", rechargeStep: (amount) => `Theek ${amount} hi pay karo. Recharge number pehle se bhara hai.`,
  },
  kn: {
    title: "UPI ಮೂಲಕ ಪಾವತಿಸಿ", subtitle: (amount) => `ನಿಮ್ಮ ಆರ್ಡರ್ ಖಚಿತಪಡಿಸಲು ${amount} ಪಾವತಿಸಿ.`, badge: "ಯಾವುದೇ UPI ಆ್ಯಪ್",
    scanHint: "ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", qrAlt: (amount) => `${amount} ಪಾವತಿಸಲು UPI QR ಕೋಡ್`, openApp: "UPI ಆ್ಯಪ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ", downloadQr: "QR ಉಳಿಸಿ",
    payTo: "ಹಣ ಪಡೆಯುವವರು", upiId: "UPI ID", amount: "ಮೊತ್ತ", orderNo: "ಆರ್ಡರ್ ಸಂಖ್ಯೆ", copy: "ಕಾಪಿ", copied: "ಕಾಪಿ ಆಯಿತು",
    stepsTitle: "ಪಾವತಿಸುವುದು ಹೇಗೆ",
    steps: (amount) => [
      "ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಲ್ಲಿ ಈ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ಅಥವಾ “UPI ಆ್ಯಪ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ” ಒತ್ತಿ.",
      `ಸರಿಯಾಗಿ ${amount} ಮಾತ್ರ ಪಾವತಿಸಿ. ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಮೊದಲೇ ತುಂಬಿದೆ.`,
      "ಪಾವತಿಸಿದ ನಂತರ ಆ್ಯಪ್‌ನಲ್ಲಿ ಪಾವತಿ ವಿವರ ತೆರೆಯಿರಿ. 12 ಅಂಕಿಯ UTR (UPI Ref No.) ಕಾಪಿ ಮಾಡಿ.",
      "ಆ ಸಂಖ್ಯೆಯನ್ನು ಕೆಳಗೆ ಬರೆದು ಕಳುಹಿಸಿ.",
    ],
    utrLabel: "UTR / UPI ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆ", utrPlaceholder: "1234 5678 9012",
    utrHelp: "ಇದರಲ್ಲಿ 12 ಅಂಕಿಗಳಿವೆ. ನಿಮ್ಮ UPI ಆ್ಯಪ್‌ನ ಪಾವತಿ ವಿವರದಲ್ಲಿ ಇದು ಸಿಗುತ್ತದೆ.", utrCount: (n) => `${n}/12 ಅಂಕಿಗಳು`,
    utrTooShort: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ 12 ಅಂಕಿಗಳನ್ನು ಬರೆಯಿರಿ.", utrTooLong: "ಇದು 12ಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂಕಿಗಳು. ದಯವಿಟ್ಟು ಮತ್ತೆ ನೋಡಿ.", utrOnlyDigits: "ಅಂಕಿಗಳನ್ನು ಮಾತ್ರ ಬರೆಯಿರಿ.",
    submit: "ಪಾವತಿ ಸಂಖ್ಯೆ ಕಳುಹಿಸಿ", submitting: "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
    rejectedTitle: "ನಿಮ್ಮ ಪಾವತಿ ನಮಗೆ ಸಿಗಲಿಲ್ಲ", rejectedReason: (reason) => `ಕಾರಣ: ${reason}`, rejectedHelp: "ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸರಿಯಾದ UTR ಸಂಖ್ಯೆ ಬರೆಯಿರಿ.",
    pendingTitle: "ನಿಮ್ಮ ಪಾವತಿ ಸಂಖ್ಯೆ ನಮಗೆ ಸಿಕ್ಕಿದೆ", pendingUtr: (last4) => `UTR •••• ${last4}`,
    pendingBody: "ನಮ್ಮ ತಂಡ ಇದನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ. ಇದಕ್ಕೆ ಸಾಮಾನ್ಯವಾಗಿ ಕೆಲವು ಗಂಟೆಗಳು ಬೇಕು.", pendingAuto: "ಈ ಪುಟ ತಾನಾಗಿಯೇ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತದೆ. ನೀವು ಇದನ್ನು ಮುಚ್ಚಬಹುದು.",
    fixUtr: "ತಪ್ಪು ಸಂಖ್ಯೆ ಬರೆದಿರಾ? ಸರಿಪಡಿಸಿ", cancel: "ಬೇಡ", pillChecking: "ಪಾವತಿ ಪರಿಶೀಲನೆ",
    safety: "ನಿಮ್ಮ UPI PIN ಯಾರಿಗೂ ಹೇಳಬೇಡಿ. ನಾವು ಎಂದಿಗೂ PIN ಕೇಳುವುದಿಲ್ಲ.",
    rechargeSubtitle: (amount) => `ಕ್ರೆಡಿಟ್ ಪಡೆಯಲು ${amount} ಪಾವತಿಸಿ.`, rechargeNo: "ರೀಚಾರ್ಜ್ ನಂಬರ್", rechargeStep: (amount) => `ಸರಿಯಾಗಿ ${amount} ಮಾತ್ರ ಪಾವತಿಸಿ. ರೀಚಾರ್ಜ್ ನಂಬರ್ ಮೊದಲೇ ತುಂಬಿದೆ.`,
  },
});
