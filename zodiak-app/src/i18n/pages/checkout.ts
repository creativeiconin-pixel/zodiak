import { defineDict } from "..";

type CheckoutCopy = {
  header: string; loading: string; step: string; promise: string; title: string; subtitle: string;
  escrowTitle: string; escrowBadge: string; escrowBody: string; escrowBold: string;
  itemTitle: string; qty: string; certTitle: string; certBody: string; included: string;
  muhuratTitle: string; muhuratBody: (planet: string) => string;
  subtotal: string; pooja: string; poojaFree: string; shipping: string; free: string; total: string;
  deliveryTitle: string; fields: { customer_name: string; customer_phone: string; address_line: string; city_postal: string };
  packingLabel: string; packingBody: string;
  paymentTitle: string; pineLabs: string; methodsLabel: string; upi: string; cards: string; netbanking: string; emi: string;
  pay: (amount: string) => string; paying: string; sandbox: string; secure: string; pci: string; consent: string;
  /** UPI QR mode: the seeker pays by any UPI app and our team checks the payment. */
  upiBadge: string; upiMethods: string; upiNext: string; payUpi: (amount: string) => string; preparingUpi: string; upiChecked: string;
};

export const checkoutText = defineDict<CheckoutCopy>({
  en: {
    header: "Checkout", loading: "Getting your order ready...", step: "Step 2 of 2: Address & payment", promise: "Money-back promise",
    title: "Place your order", subtitle: "Check your item, add your address and pay.",
    escrowTitle: "A Pandit checks first", escrowBadge: "Money kept safe",
    escrowBody: "We keep your money safe until a Pandit checks your birth chart. If this remedy is not right for you, ", escrowBold: "you get all your money back",
    itemTitle: "Your item", qty: "Qty: 1", certTitle: "Free pooja & lab certificate", certBody: "Lab test certificate included (worth ₹1,500)", included: "Included",
    muhuratTitle: "Pooja at a good time", muhuratBody: (planet) => `Done at a good ${planet} muhurat after the Pandit says yes`,
    subtotal: "Item price", pooja: "Pooja (Pran-Pratishtha)", poojaFree: "FREE (worth ₹1,500)", shipping: "Safe, insured delivery", free: "FREE", total: "Total",
    deliveryTitle: "Delivery address",
    fields: { customer_name: "Full name", customer_phone: "Phone number (for delivery OTP)", address_line: "House and street", city_postal: "City and PIN code" },
    packingLabel: "Packing:", packingBody: "Sealed velvet box. Safe and private.",
    paymentTitle: "Payment", pineLabs: "Pine Labs secure", methodsLabel: "You can pay with", upi: "UPI (GPay / PhonePe)", cards: "Cards (Visa, RuPay, Mastercard)", netbanking: "Net banking", emi: "Easy EMI from ₹2,500/month",
    pay: (amount) => `Pay ${amount}`, paying: "Keeping your money safe...", sandbox: "Test mode • No money is taken yet",
    secure: "Bank-level safety", pci: "PCI-DSS certified", consent: "By paying, you let our Pandits see your birth details to check this remedy.",
    upiBadge: "Safe UPI", upiMethods: "Pay by any UPI app (GPay, PhonePe, Paytm, BHIM)", upiNext: "On the next page you will see a QR code. Scan it and pay.",
    payUpi: (amount) => `Continue to pay ${amount} by UPI`, preparingUpi: "Getting your QR code ready...", upiChecked: "Checked by our team",
  },
  hi: {
    header: "चेकआउट", loading: "आपका ऑर्डर तैयार हो रहा है...", step: "कदम 2 / 2: पता और भुगतान", promise: "पैसे वापसी का वादा",
    title: "अपना ऑर्डर दें", subtitle: "अपना सामान देखें, पता भरें और भुगतान करें।",
    escrowTitle: "पहले पंडित जी जाँचते हैं", escrowBadge: "पैसे सुरक्षित",
    escrowBody: "जब तक पंडित जी आपकी कुंडली नहीं जाँच लेते, हम आपके पैसे सुरक्षित रखते हैं। अगर यह उपाय आपके लिए सही नहीं है, तो ", escrowBold: "आपके पूरे पैसे वापस मिलेंगे",
    itemTitle: "आपका सामान", qty: "मात्रा: 1", certTitle: "मुफ़्त पूजा और लैब सर्टिफ़िकेट", certBody: "लैब जाँच का सर्टिफ़िकेट शामिल (₹1,500 का)", included: "शामिल",
    muhuratTitle: "शुभ समय पर पूजा", muhuratBody: (planet) => `पंडित जी की हाँ के बाद ${planet} के शुभ मुहूर्त में पूजा`,
    subtotal: "सामान की कीमत", pooja: "पूजा (प्राण-प्रतिष्ठा)", poojaFree: "मुफ़्त (₹1,500 की)", shipping: "सुरक्षित, बीमा वाली डिलीवरी", free: "मुफ़्त", total: "कुल",
    deliveryTitle: "डिलीवरी का पता",
    fields: { customer_name: "पूरा नाम", customer_phone: "फ़ोन नंबर (डिलीवरी OTP के लिए)", address_line: "मकान और गली", city_postal: "शहर और पिन कोड" },
    packingLabel: "पैकिंग:", packingBody: "सील बंद मखमली डिब्बा। सुरक्षित और गोपनीय।",
    paymentTitle: "भुगतान", pineLabs: "Pine Labs सुरक्षित", methodsLabel: "आप इनसे भुगतान कर सकते हैं", upi: "UPI (GPay / PhonePe)", cards: "कार्ड (Visa, RuPay, Mastercard)", netbanking: "नेट बैंकिंग", emi: "आसान EMI ₹2,500/महीना से",
    pay: (amount) => `${amount} भुगतान करें`, paying: "आपके पैसे सुरक्षित किए जा रहे हैं...", sandbox: "टेस्ट मोड • अभी कोई पैसा नहीं कटेगा",
    secure: "बैंक जैसी सुरक्षा", pci: "PCI-DSS प्रमाणित", consent: "भुगतान करके आप पंडित जी को यह उपाय जाँचने के लिए अपनी जन्म जानकारी देखने की अनुमति देते हैं।",
    upiBadge: "सुरक्षित UPI", upiMethods: "किसी भी UPI ऐप से भुगतान करें (GPay, PhonePe, Paytm, BHIM)", upiNext: "अगले पेज पर एक QR कोड दिखेगा। उसे स्कैन करके भुगतान करें।",
    payUpi: (amount) => `UPI से ${amount} भुगतान करने के लिए आगे बढ़ें`, preparingUpi: "आपका QR कोड तैयार हो रहा है...", upiChecked: "हमारी टीम जाँचती है",
  },
  hinglish: {
    header: "Checkout", loading: "Aapka order taiyaar ho raha hai...", step: "Step 2 / 2: Address aur payment", promise: "Paise wapsi ka vaada",
    title: "Apna order do", subtitle: "Apna item dekho, address bharo aur payment karo.",
    escrowTitle: "Pehle Pandit ji check karte hain", escrowBadge: "Paise safe",
    escrowBody: "Jab tak Pandit ji aapki kundli check nahi kar lete, hum aapke paise safe rakhte hain. Agar yeh upay aapke liye sahi nahi hai, to ", escrowBold: "aapke poore paise wapas milenge",
    itemTitle: "Aapka item", qty: "Qty: 1", certTitle: "Free pooja aur lab certificate", certBody: "Lab test certificate shaamil (₹1,500 ka)", included: "Shaamil",
    muhuratTitle: "Shubh samay par pooja", muhuratBody: (planet) => `Pandit ji ki haan ke baad ${planet} ke shubh muhurat mein pooja`,
    subtotal: "Item ki keemat", pooja: "Pooja (Pran-Pratishtha)", poojaFree: "FREE (₹1,500 ki)", shipping: "Safe, insured delivery", free: "FREE", total: "Total",
    deliveryTitle: "Delivery address",
    fields: { customer_name: "Poora naam", customer_phone: "Phone number (delivery OTP ke liye)", address_line: "Ghar aur gali", city_postal: "Shehar aur PIN code" },
    packingLabel: "Packing:", packingBody: "Sealed velvet dabba. Safe aur private.",
    paymentTitle: "Payment", pineLabs: "Pine Labs secure", methodsLabel: "Aap inse pay kar sakte ho", upi: "UPI (GPay / PhonePe)", cards: "Cards (Visa, RuPay, Mastercard)", netbanking: "Net banking", emi: "Easy EMI ₹2,500/month se",
    pay: (amount) => `${amount} pay karo`, paying: "Aapke paise safe kiye ja rahe hain...", sandbox: "Test mode • Abhi koi paisa nahi katega",
    secure: "Bank jaisi safety", pci: "PCI-DSS certified", consent: "Pay karke aap Pandit ji ko yeh upay check karne ke liye apni janam details dekhne ki permission dete ho.",
    upiBadge: "Safe UPI", upiMethods: "Kisi bhi UPI app se pay karo (GPay, PhonePe, Paytm, BHIM)", upiNext: "Agle page par ek QR code dikhega. Use scan karke pay karo.",
    payUpi: (amount) => `UPI se ${amount} pay karne ke liye aage badho`, preparingUpi: "Aapka QR code taiyaar ho raha hai...", upiChecked: "Hamari team check karti hai",
  },
  kn: {
    header: "ಚೆಕ್‌ಔಟ್", loading: "ನಿಮ್ಮ ಆರ್ಡರ್ ತಯಾರಾಗುತ್ತಿದೆ...", step: "ಹಂತ 2 / 2: ವಿಳಾಸ ಮತ್ತು ಪಾವತಿ", promise: "ಹಣ ವಾಪಸ್ ಭರವಸೆ",
    title: "ನಿಮ್ಮ ಆರ್ಡರ್ ಮಾಡಿ", subtitle: "ನಿಮ್ಮ ವಸ್ತು ನೋಡಿ, ವಿಳಾಸ ಸೇರಿಸಿ ಮತ್ತು ಪಾವತಿಸಿ.",
    escrowTitle: "ಮೊದಲು ಪಂಡಿತರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ", escrowBadge: "ಹಣ ಸುರಕ್ಷಿತ",
    escrowBody: "ಪಂಡಿತರು ನಿಮ್ಮ ಜಾತಕ ಪರಿಶೀಲಿಸುವವರೆಗೆ ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತವಾಗಿ ಇರುತ್ತದೆ. ಈ ಪರಿಹಾರ ನಿಮಗೆ ಸರಿಯಲ್ಲದಿದ್ದರೆ, ", escrowBold: "ನಿಮ್ಮ ಪೂರ್ತಿ ಹಣ ವಾಪಸ್ ಸಿಗುತ್ತದೆ",
    itemTitle: "ನಿಮ್ಮ ವಸ್ತು", qty: "ಪ್ರಮಾಣ: 1", certTitle: "ಉಚಿತ ಪೂಜೆ ಮತ್ತು ಲ್ಯಾಬ್ ಪ್ರಮಾಣಪತ್ರ", certBody: "ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆ ಪ್ರಮಾಣಪತ್ರ ಸೇರಿದೆ (₹1,500 ಮೌಲ್ಯ)", included: "ಸೇರಿದೆ",
    muhuratTitle: "ಶುಭ ಸಮಯದಲ್ಲಿ ಪೂಜೆ", muhuratBody: (planet) => `ಪಂಡಿತರು ಒಪ್ಪಿದ ನಂತರ ${planet} ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಪೂಜೆ`,
    subtotal: "ವಸ್ತುವಿನ ಬೆಲೆ", pooja: "ಪೂಜೆ (ಪ್ರಾಣ ಪ್ರತಿಷ್ಠೆ)", poojaFree: "ಉಚಿತ (₹1,500 ಮೌಲ್ಯ)", shipping: "ಸುರಕ್ಷಿತ, ವಿಮೆ ಇರುವ ಡೆಲಿವರಿ", free: "ಉಚಿತ", total: "ಒಟ್ಟು",
    deliveryTitle: "ಡೆಲಿವರಿ ವಿಳಾಸ",
    fields: { customer_name: "ಪೂರ್ಣ ಹೆಸರು", customer_phone: "ಫೋನ್ ನಂಬರ್ (ಡೆಲಿವರಿ OTPಗಾಗಿ)", address_line: "ಮನೆ ಮತ್ತು ರಸ್ತೆ", city_postal: "ನಗರ ಮತ್ತು ಪಿನ್ ಕೋಡ್" },
    packingLabel: "ಪ್ಯಾಕಿಂಗ್:", packingBody: "ಸೀಲ್ ಮಾಡಿದ ವೆಲ್ವೆಟ್ ಪೆಟ್ಟಿಗೆ. ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ.",
    paymentTitle: "ಪಾವತಿ", pineLabs: "Pine Labs ಸುರಕ್ಷಿತ", methodsLabel: "ನೀವು ಇವುಗಳಿಂದ ಪಾವತಿಸಬಹುದು", upi: "UPI (GPay / PhonePe)", cards: "ಕಾರ್ಡ್ (Visa, RuPay, Mastercard)", netbanking: "ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್", emi: "ಸುಲಭ EMI ₹2,500/ತಿಂಗಳಿನಿಂದ",
    pay: (amount) => `${amount} ಪಾವತಿಸಿ`, paying: "ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗುತ್ತಿದೆ...", sandbox: "ಪರೀಕ್ಷಾ ಮೋಡ್ • ಈಗ ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗುವುದಿಲ್ಲ",
    secure: "ಬ್ಯಾಂಕ್ ಮಟ್ಟದ ಸುರಕ್ಷತೆ", pci: "PCI-DSS ಪ್ರಮಾಣಿತ", consent: "ಪಾವತಿಸುವ ಮೂಲಕ, ಈ ಪರಿಹಾರ ಪರಿಶೀಲಿಸಲು ನಿಮ್ಮ ಜನ್ಮ ವಿವರ ನೋಡಲು ಪಂಡಿತರಿಗೆ ಅನುಮತಿ ನೀಡುತ್ತೀರಿ.",
    upiBadge: "ಸುರಕ್ಷಿತ UPI", upiMethods: "ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಿಂದ ಪಾವತಿಸಿ (GPay, PhonePe, Paytm, BHIM)", upiNext: "ಮುಂದಿನ ಪುಟದಲ್ಲಿ ಒಂದು QR ಕೋಡ್ ಕಾಣುತ್ತದೆ. ಅದನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಪಾವತಿಸಿ.",
    payUpi: (amount) => `UPI ಮೂಲಕ ${amount} ಪಾವತಿಸಲು ಮುಂದುವರಿಯಿರಿ`, preparingUpi: "ನಿಮ್ಮ QR ಕೋಡ್ ತಯಾರಾಗುತ್ತಿದೆ...", upiChecked: "ನಮ್ಮ ತಂಡ ಪರಿಶೀಲಿಸುತ್ತದೆ",
  },
});
