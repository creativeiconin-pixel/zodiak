import { defineDict } from "..";
import type { Hand, PalmLineKey, PalmMountKey, RetakeReason } from "../../lib/palmApi";

type Copy = {
  eyebrow: string;
  title: string;
  intro: string;
  hudLabel: string;
  hudReady: string;
  hudScanning: string;
  hudDone: string;
  hudRetake: string;
  sample: string;
  handLabel: string;
  hands: Record<Hand, string>;
  handHint: string;
  takePhoto: string;
  choosePhoto: string;
  privacy: string;
  tipsTitle: string;
  tips: string[];
  scanning: string;
  scanSteps: string[];
  summaryTitle: string;
  linesTitle: string;
  lines: Record<PalmLineKey, { name: string; hint: string }>;
  lineSeen: string;
  lineFaint: string;
  mountsTitle: string;
  mountsHint: string;
  mounts: Record<PalmMountKey, { name: string; where: string }>;
  strength: Record<"strong" | "medium" | "soft", string>;
  tipTitle: string;
  confidenceTitle: string;
  confidence: Record<"low" | "moderate" | "high", string>;
  note: string;
  readAgain: string;
  retakeTitle: string;
  retakeReasons: Record<RetakeReason, string>;
  tryAgain: string;
  guestTitle: string;
  guestBody: string;
  signIn: string;
  notReadyTitle: string;
  busy: string;
  photoError: string;
  historyTitle: string;
  historyItem: (hand: string, date: string) => string;
};

export const palmistryText = defineDict<Copy>({
  en: {
    eyebrow: "AI Palm Reading",
    title: "Read your palm",
    intro: "Take a photo of your open hand. Our AI looks at your main lines and tells you what they mean in old Indian palm reading.",
    hudLabel: "Palm scanner",
    hudReady: "Ready",
    hudScanning: "Scanning",
    hudDone: "Done",
    hudRetake: "Try again",
    sample: "Sample palm",
    handLabel: "Which hand?",
    hands: { left: "Left hand", right: "Right hand" },
    handHint: "Most people choose the hand they write with.",
    takePhoto: "Take photo",
    choosePhoto: "Choose photo",
    privacy: "Your photo is not saved. We only keep the reading.",
    tipsTitle: "Tips for a good photo",
    tips: [
      "Open your hand flat. Keep fingers a little apart.",
      "Use bright light, like near a window.",
      "Show the whole palm, from wrist to fingers.",
      "Hold the phone still so the photo is sharp.",
    ],
    scanning: "Reading your palm...",
    scanSteps: ["Looking at your photo", "Finding your lines", "Writing your reading"],
    summaryTitle: "Your palm in short",
    linesTitle: "Your 4 main lines",
    lines: {
      life: { name: "Life line", hint: "Shows energy and big life changes, not how long you live." },
      head: { name: "Head line", hint: "Shows how you think, learn and decide." },
      heart: { name: "Heart line", hint: "Shows feelings, love and friends." },
      fate: { name: "Fate line", hint: "Shows work and direction. Many people have a faint one, and that is okay." },
    },
    lineSeen: "Seen clearly",
    lineFaint: "Hard to see",
    mountsTitle: "Mounts that stand out",
    mountsHint: "Mounts are the soft, raised pads on your palm.",
    mounts: {
      jupiter: { name: "Jupiter (Guru)", where: "Below the first finger" },
      saturn: { name: "Saturn (Shani)", where: "Below the middle finger" },
      sun: { name: "Sun (Surya)", where: "Below the ring finger" },
      mercury: { name: "Mercury (Budh)", where: "Below the little finger" },
      venus: { name: "Venus (Shukra)", where: "At the base of the thumb" },
      moon: { name: "Moon (Chandra)", where: "Edge of the palm, near the wrist" },
      mars: { name: "Mars (Mangal)", where: "Middle sides of the palm" },
    },
    strength: { strong: "Strong", medium: "Medium", soft: "Soft" },
    tipTitle: "Try this week",
    confidenceTitle: "How clear was the photo?",
    confidence: { low: "Not very clear. Some lines were hard to see.", moderate: "Clear enough for a good reading.", high: "Very clear." },
    note: "Palm reading is an old tradition, not a promise. It shows tendencies, not a fixed future.",
    readAgain: "Read another photo",
    retakeTitle: "Let's take another photo",
    retakeReasons: {
      too_dark: "The photo is too dark.",
      blurry: "The photo is blurry.",
      not_a_palm: "We could not see an open palm.",
      fingers_closed: "Your fingers look closed.",
      hand_cut_off: "Part of your palm is cut off.",
      unclear: "We could not read this photo.",
    },
    tryAgain: "Try again",
    guestTitle: "Sign in to read your palm",
    guestBody: "Sign in with your phone number. It is free, and your readings are kept safe for you.",
    signIn: "Sign in",
    notReadyTitle: "Palm reading is resting",
    busy: "You have read many palms just now. Please wait a minute and try again.",
    photoError: "We could not open this photo. Please choose a JPG or PNG photo.",
    historyTitle: "Your past readings",
    historyItem: (hand, date) => `${hand} • ${date}`,
  },
  hi: {
    eyebrow: "AI हस्तरेखा",
    title: "अपनी हथेली पढ़वाएँ",
    intro: "अपने खुले हाथ की फ़ोटो लें। हमारा AI आपकी मुख्य रेखाएँ देखकर बताता है कि पुराने भारतीय हस्तरेखा शास्त्र में उनका क्या मतलब है।",
    hudLabel: "हथेली स्कैनर",
    hudReady: "तैयार",
    hudScanning: "स्कैन हो रहा है",
    hudDone: "हो गया",
    hudRetake: "फिर से लें",
    sample: "नमूना हथेली",
    handLabel: "कौन-सा हाथ?",
    hands: { left: "बायाँ हाथ", right: "दायाँ हाथ" },
    handHint: "ज़्यादातर लोग वह हाथ चुनते हैं जिससे वे लिखते हैं।",
    takePhoto: "फ़ोटो लें",
    choosePhoto: "फ़ोटो चुनें",
    privacy: "आपकी फ़ोटो सेव नहीं होती। हम सिर्फ़ रीडिंग रखते हैं।",
    tipsTitle: "अच्छी फ़ोटो के लिए सुझाव",
    tips: [
      "हाथ सीधा खोलें। उँगलियाँ थोड़ी अलग रखें।",
      "अच्छी रोशनी में फ़ोटो लें, जैसे खिड़की के पास।",
      "पूरी हथेली दिखाएँ, कलाई से उँगलियों तक।",
      "फ़ोन स्थिर रखें ताकि फ़ोटो साफ़ आए।",
    ],
    scanning: "आपकी हथेली पढ़ी जा रही है...",
    scanSteps: ["फ़ोटो देख रहे हैं", "रेखाएँ ढूँढ रहे हैं", "रीडिंग लिख रहे हैं"],
    summaryTitle: "आपकी हथेली, थोड़े में",
    linesTitle: "आपकी 4 मुख्य रेखाएँ",
    lines: {
      life: { name: "जीवन रेखा", hint: "ऊर्जा और जीवन के बड़े बदलाव दिखाती है, उम्र नहीं।" },
      head: { name: "मस्तिष्क रेखा", hint: "दिखाती है कि आप कैसे सोचते, सीखते और फ़ैसले लेते हैं।" },
      heart: { name: "हृदय रेखा", hint: "भावनाएँ, प्यार और दोस्ती दिखाती है।" },
      fate: { name: "भाग्य रेखा", hint: "काम और जीवन की दिशा दिखाती है। कई लोगों में यह हल्की होती है, और यह ठीक है।" },
    },
    lineSeen: "साफ़ दिखी",
    lineFaint: "ठीक से नहीं दिखी",
    mountsTitle: "उभरे हुए पर्वत",
    mountsHint: "पर्वत हथेली पर बने मुलायम, उभरे हुए हिस्से हैं।",
    mounts: {
      jupiter: { name: "गुरु पर्वत", where: "पहली उँगली के नीचे" },
      saturn: { name: "शनि पर्वत", where: "बीच वाली उँगली के नीचे" },
      sun: { name: "सूर्य पर्वत", where: "अनामिका (रिंग फ़िंगर) के नीचे" },
      mercury: { name: "बुध पर्वत", where: "छोटी उँगली के नीचे" },
      venus: { name: "शुक्र पर्वत", where: "अँगूठे की जड़ में" },
      moon: { name: "चंद्र पर्वत", where: "हथेली के किनारे, कलाई के पास" },
      mars: { name: "मंगल पर्वत", where: "हथेली के बीच के दोनों किनारे" },
    },
    strength: { strong: "मज़बूत", medium: "मध्यम", soft: "हल्का" },
    tipTitle: "इस हफ़्ते यह करें",
    confidenceTitle: "फ़ोटो कितनी साफ़ थी?",
    confidence: { low: "बहुत साफ़ नहीं। कुछ रेखाएँ ठीक से नहीं दिखीं।", moderate: "अच्छी रीडिंग के लिए काफ़ी साफ़।", high: "बहुत साफ़।" },
    note: "हस्तरेखा एक पुरानी परंपरा है, वादा नहीं। यह झुकाव दिखाती है, पक्का भविष्य नहीं।",
    readAgain: "दूसरी फ़ोटो पढ़वाएँ",
    retakeTitle: "चलिए, एक और फ़ोटो लेते हैं",
    retakeReasons: {
      too_dark: "फ़ोटो बहुत अँधेरी है।",
      blurry: "फ़ोटो धुंधली है।",
      not_a_palm: "हमें खुली हथेली नहीं दिखी।",
      fingers_closed: "आपकी उँगलियाँ बंद लग रही हैं।",
      hand_cut_off: "हथेली का कुछ हिस्सा कट गया है।",
      unclear: "हम यह फ़ोटो नहीं पढ़ पाए।",
    },
    tryAgain: "फिर से कोशिश करें",
    guestTitle: "हथेली पढ़वाने के लिए साइन इन करें",
    guestBody: "अपने फ़ोन नंबर से साइन इन करें। यह मुफ़्त है, और आपकी रीडिंग आपके लिए सुरक्षित रखी जाती है।",
    signIn: "साइन इन",
    notReadyTitle: "हस्तरेखा अभी आराम कर रही है",
    busy: "आपने अभी बहुत सारी फ़ोटो भेजी हैं। एक मिनट रुककर फिर कोशिश करें।",
    photoError: "हम यह फ़ोटो नहीं खोल पाए। कृपया JPG या PNG फ़ोटो चुनें।",
    historyTitle: "आपकी पिछली रीडिंग",
    historyItem: (hand, date) => `${hand} • ${date}`,
  },
  hinglish: {
    eyebrow: "AI Palm Reading",
    title: "Apni hatheli padhwao",
    intro: "Apne khule haath ki photo lo. Hamara AI aapki main rekhayein dekhkar batata hai ki purane Indian hast rekha shastra mein unka kya matlab hai.",
    hudLabel: "Palm scanner",
    hudReady: "Ready",
    hudScanning: "Scan ho raha hai",
    hudDone: "Ho gaya",
    hudRetake: "Phir se lo",
    sample: "Sample hatheli",
    handLabel: "Kaunsa haath?",
    hands: { left: "Left haath", right: "Right haath" },
    handHint: "Zyada log woh haath chunte hain jisse woh likhte hain.",
    takePhoto: "Photo lo",
    choosePhoto: "Photo chuno",
    privacy: "Aapki photo save nahi hoti. Hum sirf reading rakhte hain.",
    tipsTitle: "Achhi photo ke liye tips",
    tips: [
      "Haath seedha kholo. Ungliyan thodi alag rakho.",
      "Achhi roshni mein photo lo, jaise khidki ke paas.",
      "Poori hatheli dikhao, kalai se ungliyon tak.",
      "Phone stable rakho taaki photo saaf aaye.",
    ],
    scanning: "Aapki hatheli padhi ja rahi hai...",
    scanSteps: ["Photo dekh rahe hain", "Rekhayein dhoondh rahe hain", "Reading likh rahe hain"],
    summaryTitle: "Aapki hatheli, short mein",
    linesTitle: "Aapki 4 main rekhayein",
    lines: {
      life: { name: "Jeevan rekha (Life line)", hint: "Energy aur life ke bade badlav dikhati hai, umar nahi." },
      head: { name: "Mastishk rekha (Head line)", hint: "Dikhati hai ki aap kaise sochte, seekhte aur decide karte ho." },
      heart: { name: "Hriday rekha (Heart line)", hint: "Feelings, pyaar aur dosti dikhati hai." },
      fate: { name: "Bhagya rekha (Fate line)", hint: "Kaam aur life ki direction dikhati hai. Kai logon mein yeh halki hoti hai, aur yeh theek hai." },
    },
    lineSeen: "Saaf dikhi",
    lineFaint: "Theek se nahi dikhi",
    mountsTitle: "Ubhre hue parvat (mounts)",
    mountsHint: "Parvat hatheli par bane soft, ubhre hue hisse hain.",
    mounts: {
      jupiter: { name: "Guru parvat (Jupiter)", where: "Pehli ungli ke neeche" },
      saturn: { name: "Shani parvat (Saturn)", where: "Beech wali ungli ke neeche" },
      sun: { name: "Surya parvat (Sun)", where: "Ring finger ke neeche" },
      mercury: { name: "Budh parvat (Mercury)", where: "Chhoti ungli ke neeche" },
      venus: { name: "Shukra parvat (Venus)", where: "Angoothe ki jad mein" },
      moon: { name: "Chandra parvat (Moon)", where: "Hatheli ke kinare, kalai ke paas" },
      mars: { name: "Mangal parvat (Mars)", where: "Hatheli ke beech ke dono kinare" },
    },
    strength: { strong: "Strong", medium: "Medium", soft: "Halka" },
    tipTitle: "Is hafte yeh karo",
    confidenceTitle: "Photo kitni saaf thi?",
    confidence: { low: "Zyada saaf nahi. Kuch rekhayein theek se nahi dikhi.", moderate: "Achhi reading ke liye kaafi saaf.", high: "Bahut saaf." },
    note: "Hast rekha ek purani parampara hai, promise nahi. Yeh jhukaav dikhati hai, pakka future nahi.",
    readAgain: "Doosri photo padhwao",
    retakeTitle: "Chalo, ek aur photo lete hain",
    retakeReasons: {
      too_dark: "Photo bahut andheri hai.",
      blurry: "Photo blurry hai.",
      not_a_palm: "Humein khuli hatheli nahi dikhi.",
      fingers_closed: "Aapki ungliyan band lag rahi hain.",
      hand_cut_off: "Hatheli ka kuch hissa kat gaya hai.",
      unclear: "Hum yeh photo nahi padh paye.",
    },
    tryAgain: "Phir se try karo",
    guestTitle: "Hatheli padhwane ke liye sign in karo",
    guestBody: "Apne phone number se sign in karo. Yeh free hai, aur aapki readings aapke liye safe rakhi jaati hain.",
    signIn: "Sign in",
    notReadyTitle: "Palm reading abhi aaram kar rahi hai",
    busy: "Aapne abhi bahut saari photos bheji hain. Ek minute ruk kar phir try karo.",
    photoError: "Hum yeh photo khol nahi paye. Please JPG ya PNG photo chuno.",
    historyTitle: "Aapki pichhli readings",
    historyItem: (hand, date) => `${hand} • ${date}`,
  },
  kn: {
    eyebrow: "AI ಹಸ್ತರೇಖೆ",
    title: "ನಿಮ್ಮ ಅಂಗೈ ಓದಿಸಿ",
    intro: "ನಿಮ್ಮ ತೆರೆದ ಕೈಯ ಫೋಟೋ ತೆಗೆಯಿರಿ. ನಮ್ಮ AI ನಿಮ್ಮ ಮುಖ್ಯ ರೇಖೆಗಳನ್ನು ನೋಡಿ, ಹಳೆಯ ಭಾರತೀಯ ಹಸ್ತರೇಖಾ ಶಾಸ್ತ್ರದಲ್ಲಿ ಅವುಗಳ ಅರ್ಥ ಹೇಳುತ್ತದೆ.",
    hudLabel: "ಅಂಗೈ ಸ್ಕ್ಯಾನರ್",
    hudReady: "ಸಿದ್ಧ",
    hudScanning: "ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ",
    hudDone: "ಮುಗಿಯಿತು",
    hudRetake: "ಮತ್ತೆ ತೆಗೆಯಿರಿ",
    sample: "ಮಾದರಿ ಅಂಗೈ",
    handLabel: "ಯಾವ ಕೈ?",
    hands: { left: "ಎಡಗೈ", right: "ಬಲಗೈ" },
    handHint: "ಹೆಚ್ಚಿನವರು ತಾವು ಬರೆಯುವ ಕೈಯನ್ನು ಆಯ್ಕೆಮಾಡುತ್ತಾರೆ.",
    takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    choosePhoto: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ",
    privacy: "ನಿಮ್ಮ ಫೋಟೋ ಉಳಿಸುವುದಿಲ್ಲ. ನಾವು ಓದಿನ ಫಲಿತಾಂಶವನ್ನು ಮಾತ್ರ ಇಡುತ್ತೇವೆ.",
    tipsTitle: "ಒಳ್ಳೆಯ ಫೋಟೋಗೆ ಸಲಹೆಗಳು",
    tips: [
      "ಕೈಯನ್ನು ನೇರವಾಗಿ ತೆರೆಯಿರಿ. ಬೆರಳುಗಳನ್ನು ಸ್ವಲ್ಪ ದೂರ ಇಡಿ.",
      "ಚೆನ್ನಾದ ಬೆಳಕಿನಲ್ಲಿ ತೆಗೆಯಿರಿ, ಕಿಟಕಿಯ ಹತ್ತಿರದಂತೆ.",
      "ಮಣಿಕಟ್ಟಿನಿಂದ ಬೆರಳುಗಳವರೆಗೆ ಇಡೀ ಅಂಗೈ ತೋರಿಸಿ.",
      "ಫೋಟೋ ಸ್ಪಷ್ಟವಾಗಲು ಫೋನ್ ಅಲುಗಾಡದಂತೆ ಹಿಡಿಯಿರಿ.",
    ],
    scanning: "ನಿಮ್ಮ ಅಂಗೈ ಓದಲಾಗುತ್ತಿದೆ...",
    scanSteps: ["ಫೋಟೋ ನೋಡುತ್ತಿದ್ದೇವೆ", "ರೇಖೆಗಳನ್ನು ಹುಡುಕುತ್ತಿದ್ದೇವೆ", "ಓದನ್ನು ಬರೆಯುತ್ತಿದ್ದೇವೆ"],
    summaryTitle: "ನಿಮ್ಮ ಅಂಗೈ, ಚಿಕ್ಕದಾಗಿ",
    linesTitle: "ನಿಮ್ಮ 4 ಮುಖ್ಯ ರೇಖೆಗಳು",
    lines: {
      life: { name: "ಜೀವ ರೇಖೆ", hint: "ಶಕ್ತಿ ಮತ್ತು ಜೀವನದ ದೊಡ್ಡ ಬದಲಾವಣೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆ, ಆಯಸ್ಸನ್ನು ಅಲ್ಲ." },
      head: { name: "ಮಸ್ತಿಷ್ಕ ರೇಖೆ", hint: "ನೀವು ಹೇಗೆ ಯೋಚಿಸುತ್ತೀರಿ, ಕಲಿಯುತ್ತೀರಿ, ತೀರ್ಮಾನಿಸುತ್ತೀರಿ ಎಂದು ತೋರಿಸುತ್ತದೆ." },
      heart: { name: "ಹೃದಯ ರೇಖೆ", hint: "ಭಾವನೆ, ಪ್ರೀತಿ ಮತ್ತು ಸ್ನೇಹವನ್ನು ತೋರಿಸುತ್ತದೆ." },
      fate: { name: "ಭಾಗ್ಯ ರೇಖೆ", hint: "ಕೆಲಸ ಮತ್ತು ಜೀವನದ ದಿಕ್ಕನ್ನು ತೋರಿಸುತ್ತದೆ. ಹಲವರಲ್ಲಿ ಇದು ಮಸುಕಾಗಿರುತ್ತದೆ, ಅದು ಸರಿಯೇ." },
    },
    lineSeen: "ಸ್ಪಷ್ಟವಾಗಿ ಕಂಡಿತು",
    lineFaint: "ಸರಿಯಾಗಿ ಕಾಣಲಿಲ್ಲ",
    mountsTitle: "ಎದ್ದು ಕಾಣುವ ಪರ್ವತಗಳು",
    mountsHint: "ಪರ್ವತಗಳು ಅಂಗೈ ಮೇಲಿನ ಮೃದುವಾದ, ಉಬ್ಬಿದ ಭಾಗಗಳು.",
    mounts: {
      jupiter: { name: "ಗುರು ಪರ್ವತ", where: "ತೋರು ಬೆರಳಿನ ಕೆಳಗೆ" },
      saturn: { name: "ಶನಿ ಪರ್ವತ", where: "ಮಧ್ಯದ ಬೆರಳಿನ ಕೆಳಗೆ" },
      sun: { name: "ಸೂರ್ಯ ಪರ್ವತ", where: "ಉಂಗುರದ ಬೆರಳಿನ ಕೆಳಗೆ" },
      mercury: { name: "ಬುಧ ಪರ್ವತ", where: "ಕಿರು ಬೆರಳಿನ ಕೆಳಗೆ" },
      venus: { name: "ಶುಕ್ರ ಪರ್ವತ", where: "ಹೆಬ್ಬೆರಳಿನ ಬುಡದಲ್ಲಿ" },
      moon: { name: "ಚಂದ್ರ ಪರ್ವತ", where: "ಅಂಗೈ ಅಂಚಿನಲ್ಲಿ, ಮಣಿಕಟ್ಟಿನ ಹತ್ತಿರ" },
      mars: { name: "ಮಂಗಳ ಪರ್ವತ", where: "ಅಂಗೈ ಮಧ್ಯದ ಎರಡೂ ಬದಿ" },
    },
    strength: { strong: "ಬಲವಾದ", medium: "ಮಧ್ಯಮ", soft: "ಮೃದು" },
    tipTitle: "ಈ ವಾರ ಇದನ್ನು ಮಾಡಿ",
    confidenceTitle: "ಫೋಟೋ ಎಷ್ಟು ಸ್ಪಷ್ಟವಾಗಿತ್ತು?",
    confidence: { low: "ಅಷ್ಟು ಸ್ಪಷ್ಟವಿಲ್ಲ. ಕೆಲವು ರೇಖೆಗಳು ಸರಿಯಾಗಿ ಕಾಣಲಿಲ್ಲ.", moderate: "ಒಳ್ಳೆಯ ಓದಿಗೆ ಸಾಕಷ್ಟು ಸ್ಪಷ್ಟ.", high: "ತುಂಬಾ ಸ್ಪಷ್ಟ." },
    note: "ಹಸ್ತರೇಖೆ ಹಳೆಯ ಸಂಪ್ರದಾಯ, ಭರವಸೆ ಅಲ್ಲ. ಇದು ಒಲವನ್ನು ತೋರಿಸುತ್ತದೆ, ಖಚಿತ ಭವಿಷ್ಯವನ್ನಲ್ಲ.",
    readAgain: "ಇನ್ನೊಂದು ಫೋಟೋ ಓದಿಸಿ",
    retakeTitle: "ಬನ್ನಿ, ಇನ್ನೊಂದು ಫೋಟೋ ತೆಗೆಯೋಣ",
    retakeReasons: {
      too_dark: "ಫೋಟೋ ತುಂಬಾ ಕತ್ತಲಾಗಿದೆ.",
      blurry: "ಫೋಟೋ ಮಸುಕಾಗಿದೆ.",
      not_a_palm: "ನಮಗೆ ತೆರೆದ ಅಂಗೈ ಕಾಣಲಿಲ್ಲ.",
      fingers_closed: "ನಿಮ್ಮ ಬೆರಳುಗಳು ಮುಚ್ಚಿದಂತೆ ಕಾಣುತ್ತಿವೆ.",
      hand_cut_off: "ಅಂಗೈಯ ಸ್ವಲ್ಪ ಭಾಗ ಫೋಟೋದಿಂದ ಹೊರಗಿದೆ.",
      unclear: "ಈ ಫೋಟೋ ಓದಲು ಆಗಲಿಲ್ಲ.",
    },
    tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    guestTitle: "ಅಂಗೈ ಓದಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    guestBody: "ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್‌ನಿಂದ ಸೈನ್ ಇನ್ ಮಾಡಿ. ಇದು ಉಚಿತ, ಮತ್ತು ನಿಮ್ಮ ಓದುಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇಡಲಾಗುತ್ತದೆ.",
    signIn: "ಸೈನ್ ಇನ್",
    notReadyTitle: "ಹಸ್ತರೇಖೆ ಓದು ಈಗ ವಿಶ್ರಾಂತಿಯಲ್ಲಿದೆ",
    busy: "ನೀವು ಈಗಷ್ಟೇ ತುಂಬಾ ಫೋಟೋ ಕಳುಹಿಸಿದ್ದೀರಿ. ಒಂದು ನಿಮಿಷ ಕಾದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    photoError: "ಈ ಫೋಟೋ ತೆರೆಯಲು ಆಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು JPG ಅಥವಾ PNG ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ.",
    historyTitle: "ನಿಮ್ಮ ಹಿಂದಿನ ಓದುಗಳು",
    historyItem: (hand, date) => `${hand} • ${date}`,
  },
});
