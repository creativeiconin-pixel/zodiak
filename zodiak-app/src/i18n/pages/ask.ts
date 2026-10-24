import { defineDict } from "..";

type AskCopy = {
  title: string; status: string; chartLoaded: (lagna: string, moon: string, period: string) => string; noChart: string; makeChart: string;
  signInTitle: string; signInBody: string; signInCta: string;
  topics: { label: string; icon: string; question: string }[];
  tryAsking: string; suggestions: string[];
  aiLabel: string; justNow: string; whatChartShows: string; practicalStep: string;
  confidence: string; confidenceLevels: Record<"low" | "moderate" | "high", string>;
  remedyTitle: string; panditChecked: string; viewRemedy: string;
  remedyOnHold: string; remedyRemoved: string; panditNote: string;
  report: string; reportTitle: string; reportPlaceholder: string; reportSend: string; reportCancel: string; reportSent: string; reportFailed: string;
  careTitle: string; callHelpline: string;
  thinking: string; placeholder: string; send: string; voice: string; listening: string;
  disclaimer: string; loadingHistory: string;
  online: string; typing: string; recordingStatus: string; back: string; today: string;
  record: string; cancelRecording: string; sendVoice: string; micDenied: string; recordUnsupported: string; needsHttps: string;
  noWordsHeard: string; transcriptUnsupported: string; transcript: string; showText: string; hideText: string;
  play: string; pause: string; speed: string; voiceUnavailable: string; voiceReplies: string;
};

export const askText = defineDict<AskCopy>({
  en: {
    title: "Pandit Jii", status: "Reads your own birth chart",
    chartLoaded: (lagna, moon, period) => `Chart loaded • ${lagna} rising • Moon in ${moon} • ${period} period`,
    noChart: "Add your birth chart for answers about you.", makeChart: "Make my chart",
    signInTitle: "Sign in to ask questions", signInBody: "Your questions and answers are saved safely in your account.", signInCta: "Sign in",
    topics: [
      { label: "Work & money", icon: "workspace_premium", question: "How will my work and money be this year?" },
      { label: "Love & marriage", icon: "favorite", question: "What does my chart say about marriage?" },
      { label: "Health & energy", icon: "vital_signs", question: "How can I keep my energy good this month?" },
      { label: "My planet period", icon: "hourglass_top", question: "What does my current planet period (dasha) mean for me?" },
    ],
    tryAsking: "Try asking",
    suggestions: ["Should I change my job this year?", "What is my strongest planet?", "What should I focus on this month?"],
    aiLabel: "AI reading", justNow: "Just now", whatChartShows: "What your chart shows", practicalStep: "What you can do",
    confidence: "How sure", confidenceLevels: { low: "Low", moderate: "Medium", high: "High" },
    remedyTitle: "Suggested remedy", panditChecked: "A Pandit checks first", viewRemedy: "See remedy details",
    remedyOnHold: "A Pandit is checking this suggestion for your chart. You will see it here after the check.",
    remedyRemoved: "A Pandit checked this and took the product off. It is not right for your chart.",
    panditNote: "Note from the Pandit",
    report: "Report this answer", reportTitle: "What is wrong with this answer?", reportPlaceholder: "Tell us in a few words (you can leave this empty)",
    reportSend: "Send to Pandit", reportCancel: "Cancel", reportSent: "Thank you. A Pandit will check this answer.", reportFailed: "Could not send. Please try again.",
    careTitle: "You matter", callHelpline: "Call Tele-MANAS 14416",
    thinking: "Reading your chart...", placeholder: "Ask about your chart...", send: "Send", voice: "Speak your question", listening: "Listening...",
    disclaimer: "Astrology gives guidance, not certainty. For health, legal or money decisions, please talk to a qualified expert.",
    loadingHistory: "Loading your chat...",
    online: "online", typing: "typing...", recordingStatus: "listening to you...", back: "Back", today: "Today",
    record: "Record a voice note", cancelRecording: "Delete recording", sendVoice: "Send voice note",
    micDenied: "The microphone is blocked. Tap the lock icon next to the web address, allow Microphone, then try again.", recordUnsupported: "This browser cannot record. If you opened Zodiak from WhatsApp or Instagram, open it in Chrome or Safari instead.", needsHttps: "Voice notes need the secure link. Please open https://zodiak.staywill.com",
    noWordsHeard: "We could not hear any words. Please speak a little louder, or type your question.",
    transcriptUnsupported: "This browser cannot turn speech into text. Please use Chrome, or type your question.",
    transcript: "Transcript", showText: "Show text", hideText: "Hide text",
    play: "Play voice note", pause: "Pause voice note", speed: "Change speed",
    voiceUnavailable: "Your phone has no voice for this language, so the reply is shown as text.", voiceReplies: "Voice replies",
  },
  hi: {
    title: "पंडित जी", status: "आपकी अपनी कुंडली पढ़ते हैं",
    chartLoaded: (lagna, moon, period) => `कुंडली जुड़ी • ${lagna} लग्न • चंद्र ${moon} में • ${period} की दशा`,
    noChart: "अपने बारे में जवाब पाने के लिए कुंडली जोड़ें।", makeChart: "मेरी कुंडली बनाएँ",
    signInTitle: "सवाल पूछने के लिए साइन इन करें", signInBody: "आपके सवाल और जवाब आपके खाते में सुरक्षित रहते हैं।", signInCta: "साइन इन",
    topics: [
      { label: "काम और पैसा", icon: "workspace_premium", question: "इस साल मेरा काम और पैसा कैसा रहेगा?" },
      { label: "प्यार और शादी", icon: "favorite", question: "मेरी कुंडली शादी के बारे में क्या कहती है?" },
      { label: "सेहत और ऊर्जा", icon: "vital_signs", question: "इस महीने मैं अपनी ऊर्जा अच्छी कैसे रखूँ?" },
      { label: "मेरी दशा", icon: "hourglass_top", question: "मेरी अभी की दशा का मेरे लिए क्या मतलब है?" },
    ],
    tryAsking: "ऐसे पूछें",
    suggestions: ["क्या मुझे इस साल नौकरी बदलनी चाहिए?", "मेरा सबसे मज़बूत ग्रह कौन-सा है?", "इस महीने मुझे किस बात पर ध्यान देना चाहिए?"],
    aiLabel: "AI फलादेश", justNow: "अभी", whatChartShows: "आपकी कुंडली क्या दिखाती है", practicalStep: "आप क्या कर सकते हैं",
    confidence: "कितना पक्का", confidenceLevels: { low: "कम", moderate: "मध्यम", high: "ज़्यादा" },
    remedyTitle: "सुझाया गया उपाय", panditChecked: "पहले पंडित जी जाँचते हैं", viewRemedy: "उपाय देखें",
    remedyOnHold: "पंडित जी आपकी कुंडली के लिए यह सुझाव जाँच रहे हैं। जाँच के बाद यह यहाँ दिखेगा।",
    remedyRemoved: "पंडित जी ने जाँच कर यह चीज़ हटा दी। यह आपकी कुंडली के लिए सही नहीं है।",
    panditNote: "पंडित जी की बात",
    report: "इस जवाब की शिकायत करें", reportTitle: "इस जवाब में क्या गलत है?", reportPlaceholder: "कुछ शब्दों में बताएँ (खाली भी छोड़ सकते हैं)",
    reportSend: "पंडित जी को भेजें", reportCancel: "रहने दें", reportSent: "धन्यवाद। पंडित जी यह जवाब जाँचेंगे।", reportFailed: "भेज नहीं पाए। फिर से कोशिश करें।",
    careTitle: "आप ज़रूरी हैं", callHelpline: "Tele-MANAS 14416 पर कॉल करें",
    thinking: "आपकी कुंडली पढ़ रहे हैं...", placeholder: "अपनी कुंडली के बारे में पूछें...", send: "भेजें", voice: "बोलकर पूछें", listening: "सुन रहे हैं...",
    disclaimer: "ज्योतिष राह दिखाता है, पक्की बात नहीं। सेहत, कानून या पैसे के फ़ैसलों के लिए किसी जानकार से बात करें।",
    loadingHistory: "आपकी बातचीत लोड हो रही है...",
    online: "ऑनलाइन", typing: "लिख रहे हैं...", recordingStatus: "आपकी बात सुन रहे हैं...", back: "पीछे", today: "आज",
    record: "वॉइस नोट रिकॉर्ड करें", cancelRecording: "रिकॉर्डिंग हटाएँ", sendVoice: "वॉइस नोट भेजें",
    micDenied: "माइक्रोफ़ोन बंद है। वेब पते के पास ताले के निशान पर टैप करें, माइक्रोफ़ोन चालू करें और फिर कोशिश करें।", recordUnsupported: "यह ब्राउज़र रिकॉर्ड नहीं कर सकता। अगर आपने Zodiak को WhatsApp या Instagram से खोला है, तो उसे Chrome या Safari में खोलें।", needsHttps: "वॉइस नोट के लिए सुरक्षित लिंक चाहिए। कृपया https://zodiak.staywill.com खोलें",
    noWordsHeard: "हमें कोई शब्द सुनाई नहीं दिया। थोड़ा ज़ोर से बोलें, या सवाल लिखें।",
    transcriptUnsupported: "यह ब्राउज़र आवाज़ को लिखाई में नहीं बदल सकता। Chrome इस्तेमाल करें, या सवाल लिखें।",
    transcript: "लिखा हुआ", showText: "लिखाई देखें", hideText: "लिखाई छुपाएँ",
    play: "वॉइस नोट चलाएँ", pause: "वॉइस नोट रोकें", speed: "रफ़्तार बदलें",
    voiceUnavailable: "आपके फ़ोन में इस भाषा की आवाज़ नहीं है, इसलिए जवाब लिखकर दिखाया गया है।", voiceReplies: "आवाज़ में जवाब",
  },
  hinglish: {
    title: "Pandit Jii", status: "Aapki apni kundli padhte hain",
    chartLoaded: (lagna, moon, period) => `Kundli judi • ${lagna} Lagna • Chandra ${moon} mein • ${period} ki dasha`,
    noChart: "Apne baare mein jawab ke liye kundli jodo.", makeChart: "Meri kundli banao",
    signInTitle: "Sawaal poochhne ke liye sign in karo", signInBody: "Aapke sawaal aur jawab aapke account mein safe rehte hain.", signInCta: "Sign in",
    topics: [
      { label: "Kaam aur paisa", icon: "workspace_premium", question: "Is saal mera kaam aur paisa kaisa rahega?" },
      { label: "Pyaar aur shaadi", icon: "favorite", question: "Meri kundli shaadi ke baare mein kya kehti hai?" },
      { label: "Sehat aur energy", icon: "vital_signs", question: "Is mahine main apni energy achhi kaise rakhoon?" },
      { label: "Meri dasha", icon: "hourglass_top", question: "Meri abhi ki dasha ka mere liye kya matlab hai?" },
    ],
    tryAsking: "Aise poochho",
    suggestions: ["Kya mujhe is saal job badalni chahiye?", "Mera sabse mazboot grah kaunsa hai?", "Is mahine mujhe kis cheez par dhyaan dena chahiye?"],
    aiLabel: "AI reading", justNow: "Abhi", whatChartShows: "Aapki kundli kya dikhati hai", practicalStep: "Aap kya kar sakte ho",
    confidence: "Kitna pakka", confidenceLevels: { low: "Kam", moderate: "Medium", high: "Zyada" },
    remedyTitle: "Suggest kiya gaya upay", panditChecked: "Pehle Pandit ji check karte hain", viewRemedy: "Upay dekho",
    remedyOnHold: "Pandit ji aapki kundli ke liye yeh suggestion check kar rahe hain. Check ke baad yeh yahan dikhega.",
    remedyRemoved: "Pandit ji ne check karke yeh product hata diya. Yeh aapki kundli ke liye sahi nahi hai.",
    panditNote: "Pandit ji ki baat",
    report: "Is jawab ki shikayat karo", reportTitle: "Is jawab mein kya galat hai?", reportPlaceholder: "Kuch shabdon mein batao (khaali bhi chhod sakte ho)",
    reportSend: "Pandit ji ko bhejo", reportCancel: "Rehne do", reportSent: "Dhanyavaad. Pandit ji yeh jawab check karenge.", reportFailed: "Bhej nahi paaye. Phir se try karo.",
    careTitle: "Aap zaroori ho", callHelpline: "Tele-MANAS 14416 par call karo",
    thinking: "Aapki kundli padh rahe hain...", placeholder: "Apni kundli ke baare mein poochho...", send: "Bhejo", voice: "Bolkar poochho", listening: "Sun rahe hain...",
    disclaimer: "Jyotish raah dikhata hai, pakki baat nahi. Sehat, kanoon ya paise ke faislon ke liye kisi expert se baat karo.",
    loadingHistory: "Aapki chat load ho rahi hai...",
    online: "online", typing: "likh rahe hain...", recordingStatus: "aapki baat sun rahe hain...", back: "Peeche", today: "Aaj",
    record: "Voice note record karo", cancelRecording: "Recording hatao", sendVoice: "Voice note bhejo",
    micDenied: "Microphone band hai. Web address ke paas lock ke nishaan par tap karo, Microphone allow karo, phir try karo.", recordUnsupported: "Yeh browser record nahi kar sakta. Agar aapne Zodiak ko WhatsApp ya Instagram se khola hai, to use Chrome ya Safari mein kholo.", needsHttps: "Voice note ke liye secure link chahiye. Please https://zodiak.staywill.com kholo",
    noWordsHeard: "Humein koi shabd sunai nahi diya. Thoda zor se bolo, ya sawaal likho.",
    transcriptUnsupported: "Yeh browser awaaz ko text mein nahi badal sakta. Chrome use karo, ya sawaal likho.",
    transcript: "Text", showText: "Text dekho", hideText: "Text chhupao",
    play: "Voice note chalao", pause: "Voice note roko", speed: "Speed badlo",
    voiceUnavailable: "Aapke phone mein is bhasha ki awaaz nahi hai, isliye jawab text mein dikhaya gaya hai.", voiceReplies: "Awaaz mein jawab",
  },
  kn: {
    title: "ಪಂಡಿತ್ ಜೀ", status: "ನಿಮ್ಮದೇ ಜಾತಕ ಓದುತ್ತಾರೆ",
    chartLoaded: (lagna, moon, period) => `ಜಾತಕ ಸೇರಿದೆ • ${lagna} ಲಗ್ನ • ಚಂದ್ರ ${moon}ದಲ್ಲಿ • ${period} ದಶೆ`,
    noChart: "ನಿಮ್ಮ ಬಗ್ಗೆ ಉತ್ತರಕ್ಕಾಗಿ ಜಾತಕ ಸೇರಿಸಿ.", makeChart: "ನನ್ನ ಜಾತಕ ಮಾಡಿ",
    signInTitle: "ಪ್ರಶ್ನೆ ಕೇಳಲು ಸೈನ್ ಇನ್ ಮಾಡಿ", signInBody: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರಗಳು ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.", signInCta: "ಸೈನ್ ಇನ್",
    topics: [
      { label: "ಕೆಲಸ ಮತ್ತು ಹಣ", icon: "workspace_premium", question: "ಈ ವರ್ಷ ನನ್ನ ಕೆಲಸ ಮತ್ತು ಹಣ ಹೇಗಿರುತ್ತದೆ?" },
      { label: "ಪ್ರೀತಿ ಮತ್ತು ಮದುವೆ", icon: "favorite", question: "ಮದುವೆಯ ಬಗ್ಗೆ ನನ್ನ ಜಾತಕ ಏನು ಹೇಳುತ್ತದೆ?" },
      { label: "ಆರೋಗ್ಯ ಮತ್ತು ಶಕ್ತಿ", icon: "vital_signs", question: "ಈ ತಿಂಗಳು ನನ್ನ ಶಕ್ತಿಯನ್ನು ಹೇಗೆ ಚೆನ್ನಾಗಿ ಇಟ್ಟುಕೊಳ್ಳಲಿ?" },
      { label: "ನನ್ನ ದಶೆ", icon: "hourglass_top", question: "ನನ್ನ ಈಗಿನ ದಶೆ ನನಗೆ ಏನು ಅರ್ಥ?" },
    ],
    tryAsking: "ಹೀಗೆ ಕೇಳಿ",
    suggestions: ["ಈ ವರ್ಷ ನಾನು ಕೆಲಸ ಬದಲಿಸಬೇಕೇ?", "ನನ್ನ ಅತ್ಯಂತ ಬಲವಾದ ಗ್ರಹ ಯಾವುದು?", "ಈ ತಿಂಗಳು ನಾನು ಯಾವುದರ ಮೇಲೆ ಗಮನ ಕೊಡಬೇಕು?"],
    aiLabel: "AI ಭವಿಷ್ಯ", justNow: "ಈಗ", whatChartShows: "ನಿಮ್ಮ ಜಾತಕ ಏನು ತೋರಿಸುತ್ತದೆ", practicalStep: "ನೀವು ಏನು ಮಾಡಬಹುದು",
    confidence: "ಎಷ್ಟು ಖಚಿತ", confidenceLevels: { low: "ಕಡಿಮೆ", moderate: "ಮಧ್ಯಮ", high: "ಹೆಚ್ಚು" },
    remedyTitle: "ಸೂಚಿಸಿದ ಪರಿಹಾರ", panditChecked: "ಮೊದಲು ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ", viewRemedy: "ಪರಿಹಾರ ನೋಡಿ",
    remedyOnHold: "ಪಂಡಿತರು ನಿಮ್ಮ ಜಾತಕಕ್ಕೆ ಈ ಸಲಹೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ. ಪರಿಶೀಲನೆಯ ನಂತರ ಇದು ಇಲ್ಲಿ ಕಾಣುತ್ತದೆ.",
    remedyRemoved: "ಪಂಡಿತರು ಪರಿಶೀಲಿಸಿ ಈ ವಸ್ತುವನ್ನು ತೆಗೆದಿದ್ದಾರೆ. ಇದು ನಿಮ್ಮ ಜಾತಕಕ್ಕೆ ಸರಿಯಲ್ಲ.",
    panditNote: "ಪಂಡಿತರ ಮಾತು",
    report: "ಈ ಉತ್ತರದ ಬಗ್ಗೆ ದೂರು ನೀಡಿ", reportTitle: "ಈ ಉತ್ತರದಲ್ಲಿ ಏನು ತಪ್ಪಿದೆ?", reportPlaceholder: "ಕೆಲವು ಪದಗಳಲ್ಲಿ ಹೇಳಿ (ಖಾಲಿ ಬಿಡಬಹುದು)",
    reportSend: "ಪಂಡಿತರಿಗೆ ಕಳುಹಿಸಿ", reportCancel: "ಬೇಡ", reportSent: "ಧನ್ಯವಾದ. ಪಂಡಿತರು ಈ ಉತ್ತರವನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.", reportFailed: "ಕಳುಹಿಸಲು ಆಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    careTitle: "ನೀವು ಮುಖ್ಯ", callHelpline: "Tele-MANAS 14416 ಗೆ ಕರೆ ಮಾಡಿ",
    thinking: "ನಿಮ್ಮ ಜಾತಕ ಓದುತ್ತಿದ್ದೇವೆ...", placeholder: "ನಿಮ್ಮ ಜಾತಕದ ಬಗ್ಗೆ ಕೇಳಿ...", send: "ಕಳುಹಿಸಿ", voice: "ಮಾತನಾಡಿ ಕೇಳಿ", listening: "ಕೇಳುತ್ತಿದ್ದೇವೆ...",
    disclaimer: "ಜ್ಯೋತಿಷ್ಯ ದಾರಿ ತೋರಿಸುತ್ತದೆ, ಖಚಿತ ಉತ್ತರವಲ್ಲ. ಆರೋಗ್ಯ, ಕಾನೂನು ಅಥವಾ ಹಣದ ನಿರ್ಧಾರಗಳಿಗೆ ತಜ್ಞರೊಂದಿಗೆ ಮಾತನಾಡಿ.",
    loadingHistory: "ನಿಮ್ಮ ಚಾಟ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    online: "ಆನ್‌ಲೈನ್", typing: "ಬರೆಯುತ್ತಿದ್ದಾರೆ...", recordingStatus: "ನಿಮ್ಮ ಮಾತು ಕೇಳುತ್ತಿದ್ದೇವೆ...", back: "ಹಿಂದೆ", today: "ಇಂದು",
    record: "ಧ್ವನಿ ಸಂದೇಶ ರೆಕಾರ್ಡ್ ಮಾಡಿ", cancelRecording: "ರೆಕಾರ್ಡಿಂಗ್ ಅಳಿಸಿ", sendVoice: "ಧ್ವನಿ ಸಂದೇಶ ಕಳುಹಿಸಿ",
    micDenied: "ಮೈಕ್ರೊಫೋನ್ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ವೆಬ್ ವಿಳಾಸದ ಪಕ್ಕದ ಬೀಗದ ಗುರುತು ಒತ್ತಿ, ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಸಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", recordUnsupported: "ಈ ಬ್ರೌಸರ್ ರೆಕಾರ್ಡ್ ಮಾಡಲು ಆಗುವುದಿಲ್ಲ. WhatsApp ಅಥವಾ Instagram ನಿಂದ Zodiak ತೆರೆದಿದ್ದರೆ, Chrome ಅಥವಾ Safari ನಲ್ಲಿ ತೆರೆಯಿರಿ.", needsHttps: "ಧ್ವನಿ ಸಂದೇಶಕ್ಕೆ ಸುರಕ್ಷಿತ ಲಿಂಕ್ ಬೇಕು. ದಯವಿಟ್ಟು https://zodiak.staywill.com ತೆರೆಯಿರಿ",
    noWordsHeard: "ನಮಗೆ ಯಾವ ಪದವೂ ಕೇಳಿಸಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಜೋರಾಗಿ ಮಾತನಾಡಿ, ಅಥವಾ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ.",
    transcriptUnsupported: "ಈ ಬ್ರೌಸರ್ ಮಾತನ್ನು ಬರಹವಾಗಿ ಬದಲಿಸಲು ಆಗುವುದಿಲ್ಲ. Chrome ಬಳಸಿ, ಅಥವಾ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ.",
    transcript: "ಬರಹ", showText: "ಬರಹ ನೋಡಿ", hideText: "ಬರಹ ಮುಚ್ಚಿ",
    play: "ಧ್ವನಿ ಸಂದೇಶ ಆಡಿಸಿ", pause: "ಧ್ವನಿ ಸಂದೇಶ ನಿಲ್ಲಿಸಿ", speed: "ವೇಗ ಬದಲಿಸಿ",
    voiceUnavailable: "ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಈ ಭಾಷೆಯ ಧ್ವನಿ ಇಲ್ಲ, ಆದ್ದರಿಂದ ಉತ್ತರವನ್ನು ಬರಹದಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ.", voiceReplies: "ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರ",
  },
});
