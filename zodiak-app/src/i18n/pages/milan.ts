import type { KootaKey, ManglikMatch, ManglikResult, Verdict } from "../../lib/milan";
import { defineDict } from "..";

export type KootaStatus = "full" | "good" | "some" | "low";
export type GroupKey = "mind" | "body" | "luck";

type KootaCopy = { name: string; short: string; meaning: string };
type DoshaCopy = { title: string; body: string; softened: string; remedy: string };

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  person1: string;
  person2: string;
  bride: string;
  groom: string;
  fromProfile: string;
  change: string;
  noProfile: string;
  noProfileCta: string;
  fields: {
    name: string;
    namePh: string;
    gender: string;
    female: string;
    male: string;
    date: string;
    time: string;
    timeUnknown: string;
    timeUnknownNote: string;
    place: string;
    placePh: string;
    pickPlace: string;
    placeFound: string;
  };
  needName: (who: string) => string;
  needDate: (who: string) => string;
  needTime: (who: string) => string;
  needPlace: (who: string) => string;
  check: string;
  editDetails: string;
  lagna: (sign: string) => string;
  lagnaUnknown: string;
  moonLine: (nakshatra: string, sign: string) => string;
  manglikChip: Record<ManglikMatch, string>;
  gunas: string;
  outOf: string;
  verdict: Record<Verdict, { label: string; body: string }>;
  percent: (p: number) => string;
  groups: Record<GroupKey, string>;
  status: Record<KootaStatus, string>;
  method: string;
  methodNote: string;
  kootasTitle: string;
  kootasCount: string;
  kootas: Record<KootaKey, KootaCopy>;
  doshaTitle: string;
  noDosha: string;
  remedyTag: string;
  easyFix: string;
  nadi: DoshaCopy;
  bhakoot: Omit<DoshaCopy, "body"> & { body: (pair: string) => string };
  manglik: {
    title: string;
    intro: string;
    level: Record<ManglikResult["level"], string>;
    match: { none: string; balanced: string; one: (name: string) => string };
    softened: string;
    lagnaUnknown: string;
    remedy: string;
  };
  aiTitle: string;
  aiBadge: string;
  aiSummary: (a: { p1: string; p2: string; total: string; best: string; weak: string | null }) => string;
  aiCta: string;
  panditCta: string;
  another: string;
  footer: string;
};

export const milanText = defineDict<Copy>({
  en: {
    eyebrow: "Match two birth charts",
    title: "Kundli Milan",
    subtitle: "See how well two people match, the old Indian way. We check 8 parts and give points out of 36.",
    person1: "You",
    person2: "Your partner",
    bride: "Bride",
    groom: "Groom",
    fromProfile: "From your saved birth details",
    change: "Change",
    noProfile: "Tip: save your own birth details once, and we will fill them in for you next time.",
    noProfileCta: "Save my details",
    fields: {
      name: "Name",
      namePh: "e.g. Rohan Verma",
      gender: "Gender",
      female: "Female",
      male: "Male",
      date: "Date of birth",
      time: "Time of birth",
      timeUnknown: "I don't know the birth time",
      timeUnknownNote: "That's okay. The match uses the Moon, which stays right without the time.",
      place: "Place of birth",
      placePh: "Type a town or city",
      pickPlace: "Pick the town from the list",
      placeFound: "Place found",
    },
    needName: (who) => `Please write the name for "${who}".`,
    needDate: (who) => `Please choose the date of birth for "${who}".`,
    needTime: (who) => `Please add the birth time for "${who}", or tick "I don't know the birth time".`,
    needPlace: (who) => `Please pick the birth town for "${who}" from the list.`,
    check: "Check match",
    editDetails: "Change details",
    lagna: (sign) => `${sign} Lagna`,
    lagnaUnknown: "Birth time not known",
    moonLine: (nakshatra, sign) => `${nakshatra} • ${sign} Moon`,
    manglikChip: { none: "No Mangal dosha", balanced: "Mangal balanced", one: "Mangal: small check" },
    gunas: "Gunas",
    outOf: "/ 36",
    verdict: {
      great: { label: "Very good match", body: "28 or more out of 36. Tradition sees this as a very happy match." },
      good: { label: "Good match", body: "18 to 27 out of 36. Tradition says 18 or more is good. Small gaps are normal." },
      care: { label: "Needs some care", body: "Less than 18 out of 36. This is not a \"no\". Many couples balance it with simple steps and a Pandit's advice." },
    },
    percent: (p) => `${p}% match`,
    groups: { mind: "Mind", body: "Body & health", luck: "Luck & family" },
    status: { full: "Full match", good: "Good", some: "Some match", low: "Low" },
    method: "Ashtakoota • 8 parts",
    methodNote: "Lahiri method",
    kootasTitle: "The 8 parts of the match",
    kootasCount: "8 parts",
    kootas: {
      varna: { name: "Varna", short: "Work & respect", meaning: "How much you respect each other's way of working." },
      vashya: { name: "Vashya", short: "Attraction", meaning: "How much you are drawn to each other and listen to each other." },
      tara: { name: "Tara", short: "Luck & well-being", meaning: "How your birth stars support each other's luck and health." },
      yoni: { name: "Yoni", short: "Closeness", meaning: "How comfortable and close you feel as a couple." },
      maitri: { name: "Graha Maitri", short: "Friendship", meaning: "If your thinking matches, like good friends." },
      gana: { name: "Gana", short: "Nature", meaning: "If your nature and daily habits fit well." },
      bhakoot: { name: "Bhakoot", short: "Love & family growth", meaning: "Love, money and family happiness together." },
      nadi: { name: "Nadi", short: "Health & family line", meaning: "Health, and children in the future, as per tradition." },
    },
    doshaTitle: "Things to look at",
    noDosha: "No Nadi or Bhakoot dosha. These two big parts match well.",
    remedyTag: "Simple remedy",
    easyFix: "Can be balanced",
    nadi: {
      title: "Nadi dosha",
      body: "You both have the same Nadi. Tradition calls this a small mismatch for health and children. Families often balance it with a simple puja.",
      softened: "Good news: your Moon stars sit in a way that tradition says makes this much lighter.",
      remedy: "Chant the Mahamrityunjaya mantra, or do a Nadi dosha puja. Give food or grain to people in need.",
    },
    bhakoot: {
      title: "Bhakoot dosha",
      body: (pair) => `Your Moon signs are in a ${pair} position. Tradition links this to small ups and downs in money or family life.`,
      softened: "Your Moon sign lords are friends, so tradition says this is mostly balanced already.",
      remedy: "Pray to Shiva and Parvati together, and do a small puja before the wedding.",
    },
    manglik: {
      title: "Mangal dosha (Manglik)",
      intro: "When Mars sits in some houses of the chart, people call it Manglik. It is very common.",
      level: { none: "Not Manglik", mild: "A little Manglik", full: "Manglik" },
      match: {
        none: "Neither of you is Manglik. Nothing to do here.",
        balanced: "You are both Manglik. Tradition says this balances out. That is good.",
        one: (name) => `Only ${name} is Manglik. Many families simply do a Mangal puja to balance it.`,
      },
      softened: "Mars is in its own or strong sign, which makes it softer.",
      lagnaUnknown: "Birth time not known, so we checked from the Moon only.",
      remedy: "Read the Hanuman Chalisa on Tuesdays, or do a Mangal shanti puja.",
    },
    aiTitle: "Pandit Jii says",
    aiBadge: "Quick summary",
    aiSummary: ({ p1, p2, total, best, weak }) =>
      `${p1} and ${p2} match ${total} out of 36 gunas. The strongest part is ${best}.` +
      (weak ? ` Give a little extra care to ${weak}.` : " All the big parts look fine."),
    aiCta: "Ask Pandit Jii about this match",
    panditCta: "Talk to a Pandit about remedies",
    another: "Check another match",
    footer: "Kundli Milan is an old tradition to guide you. Trust, care and talking openly matter most.",
  },
  hi: {
    eyebrow: "दो कुंडलियाँ मिलाएँ",
    title: "कुंडली मिलान",
    subtitle: "पुराने भारतीय तरीके से देखें कि दो लोग कितने मिलते हैं। हम 8 हिस्से देखते हैं और 36 में से अंक देते हैं।",
    person1: "आप",
    person2: "आपके साथी",
    bride: "वधू",
    groom: "वर",
    fromProfile: "आपकी सेव की हुई जन्म जानकारी से",
    change: "बदलें",
    noProfile: "सुझाव: एक बार अपनी जन्म जानकारी सेव करें, अगली बार हम खुद भर देंगे।",
    noProfileCta: "मेरी जानकारी सेव करें",
    fields: {
      name: "नाम",
      namePh: "जैसे: रोहन वर्मा",
      gender: "लिंग",
      female: "महिला",
      male: "पुरुष",
      date: "जन्म तिथि",
      time: "जन्म का समय",
      timeUnknown: "जन्म का समय नहीं पता",
      timeUnknownNote: "कोई बात नहीं। मिलान चंद्रमा से होता है, जो समय के बिना भी सही रहता है।",
      place: "जन्म स्थान",
      placePh: "शहर या गाँव का नाम लिखें",
      pickPlace: "लिस्ट से जगह चुनें",
      placeFound: "जगह मिल गई",
    },
    needName: (who) => `"${who}" का नाम लिखें।`,
    needDate: (who) => `"${who}" की जन्म तिथि चुनें।`,
    needTime: (who) => `"${who}" का जन्म समय लिखें, या "जन्म का समय नहीं पता" पर टिक करें।`,
    needPlace: (who) => `"${who}" का जन्म स्थान लिस्ट से चुनें।`,
    check: "मिलान देखें",
    editDetails: "जानकारी बदलें",
    lagna: (sign) => `${sign} लग्न`,
    lagnaUnknown: "जन्म समय नहीं पता",
    moonLine: (nakshatra, sign) => `${nakshatra} • ${sign} राशि`,
    manglikChip: { none: "मंगल दोष नहीं", balanced: "मंगल बराबर", one: "मंगल: थोड़ा देखें" },
    gunas: "गुण",
    outOf: "/ 36",
    verdict: {
      great: { label: "बहुत अच्छा मिलान", body: "36 में से 28 या ज़्यादा। परंपरा में इसे बहुत सुखी जोड़ी माना जाता है।" },
      good: { label: "अच्छा मिलान", body: "36 में से 18 से 27। परंपरा कहती है 18 या ज़्यादा अच्छा है। छोटी कमियाँ आम हैं।" },
      care: { label: "थोड़ा ध्यान चाहिए", body: "36 में से 18 से कम। इसका मतलब \"ना\" नहीं है। कई जोड़े आसान उपाय और पंडित जी की सलाह से इसे संतुलित करते हैं।" },
    },
    percent: (p) => `${p}% मिलान`,
    groups: { mind: "मन", body: "शरीर और सेहत", luck: "किस्मत और परिवार" },
    status: { full: "पूरा मेल", good: "अच्छा", some: "थोड़ा मेल", low: "कम" },
    method: "अष्टकूट • 8 हिस्से",
    methodNote: "लाहिड़ी विधि",
    kootasTitle: "मिलान के 8 हिस्से",
    kootasCount: "8 हिस्से",
    kootas: {
      varna: { name: "वर्ण", short: "काम और सम्मान", meaning: "आप एक-दूसरे के काम करने के तरीके का कितना सम्मान करते हैं।" },
      vashya: { name: "वश्य", short: "आकर्षण", meaning: "आप एक-दूसरे की ओर कितना खिंचते हैं और एक-दूसरे की बात मानते हैं।" },
      tara: { name: "तारा", short: "किस्मत और भलाई", meaning: "आपके जन्म नक्षत्र एक-दूसरे की किस्मत और सेहत में कितना साथ देते हैं।" },
      yoni: { name: "योनि", short: "नज़दीकी", meaning: "जोड़ी के रूप में आप कितना सहज और करीब महसूस करते हैं।" },
      maitri: { name: "ग्रह मैत्री", short: "दोस्ती", meaning: "क्या आपकी सोच अच्छे दोस्तों की तरह मिलती है।" },
      gana: { name: "गण", short: "स्वभाव", meaning: "क्या आपका स्वभाव और रोज़ की आदतें मेल खाती हैं।" },
      bhakoot: { name: "भकूट", short: "प्यार और परिवार की बढ़त", meaning: "साथ में प्यार, पैसा और परिवार की खुशी।" },
      nadi: { name: "नाड़ी", short: "सेहत और वंश", meaning: "परंपरा के अनुसार सेहत और आगे चलकर बच्चे।" },
    },
    doshaTitle: "किन बातों पर ध्यान दें",
    noDosha: "नाड़ी या भकूट दोष नहीं है। ये दो बड़े हिस्से अच्छे से मिलते हैं।",
    remedyTag: "आसान उपाय",
    easyFix: "संतुलित हो सकता है",
    nadi: {
      title: "नाड़ी दोष",
      body: "आप दोनों की नाड़ी एक ही है। परंपरा इसे सेहत और बच्चों के लिए छोटा बेमेल मानती है। परिवार अक्सर एक आसान पूजा से इसे संतुलित करते हैं।",
      softened: "अच्छी खबर: आपके चंद्र नक्षत्र ऐसे हैं कि परंपरा के अनुसार यह दोष काफ़ी हल्का हो जाता है।",
      remedy: "महामृत्युंजय मंत्र का जाप करें या नाड़ी दोष पूजा कराएँ। ज़रूरतमंदों को खाना या अनाज दें।",
    },
    bhakoot: {
      title: "भकूट दोष",
      body: (pair) => `आपकी चंद्र राशियाँ ${pair} की स्थिति में हैं। परंपरा इसे पैसे या परिवार में छोटे उतार-चढ़ाव से जोड़ती है।`,
      softened: "आपकी चंद्र राशियों के स्वामी दोस्त हैं, इसलिए परंपरा के अनुसार यह काफ़ी हद तक पहले से संतुलित है।",
      remedy: "शिव और पार्वती की साथ में पूजा करें, और शादी से पहले एक छोटी पूजा कराएँ।",
    },
    manglik: {
      title: "मंगल दोष (मांगलिक)",
      intro: "जब मंगल कुंडली के कुछ घरों में होता है, तो उसे मांगलिक कहते हैं। यह बहुत आम है।",
      level: { none: "मांगलिक नहीं", mild: "थोड़ा मांगलिक", full: "मांगलिक" },
      match: {
        none: "आप दोनों में से कोई मांगलिक नहीं है। यहाँ कुछ करने की ज़रूरत नहीं।",
        balanced: "आप दोनों मांगलिक हैं। परंपरा कहती है इससे दोष बराबर हो जाता है। यह अच्छा है।",
        one: (name) => `सिर्फ़ ${name} मांगलिक हैं। कई परिवार इसे संतुलित करने के लिए बस मंगल पूजा कराते हैं।`,
      },
      softened: "मंगल अपनी या मज़बूत राशि में है, इससे यह हल्का हो जाता है।",
      lagnaUnknown: "जन्म समय नहीं पता, इसलिए हमने सिर्फ़ चंद्रमा से देखा।",
      remedy: "मंगलवार को हनुमान चालीसा पढ़ें, या मंगल शांति पूजा कराएँ।",
    },
    aiTitle: "पंडित जी की राय",
    aiBadge: "छोटा सार",
    aiSummary: ({ p1, p2, total, best, weak }) =>
      `${p1} और ${p2} के 36 में से ${total} गुण मिलते हैं। सबसे मज़बूत हिस्सा है ${best}।` +
      (weak ? ` ${weak} पर थोड़ा ज़्यादा ध्यान दें।` : " सभी बड़े हिस्से ठीक दिखते हैं।"),
    aiCta: "इस मिलान के बारे में पंडित जी से पूछें",
    panditCta: "उपाय के लिए पंडित जी से बात करें",
    another: "दूसरा मिलान देखें",
    footer: "कुंडली मिलान एक पुरानी परंपरा है जो राह दिखाती है। भरोसा, देखभाल और खुलकर बात करना सबसे ज़रूरी है।",
  },
  hinglish: {
    eyebrow: "Do kundli milao",
    title: "Kundli Milan",
    subtitle: "Purane Indian tareeke se dekho ki do log kitna milte hain. Hum 8 hisse dekhte hain aur 36 mein se points dete hain.",
    person1: "Aap",
    person2: "Aapke partner",
    bride: "Vadhu",
    groom: "Var",
    fromProfile: "Aapki saved janam details se",
    change: "Badlo",
    noProfile: "Tip: ek baar apni janam details save karo, agli baar hum khud bhar denge.",
    noProfileCta: "Meri details save karo",
    fields: {
      name: "Naam",
      namePh: "Jaise: Rohan Verma",
      gender: "Gender",
      female: "Female",
      male: "Male",
      date: "Janam tithi",
      time: "Janam ka time",
      timeUnknown: "Janam ka time nahi pata",
      timeUnknownNote: "Koi baat nahi. Milan Chandra se hota hai, jo time ke bina bhi sahi rehta hai.",
      place: "Janam sthan",
      placePh: "Shehar ya gaon ka naam likho",
      pickPlace: "List se jagah chuno",
      placeFound: "Jagah mil gayi",
    },
    needName: (who) => `"${who}" ka naam likho.`,
    needDate: (who) => `"${who}" ki janam tithi chuno.`,
    needTime: (who) => `"${who}" ka janam time likho, ya "Janam ka time nahi pata" par tick karo.`,
    needPlace: (who) => `"${who}" ka janam sthan list se chuno.`,
    check: "Milan dekho",
    editDetails: "Details badlo",
    lagna: (sign) => `${sign} Lagna`,
    lagnaUnknown: "Janam time nahi pata",
    moonLine: (nakshatra, sign) => `${nakshatra} • ${sign} Rashi`,
    manglikChip: { none: "Mangal dosh nahi", balanced: "Mangal barabar", one: "Mangal: thoda dekho" },
    gunas: "Gun",
    outOf: "/ 36",
    verdict: {
      great: { label: "Bahut achha milan", body: "36 mein se 28 ya zyada. Parampara mein ise bahut sukhi jodi maana jaata hai." },
      good: { label: "Achha milan", body: "36 mein se 18 se 27. Parampara kehti hai 18 ya zyada achha hai. Chhoti kamiyan normal hain." },
      care: { label: "Thoda dhyan chahiye", body: "36 mein se 18 se kam. Iska matlab \"na\" nahi hai. Kai jode aasan upay aur Pandit ji ki salah se ise balance karte hain." },
    },
    percent: (p) => `${p}% milan`,
    groups: { mind: "Mann", body: "Sharir aur sehat", luck: "Kismat aur parivar" },
    status: { full: "Poora mel", good: "Achha", some: "Thoda mel", low: "Kam" },
    method: "Ashtakoot • 8 hisse",
    methodNote: "Lahiri vidhi",
    kootasTitle: "Milan ke 8 hisse",
    kootasCount: "8 hisse",
    kootas: {
      varna: { name: "Varna", short: "Kaam aur izzat", meaning: "Aap ek-doosre ke kaam karne ke tareeke ki kitni izzat karte ho." },
      vashya: { name: "Vashya", short: "Attraction", meaning: "Aap ek-doosre ki taraf kitna khinchte ho aur baat maante ho." },
      tara: { name: "Tara", short: "Kismat aur bhalai", meaning: "Aapke janam nakshatra ek-doosre ki kismat aur sehat mein kitna saath dete hain." },
      yoni: { name: "Yoni", short: "Nazdeeki", meaning: "Jodi ke roop mein aap kitna comfortable aur kareeb feel karte ho." },
      maitri: { name: "Graha Maitri", short: "Dosti", meaning: "Kya aapki soch achhe doston ki tarah milti hai." },
      gana: { name: "Gana", short: "Swabhav", meaning: "Kya aapka swabhav aur roz ki aadatein mel khaati hain." },
      bhakoot: { name: "Bhakoot", short: "Pyaar aur parivar ki badhat", meaning: "Saath mein pyaar, paisa aur parivar ki khushi." },
      nadi: { name: "Nadi", short: "Sehat aur vansh", meaning: "Parampara ke hisaab se sehat aur aage chalkar bachche." },
    },
    doshaTitle: "Kin baaton par dhyan do",
    noDosha: "Nadi ya Bhakoot dosh nahi hai. Ye do bade hisse achhe se milte hain.",
    remedyTag: "Aasan upay",
    easyFix: "Balance ho sakta hai",
    nadi: {
      title: "Nadi dosh",
      body: "Aap dono ki Nadi ek hi hai. Parampara ise sehat aur bachchon ke liye chhota bemel maanti hai. Parivar aksar ek aasan pooja se ise balance karte hain.",
      softened: "Achhi khabar: aapke Chandra nakshatra aise hain ki parampara ke hisaab se ye dosh kaafi halka ho jaata hai.",
      remedy: "Mahamrityunjaya mantra ka jaap karo ya Nadi dosh pooja karao. Zaroorat-mandon ko khana ya anaaj do.",
    },
    bhakoot: {
      title: "Bhakoot dosh",
      body: (pair) => `Aapki Chandra rashiyan ${pair} ki position mein hain. Parampara ise paise ya parivar mein chhote utaar-chadhaav se jodti hai.`,
      softened: "Aapki Chandra rashiyon ke swami dost hain, isliye parampara ke hisaab se ye kaafi had tak pehle se balanced hai.",
      remedy: "Shiv aur Parvati ki saath mein pooja karo, aur shaadi se pehle ek chhoti pooja karao.",
    },
    manglik: {
      title: "Mangal dosh (Manglik)",
      intro: "Jab Mangal kundli ke kuch gharon mein hota hai, to use Manglik kehte hain. Ye bahut common hai.",
      level: { none: "Manglik nahi", mild: "Thoda Manglik", full: "Manglik" },
      match: {
        none: "Aap dono mein se koi Manglik nahi hai. Yahan kuch karne ki zaroorat nahi.",
        balanced: "Aap dono Manglik ho. Parampara kehti hai isse dosh barabar ho jaata hai. Ye achha hai.",
        one: (name) => `Sirf ${name} Manglik hain. Kai parivar ise balance karne ke liye bas Mangal pooja karaate hain.`,
      },
      softened: "Mangal apni ya mazboot rashi mein hai, isse ye halka ho jaata hai.",
      lagnaUnknown: "Janam time nahi pata, isliye humne sirf Chandra se dekha.",
      remedy: "Mangalvaar ko Hanuman Chalisa padho, ya Mangal shanti pooja karao.",
    },
    aiTitle: "Pandit Jii ki raay",
    aiBadge: "Chhota saar",
    aiSummary: ({ p1, p2, total, best, weak }) =>
      `${p1} aur ${p2} ke 36 mein se ${total} gun milte hain. Sabse mazboot hissa hai ${best}.` +
      (weak ? ` ${weak} par thoda zyada dhyan do.` : " Saare bade hisse theek dikhte hain."),
    aiCta: "Is milan ke baare mein Pandit Jii se poochho",
    panditCta: "Upay ke liye Pandit ji se baat karo",
    another: "Doosra milan dekho",
    footer: "Kundli Milan ek purani parampara hai jo raah dikhaati hai. Bharosa, care aur khulkar baat karna sabse zaroori hai.",
  },
  kn: {
    eyebrow: "ಎರಡು ಜಾತಕ ಹೊಂದಿಸಿ",
    title: "ಜಾತಕ ಹೊಂದಾಣಿಕೆ",
    subtitle: "ಹಳೆಯ ಭಾರತೀಯ ರೀತಿಯಲ್ಲಿ ಇಬ್ಬರು ಎಷ್ಟು ಹೊಂದುತ್ತಾರೆ ನೋಡಿ. ನಾವು 8 ಭಾಗ ನೋಡಿ 36ರಲ್ಲಿ ಅಂಕ ಕೊಡುತ್ತೇವೆ.",
    person1: "ನೀವು",
    person2: "ನಿಮ್ಮ ಸಂಗಾತಿ",
    bride: "ವಧು",
    groom: "ವರ",
    fromProfile: "ನೀವು ಉಳಿಸಿದ ಜನ್ಮ ವಿವರದಿಂದ",
    change: "ಬದಲಿಸಿ",
    noProfile: "ಸಲಹೆ: ಒಮ್ಮೆ ನಿಮ್ಮ ಜನ್ಮ ವಿವರ ಉಳಿಸಿ, ಮುಂದಿನ ಸಲ ನಾವೇ ತುಂಬುತ್ತೇವೆ.",
    noProfileCta: "ನನ್ನ ವಿವರ ಉಳಿಸಿ",
    fields: {
      name: "ಹೆಸರು",
      namePh: "ಉದಾ: ರೋಹನ್ ವರ್ಮಾ",
      gender: "ಲಿಂಗ",
      female: "ಹೆಣ್ಣು",
      male: "ಗಂಡು",
      date: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
      time: "ಹುಟ್ಟಿದ ಸಮಯ",
      timeUnknown: "ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ",
      timeUnknownNote: "ಪರವಾಗಿಲ್ಲ. ಹೊಂದಾಣಿಕೆ ಚಂದ್ರನಿಂದ ಆಗುತ್ತದೆ, ಸಮಯ ಇಲ್ಲದಿದ್ದರೂ ಸರಿಯಾಗಿರುತ್ತದೆ.",
      place: "ಹುಟ್ಟಿದ ಸ್ಥಳ",
      placePh: "ಊರು ಅಥವಾ ನಗರದ ಹೆಸರು ಬರೆಯಿರಿ",
      pickPlace: "ಪಟ್ಟಿಯಿಂದ ಊರು ಆರಿಸಿ",
      placeFound: "ಸ್ಥಳ ಸಿಕ್ಕಿತು",
    },
    needName: (who) => `"${who}" ಅವರ ಹೆಸರು ಬರೆಯಿರಿ.`,
    needDate: (who) => `"${who}" ಅವರ ಹುಟ್ಟಿದ ದಿನಾಂಕ ಆರಿಸಿ.`,
    needTime: (who) => `"${who}" ಅವರ ಹುಟ್ಟಿದ ಸಮಯ ಬರೆಯಿರಿ, ಅಥವಾ "ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ" ಗುರುತು ಮಾಡಿ.`,
    needPlace: (who) => `"${who}" ಅವರ ಹುಟ್ಟಿದ ಊರನ್ನು ಪಟ್ಟಿಯಿಂದ ಆರಿಸಿ.`,
    check: "ಹೊಂದಾಣಿಕೆ ನೋಡಿ",
    editDetails: "ವಿವರ ಬದಲಿಸಿ",
    lagna: (sign) => `${sign} ಲಗ್ನ`,
    lagnaUnknown: "ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ",
    moonLine: (nakshatra, sign) => `${nakshatra} • ${sign} ರಾಶಿ`,
    manglikChip: { none: "ಕುಜ ದೋಷ ಇಲ್ಲ", balanced: "ಕುಜ ಸಮವಾಗಿದೆ", one: "ಕುಜ: ಸ್ವಲ್ಪ ನೋಡಿ" },
    gunas: "ಗುಣ",
    outOf: "/ 36",
    verdict: {
      great: { label: "ತುಂಬಾ ಒಳ್ಳೆಯ ಹೊಂದಾಣಿಕೆ", body: "36ರಲ್ಲಿ 28 ಅಥವಾ ಹೆಚ್ಚು. ಸಂಪ್ರದಾಯದಲ್ಲಿ ಇದನ್ನು ತುಂಬಾ ಸಂತೋಷದ ಜೋಡಿ ಎನ್ನುತ್ತಾರೆ." },
      good: { label: "ಒಳ್ಳೆಯ ಹೊಂದಾಣಿಕೆ", body: "36ರಲ್ಲಿ 18 ರಿಂದ 27. 18 ಅಥವಾ ಹೆಚ್ಚು ಒಳ್ಳೆಯದು ಎಂದು ಸಂಪ್ರದಾಯ ಹೇಳುತ್ತದೆ. ಸಣ್ಣ ಕೊರತೆ ಸಾಮಾನ್ಯ." },
      care: { label: "ಸ್ವಲ್ಪ ಗಮನ ಬೇಕು", body: "36ರಲ್ಲಿ 18ಕ್ಕಿಂತ ಕಡಿಮೆ. ಇದರ ಅರ್ಥ \"ಬೇಡ\" ಅಲ್ಲ. ಅನೇಕ ಜೋಡಿಗಳು ಸುಲಭ ಪರಿಹಾರ ಮತ್ತು ಪಂಡಿತರ ಸಲಹೆಯಿಂದ ಇದನ್ನು ಸರಿಮಾಡುತ್ತಾರೆ." },
    },
    percent: (p) => `${p}% ಹೊಂದಾಣಿಕೆ`,
    groups: { mind: "ಮನಸ್ಸು", body: "ದೇಹ ಮತ್ತು ಆರೋಗ್ಯ", luck: "ಅದೃಷ್ಟ ಮತ್ತು ಕುಟುಂಬ" },
    status: { full: "ಪೂರ್ಣ ಹೊಂದಾಣಿಕೆ", good: "ಒಳ್ಳೆಯದು", some: "ಸ್ವಲ್ಪ ಹೊಂದಾಣಿಕೆ", low: "ಕಡಿಮೆ" },
    method: "ಅಷ್ಟಕೂಟ • 8 ಭಾಗ",
    methodNote: "ಲಾಹಿರಿ ವಿಧಾನ",
    kootasTitle: "ಹೊಂದಾಣಿಕೆಯ 8 ಭಾಗಗಳು",
    kootasCount: "8 ಭಾಗ",
    kootas: {
      varna: { name: "ವರ್ಣ", short: "ಕೆಲಸ ಮತ್ತು ಗೌರವ", meaning: "ಒಬ್ಬರ ಕೆಲಸದ ರೀತಿಯನ್ನು ಇನ್ನೊಬ್ಬರು ಎಷ್ಟು ಗೌರವಿಸುತ್ತೀರಿ." },
      vashya: { name: "ವಶ್ಯ", short: "ಆಕರ್ಷಣೆ", meaning: "ನೀವು ಒಬ್ಬರನ್ನೊಬ್ಬರು ಎಷ್ಟು ಇಷ್ಟಪಡುತ್ತೀರಿ ಮತ್ತು ಮಾತು ಕೇಳುತ್ತೀರಿ." },
      tara: { name: "ತಾರಾ", short: "ಅದೃಷ್ಟ ಮತ್ತು ಒಳಿತು", meaning: "ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರಗಳು ಒಬ್ಬರ ಅದೃಷ್ಟ ಮತ್ತು ಆರೋಗ್ಯಕ್ಕೆ ಎಷ್ಟು ಸಹಾಯ ಮಾಡುತ್ತವೆ." },
      yoni: { name: "ಯೋನಿ", short: "ಹತ್ತಿರತನ", meaning: "ಜೋಡಿಯಾಗಿ ನೀವು ಎಷ್ಟು ಆರಾಮ ಮತ್ತು ಹತ್ತಿರ ಅನಿಸುತ್ತೀರಿ." },
      maitri: { name: "ಗ್ರಹ ಮೈತ್ರಿ", short: "ಸ್ನೇಹ", meaning: "ನಿಮ್ಮ ಯೋಚನೆ ಒಳ್ಳೆಯ ಸ್ನೇಹಿತರಂತೆ ಹೊಂದುತ್ತದೆಯೇ." },
      gana: { name: "ಗಣ", short: "ಸ್ವಭಾವ", meaning: "ನಿಮ್ಮ ಸ್ವಭಾವ ಮತ್ತು ದಿನದ ಅಭ್ಯಾಸಗಳು ಹೊಂದುತ್ತವೆಯೇ." },
      bhakoot: { name: "ಭಕೂಟ", short: "ಪ್ರೀತಿ ಮತ್ತು ಕುಟುಂಬದ ಬೆಳವಣಿಗೆ", meaning: "ಒಟ್ಟಿಗೆ ಪ್ರೀತಿ, ಹಣ ಮತ್ತು ಕುಟುಂಬದ ಸಂತೋಷ." },
      nadi: { name: "ನಾಡಿ", short: "ಆರೋಗ್ಯ ಮತ್ತು ವಂಶ", meaning: "ಸಂಪ್ರದಾಯದ ಪ್ರಕಾರ ಆರೋಗ್ಯ ಮತ್ತು ಮುಂದೆ ಮಕ್ಕಳು." },
    },
    doshaTitle: "ಗಮನಿಸಬೇಕಾದ ವಿಷಯಗಳು",
    noDosha: "ನಾಡಿ ಅಥವಾ ಭಕೂಟ ದೋಷ ಇಲ್ಲ. ಈ ಎರಡು ದೊಡ್ಡ ಭಾಗಗಳು ಚೆನ್ನಾಗಿ ಹೊಂದುತ್ತವೆ.",
    remedyTag: "ಸುಲಭ ಪರಿಹಾರ",
    easyFix: "ಸರಿಮಾಡಬಹುದು",
    nadi: {
      title: "ನಾಡಿ ದೋಷ",
      body: "ನಿಮ್ಮಿಬ್ಬರ ನಾಡಿ ಒಂದೇ. ಸಂಪ್ರದಾಯ ಇದನ್ನು ಆರೋಗ್ಯ ಮತ್ತು ಮಕ್ಕಳ ವಿಷಯದಲ್ಲಿ ಸಣ್ಣ ಹೊಂದಾಣಿಕೆ ಕೊರತೆ ಎನ್ನುತ್ತದೆ. ಕುಟುಂಬಗಳು ಸುಲಭ ಪೂಜೆಯಿಂದ ಇದನ್ನು ಸರಿಮಾಡುತ್ತಾರೆ.",
      softened: "ಒಳ್ಳೆಯ ಸುದ್ದಿ: ನಿಮ್ಮ ಚಂದ್ರ ನಕ್ಷತ್ರಗಳ ಸ್ಥಾನದಿಂದ ಸಂಪ್ರದಾಯದ ಪ್ರಕಾರ ಇದು ತುಂಬಾ ಹಗುರವಾಗುತ್ತದೆ.",
      remedy: "ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಜಪಿಸಿ ಅಥವಾ ನಾಡಿ ದೋಷ ಪೂಜೆ ಮಾಡಿಸಿ. ಅಗತ್ಯ ಇರುವವರಿಗೆ ಊಟ ಅಥವಾ ಧಾನ್ಯ ಕೊಡಿ.",
    },
    bhakoot: {
      title: "ಭಕೂಟ ದೋಷ",
      body: (pair) => `ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಗಳು ${pair} ಸ್ಥಾನದಲ್ಲಿವೆ. ಸಂಪ್ರದಾಯ ಇದನ್ನು ಹಣ ಅಥವಾ ಕುಟುಂಬದಲ್ಲಿ ಸಣ್ಣ ಏರಿಳಿತಕ್ಕೆ ಜೋಡಿಸುತ್ತದೆ.`,
      softened: "ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಗಳ ಅಧಿಪತಿಗಳು ಸ್ನೇಹಿತರು, ಆದ್ದರಿಂದ ಇದು ಈಗಾಗಲೇ ಹೆಚ್ಚು ಸಮವಾಗಿದೆ.",
      remedy: "ಶಿವ ಮತ್ತು ಪಾರ್ವತಿಯನ್ನು ಒಟ್ಟಿಗೆ ಪೂಜಿಸಿ, ಮದುವೆಗೆ ಮೊದಲು ಒಂದು ಸಣ್ಣ ಪೂಜೆ ಮಾಡಿಸಿ.",
    },
    manglik: {
      title: "ಕುಜ ದೋಷ (ಮಾಂಗಲಿಕ)",
      intro: "ಕುಜ (ಮಂಗಳ) ಜಾತಕದ ಕೆಲವು ಮನೆಗಳಲ್ಲಿ ಇದ್ದರೆ ಅದನ್ನು ಕುಜ ದೋಷ ಎನ್ನುತ್ತಾರೆ. ಇದು ತುಂಬಾ ಸಾಮಾನ್ಯ.",
      level: { none: "ಕುಜ ದೋಷ ಇಲ್ಲ", mild: "ಸ್ವಲ್ಪ ಕುಜ ದೋಷ", full: "ಕುಜ ದೋಷ ಇದೆ" },
      match: {
        none: "ನಿಮ್ಮಿಬ್ಬರಲ್ಲಿ ಯಾರಿಗೂ ಕುಜ ದೋಷ ಇಲ್ಲ. ಇಲ್ಲಿ ಏನೂ ಮಾಡಬೇಕಿಲ್ಲ.",
        balanced: "ನಿಮ್ಮಿಬ್ಬರಿಗೂ ಕುಜ ದೋಷ ಇದೆ. ಇದರಿಂದ ದೋಷ ಸಮವಾಗುತ್ತದೆ ಎಂದು ಸಂಪ್ರದಾಯ ಹೇಳುತ್ತದೆ. ಇದು ಒಳ್ಳೆಯದು.",
        one: (name) => `${name} ಅವರಿಗೆ ಮಾತ್ರ ಕುಜ ದೋಷ ಇದೆ. ಅನೇಕ ಕುಟುಂಬಗಳು ಕುಜ ಪೂಜೆ ಮಾಡಿಸಿ ಇದನ್ನು ಸರಿಮಾಡುತ್ತಾರೆ.`,
      },
      softened: "ಕುಜ ತನ್ನ ಸ್ವಂತ ಅಥವಾ ಬಲವಾದ ರಾಶಿಯಲ್ಲಿದೆ, ಇದರಿಂದ ದೋಷ ಹಗುರವಾಗುತ್ತದೆ.",
      lagnaUnknown: "ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ, ಆದ್ದರಿಂದ ಚಂದ್ರನಿಂದ ಮಾತ್ರ ನೋಡಿದ್ದೇವೆ.",
      remedy: "ಮಂಗಳವಾರ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಓದಿ, ಅಥವಾ ಕುಜ ಶಾಂತಿ ಪೂಜೆ ಮಾಡಿಸಿ.",
    },
    aiTitle: "ಪಂಡಿತ್ ಜೀ ಅಭಿಪ್ರಾಯ",
    aiBadge: "ಚಿಕ್ಕ ಸಾರಾಂಶ",
    aiSummary: ({ p1, p2, total, best, weak }) =>
      `${p1} ಮತ್ತು ${p2} ಅವರಿಗೆ 36ರಲ್ಲಿ ${total} ಗುಣ ಹೊಂದುತ್ತವೆ. ಅತ್ಯಂತ ಬಲವಾದ ಭಾಗ ${best}.` +
      (weak ? ` ${weak} ಮೇಲೆ ಸ್ವಲ್ಪ ಹೆಚ್ಚು ಗಮನ ಕೊಡಿ.` : " ಎಲ್ಲಾ ದೊಡ್ಡ ಭಾಗಗಳು ಚೆನ್ನಾಗಿವೆ."),
    aiCta: "ಈ ಹೊಂದಾಣಿಕೆ ಬಗ್ಗೆ ಪಂಡಿತ್ ಜೀ ಕೇಳಿ",
    panditCta: "ಪರಿಹಾರಕ್ಕಾಗಿ ಪಂಡಿತರ ಜೊತೆ ಮಾತಾಡಿ",
    another: "ಇನ್ನೊಂದು ಹೊಂದಾಣಿಕೆ ನೋಡಿ",
    footer: "ಜಾತಕ ಹೊಂದಾಣಿಕೆ ದಾರಿ ತೋರಿಸುವ ಹಳೆಯ ಸಂಪ್ರದಾಯ. ನಂಬಿಕೆ, ಕಾಳಜಿ ಮತ್ತು ಮುಕ್ತವಾಗಿ ಮಾತಾಡುವುದು ಎಲ್ಲಕ್ಕಿಂತ ಮುಖ್ಯ.",
  },
});
