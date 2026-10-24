import { defineDict } from "..";

type Feature = { key: "kundli" | "ask" | "horoscope" | "milan" | "palm" | "store"; eyebrow: string; title: string; body: string; points: string[] };

type LandingCopy = {
  nav: { features: string; how: string; languages: string; faq: string };
  openApp: string;
  badge: string;
  heroTitle: string;
  heroAccent: string;
  heroBody: string;
  ctaComputer: string;
  ctaPhone: string;
  installComputer: string;
  freeCredits: (n: number) => string;
  qrTitle: string;
  qrBody: string;
  chipVoice: string;
  chipPandit: string;
  trust: { icon: string; title: string; body: string }[];
  featuresEyebrow: string;
  featuresTitle: string;
  featuresBody: string;
  features: Feature[];
  tryIt: string;
  howEyebrow: string;
  howTitle: string;
  steps: { icon: string; title: string; body: string }[];
  langEyebrow: string;
  langTitle: string;
  langBody: string;
  langSamples: Record<"en" | "hi" | "hinglish" | "kn", string>;
  installEyebrow: string;
  installTitle: string;
  installBody: string;
  android: string;
  androidSteps: string;
  iphone: string;
  iphoneSteps: string;
  noStore: string;
  faqEyebrow: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalTitle: string;
  finalBody: string;
  disclaimer: string;
  madeIn: string;
};


export const landingText = defineDict<LandingCopy>({
  en: {
    nav: { features: "Features", how: "How it works", languages: "Languages", faq: "Questions" },
    openApp: "Open Zodiak",
    badge: "Vedic astrology • Simple words • Checked by Pandits",
    heroTitle: "Your Pandit Jii,",
    heroAccent: "on your phone.",
    heroBody: "Get your real birth chart for free. Ask Pandit Jii anything by typing or by voice note, in your own language. Every remedy is checked by a real Pandit before we send it.",
    ctaComputer: "Use it on this computer",
    ctaPhone: "Get it on my phone",
    installComputer: "Install on this computer",
    freeCredits: (n) => `New here? You get ${n} free credits to ask Pandit Jii.`,
    qrTitle: "Scan to open on your phone",
    qrBody: "Point your phone camera at this code.",
    chipVoice: "Voice notes in 4 languages",
    chipPandit: "Remedies checked by a Pandit",
    trust: [
      { icon: "auto_awesome", title: "Free birth chart", body: "Made from real planet positions" },
      { icon: "translate", title: "4 languages", body: "English, हिंदी, Hinglish, ಕನ್ನಡ" },
      { icon: "verified_user", title: "Money-back promise", body: "Full refund if a remedy doesn't suit you" },
      { icon: "lock", title: "Private and safe", body: "Your birth details are never sold" },
    ],
    featuresEyebrow: "What you can do",
    featuresTitle: "Everything in one simple app",
    featuresBody: "Six helpful tools, all explained in plain words.",
    features: [
      { key: "kundli", eyebrow: "Free Kundli", title: "Your real birth chart", body: "Enter your birth date, time and place. We work out where every planet was when you were born.", points: ["North and South Indian charts", "Your rising sign, Moon sign and Moon star", "Your planet periods (dasha) with dates"] },
      { key: "ask", eyebrow: "Pandit Jii AI", title: "Ask anything, even by voice", body: "Chat like WhatsApp. Type or send a voice note. Pandit Jii reads your chart and answers in simple words.", points: ["Voice notes in, voice replies out", "Shows which planets the answer is based on", "Gives one simple step you can take"] },
      { key: "horoscope", eyebrow: "Daily horoscope", title: "Made from your own chart", body: "Not a general sun-sign message. We use today's real planets and your own Moon sign.", points: ["Daily, weekly and monthly", "Good time of the day (muhurat)", "Lucky colour and number"] },
      { key: "milan", eyebrow: "Kundli Milan", title: "Check a match, the Indian way", body: "Add your partner's birth details. We check all 8 parts (Ashtakoota) and give points out of 36.", points: ["Easy score with a clear meaning", "Mangal dosha check", "Simple remedy notes"] },
      { key: "palm", eyebrow: "Palm reading", title: "Take a photo of your palm", body: "Our AI looks at your main palm lines and explains them in plain words.", points: ["Life, heart, head and fate lines", "Works with your phone camera", "Traditional meanings, kindly explained"] },
      { key: "store", eyebrow: "Remedy store", title: "Remedies you can trust", body: "Gemstones, Rudraksha and books. A Pandit checks each order against your chart first.", points: ["Lab-tested and blessed with pooja", "Pay by UPI; money kept safe until checked", "Full money back if it doesn't suit you"] },
    ],
    tryIt: "Try it",
    howEyebrow: "How it works",
    howTitle: "Three easy steps",
    steps: [
      { icon: "edit_calendar", title: "Add your birth details", body: "Date, time and place of birth. That's all we need." },
      { icon: "mic", title: "Ask Pandit Jii", body: "Type or speak your question about work, family, health or money." },
      { icon: "verified", title: "Get trusted help", body: "Simple answers, free remedies, and Pandit-checked items when you need them." },
    ],
    langEyebrow: "Your language",
    langTitle: "Speak the way you like",
    langBody: "Switch the language any time. Answers and voice replies follow your choice.",
    langSamples: { en: "Your chart suggests a good time for work.", hi: "आपकी कुंडली काम के लिए अच्छा समय दिखाती है।", hinglish: "Aapki kundli kaam ke liye achha time dikhati hai.", kn: "ನಿಮ್ಮ ಜಾತಕ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯ ಸಮಯ ತೋರಿಸುತ್ತದೆ." },
    installEyebrow: "Install the app",
    installTitle: "Keep Zodiak on your home screen",
    installBody: "No app store needed. Open the link on your phone and add it in a few taps.",
    android: "Android (Chrome)",
    androidSteps: "Tap ⋮ menu → Install app",
    iphone: "iPhone (Safari)",
    iphoneSteps: "Tap Share → Add to Home Screen",
    noStore: "Works even with weak internet. Your chart is saved on the phone.",
    faqEyebrow: "Questions",
    faqTitle: "Good to know",
    faqs: [
      { q: "Is Zodiak free?", a: "Your birth chart, daily horoscope and Kundli Milan are free. Questions to Pandit Jii and palm readings use credits, and new users get free credits to start." },
      { q: "How do you make my chart?", a: "We use real astronomy data for the planets and the Lahiri method used across India. The maths is the same as a traditional panchang." },
      { q: "Can I talk instead of typing?", a: "Yes. Send a voice note in English, Hindi, Hinglish or Kannada. Pandit Jii can reply with a voice note too." },
      { q: "How do remedies and refunds work?", a: "You pay by UPI and your money is kept safe. A Pandit checks the remedy against your chart. If it doesn't suit you, you get all your money back." },
      { q: "Is my information safe?", a: "Yes. Your birth details and chats are private. We never sell your data." },
    ],
    finalTitle: "Start with your free birth chart",
    finalBody: "It takes less than a minute.",
    disclaimer: "Astrology gives guidance, not certainty. For health, legal or money decisions, please talk to a qualified expert.",
    madeIn: "Made with care in India",
  },
  hi: {
    nav: { features: "सुविधाएँ", how: "कैसे काम करता है", languages: "भाषाएँ", faq: "सवाल" },
    openApp: "Zodiak खोलें",
    badge: "वैदिक ज्योतिष • आसान शब्द • पंडित जी की जाँच",
    heroTitle: "आपके पंडित जी,",
    heroAccent: "आपके फ़ोन में।",
    heroBody: "अपनी असली जन्म कुंडली मुफ़्त पाएँ। पंडित जी से लिखकर या वॉइस नोट से, अपनी भाषा में कुछ भी पूछें। हर उपाय भेजने से पहले एक असली पंडित जी जाँचते हैं।",
    ctaComputer: "इसी कंप्यूटर पर चलाएँ",
    ctaPhone: "मेरे फ़ोन पर पाएँ",
    installComputer: "इस कंप्यूटर पर इंस्टॉल करें",
    freeCredits: (n) => `नए हैं? पंडित जी से पूछने के लिए आपको ${n} मुफ़्त क्रेडिट मिलेंगे।`,
    qrTitle: "फ़ोन पर खोलने के लिए स्कैन करें",
    qrBody: "अपने फ़ोन का कैमरा इस कोड पर रखें।",
    chipVoice: "4 भाषाओं में वॉइस नोट",
    chipPandit: "पंडित जी द्वारा जाँचे उपाय",
    trust: [
      { icon: "auto_awesome", title: "मुफ़्त जन्म कुंडली", body: "ग्रहों की असली स्थिति से बनी" },
      { icon: "translate", title: "4 भाषाएँ", body: "English, हिंदी, Hinglish, ಕನ್ನಡ" },
      { icon: "verified_user", title: "पैसे वापसी का वादा", body: "उपाय सही न हो तो पूरे पैसे वापस" },
      { icon: "lock", title: "गोपनीय और सुरक्षित", body: "आपकी जन्म जानकारी कभी बेची नहीं जाती" },
    ],
    featuresEyebrow: "आप क्या कर सकते हैं",
    featuresTitle: "सब कुछ एक आसान ऐप में",
    featuresBody: "छह काम के टूल, सब आसान शब्दों में।",
    features: [
      { key: "kundli", eyebrow: "मुफ़्त कुंडली", title: "आपकी असली जन्म कुंडली", body: "जन्म की तारीख, समय और जगह भरें। हम देखते हैं कि आपके जन्म के समय हर ग्रह कहाँ था।", points: ["उत्तर और दक्षिण भारतीय कुंडली", "आपका लग्न, चंद्र राशि और नक्षत्र", "तारीख़ों के साथ आपकी दशाएँ"] },
      { key: "ask", eyebrow: "पंडित जी AI", title: "कुछ भी पूछें, बोलकर भी", body: "WhatsApp की तरह चैट करें। लिखें या वॉइस नोट भेजें। पंडित जी आपकी कुंडली पढ़कर आसान शब्दों में जवाब देते हैं।", points: ["वॉइस नोट भेजें, आवाज़ में जवाब पाएँ", "जवाब किन ग्रहों पर आधारित है, दिखाता है", "एक आसान कदम बताता है"] },
      { key: "horoscope", eyebrow: "रोज़ का राशिफल", title: "आपकी अपनी कुंडली से", body: "आम राशिफल नहीं। हम आज के असली ग्रह और आपकी चंद्र राशि देखते हैं।", points: ["रोज़, हफ़्ते और महीने का", "दिन का शुभ समय (मुहूर्त)", "शुभ रंग और अंक"] },
      { key: "milan", eyebrow: "कुंडली मिलान", title: "भारतीय तरीके से रिश्ता मिलाएँ", body: "साथी की जन्म जानकारी जोड़ें। हम आठों कूट (अष्टकूट) देखकर 36 में से गुण बताते हैं।", points: ["साफ़ मतलब के साथ आसान अंक", "मंगल दोष की जाँच", "आसान उपाय"] },
      { key: "palm", eyebrow: "हस्तरेखा", title: "हथेली की फ़ोटो लें", body: "हमारा AI आपकी मुख्य रेखाएँ देखकर आसान शब्दों में समझाता है।", points: ["जीवन, हृदय, मस्तिष्क और भाग्य रेखा", "फ़ोन के कैमरे से", "परंपरागत मतलब, प्यार से समझाए"] },
      { key: "store", eyebrow: "उपाय की दुकान", title: "भरोसेमंद उपाय", body: "रत्न, रुद्राक्ष और किताबें। हर ऑर्डर पहले पंडित जी आपकी कुंडली से जाँचते हैं।", points: ["लैब में जाँचे और पूजा से पूजित", "UPI से भुगतान; जाँच तक पैसे सुरक्षित", "सही न हो तो पूरे पैसे वापस"] },
    ],
    tryIt: "आज़माएँ",
    howEyebrow: "कैसे काम करता है",
    howTitle: "तीन आसान कदम",
    steps: [
      { icon: "edit_calendar", title: "जन्म जानकारी भरें", body: "जन्म की तारीख, समय और जगह। बस इतना ही।" },
      { icon: "mic", title: "पंडित जी से पूछें", body: "काम, परिवार, सेहत या पैसे के बारे में लिखकर या बोलकर पूछें।" },
      { icon: "verified", title: "भरोसेमंद मदद पाएँ", body: "आसान जवाब, मुफ़्त उपाय, और ज़रूरत हो तो पंडित जी से जाँचा सामान।" },
    ],
    langEyebrow: "आपकी भाषा",
    langTitle: "जैसे चाहें वैसे बात करें",
    langBody: "कभी भी भाषा बदलें। जवाब और आवाज़ वाले जवाब उसी भाषा में आएँगे।",
    langSamples: { en: "Your chart suggests a good time for work.", hi: "आपकी कुंडली काम के लिए अच्छा समय दिखाती है।", hinglish: "Aapki kundli kaam ke liye achha time dikhati hai.", kn: "ನಿಮ್ಮ ಜಾತಕ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯ ಸಮಯ ತೋರಿಸುತ್ತದೆ." },
    installEyebrow: "ऐप इंस्टॉल करें",
    installTitle: "Zodiak को होम स्क्रीन पर रखें",
    installBody: "ऐप स्टोर की ज़रूरत नहीं। फ़ोन पर लिंक खोलें और कुछ टैप में जोड़ें।",
    android: "Android (Chrome)",
    androidSteps: "⋮ मेन्यू → ऐप इंस्टॉल करें",
    iphone: "iPhone (Safari)",
    iphoneSteps: "शेयर → होम स्क्रीन पर जोड़ें",
    noStore: "कमज़ोर इंटरनेट में भी चलता है। आपकी कुंडली फ़ोन में सेव रहती है।",
    faqEyebrow: "सवाल",
    faqTitle: "जानने लायक बातें",
    faqs: [
      { q: "क्या Zodiak मुफ़्त है?", a: "जन्म कुंडली, रोज़ का राशिफल और कुंडली मिलान मुफ़्त हैं। पंडित जी से सवाल और हस्तरेखा में क्रेडिट लगते हैं, और नए लोगों को शुरू में मुफ़्त क्रेडिट मिलते हैं।" },
      { q: "आप मेरी कुंडली कैसे बनाते हैं?", a: "हम ग्रहों के लिए खगोल विज्ञान के असली आँकड़े और पूरे भारत में चलने वाली लाहिरी पद्धति इस्तेमाल करते हैं। गणित पारंपरिक पंचांग जैसा ही है।" },
      { q: "क्या मैं लिखने की जगह बोल सकता हूँ?", a: "हाँ। English, हिंदी, Hinglish या कन्नड़ में वॉइस नोट भेजें। पंडित जी भी आवाज़ में जवाब दे सकते हैं।" },
      { q: "उपाय और पैसे वापसी कैसे होती है?", a: "आप UPI से भुगतान करते हैं और पैसे सुरक्षित रहते हैं। पंडित जी उपाय को आपकी कुंडली से जाँचते हैं। सही न हो तो पूरे पैसे वापस।" },
      { q: "क्या मेरी जानकारी सुरक्षित है?", a: "हाँ। आपकी जन्म जानकारी और बातचीत गोपनीय है। हम आपका डेटा कभी नहीं बेचते।" },
    ],
    finalTitle: "अपनी मुफ़्त जन्म कुंडली से शुरू करें",
    finalBody: "एक मिनट से भी कम लगता है।",
    disclaimer: "ज्योतिष राह दिखाता है, पक्की बात नहीं। सेहत, कानून या पैसे के फ़ैसलों के लिए किसी जानकार से बात करें।",
    madeIn: "भारत में प्यार से बनाया गया",
  },
  hinglish: {
    nav: { features: "Features", how: "Kaise kaam karta hai", languages: "Bhashayein", faq: "Sawaal" },
    openApp: "Zodiak kholo",
    badge: "Vedic jyotish • Aasaan shabd • Pandit ji ka check",
    heroTitle: "Aapke Pandit Jii,",
    heroAccent: "aapke phone mein.",
    heroBody: "Apni asli janam kundli free mein pao. Pandit Jii se likhkar ya voice note se, apni bhasha mein kuch bhi poochho. Har upay bhejne se pehle ek asli Pandit ji check karte hain.",
    ctaComputer: "Isi computer par chalao",
    ctaPhone: "Mere phone par pao",
    installComputer: "Is computer par install karo",
    freeCredits: (n) => `Naye ho? Pandit Jii se poochhne ke liye aapko ${n} free credits milenge.`,
    qrTitle: "Phone par kholne ke liye scan karo",
    qrBody: "Apne phone ka camera is code par rakho.",
    chipVoice: "4 bhashaon mein voice note",
    chipPandit: "Pandit ji dwara check kiye upay",
    trust: [
      { icon: "auto_awesome", title: "Free janam kundli", body: "Grahon ki asli position se bani" },
      { icon: "translate", title: "4 bhashayein", body: "English, हिंदी, Hinglish, ಕನ್ನಡ" },
      { icon: "verified_user", title: "Paise wapsi ka vaada", body: "Upay sahi na ho to poore paise wapas" },
      { icon: "lock", title: "Private aur safe", body: "Aapki janam details kabhi bechi nahi jaati" },
    ],
    featuresEyebrow: "Aap kya kar sakte ho",
    featuresTitle: "Sab kuch ek aasaan app mein",
    featuresBody: "Chhe kaam ke tools, sab aasaan shabdon mein.",
    features: [
      { key: "kundli", eyebrow: "Free Kundli", title: "Aapki asli janam kundli", body: "Janam ki date, time aur jagah bharo. Hum dekhte hain ki aapke janam ke time har grah kahan tha.", points: ["North aur South Indian chart", "Aapka Lagna, Chandra rashi aur nakshatra", "Dates ke saath aapki dashayein"] },
      { key: "ask", eyebrow: "Pandit Jii AI", title: "Kuch bhi poochho, bolkar bhi", body: "WhatsApp jaisi chat. Likho ya voice note bhejo. Pandit Jii aapki kundli padhkar aasaan shabdon mein jawab dete hain.", points: ["Voice note bhejo, awaaz mein jawab pao", "Jawab kin grahon par based hai, dikhata hai", "Ek aasaan step batata hai"] },
      { key: "horoscope", eyebrow: "Roz ka rashifal", title: "Aapki apni kundli se", body: "General rashifal nahi. Hum aaj ke asli grah aur aapki Chandra rashi dekhte hain.", points: ["Roz, hafte aur mahine ka", "Din ka shubh samay (muhurat)", "Lucky rang aur number"] },
      { key: "milan", eyebrow: "Kundli Milan", title: "Indian tareeke se rishta milao", body: "Partner ki janam details jodo. Hum aathon koot (Ashtakoota) dekhkar 36 mein se gun batate hain.", points: ["Saaf matlab ke saath aasaan score", "Mangal dosh ka check", "Aasaan upay"] },
      { key: "palm", eyebrow: "Palm reading", title: "Hatheli ki photo lo", body: "Hamara AI aapki main rekhayein dekhkar aasaan shabdon mein samjhata hai.", points: ["Jeevan, hriday, mastishk aur bhagya rekha", "Phone ke camera se", "Paramparik matlab, pyaar se samjhaye"] },
      { key: "store", eyebrow: "Upay ki dukaan", title: "Bharosemand upay", body: "Ratna, Rudraksha aur kitaabein. Har order pehle Pandit ji aapki kundli se check karte hain.", points: ["Lab mein check aur pooja se poojit", "UPI se payment; check tak paise safe", "Sahi na ho to poore paise wapas"] },
    ],
    tryIt: "Try karo",
    howEyebrow: "Kaise kaam karta hai",
    howTitle: "Teen aasaan steps",
    steps: [
      { icon: "edit_calendar", title: "Janam details bharo", body: "Janam ki date, time aur jagah. Bas itna hi." },
      { icon: "mic", title: "Pandit Jii se poochho", body: "Kaam, parivaar, sehat ya paise ke baare mein likhkar ya bolkar poochho." },
      { icon: "verified", title: "Bharosemand madad pao", body: "Aasaan jawab, free upay, aur zaroorat ho to Pandit ji se check kiya saamaan." },
    ],
    langEyebrow: "Aapki bhasha",
    langTitle: "Jaise chaho waise baat karo",
    langBody: "Kabhi bhi bhasha badlo. Jawab aur awaaz wale jawab usi bhasha mein aayenge.",
    langSamples: { en: "Your chart suggests a good time for work.", hi: "आपकी कुंडली काम के लिए अच्छा समय दिखाती है।", hinglish: "Aapki kundli kaam ke liye achha time dikhati hai.", kn: "ನಿಮ್ಮ ಜಾತಕ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯ ಸಮಯ ತೋರಿಸುತ್ತದೆ." },
    installEyebrow: "App install karo",
    installTitle: "Zodiak ko home screen par rakho",
    installBody: "App store ki zaroorat nahi. Phone par link kholo aur kuch taps mein jodo.",
    android: "Android (Chrome)",
    androidSteps: "⋮ menu → Install app",
    iphone: "iPhone (Safari)",
    iphoneSteps: "Share → Add to Home Screen",
    noStore: "Kamzor internet mein bhi chalta hai. Aapki kundli phone mein save rehti hai.",
    faqEyebrow: "Sawaal",
    faqTitle: "Jaanne layak baatein",
    faqs: [
      { q: "Kya Zodiak free hai?", a: "Janam kundli, roz ka rashifal aur Kundli Milan free hain. Pandit Jii se sawaal aur palm reading mein credits lagte hain, aur naye logon ko shuru mein free credits milte hain." },
      { q: "Aap meri kundli kaise banate ho?", a: "Hum grahon ke liye astronomy ka asli data aur poore India mein chalne wala Lahiri tareeka use karte hain. Maths paramparik panchang jaisa hi hai." },
      { q: "Kya main likhne ki jagah bol sakta hoon?", a: "Haan. English, Hindi, Hinglish ya Kannada mein voice note bhejo. Pandit Jii bhi awaaz mein jawab de sakte hain." },
      { q: "Upay aur paise wapsi kaise hoti hai?", a: "Aap UPI se pay karte ho aur paise safe rehte hain. Pandit ji upay ko aapki kundli se check karte hain. Sahi na ho to poore paise wapas." },
      { q: "Kya meri jaankari safe hai?", a: "Haan. Aapki janam details aur chats private hain. Hum aapka data kabhi nahi bechte." },
    ],
    finalTitle: "Apni free janam kundli se shuru karo",
    finalBody: "Ek minute se bhi kam lagta hai.",
    disclaimer: "Jyotish raah dikhata hai, pakki baat nahi. Sehat, kanoon ya paise ke faislon ke liye kisi expert se baat karo.",
    madeIn: "India mein pyaar se banaya gaya",
  },
  kn: {
    nav: { features: "ವೈಶಿಷ್ಟ್ಯಗಳು", how: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", languages: "ಭಾಷೆಗಳು", faq: "ಪ್ರಶ್ನೆಗಳು" },
    openApp: "Zodiak ತೆರೆಯಿರಿ",
    badge: "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ • ಸರಳ ಪದಗಳು • ಪಂಡಿತರ ಪರಿಶೀಲನೆ",
    heroTitle: "ನಿಮ್ಮ ಪಂಡಿತ್ ಜೀ,",
    heroAccent: "ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ.",
    heroBody: "ನಿಮ್ಮ ನಿಜವಾದ ಜಾತಕ ಉಚಿತವಾಗಿ ಪಡೆಯಿರಿ. ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಬರೆದು ಅಥವಾ ಧ್ವನಿ ಸಂದೇಶದಿಂದ, ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ. ಪ್ರತಿ ಪರಿಹಾರ ಕಳುಹಿಸುವ ಮೊದಲು ನಿಜವಾದ ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.",
    ctaComputer: "ಈ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲೇ ಬಳಸಿ",
    ctaPhone: "ನನ್ನ ಫೋನ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ",
    installComputer: "ಈ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    freeCredits: (n) => `ಹೊಸಬರೇ? ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳಲು ನಿಮಗೆ ${n} ಉಚಿತ ಕ್ರೆಡಿಟ್ ಸಿಗುತ್ತದೆ.`,
    qrTitle: "ಫೋನ್‌ನಲ್ಲಿ ತೆರೆಯಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    qrBody: "ನಿಮ್ಮ ಫೋನ್ ಕ್ಯಾಮೆರಾವನ್ನು ಈ ಕೋಡ್ ಕಡೆ ಹಿಡಿಯಿರಿ.",
    chipVoice: "4 ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಸಂದೇಶ",
    chipPandit: "ಪಂಡಿತರು ಪರಿಶೀಲಿಸಿದ ಪರಿಹಾರ",
    trust: [
      { icon: "auto_awesome", title: "ಉಚಿತ ಜಾತಕ", body: "ಗ್ರಹಗಳ ನಿಜವಾದ ಸ್ಥಾನದಿಂದ ಮಾಡಿದ್ದು" },
      { icon: "translate", title: "4 ಭಾಷೆಗಳು", body: "English, हिंदी, Hinglish, ಕನ್ನಡ" },
      { icon: "verified_user", title: "ಹಣ ವಾಪಸ್ ಭರವಸೆ", body: "ಪರಿಹಾರ ಸರಿಹೊಂದದಿದ್ದರೆ ಪೂರ್ತಿ ಹಣ ವಾಪಸ್" },
      { icon: "lock", title: "ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತ", body: "ನಿಮ್ಮ ಜನ್ಮ ವಿವರ ಎಂದಿಗೂ ಮಾರಾಟವಾಗುವುದಿಲ್ಲ" },
    ],
    featuresEyebrow: "ನೀವು ಏನು ಮಾಡಬಹುದು",
    featuresTitle: "ಎಲ್ಲವೂ ಒಂದೇ ಸರಳ ಆ್ಯಪ್‌ನಲ್ಲಿ",
    featuresBody: "ಆರು ಉಪಯುಕ್ತ ಸಾಧನಗಳು, ಎಲ್ಲವೂ ಸರಳ ಪದಗಳಲ್ಲಿ.",
    features: [
      { key: "kundli", eyebrow: "ಉಚಿತ ಜಾತಕ", title: "ನಿಮ್ಮ ನಿಜವಾದ ಜನ್ಮ ಜಾತಕ", body: "ಹುಟ್ಟಿದ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಹಾಕಿ. ನೀವು ಹುಟ್ಟಿದಾಗ ಪ್ರತಿ ಗ್ರಹ ಎಲ್ಲಿತ್ತು ಎಂದು ನಾವು ಲೆಕ್ಕ ಹಾಕುತ್ತೇವೆ.", points: ["ಉತ್ತರ ಮತ್ತು ದಕ್ಷಿಣ ಭಾರತೀಯ ಜಾತಕ", "ನಿಮ್ಮ ಲಗ್ನ, ಚಂದ್ರ ರಾಶಿ ಮತ್ತು ನಕ್ಷತ್ರ", "ದಿನಾಂಕಗಳೊಂದಿಗೆ ನಿಮ್ಮ ದಶೆಗಳು"] },
      { key: "ask", eyebrow: "ಪಂಡಿತ್ ಜೀ AI", title: "ಏನು ಬೇಕಾದರೂ ಕೇಳಿ, ಮಾತನಾಡಿಯೂ", body: "WhatsApp ತರಹ ಚಾಟ್ ಮಾಡಿ. ಬರೆಯಿರಿ ಅಥವಾ ಧ್ವನಿ ಸಂದೇಶ ಕಳುಹಿಸಿ. ಪಂಡಿತ್ ಜೀ ನಿಮ್ಮ ಜಾತಕ ಓದಿ ಸರಳ ಪದಗಳಲ್ಲಿ ಉತ್ತರಿಸುತ್ತಾರೆ.", points: ["ಧ್ವನಿ ಸಂದೇಶ ಕಳುಹಿಸಿ, ಧ್ವನಿಯಲ್ಲೇ ಉತ್ತರ ಪಡೆಯಿರಿ", "ಉತ್ತರ ಯಾವ ಗ್ರಹಗಳ ಮೇಲೆ ಆಧಾರಿತ ಎಂದು ತೋರಿಸುತ್ತದೆ", "ಒಂದು ಸರಳ ಹೆಜ್ಜೆ ಹೇಳುತ್ತದೆ"] },
      { key: "horoscope", eyebrow: "ದಿನ ಭವಿಷ್ಯ", title: "ನಿಮ್ಮದೇ ಜಾತಕದಿಂದ", body: "ಸಾಮಾನ್ಯ ರಾಶಿ ಭವಿಷ್ಯವಲ್ಲ. ನಾವು ಇಂದಿನ ನಿಜವಾದ ಗ್ರಹಗಳು ಮತ್ತು ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿ ನೋಡುತ್ತೇವೆ.", points: ["ದಿನ, ವಾರ ಮತ್ತು ತಿಂಗಳು", "ದಿನದ ಶುಭ ಸಮಯ (ಮುಹೂರ್ತ)", "ಅದೃಷ್ಟದ ಬಣ್ಣ ಮತ್ತು ಸಂಖ್ಯೆ"] },
      { key: "milan", eyebrow: "ಜಾತಕ ಹೊಂದಾಣಿಕೆ", title: "ಭಾರತೀಯ ರೀತಿಯಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ನೋಡಿ", body: "ಸಂಗಾತಿಯ ಜನ್ಮ ವಿವರ ಸೇರಿಸಿ. ನಾವು ಎಂಟೂ ಕೂಟಗಳನ್ನು (ಅಷ್ಟಕೂಟ) ನೋಡಿ 36ರಲ್ಲಿ ಗುಣ ಹೇಳುತ್ತೇವೆ.", points: ["ಸ್ಪಷ್ಟ ಅರ್ಥದ ಸರಳ ಅಂಕ", "ಕುಜ ದೋಷ ಪರಿಶೀಲನೆ", "ಸರಳ ಪರಿಹಾರ"] },
      { key: "palm", eyebrow: "ಹಸ್ತ ಸಾಮುದ್ರಿಕ", title: "ಅಂಗೈಯ ಫೋಟೋ ತೆಗೆಯಿರಿ", body: "ನಮ್ಮ AI ನಿಮ್ಮ ಮುಖ್ಯ ರೇಖೆಗಳನ್ನು ನೋಡಿ ಸರಳ ಪದಗಳಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ.", points: ["ಆಯುಷ್ಯ, ಹೃದಯ, ಮಸ್ತಿಷ್ಕ ಮತ್ತು ಭಾಗ್ಯ ರೇಖೆ", "ಫೋನ್ ಕ್ಯಾಮೆರಾದಿಂದ", "ಸಾಂಪ್ರದಾಯಿಕ ಅರ್ಥ, ಪ್ರೀತಿಯಿಂದ ವಿವರಿಸಲಾಗಿದೆ"] },
      { key: "store", eyebrow: "ಪರಿಹಾರ ಅಂಗಡಿ", title: "ನಂಬಬಹುದಾದ ಪರಿಹಾರಗಳು", body: "ರತ್ನ, ರುದ್ರಾಕ್ಷಿ ಮತ್ತು ಪುಸ್ತಕಗಳು. ಪ್ರತಿ ಆರ್ಡರ್ ಅನ್ನು ಮೊದಲು ಪಂಡಿತರು ನಿಮ್ಮ ಜಾತಕದೊಂದಿಗೆ ಪರಿಶೀಲಿಸುತ್ತಾರೆ.", points: ["ಲ್ಯಾಬ್ ಪರೀಕ್ಷಿತ, ಪೂಜೆಯಿಂದ ಪೂಜಿತ", "UPI ಮೂಲಕ ಪಾವತಿ; ಪರಿಶೀಲನೆಯವರೆಗೆ ಹಣ ಸುರಕ್ಷಿತ", "ಸರಿಹೊಂದದಿದ್ದರೆ ಪೂರ್ತಿ ಹಣ ವಾಪಸ್"] },
    ],
    tryIt: "ಪ್ರಯತ್ನಿಸಿ",
    howEyebrow: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    howTitle: "ಮೂರು ಸುಲಭ ಹೆಜ್ಜೆಗಳು",
    steps: [
      { icon: "edit_calendar", title: "ಜನ್ಮ ವಿವರ ಸೇರಿಸಿ", body: "ಹುಟ್ಟಿದ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ. ಅಷ್ಟೇ ಸಾಕು." },
      { icon: "mic", title: "ಪಂಡಿತ್ ಜೀ ಅವರನ್ನು ಕೇಳಿ", body: "ಕೆಲಸ, ಕುಟುಂಬ, ಆರೋಗ್ಯ ಅಥವಾ ಹಣದ ಬಗ್ಗೆ ಬರೆದು ಅಥವಾ ಮಾತನಾಡಿ ಕೇಳಿ." },
      { icon: "verified", title: "ನಂಬಬಹುದಾದ ಸಹಾಯ ಪಡೆಯಿರಿ", body: "ಸರಳ ಉತ್ತರಗಳು, ಉಚಿತ ಪರಿಹಾರಗಳು, ಬೇಕಾದರೆ ಪಂಡಿತರು ಪರಿಶೀಲಿಸಿದ ವಸ್ತುಗಳು." },
    ],
    langEyebrow: "ನಿಮ್ಮ ಭಾಷೆ",
    langTitle: "ನಿಮಗೆ ಇಷ್ಟವಾದಂತೆ ಮಾತನಾಡಿ",
    langBody: "ಯಾವಾಗ ಬೇಕಾದರೂ ಭಾಷೆ ಬದಲಿಸಿ. ಉತ್ತರಗಳು ಮತ್ತು ಧ್ವನಿ ಉತ್ತರಗಳು ಅದೇ ಭಾಷೆಯಲ್ಲಿ ಬರುತ್ತವೆ.",
    langSamples: { en: "Your chart suggests a good time for work.", hi: "आपकी कुंडली काम के लिए अच्छा समय दिखाती है।", hinglish: "Aapki kundli kaam ke liye achha time dikhati hai.", kn: "ನಿಮ್ಮ ಜಾತಕ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯ ಸಮಯ ತೋರಿಸುತ್ತದೆ." },
    installEyebrow: "ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    installTitle: "Zodiak ಅನ್ನು ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ನಲ್ಲಿ ಇಡಿ",
    installBody: "ಆ್ಯಪ್ ಸ್ಟೋರ್ ಬೇಕಿಲ್ಲ. ಫೋನ್‌ನಲ್ಲಿ ಲಿಂಕ್ ತೆರೆದು ಕೆಲವು ಟ್ಯಾಪ್‌ಗಳಲ್ಲಿ ಸೇರಿಸಿ.",
    android: "Android (Chrome)",
    androidSteps: "⋮ ಮೆನು → ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    iphone: "iPhone (Safari)",
    iphoneSteps: "ಶೇರ್ → ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ",
    noStore: "ದುರ್ಬಲ ಇಂಟರ್ನೆಟ್‌ನಲ್ಲೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ನಿಮ್ಮ ಜಾತಕ ಫೋನ್‌ನಲ್ಲಿ ಉಳಿಯುತ್ತದೆ.",
    faqEyebrow: "ಪ್ರಶ್ನೆಗಳು",
    faqTitle: "ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ್ದು",
    faqs: [
      { q: "Zodiak ಉಚಿತವೇ?", a: "ಜನ್ಮ ಜಾತಕ, ದಿನ ಭವಿಷ್ಯ ಮತ್ತು ಜಾತಕ ಹೊಂದಾಣಿಕೆ ಉಚಿತ. ಪಂಡಿತ್ ಜೀ ಅವರಿಗೆ ಪ್ರಶ್ನೆ ಮತ್ತು ಹಸ್ತ ಸಾಮುದ್ರಿಕಕ್ಕೆ ಕ್ರೆಡಿಟ್ ಬೇಕು, ಹೊಸಬರಿಗೆ ಆರಂಭದಲ್ಲಿ ಉಚಿತ ಕ್ರೆಡಿಟ್ ಸಿಗುತ್ತದೆ." },
      { q: "ನನ್ನ ಜಾತಕ ಹೇಗೆ ಮಾಡುತ್ತೀರಿ?", a: "ನಾವು ಗ್ರಹಗಳಿಗೆ ನಿಜವಾದ ಖಗೋಳ ದತ್ತಾಂಶ ಮತ್ತು ಭಾರತದಾದ್ಯಂತ ಬಳಸುವ ಲಾಹಿರಿ ವಿಧಾನ ಬಳಸುತ್ತೇವೆ. ಲೆಕ್ಕ ಸಾಂಪ್ರದಾಯಿಕ ಪಂಚಾಂಗದಂತೆಯೇ." },
      { q: "ಬರೆಯುವ ಬದಲು ಮಾತನಾಡಬಹುದೇ?", a: "ಹೌದು. ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ಹಿಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಸಂದೇಶ ಕಳುಹಿಸಿ. ಪಂಡಿತ್ ಜೀ ಕೂಡ ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರಿಸಬಹುದು." },
      { q: "ಪರಿಹಾರ ಮತ್ತು ಹಣ ವಾಪಸ್ ಹೇಗೆ?", a: "ನೀವು UPI ಮೂಲಕ ಪಾವತಿಸುತ್ತೀರಿ, ಹಣ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ. ಪಂಡಿತರು ಪರಿಹಾರವನ್ನು ನಿಮ್ಮ ಜಾತಕದೊಂದಿಗೆ ಪರಿಶೀಲಿಸುತ್ತಾರೆ. ಸರಿಹೊಂದದಿದ್ದರೆ ಪೂರ್ತಿ ಹಣ ವಾಪಸ್." },
      { q: "ನನ್ನ ಮಾಹಿತಿ ಸುರಕ್ಷಿತವೇ?", a: "ಹೌದು. ನಿಮ್ಮ ಜನ್ಮ ವಿವರ ಮತ್ತು ಚಾಟ್‌ಗಳು ಖಾಸಗಿ. ನಾವು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಎಂದಿಗೂ ಮಾರುವುದಿಲ್ಲ." },
    ],
    finalTitle: "ನಿಮ್ಮ ಉಚಿತ ಜನ್ಮ ಜಾತಕದಿಂದ ಶುರು ಮಾಡಿ",
    finalBody: "ಒಂದು ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ ಸಮಯ ಸಾಕು.",
    disclaimer: "ಜ್ಯೋತಿಷ್ಯ ದಾರಿ ತೋರಿಸುತ್ತದೆ, ಖಚಿತ ಉತ್ತರವಲ್ಲ. ಆರೋಗ್ಯ, ಕಾನೂನು ಅಥವಾ ಹಣದ ನಿರ್ಧಾರಗಳಿಗೆ ತಜ್ಞರೊಂದಿಗೆ ಮಾತನಾಡಿ.",
    madeIn: "ಭಾರತದಲ್ಲಿ ಕಾಳಜಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ",
  },
});
