import type { Dignity, Planet } from "../lib/astro";
import { defineDict } from ".";

type AstroTerms = {
  /** Three simple traits traditionally linked with each sign, Aries first. */
  signTraits: string[];
  /** What each house (1st to 12th) looks after. */
  houses: string[];
  dignity: Record<Dignity, string>;
  weekday: Record<Planet, string>;
  /** Two-letter planet marks drawn inside the chart. */
  planetShort: Record<Planet, string>;
  houseLabel: (n: number) => string;
};

/** Short beej-style name mantras, the same in every language. */
export const PLANET_MANTRAS: Record<Planet, { devanagari: string; roman: string }> = {
  Sun: { devanagari: "ॐ सूर्याय नमः", roman: "Om Suryaya Namah" },
  Moon: { devanagari: "ॐ चन्द्राय नमः", roman: "Om Chandraya Namah" },
  Mars: { devanagari: "ॐ मङ्गलाय नमः", roman: "Om Mangalaya Namah" },
  Mercury: { devanagari: "ॐ बुधाय नमः", roman: "Om Budhaya Namah" },
  Jupiter: { devanagari: "ॐ गुरवे नमः", roman: "Om Gurave Namah" },
  Venus: { devanagari: "ॐ शुक्राय नमः", roman: "Om Shukraya Namah" },
  Saturn: { devanagari: "ॐ शनैश्चराय नमः", roman: "Om Shanaishcharaya Namah" },
  Rahu: { devanagari: "ॐ राहवे नमः", roman: "Om Rahave Namah" },
  Ketu: { devanagari: "ॐ केतवे नमः", roman: "Om Ketave Namah" },
};

export const astroTerms = defineDict<AstroTerms>({
  en: {
    signTraits: [
      "brave, quick and full of energy", "calm, steady and loves comfort", "curious, chatty and quick to learn", "caring, emotional and loves home",
      "proud, warm and a natural leader", "careful, helpful and neat", "fair, friendly and loves beauty", "deep, strong-willed and private",
      "hopeful, honest and loves to learn", "hard-working, patient and practical", "independent, kind and full of new ideas", "gentle, kind and imaginative",
    ],
    houses: [
      "you, your body and nature", "money, family and speech", "courage, brothers and sisters, short trips", "home, mother and peace of mind",
      "children, studies and creativity", "health, daily work and problems", "marriage and partners", "sudden changes and secrets",
      "luck, teachers and faith", "work, career and name", "income, friends and wishes", "spending, rest and spiritual life",
    ],
    dignity: {
      "Exalted (Uchha)": "Very strong", "Debilitated (Neecha)": "Weak", "Own House": "At home (strong)", Friendly: "Friendly sign",
      Neutral: "Neutral", "Enemy Sign": "Uneasy sign", "Shadow Node": "Shadow planet",
    },
    weekday: { Sun: "Sundays", Moon: "Mondays", Mars: "Tuesdays", Mercury: "Wednesdays", Jupiter: "Thursdays", Venus: "Fridays", Saturn: "Saturdays", Rahu: "Saturdays", Ketu: "Tuesdays" },
    planetShort: { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" },
    houseLabel: (n) => `House ${n}`,
  },
  hi: {
    signTraits: [
      "बहादुर, तेज़ और ऊर्जा से भरे", "शांत, स्थिर और आराम पसंद", "जिज्ञासु, बातूनी और जल्दी सीखने वाले", "ख़याल रखने वाले, भावुक और घर से प्यार",
      "स्वाभिमानी, गर्मजोश और जन्मजात नेता", "सावधान, मददगार और साफ़-सुथरे", "न्यायप्रिय, मिलनसार और सुंदरता पसंद", "गहरे, दृढ़ इच्छा वाले और निजी",
      "आशावान, ईमानदार और सीखने के शौक़ीन", "मेहनती, धैर्यवान और व्यावहारिक", "आज़ाद, दयालु और नए विचारों वाले", "कोमल, दयालु और कल्पनाशील",
    ],
    houses: [
      "आप, आपका शरीर और स्वभाव", "पैसा, परिवार और वाणी", "हिम्मत, भाई-बहन और छोटी यात्राएँ", "घर, माँ और मन की शांति",
      "संतान, पढ़ाई और रचनात्मकता", "सेहत, रोज़ का काम और परेशानियाँ", "शादी और साथी", "अचानक बदलाव और राज़",
      "भाग्य, गुरु और आस्था", "काम, करियर और नाम", "कमाई, दोस्त और इच्छाएँ", "ख़र्च, आराम और आध्यात्मिक जीवन",
    ],
    dignity: {
      "Exalted (Uchha)": "बहुत मज़बूत (उच्च)", "Debilitated (Neecha)": "कमज़ोर (नीच)", "Own House": "अपने घर में (मज़बूत)", Friendly: "मित्र राशि",
      Neutral: "सामान्य", "Enemy Sign": "शत्रु राशि", "Shadow Node": "छाया ग्रह",
    },
    weekday: { Sun: "रविवार", Moon: "सोमवार", Mars: "मंगलवार", Mercury: "बुधवार", Jupiter: "गुरुवार", Venus: "शुक्रवार", Saturn: "शनिवार", Rahu: "शनिवार", Ketu: "मंगलवार" },
    planetShort: { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" },
    houseLabel: (n) => `भाव ${n}`,
  },
  hinglish: {
    signTraits: [
      "bahadur, tez aur energy se bhare", "shaant, sthir aur aaram pasand", "jigyasu, baatooni aur jaldi seekhne wale", "khayal rakhne wale, bhavuk aur ghar se pyaar",
      "swabhimani, garamjosh aur janmajaat leader", "savdhaan, madadgaar aur saaf-suthre", "nyaypriya, milansaar aur sundarta pasand", "gehre, dridh ichha wale aur private",
      "aashawaan, imaandaar aur seekhne ke shaukeen", "mehnati, dhairyawaan aur practical", "azaad, dayalu aur naye vichaaron wale", "komal, dayalu aur kalpanasheel",
    ],
    houses: [
      "aap, aapka shareer aur swabhaav", "paisa, parivaar aur vaani", "himmat, bhai-behen aur chhoti yatrayein", "ghar, maa aur mann ki shanti",
      "santaan, padhai aur creativity", "sehat, roz ka kaam aur pareshaniyan", "shaadi aur saathi", "achanak badlav aur raaz",
      "bhagya, guru aur aastha", "kaam, career aur naam", "kamaai, dost aur ichhayein", "kharch, aaram aur adhyatmik jeevan",
    ],
    dignity: {
      "Exalted (Uchha)": "Bahut mazboot (Uchha)", "Debilitated (Neecha)": "Kamzor (Neecha)", "Own House": "Apne ghar mein (mazboot)", Friendly: "Mitra rashi",
      Neutral: "Normal", "Enemy Sign": "Shatru rashi", "Shadow Node": "Chhaya grah",
    },
    weekday: { Sun: "Ravivaar", Moon: "Somvaar", Mars: "Mangalvaar", Mercury: "Budhvaar", Jupiter: "Guruvaar", Venus: "Shukravaar", Saturn: "Shanivaar", Rahu: "Shanivaar", Ketu: "Mangalvaar" },
    planetShort: { Sun: "Su", Moon: "Ch", Mars: "Ma", Mercury: "Bu", Jupiter: "Gu", Venus: "Sh", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" },
    houseLabel: (n) => `Bhaav ${n}`,
  },
  kn: {
    signTraits: [
      "ಧೈರ್ಯಶಾಲಿ, ಚುರುಕು ಮತ್ತು ಶಕ್ತಿಯುತ", "ಶಾಂತ, ಸ್ಥಿರ ಮತ್ತು ಸುಖ ಇಷ್ಟಪಡುವವರು", "ಕುತೂಹಲಿ, ಮಾತುಗಾರ ಮತ್ತು ಬೇಗ ಕಲಿಯುವವರು", "ಕಾಳಜಿಯುಳ್ಳ, ಭಾವುಕ ಮತ್ತು ಮನೆ ಪ್ರೀತಿಸುವವರು",
      "ಸ್ವಾಭಿಮಾನಿ, ಆತ್ಮೀಯ ಮತ್ತು ಹುಟ್ಟು ನಾಯಕ", "ಜಾಗರೂಕ, ಸಹಾಯಕ ಮತ್ತು ಅಚ್ಚುಕಟ್ಟು", "ನ್ಯಾಯಪ್ರಿಯ, ಸ್ನೇಹಪರ ಮತ್ತು ಸೌಂದರ್ಯ ಪ್ರೇಮಿ", "ಆಳವಾದ, ದೃಢ ಮನಸ್ಸಿನ ಮತ್ತು ಖಾಸಗಿ",
      "ಆಶಾವಾದಿ, ಪ್ರಾಮಾಣಿಕ ಮತ್ತು ಕಲಿಯಲು ಇಷ್ಟ", "ಶ್ರಮಜೀವಿ, ತಾಳ್ಮೆಯುಳ್ಳ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ", "ಸ್ವತಂತ್ರ, ದಯಾಳು ಮತ್ತು ಹೊಸ ಆಲೋಚನೆಗಳ", "ಮೃದು, ದಯಾಳು ಮತ್ತು ಕಲ್ಪನಾಶೀಲ",
    ],
    houses: [
      "ನೀವು, ನಿಮ್ಮ ದೇಹ ಮತ್ತು ಸ್ವಭಾವ", "ಹಣ, ಕುಟುಂಬ ಮತ್ತು ಮಾತು", "ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು ಮತ್ತು ಸಣ್ಣ ಪ್ರಯಾಣ", "ಮನೆ, ತಾಯಿ ಮತ್ತು ಮನಶಾಂತಿ",
      "ಮಕ್ಕಳು, ಓದು ಮತ್ತು ಸೃಜನಶೀಲತೆ", "ಆರೋಗ್ಯ, ದಿನದ ಕೆಲಸ ಮತ್ತು ತೊಂದರೆಗಳು", "ಮದುವೆ ಮತ್ತು ಸಂಗಾತಿ", "ಹಠಾತ್ ಬದಲಾವಣೆ ಮತ್ತು ರಹಸ್ಯಗಳು",
      "ಅದೃಷ್ಟ, ಗುರು ಮತ್ತು ನಂಬಿಕೆ", "ಕೆಲಸ, ವೃತ್ತಿ ಮತ್ತು ಹೆಸರು", "ಆದಾಯ, ಸ್ನೇಹಿತರು ಮತ್ತು ಆಸೆಗಳು", "ಖರ್ಚು, ವಿಶ್ರಾಂತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜೀವನ",
    ],
    dignity: {
      "Exalted (Uchha)": "ತುಂಬಾ ಬಲ (ಉಚ್ಚ)", "Debilitated (Neecha)": "ದುರ್ಬಲ (ನೀಚ)", "Own House": "ಸ್ವಕ್ಷೇತ್ರ (ಬಲ)", Friendly: "ಮಿತ್ರ ರಾಶಿ",
      Neutral: "ಸಾಮಾನ್ಯ", "Enemy Sign": "ಶತ್ರು ರಾಶಿ", "Shadow Node": "ಛಾಯಾ ಗ್ರಹ",
    },
    weekday: { Sun: "ಭಾನುವಾರ", Moon: "ಸೋಮವಾರ", Mars: "ಮಂಗಳವಾರ", Mercury: "ಬುಧವಾರ", Jupiter: "ಗುರುವಾರ", Venus: "ಶುಕ್ರವಾರ", Saturn: "ಶನಿವಾರ", Rahu: "ಶನಿವಾರ", Ketu: "ಮಂಗಳವಾರ" },
    planetShort: { Sun: "ಸೂ", Moon: "ಚಂ", Mars: "ಕು", Mercury: "ಬು", Jupiter: "ಗು", Venus: "ಶು", Saturn: "ಶ", Rahu: "ರಾ", Ketu: "ಕೇ" },
    houseLabel: (n) => `${n}ನೇ ಭಾವ`,
  },
});
