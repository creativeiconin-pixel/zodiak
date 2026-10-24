import { defineDict } from "..";

type Milestone = { title: string; body: string };

type OrderStatusCopy = {
  loading: string; reference: string; inCheck: string; refunded: string; delivered: string;
  grade: string; inclPooja: string;
  paidTitle: string; paidBody: string; failedTitle: string; failedBody: string; tryAgain: string; pendingPay: string;
  rejectedTitle: string; rejectedBody: (reviewer: string, amount: string) => string; findAlternative: string; ourPandit: string;
  journey: string; complete: string; stepOf: (step: number) => string; inProgress: string; stage: (n: number) => string;
  milestones: Milestone[]; trialTitle: string; trialBody: string;
  auditActive: string; auditDone: string; assurance: string; panditCouncil: string; assigning: string;
  reviewedOn: (title: string, date: string) => string; certified: string;
  guarantee: (planet: string) => string; guaranteeBold: string; guaranteeEnd: string;
  analyzing: (lagna: string, nakshatra: string) => string; linkChart: string; viewAudit: string;
  sankalpa: string; registeredUnder: (name: string, gotra: string | null) => string; askAi: string;
  invoice: string; help: string; home: string;
  drawerEyebrow: string; drawerTitle: string; planetLord: string; lagna: string; nakshatra: string; compatibility: string; muhurat: string;
  notLinked: string; pendingAudit: string; afterApproval: string; understood: string;
};

export const orderStatusText = defineDict<OrderStatusCopy>({
  en: {
    loading: "Finding your order...", reference: "Order number", inCheck: "Being checked", refunded: "Money returned", delivered: "Delivered",
    grade: "Pandit-blessed quality", inclPooja: "includes pooja",
    paidTitle: "Payment received", paidBody: "Thank you! A Pandit will now check your chart before anything is made.", failedTitle: "Payment did not go through", failedBody: "No money was taken. You can try paying again.", tryAgain: "Try again", pendingPay: "We are still waiting for your payment to finish. This page will update on its own.",
    rejectedTitle: "Not right for your chart — full money back",
    rejectedBody: (reviewer, amount) => `${reviewer} found this remedy does not suit your chart. So nothing was made, and your ${amount} was sent back to you.`,
    findAlternative: "Ask Pandit Jii for a better remedy", ourPandit: "Our Pandit",
    journey: "Your order journey", complete: "All done", stepOf: (step) => `Step ${step} of 5`, inProgress: "In progress", stage: (n) => `Step ${n}`,
    milestones: [
      { title: "Money kept safe", body: "Your money is held safely. It is used only after a Pandit says yes." },
      { title: "Pandit is checking", body: "A senior Pandit is checking your birth chart with this remedy." },
      { title: "Pooja done", body: "The remedy is blessed with mantras at a good time (muhurat)." },
      { title: "Sent to you", body: "Packed safely and given to a trusted courier." },
      { title: "Delivered", body: "It reaches you in a silk box with a blessed copper yantra card." },
    ],
    trialTitle: "3-day trial first",
    trialBody: "Your chart has a sensitive Saturn spot. So the Pandit wants a short trial before making the ring. Your money stays safe.",
    auditActive: "Pandit check going on", auditDone: "Pandit check done", assurance: "100% promise",
    panditCouncil: "Senior Pandit team", assigning: "A Pandit will be given your order soon",
    reviewedOn: (title, date) => `${title} • Checked on ${date}`, certified: "Kashi Jyotish Parishad certified",
    guarantee: (planet) => `If your chart does not match well with ${planet}, the Pandit will suggest a better remedy or give you a `,
    guaranteeBold: "full money back", guaranteeEnd: " before anything is made.",
    analyzing: (lagna, nakshatra) => `Checking: ${lagna} • ${nakshatra}`, linkChart: "Add your birth chart for a faster check", viewAudit: "See details",
    sankalpa: "Pooja will be done in the name of", registeredUnder: (name, gotra) => (gotra ? `${name}, Gotra: ${gotra}` : name), askAi: "Ask Pandit Jii",
    invoice: "Download bill", help: "Need help?", home: "Back to home",
    drawerEyebrow: "How it matches you", drawerTitle: "Remedy check details", planetLord: "Main planet", lagna: "Rising sign (Lagna)", nakshatra: "Moon star (Nakshatra)",
    compatibility: "Match with your chart", muhurat: "Pooja time (muhurat)", notLinked: "Not added", pendingAudit: "Pandit will check", afterApproval: "Fixed after approval", understood: "OK, got it",
  },
  hi: {
    loading: "आपका ऑर्डर ढूँढ रहे हैं...", reference: "ऑर्डर नंबर", inCheck: "जाँच चल रही है", refunded: "पैसे वापस", delivered: "पहुँच गया",
    grade: "पंडित जी द्वारा पूजित", inclPooja: "पूजा सहित",
    paidTitle: "भुगतान मिल गया", paidBody: "धन्यवाद! अब कुछ बनाने से पहले पंडित जी आपकी कुंडली जाँचेंगे।", failedTitle: "भुगतान नहीं हो पाया", failedBody: "कोई पैसा नहीं कटा। आप फिर से भुगतान कर सकते हैं।", tryAgain: "फिर कोशिश करें", pendingPay: "हम अभी भी आपके भुगतान के पूरा होने का इंतज़ार कर रहे हैं। यह पेज अपने आप अपडेट होगा।",
    rejectedTitle: "आपकी कुंडली के लिए सही नहीं — पूरे पैसे वापस",
    rejectedBody: (reviewer, amount) => `${reviewer} ने पाया कि यह उपाय आपकी कुंडली के लिए सही नहीं है। इसलिए कुछ नहीं बनाया गया और आपके ${amount} वापस भेज दिए गए।`,
    findAlternative: "AI से बेहतर उपाय पूछें", ourPandit: "हमारे पंडित जी",
    journey: "आपके ऑर्डर का सफ़र", complete: "सब पूरा", stepOf: (step) => `कदम ${step} / 5`, inProgress: "चल रहा है", stage: (n) => `कदम ${n}`,
    milestones: [
      { title: "पैसे सुरक्षित", body: "आपके पैसे सुरक्षित रखे गए हैं। पंडित जी की हाँ के बाद ही इस्तेमाल होंगे।" },
      { title: "पंडित जी जाँच रहे हैं", body: "एक वरिष्ठ पंडित जी आपकी कुंडली को इस उपाय से मिला रहे हैं।" },
      { title: "पूजा हो गई", body: "शुभ मुहूर्त में मंत्रों से उपाय की पूजा की जाती है।" },
      { title: "भेज दिया गया", body: "सुरक्षित पैक करके भरोसेमंद कूरियर को दिया गया।" },
      { title: "पहुँच गया", body: "रेशमी डिब्बे और पूजित ताँबे के यंत्र कार्ड के साथ आप तक पहुँचता है।" },
    ],
    trialTitle: "पहले 3 दिन का ट्रायल",
    trialBody: "आपकी कुंडली में शनि की स्थिति नाज़ुक है। इसलिए अंगूठी बनाने से पहले पंडित जी छोटा ट्रायल चाहते हैं। आपके पैसे सुरक्षित हैं।",
    auditActive: "पंडित जी की जाँच चल रही है", auditDone: "पंडित जी की जाँच पूरी", assurance: "100% वादा",
    panditCouncil: "वरिष्ठ पंडित टीम", assigning: "जल्द ही एक पंडित जी आपका ऑर्डर देखेंगे",
    reviewedOn: (title, date) => `${title} • ${date} को जाँचा`, certified: "काशी ज्योतिष परिषद से प्रमाणित",
    guarantee: (planet) => `अगर आपकी कुंडली ${planet} से ठीक नहीं मिलती, तो पंडित जी बेहतर उपाय बताएँगे या `,
    guaranteeBold: "पूरे पैसे वापस", guaranteeEnd: " करेंगे — कुछ बनाने से पहले।",
    analyzing: (lagna, nakshatra) => `जाँच: ${lagna} • ${nakshatra}`, linkChart: "जल्दी जाँच के लिए अपनी कुंडली जोड़ें", viewAudit: "जानकारी देखें",
    sankalpa: "पूजा इनके नाम से होगी", registeredUnder: (name, gotra) => (gotra ? `${name}, गोत्र: ${gotra}` : name), askAi: "पंडित जी से पूछें",
    invoice: "बिल डाउनलोड करें", help: "मदद चाहिए?", home: "होम पर जाएँ",
    drawerEyebrow: "आपसे कैसे मिलता है", drawerTitle: "उपाय जाँच की जानकारी", planetLord: "मुख्य ग्रह", lagna: "लग्न", nakshatra: "चंद्र नक्षत्र",
    compatibility: "कुंडली से मेल", muhurat: "पूजा का समय (मुहूर्त)", notLinked: "नहीं जोड़ा", pendingAudit: "पंडित जी जाँचेंगे", afterApproval: "मंज़ूरी के बाद तय होगा", understood: "ठीक है, समझ गया",
  },
  hinglish: {
    loading: "Aapka order dhoondh rahe hain...", reference: "Order number", inCheck: "Check ho raha hai", refunded: "Paise wapas", delivered: "Pahunch gaya",
    grade: "Pandit ji dwara poojit", inclPooja: "pooja ke saath",
    paidTitle: "Payment mil gaya", paidBody: "Dhanyavaad! Ab kuch banane se pehle Pandit ji aapki kundli check karenge.", failedTitle: "Payment nahi ho paya", failedBody: "Koi paisa nahi kata. Aap phir se payment kar sakte ho.", tryAgain: "Phir try karo", pendingPay: "Hum abhi bhi aapke payment ke poora hone ka intezaar kar rahe hain. Yeh page apne aap update hoga.",
    rejectedTitle: "Aapki kundli ke liye sahi nahi — poore paise wapas",
    rejectedBody: (reviewer, amount) => `${reviewer} ne dekha ki yeh upay aapki kundli ke liye sahi nahi hai. Isliye kuch nahi banaya gaya aur aapke ${amount} wapas bhej diye gaye.`,
    findAlternative: "AI se better upay poochho", ourPandit: "Hamare Pandit ji",
    journey: "Aapke order ka safar", complete: "Sab poora", stepOf: (step) => `Step ${step} / 5`, inProgress: "Chal raha hai", stage: (n) => `Step ${n}`,
    milestones: [
      { title: "Paise safe", body: "Aapke paise safe rakhe gaye hain. Pandit ji ki haan ke baad hi use honge." },
      { title: "Pandit ji check kar rahe hain", body: "Ek senior Pandit ji aapki kundli ko is upay se mila rahe hain." },
      { title: "Pooja ho gayi", body: "Shubh muhurat mein mantron se upay ki pooja ki jaati hai." },
      { title: "Bhej diya gaya", body: "Safe pack karke bharosemand courier ko diya gaya." },
      { title: "Pahunch gaya", body: "Resham ke dabbe aur poojit taambe ke yantra card ke saath aap tak pahunchta hai." },
    ],
    trialTitle: "Pehle 3 din ka trial",
    trialBody: "Aapki kundli mein Shani ki position nazuk hai. Isliye ring banane se pehle Pandit ji chhota trial chahte hain. Aapke paise safe hain.",
    auditActive: "Pandit ji ka check chal raha hai", auditDone: "Pandit ji ka check poora", assurance: "100% vaada",
    panditCouncil: "Senior Pandit team", assigning: "Jaldi hi ek Pandit ji aapka order dekhenge",
    reviewedOn: (title, date) => `${title} • ${date} ko check kiya`, certified: "Kashi Jyotish Parishad se certified",
    guarantee: (planet) => `Agar aapki kundli ${planet} se theek nahi milti, to Pandit ji better upay batayenge ya `,
    guaranteeBold: "poore paise wapas", guaranteeEnd: " karenge — kuch banane se pehle.",
    analyzing: (lagna, nakshatra) => `Check: ${lagna} • ${nakshatra}`, linkChart: "Jaldi check ke liye apni kundli jodo", viewAudit: "Details dekho",
    sankalpa: "Pooja inke naam se hogi", registeredUnder: (name, gotra) => (gotra ? `${name}, Gotra: ${gotra}` : name), askAi: "Pandit Jii se poochho",
    invoice: "Bill download karo", help: "Help chahiye?", home: "Home par jao",
    drawerEyebrow: "Aapse kaise milta hai", drawerTitle: "Upay check ki details", planetLord: "Main grah", lagna: "Lagna", nakshatra: "Chandra nakshatra",
    compatibility: "Kundli se match", muhurat: "Pooja ka time (muhurat)", notLinked: "Nahi joda", pendingAudit: "Pandit ji check karenge", afterApproval: "Approval ke baad tay hoga", understood: "Theek hai, samajh gaya",
  },
  kn: {
    loading: "ನಿಮ್ಮ ಆರ್ಡರ್ ಹುಡುಕುತ್ತಿದ್ದೇವೆ...", reference: "ಆರ್ಡರ್ ಸಂಖ್ಯೆ", inCheck: "ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ", refunded: "ಹಣ ವಾಪಸ್", delivered: "ತಲುಪಿದೆ",
    grade: "ಪಂಡಿತರಿಂದ ಪೂಜಿತ", inclPooja: "ಪೂಜೆ ಸೇರಿ",
    paidTitle: "ಪಾವತಿ ಸಿಕ್ಕಿತು", paidBody: "ಧನ್ಯವಾದ! ಏನನ್ನೂ ಮಾಡುವ ಮೊದಲು ಪಂಡಿತರು ಈಗ ನಿಮ್ಮ ಜಾತಕ ಪರಿಶೀಲಿಸುತ್ತಾರೆ.", failedTitle: "ಪಾವತಿ ಆಗಲಿಲ್ಲ", failedBody: "ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗಿಲ್ಲ. ನೀವು ಮತ್ತೆ ಪಾವತಿಸಬಹುದು.", tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", pendingPay: "ನಿಮ್ಮ ಪಾವತಿ ಮುಗಿಯುವುದಕ್ಕಾಗಿ ಇನ್ನೂ ಕಾಯುತ್ತಿದ್ದೇವೆ. ಈ ಪುಟ ತಾನಾಗಿಯೇ ಅಪ್ಡೇಟ್ ಆಗುತ್ತದೆ.",
    rejectedTitle: "ನಿಮ್ಮ ಜಾತಕಕ್ಕೆ ಸರಿಯಲ್ಲ — ಪೂರ್ತಿ ಹಣ ವಾಪಸ್",
    rejectedBody: (reviewer, amount) => `ಈ ಪರಿಹಾರ ನಿಮ್ಮ ಜಾತಕಕ್ಕೆ ಸರಿಯಲ್ಲ ಎಂದು ${reviewer} ಕಂಡರು. ಆದ್ದರಿಂದ ಏನನ್ನೂ ಮಾಡಲಿಲ್ಲ, ನಿಮ್ಮ ${amount} ವಾಪಸ್ ಕಳುಹಿಸಲಾಗಿದೆ.`,
    findAlternative: "ಉತ್ತಮ ಪರಿಹಾರಕ್ಕಾಗಿ ಪಂಡಿತ್ ಜೀ ಕೇಳಿ", ourPandit: "ನಮ್ಮ ಪಂಡಿತರು",
    journey: "ನಿಮ್ಮ ಆರ್ಡರ್ ಪ್ರಯಾಣ", complete: "ಎಲ್ಲಾ ಮುಗಿಯಿತು", stepOf: (step) => `ಹಂತ ${step} / 5`, inProgress: "ನಡೆಯುತ್ತಿದೆ", stage: (n) => `ಹಂತ ${n}`,
    milestones: [
      { title: "ಹಣ ಸುರಕ್ಷಿತ", body: "ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತವಾಗಿದೆ. ಪಂಡಿತರು ಒಪ್ಪಿದ ನಂತರವೇ ಬಳಸಲಾಗುತ್ತದೆ." },
      { title: "ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ", body: "ಹಿರಿಯ ಪಂಡಿತರು ನಿಮ್ಮ ಜಾತಕವನ್ನು ಈ ಪರಿಹಾರದ ಜೊತೆ ಹೋಲಿಸುತ್ತಿದ್ದಾರೆ." },
      { title: "ಪೂಜೆ ಆಯಿತು", body: "ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಮಂತ್ರಗಳಿಂದ ಪರಿಹಾರಕ್ಕೆ ಪೂಜೆ ಮಾಡಲಾಗುತ್ತದೆ." },
      { title: "ಕಳುಹಿಸಲಾಗಿದೆ", body: "ಸುರಕ್ಷಿತವಾಗಿ ಪ್ಯಾಕ್ ಮಾಡಿ ನಂಬಿಕೆಯ ಕೊರಿಯರ್‌ಗೆ ಕೊಡಲಾಗಿದೆ." },
      { title: "ತಲುಪಿದೆ", body: "ರೇಷ್ಮೆ ಪೆಟ್ಟಿಗೆ ಮತ್ತು ಪೂಜಿತ ತಾಮ್ರದ ಯಂತ್ರ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ನಿಮಗೆ ತಲುಪುತ್ತದೆ." },
    ],
    trialTitle: "ಮೊದಲು 3 ದಿನದ ಪ್ರಯೋಗ",
    trialBody: "ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಶನಿಯ ಸ್ಥಾನ ಸೂಕ್ಷ್ಮವಾಗಿದೆ. ಆದ್ದರಿಂದ ಉಂಗುರ ಮಾಡುವ ಮೊದಲು ಪಂಡಿತರು ಸಣ್ಣ ಪ್ರಯೋಗ ಬಯಸುತ್ತಾರೆ. ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತ.",
    auditActive: "ಪಂಡಿತರ ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ", auditDone: "ಪಂಡಿತರ ಪರಿಶೀಲನೆ ಮುಗಿದಿದೆ", assurance: "100% ಭರವಸೆ",
    panditCouncil: "ಹಿರಿಯ ಪಂಡಿತರ ತಂಡ", assigning: "ಶೀಘ್ರದಲ್ಲೇ ಒಬ್ಬ ಪಂಡಿತರು ನಿಮ್ಮ ಆರ್ಡರ್ ನೋಡುತ್ತಾರೆ",
    reviewedOn: (title, date) => `${title} • ${date} ರಂದು ಪರಿಶೀಲಿಸಲಾಗಿದೆ`, certified: "ಕಾಶಿ ಜ್ಯೋತಿಷ ಪರಿಷತ್ ಪ್ರಮಾಣಿತ",
    guarantee: (planet) => `ನಿಮ್ಮ ಜಾತಕ ${planet} ಜೊತೆ ಸರಿಯಾಗಿ ಹೊಂದದಿದ್ದರೆ, ಪಂಡಿತರು ಉತ್ತಮ ಪರಿಹಾರ ಹೇಳುತ್ತಾರೆ ಅಥವಾ `,
    guaranteeBold: "ಪೂರ್ತಿ ಹಣ ವಾಪಸ್", guaranteeEnd: " ಕೊಡುತ್ತಾರೆ — ಏನನ್ನೂ ಮಾಡುವ ಮೊದಲು.",
    analyzing: (lagna, nakshatra) => `ಪರಿಶೀಲನೆ: ${lagna} • ${nakshatra}`, linkChart: "ಬೇಗ ಪರಿಶೀಲನೆಗೆ ನಿಮ್ಮ ಜಾತಕ ಸೇರಿಸಿ", viewAudit: "ವಿವರ ನೋಡಿ",
    sankalpa: "ಪೂಜೆ ಇವರ ಹೆಸರಿನಲ್ಲಿ ನಡೆಯುತ್ತದೆ", registeredUnder: (name, gotra) => (gotra ? `${name}, ಗೋತ್ರ: ${gotra}` : name), askAi: "ಪಂಡಿತ್ ಜೀ ಕೇಳಿ",
    invoice: "ಬಿಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ", help: "ಸಹಾಯ ಬೇಕೇ?", home: "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ",
    drawerEyebrow: "ನಿಮಗೆ ಹೇಗೆ ಹೊಂದುತ್ತದೆ", drawerTitle: "ಪರಿಹಾರ ಪರಿಶೀಲನೆಯ ವಿವರ", planetLord: "ಮುಖ್ಯ ಗ್ರಹ", lagna: "ಲಗ್ನ", nakshatra: "ಚಂದ್ರ ನಕ್ಷತ್ರ",
    compatibility: "ಜಾತಕದೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ", muhurat: "ಪೂಜೆಯ ಸಮಯ (ಮುಹೂರ್ತ)", notLinked: "ಸೇರಿಸಿಲ್ಲ", pendingAudit: "ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ", afterApproval: "ಒಪ್ಪಿಗೆಯ ನಂತರ ನಿಗದಿ", understood: "ಸರಿ, ಅರ್ಥವಾಯಿತು",
  },
});
