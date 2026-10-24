import { defineDict } from "..";

type KundliCopy = {
  noChartTitle: string; noChartBody: string; makeChart: string;
  method: string; share: string; copied: string; title: (name: string) => string; born: string;
  rising: string; moonStar: string; moonSign: string; pada: (n: number) => string;
  chartTitle: string; north: string; south: string; tapHint: string; asc: string; approxNote: string;
  looksAfter: string; planetsHere: string; emptyHouse: string; sign: string;
  trinityTitle: string; ruledBy: (planet: string) => string;
  lagnaTitle: (sign: string) => string; lagnaSub: string; lagnaBody: (traits: string) => string;
  moonTitle: (sign: string) => string; moonSub: (house: string) => string; moonBody: (traits: string) => string;
  sunTitle: (sign: string) => string; sunSub: (house: string) => string; sunBody: (traits: string) => string;
  dashaTitle: string; dashaIntro: string; mainPeriod: string; periodName: (planet: string) => string; periodMeaning: (meaning: string) => string;
  done: (pct: number) => string; left: (years: number, months: number) => string;
  subNow: string; subName: (main: string, sub: string) => string; subSequence: string; statusDone: string; statusNow: string; statusNext: string;
  smallPeriods: string;
  freeRemedyTitle: string; freeRemedyBody: (planet: string, weekday: string) => string; browseRemedies: string;
  tableTitle: string; tableCount: string; colPlanet: string; colSign: string; colDegree: string; colStar: string; colStrength: string; retro: string;
  howTitle: string; howBody: string;
  printTitle: string; printBody: string; printCta: string; bookTitle: string; bookBody: string; bookCta: string;
};

export const kundliText = defineDict<KundliCopy>({
  en: {
    noChartTitle: "Your Kundli is waiting", noChartBody: "Add your birth date, time and place. We will make your full Vedic birth chart for free.", makeChart: "Make my free Kundli",
    method: "Lahiri method • Vedic", share: "Share", copied: "Link copied!", title: (name) => `${name}'s Kundli`, born: "Born",
    rising: "Rising sign", moonStar: "Moon star", moonSign: "Moon sign", pada: (n) => `Pada ${n}`,
    chartTitle: "Birth chart (D1)", north: "North", south: "South", tapHint: "Tap a house to see what it means", asc: "Lagna", approxNote: "Birth time not known, so houses are approximate.",
    looksAfter: "Looks after", planetsHere: "Planets here", emptyHouse: "No planets here", sign: "Sign",
    trinityTitle: "Your three key signs", ruledBy: (planet) => `Ruled by ${planet}`,
    lagnaTitle: (sign) => `${sign} rising`, lagnaSub: "Your body and nature • House 1", lagnaBody: (traits) => `People with this rising sign are often ${traits}.`,
    moonTitle: (sign) => `Moon in ${sign}`, moonSub: (house) => `Your mind and feelings • ${house}`, moonBody: (traits) => `Your mind is often ${traits}.`,
    sunTitle: (sign) => `Sun in ${sign}`, sunSub: (house) => `Your inner self • ${house}`, sunBody: (traits) => `Deep inside, you are often ${traits}.`,
    dashaTitle: "Your planet periods (Dasha)", dashaIntro: "Life moves through planet periods. Each one brings its own mood.", mainPeriod: "Main period now",
    periodName: (planet) => `${planet} period`, periodMeaning: (meaning) => `A time linked with ${meaning}.`,
    done: (pct) => `${pct}% done`, left: (y, m) => `${y} yrs ${m} mths left`,
    subNow: "Sub-period now", subName: (main, sub) => `${main} – ${sub}`, subSequence: "Sub-periods", statusDone: "Done", statusNow: "Now", statusNext: "Next",
    smallPeriods: "Small periods inside",
    freeRemedyTitle: "Free remedy for this period", freeRemedyBody: (planet, weekday) => `Chant this mantra 108 times on ${weekday}. It helps keep ${planet}'s energy calm and kind.`, browseRemedies: "See blessed remedies",
    tableTitle: "Where the planets are", tableCount: "9 planets", colPlanet: "Planet", colSign: "Sign", colDegree: "Degree", colStar: "Star", colStrength: "Strength", retro: "Moving backwards (retrograde)",
    howTitle: "How we calculate", howBody: "We use the real positions of the planets from astronomy data and the Lahiri method used across India. A Pandit checks any remedy before it is sent.",
    printTitle: "Keep a copy", printBody: "Save your Kundli as a PDF or print it. Free.", printCta: "Save as PDF",
    bookTitle: "Hard-bound Kundli book", bookBody: "Your chart printed in a gold-foil book, blessed and delivered home.", bookCta: "Order book",
  },
  hi: {
    noChartTitle: "आपकी कुंडली इंतज़ार कर रही है", noChartBody: "अपनी जन्म तिथि, समय और जगह भरें। हम मुफ़्त में आपकी पूरी वैदिक कुंडली बनाएँगे।", makeChart: "मेरी मुफ़्त कुंडली बनाएँ",
    method: "लाहिरी पद्धति • वैदिक", share: "शेयर करें", copied: "लिंक कॉपी हो गया!", title: (name) => `${name} की कुंडली`, born: "जन्म",
    rising: "लग्न", moonStar: "चंद्र नक्षत्र", moonSign: "चंद्र राशि", pada: (n) => `पद ${n}`,
    chartTitle: "जन्म कुंडली (D1)", north: "उत्तर", south: "दक्षिण", tapHint: "किसी भाव पर टैप करें और उसका मतलब देखें", asc: "लग्न", approxNote: "जन्म का समय नहीं पता, इसलिए भाव अनुमानित हैं।",
    looksAfter: "किसका ध्यान रखता है", planetsHere: "यहाँ के ग्रह", emptyHouse: "यहाँ कोई ग्रह नहीं", sign: "राशि",
    trinityTitle: "आपकी तीन मुख्य राशियाँ", ruledBy: (planet) => `स्वामी: ${planet}`,
    lagnaTitle: (sign) => `${sign} लग्न`, lagnaSub: "आपका शरीर और स्वभाव • भाव 1", lagnaBody: (traits) => `इस लग्न वाले लोग अक्सर ${traits} होते हैं।`,
    moonTitle: (sign) => `चंद्र ${sign} में`, moonSub: (house) => `आपका मन और भावनाएँ • ${house}`, moonBody: (traits) => `आपका मन अक्सर ${traits} होता है।`,
    sunTitle: (sign) => `सूर्य ${sign} में`, sunSub: (house) => `आपका अंदर का स्वभाव • ${house}`, sunBody: (traits) => `अंदर से आप अक्सर ${traits} होते हैं।`,
    dashaTitle: "आपकी ग्रह दशाएँ", dashaIntro: "जीवन ग्रहों की दशाओं से गुज़रता है। हर दशा का अपना असर होता है।", mainPeriod: "अभी की मुख्य दशा",
    periodName: (planet) => `${planet} की दशा`, periodMeaning: (meaning) => `${meaning} से जुड़ा समय।`,
    done: (pct) => `${pct}% पूरी`, left: (y, m) => `${y} साल ${m} महीने बाकी`,
    subNow: "अभी की अंतर्दशा", subName: (main, sub) => `${main} – ${sub}`, subSequence: "अंतर्दशाएँ", statusDone: "पूरी", statusNow: "अभी", statusNext: "आगे",
    smallPeriods: "अंदर की छोटी दशाएँ",
    freeRemedyTitle: "इस दशा के लिए मुफ़्त उपाय", freeRemedyBody: (planet, weekday) => `${weekday} को यह मंत्र 108 बार जपें। इससे ${planet} की ऊर्जा शांत और शुभ रहती है।`, browseRemedies: "पूजित उपाय देखें",
    tableTitle: "ग्रह कहाँ हैं", tableCount: "9 ग्रह", colPlanet: "ग्रह", colSign: "राशि", colDegree: "अंश", colStar: "नक्षत्र", colStrength: "बल", retro: "उल्टी चाल (वक्री)",
    howTitle: "हम कैसे गणना करते हैं", howBody: "हम खगोल विज्ञान के आँकड़ों से ग्रहों की असली स्थिति और पूरे भारत में चलने वाली लाहिरी पद्धति इस्तेमाल करते हैं। कोई भी उपाय भेजने से पहले पंडित जी जाँचते हैं।",
    printTitle: "एक कॉपी रखें", printBody: "अपनी कुंडली PDF में सेव करें या प्रिंट करें। मुफ़्त।", printCta: "PDF में सेव करें",
    bookTitle: "हार्ड-बाउंड कुंडली किताब", bookBody: "सुनहरी छपाई वाली किताब में आपकी कुंडली, पूजित और घर तक पहुँचाई गई।", bookCta: "किताब ऑर्डर करें",
  },
  hinglish: {
    noChartTitle: "Aapki kundli intezaar kar rahi hai", noChartBody: "Apni janam tithi, time aur jagah bharo. Hum free mein aapki poori Vedic kundli banayenge.", makeChart: "Meri free kundli banao",
    method: "Lahiri tareeka • Vedic", share: "Share karo", copied: "Link copy ho gaya!", title: (name) => `${name} ki Kundli`, born: "Janam",
    rising: "Lagna", moonStar: "Chandra nakshatra", moonSign: "Chandra rashi", pada: (n) => `Pada ${n}`,
    chartTitle: "Janam kundli (D1)", north: "North", south: "South", tapHint: "Kisi bhaav par tap karo aur uska matlab dekho", asc: "Lagna", approxNote: "Janam ka time nahi pata, isliye bhaav andaaze se hain.",
    looksAfter: "Kiska dhyaan rakhta hai", planetsHere: "Yahan ke grah", emptyHouse: "Yahan koi grah nahi", sign: "Rashi",
    trinityTitle: "Aapki teen main rashiyan", ruledBy: (planet) => `Swami: ${planet}`,
    lagnaTitle: (sign) => `${sign} Lagna`, lagnaSub: "Aapka shareer aur swabhaav • Bhaav 1", lagnaBody: (traits) => `Is Lagna wale log aksar ${traits} hote hain.`,
    moonTitle: (sign) => `Chandra ${sign} mein`, moonSub: (house) => `Aapka mann aur feelings • ${house}`, moonBody: (traits) => `Aapka mann aksar ${traits} hota hai.`,
    sunTitle: (sign) => `Surya ${sign} mein`, sunSub: (house) => `Aapka andar ka swabhaav • ${house}`, sunBody: (traits) => `Andar se aap aksar ${traits} hote ho.`,
    dashaTitle: "Aapki grah dashayein", dashaIntro: "Jeevan grahon ki dashaon se guzarta hai. Har dasha ka apna asar hota hai.", mainPeriod: "Abhi ki main dasha",
    periodName: (planet) => `${planet} ki dasha`, periodMeaning: (meaning) => `${meaning} se juda time.`,
    done: (pct) => `${pct}% poori`, left: (y, m) => `${y} saal ${m} mahine baaki`,
    subNow: "Abhi ki antardasha", subName: (main, sub) => `${main} – ${sub}`, subSequence: "Antardashayein", statusDone: "Poori", statusNow: "Abhi", statusNext: "Aage",
    smallPeriods: "Andar ki chhoti dashayein",
    freeRemedyTitle: "Is dasha ke liye free upay", freeRemedyBody: (planet, weekday) => `${weekday} ko yeh mantra 108 baar japo. Isse ${planet} ki energy shaant aur shubh rehti hai.`, browseRemedies: "Poojit upay dekho",
    tableTitle: "Grah kahan hain", tableCount: "9 grah", colPlanet: "Grah", colSign: "Rashi", colDegree: "Ansh", colStar: "Nakshatra", colStrength: "Bal", retro: "Ulti chaal (Vakri)",
    howTitle: "Hum kaise calculate karte hain", howBody: "Hum astronomy data se grahon ki asli position aur poore India mein chalne wala Lahiri tareeka use karte hain. Koi bhi upay bhejne se pehle Pandit ji check karte hain.",
    printTitle: "Ek copy rakho", printBody: "Apni kundli PDF mein save karo ya print karo. Free.", printCta: "PDF mein save karo",
    bookTitle: "Hard-bound kundli kitaab", bookBody: "Sunehri chhapai wali kitaab mein aapki kundli, poojit aur ghar tak pahunchayi gayi.", bookCta: "Kitaab order karo",
  },
  kn: {
    noChartTitle: "ನಿಮ್ಮ ಜಾತಕ ಕಾಯುತ್ತಿದೆ", noChartBody: "ನಿಮ್ಮ ಹುಟ್ಟಿದ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಹಾಕಿ. ನಾವು ಉಚಿತವಾಗಿ ನಿಮ್ಮ ಪೂರ್ಣ ವೈದಿಕ ಜಾತಕ ಮಾಡುತ್ತೇವೆ.", makeChart: "ನನ್ನ ಉಚಿತ ಜಾತಕ ಮಾಡಿ",
    method: "ಲಾಹಿರಿ ವಿಧಾನ • ವೈದಿಕ", share: "ಹಂಚಿಕೊಳ್ಳಿ", copied: "ಲಿಂಕ್ ಕಾಪಿ ಆಯಿತು!", title: (name) => `${name} ಅವರ ಜಾತಕ`, born: "ಜನನ",
    rising: "ಲಗ್ನ", moonStar: "ಚಂದ್ರ ನಕ್ಷತ್ರ", moonSign: "ಚಂದ್ರ ರಾಶಿ", pada: (n) => `ಪಾದ ${n}`,
    chartTitle: "ಜನ್ಮ ಜಾತಕ (D1)", north: "ಉತ್ತರ", south: "ದಕ್ಷಿಣ", tapHint: "ಒಂದು ಭಾವವನ್ನು ಒತ್ತಿ ಅದರ ಅರ್ಥ ನೋಡಿ", asc: "ಲಗ್ನ", approxNote: "ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ, ಆದ್ದರಿಂದ ಭಾವಗಳು ಅಂದಾಜು.",
    looksAfter: "ಯಾವುದನ್ನು ನೋಡಿಕೊಳ್ಳುತ್ತದೆ", planetsHere: "ಇಲ್ಲಿನ ಗ್ರಹಗಳು", emptyHouse: "ಇಲ್ಲಿ ಯಾವ ಗ್ರಹವೂ ಇಲ್ಲ", sign: "ರಾಶಿ",
    trinityTitle: "ನಿಮ್ಮ ಮೂರು ಮುಖ್ಯ ರಾಶಿಗಳು", ruledBy: (planet) => `ಅಧಿಪತಿ: ${planet}`,
    lagnaTitle: (sign) => `${sign} ಲಗ್ನ`, lagnaSub: "ನಿಮ್ಮ ದೇಹ ಮತ್ತು ಸ್ವಭಾವ • ಭಾವ 1", lagnaBody: (traits) => `ಈ ಲಗ್ನದವರು ಹೆಚ್ಚಾಗಿ ${traits} ಆಗಿರುತ್ತಾರೆ.`,
    moonTitle: (sign) => `ಚಂದ್ರ ${sign}ದಲ್ಲಿ`, moonSub: (house) => `ನಿಮ್ಮ ಮನಸ್ಸು ಮತ್ತು ಭಾವನೆಗಳು • ${house}`, moonBody: (traits) => `ನಿಮ್ಮ ಮನಸ್ಸು ಹೆಚ್ಚಾಗಿ ${traits} ಆಗಿರುತ್ತದೆ.`,
    sunTitle: (sign) => `ಸೂರ್ಯ ${sign}ದಲ್ಲಿ`, sunSub: (house) => `ನಿಮ್ಮ ಒಳಗಿನ ಸ್ವಭಾವ • ${house}`, sunBody: (traits) => `ಒಳಗಿನಿಂದ ನೀವು ಹೆಚ್ಚಾಗಿ ${traits} ಆಗಿರುತ್ತೀರಿ.`,
    dashaTitle: "ನಿಮ್ಮ ಗ್ರಹ ದಶೆಗಳು", dashaIntro: "ಜೀವನ ಗ್ರಹ ದಶೆಗಳ ಮೂಲಕ ಸಾಗುತ್ತದೆ. ಪ್ರತಿ ದಶೆಗೂ ತನ್ನದೇ ಪ್ರಭಾವ ಇರುತ್ತದೆ.", mainPeriod: "ಈಗಿನ ಮುಖ್ಯ ದಶೆ",
    periodName: (planet) => `${planet} ದಶೆ`, periodMeaning: (meaning) => `${meaning} ಜೊತೆ ಸಂಬಂಧಿಸಿದ ಸಮಯ.`,
    done: (pct) => `${pct}% ಮುಗಿದಿದೆ`, left: (y, m) => `${y} ವರ್ಷ ${m} ತಿಂಗಳು ಬಾಕಿ`,
    subNow: "ಈಗಿನ ಅಂತರ್ದಶೆ", subName: (main, sub) => `${main} – ${sub}`, subSequence: "ಅಂತರ್ದಶೆಗಳು", statusDone: "ಮುಗಿದಿದೆ", statusNow: "ಈಗ", statusNext: "ಮುಂದೆ",
    smallPeriods: "ಒಳಗಿನ ಸಣ್ಣ ದಶೆಗಳು",
    freeRemedyTitle: "ಈ ದಶೆಗೆ ಉಚಿತ ಪರಿಹಾರ", freeRemedyBody: (planet, weekday) => `${weekday} ಈ ಮಂತ್ರವನ್ನು 108 ಸಲ ಜಪಿಸಿ. ಇದು ${planet} ಶಕ್ತಿಯನ್ನು ಶಾಂತ ಮತ್ತು ಶುಭವಾಗಿ ಇಡುತ್ತದೆ.`, browseRemedies: "ಪೂಜಿತ ಪರಿಹಾರ ನೋಡಿ",
    tableTitle: "ಗ್ರಹಗಳು ಎಲ್ಲಿವೆ", tableCount: "9 ಗ್ರಹಗಳು", colPlanet: "ಗ್ರಹ", colSign: "ರಾಶಿ", colDegree: "ಅಂಶ", colStar: "ನಕ್ಷತ್ರ", colStrength: "ಬಲ", retro: "ಹಿಮ್ಮುಖ ಚಲನೆ (ವಕ್ರ)",
    howTitle: "ನಾವು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುತ್ತೇವೆ", howBody: "ನಾವು ಖಗೋಳ ದತ್ತಾಂಶದಿಂದ ಗ್ರಹಗಳ ನಿಜವಾದ ಸ್ಥಾನ ಮತ್ತು ಭಾರತದಾದ್ಯಂತ ಬಳಸುವ ಲಾಹಿರಿ ವಿಧಾನ ಬಳಸುತ್ತೇವೆ. ಯಾವುದೇ ಪರಿಹಾರ ಕಳುಹಿಸುವ ಮೊದಲು ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.",
    printTitle: "ಒಂದು ಪ್ರತಿ ಇಟ್ಟುಕೊಳ್ಳಿ", printBody: "ನಿಮ್ಮ ಜಾತಕವನ್ನು PDF ಆಗಿ ಉಳಿಸಿ ಅಥವಾ ಪ್ರಿಂಟ್ ಮಾಡಿ. ಉಚಿತ.", printCta: "PDF ಆಗಿ ಉಳಿಸಿ",
    bookTitle: "ಹಾರ್ಡ್-ಬೌಂಡ್ ಜಾತಕ ಪುಸ್ತಕ", bookBody: "ಚಿನ್ನದ ಬಣ್ಣದ ಮುದ್ರಣದ ಪುಸ್ತಕದಲ್ಲಿ ನಿಮ್ಮ ಜಾತಕ, ಪೂಜಿಸಿ ಮನೆಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.", bookCta: "ಪುಸ್ತಕ ಆರ್ಡರ್ ಮಾಡಿ",
  },
});
