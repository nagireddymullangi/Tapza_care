import type { SupportedLocale } from '@/types/domain';

export type TranslationDict = {
  appName: string;
  clinicLocation: string;
  searchPlaceholder: string;
  normalTheme: string;
  festivalTheme: string;
  darkMode: string;
  lightMode: string;
  staleConfigBanner: string;
  offlineBanner: string;
  retry: string;
  configErrorTitle: string;
  configErrorSubtitle: string;
  loadFallbackConfig: string;
  bookNow: string;
  nextSlot: string;
  consultationFee: string;
  speaks: string;
  experienceYears: string;
  selectDate: string;
  selectSlot: string;
  noSlotsTitle: string;
  noSlotsSubtitle: string;
  slotsErrorTitle: string;
  confirmBooking: string;
  confirming: string;
  bookingConfirmedTitle: string;
  bookingConfirmedSubtitle: string;
  bookingQueuedTitle: string;
  bookingQueuedSubtitle: string;
  slotConflictMessage: string;
  bookingFailedMessage: string;
  viewBookings: string;
  done: string;
  bookingsTitle: string;
  bookingsEmptyTitle: string;
  bookingsEmptySubtitle: string;
  pendingSyncBadge: string;
  confirmedBadge: string;
  syncNow: string;
  prescriptionsTitle: string;
  prescriptionsEmptyTitle: string;
  prescriptionsEmptySubtitle: string;
  morning: string;
  afternoon: string;
  night: string;
  markTaken: string;
  takenLabel: string;
  daysLeft: string;
  medicinesCount: string;
  scheduleReminders: string;
  remindersScheduled: string;
  profileTitle: string;
  languageLabel: string;
  appearanceSection: string;
  resilienceSection: string;
  latencyLabel: string;
  latencyNormal: string;
  latencySlow: string;
  failureLabel: string;
  offlineQueueToggle: string;
  openAdminEditor: string;
  adminTitle: string;
  adminApply: string;
  adminReset: string;
  adminInvalidJson: string;
  familyAlertTitle: string;
  familyAlertBody: string;
  today: string;
  tomorrow: string;
  back: string;
  doctorNotFound: string;
  prescriptionNotFound: string;
  doseProgress: string;
};

export const TRANSLATIONS: Record<SupportedLocale, TranslationDict> = {
  en: {
    appName: 'Tapza Care',
    clinicLocation: 'Jubilee Hills, Hyderabad',
    searchPlaceholder: 'Search doctors, lab tests, medicines…',
    normalTheme: 'Normal Day',
    festivalTheme: 'Diwali Special',
    darkMode: 'Dark',
    lightMode: 'Light',
    staleConfigBanner: 'Showing saved layout. Live config could not be reached.',
    offlineBanner: 'You are offline. Bookings will be queued and synced automatically.',
    retry: 'Retry',
    configErrorTitle: 'Could not load clinic home',
    configErrorSubtitle: 'Check your connection or retry fetching the remote layout.',
    loadFallbackConfig: 'Use offline clinic layout',
    bookNow: 'Book Slot',
    nextSlot: 'Next slot',
    consultationFee: 'Fee',
    speaks: 'Speaks',
    experienceYears: 'yrs exp',
    selectDate: 'Choose Date',
    selectSlot: 'Available Slots',
    noSlotsTitle: 'No slots available on this date',
    noSlotsSubtitle: 'Please try tomorrow or pick another day above.',
    slotsErrorTitle: 'Could not fetch appointment slots',
    confirmBooking: 'Confirm Appointment',
    confirming: 'Confirming…',
    bookingConfirmedTitle: 'Appointment Confirmed!',
    bookingConfirmedSubtitle: 'Your token and WhatsApp summary are ready.',
    bookingQueuedTitle: 'Saved to Offline Queue',
    bookingQueuedSubtitle: 'We will confirm this slot automatically as soon as network returns.',
    slotConflictMessage: 'That slot was just booked by another patient (409). Please pick another slot.',
    bookingFailedMessage: 'Booking could not be completed. Please try again.',
    viewBookings: 'View My Bookings',
    done: 'Done',
    bookingsTitle: 'My Appointments',
    bookingsEmptyTitle: 'No appointments yet',
    bookingsEmptySubtitle: 'Book a doctor consultation or lab test from the Home tab.',
    pendingSyncBadge: 'Queued Offline',
    confirmedBadge: 'Confirmed',
    syncNow: 'Sync Queued',
    prescriptionsTitle: 'Prescriptions & Doses',
    prescriptionsEmptyTitle: 'No prescriptions yet',
    prescriptionsEmptySubtitle: 'Prescriptions shared by your Tapza Clinic doctor on WhatsApp appear here.',
    morning: 'Morning',
    afternoon: 'Afternoon',
    night: 'Night',
    markTaken: 'Mark Taken',
    takenLabel: 'Taken',
    daysLeft: 'days course',
    medicinesCount: 'medicines',
    scheduleReminders: 'Set Daily Reminders',
    remindersScheduled: 'Daily medicine reminders active (8 AM, 2 PM, 9 PM)',
    profileTitle: 'Patient Settings & Demo Controls',
    languageLabel: 'App Language',
    appearanceSection: 'Remote Config & Theme',
    resilienceSection: 'Mock Network & Resilience Switches',
    latencyLabel: 'Network Speed',
    latencyNormal: 'Fast (250ms)',
    latencySlow: 'Slow (2.4s)',
    failureLabel: 'Simulated Failure',
    offlineQueueToggle: 'Offline Mode (Queue Bookings)',
    openAdminEditor: 'Open Live Config Editor',
    adminTitle: 'Live Remote Config Admin',
    adminApply: 'Apply Config Live',
    adminReset: 'Reset Preset',
    adminInvalidJson: 'Invalid layout config JSON',
    familyAlertTitle: 'Family Care Profiles',
    familyAlertBody: 'Managing care for Ramesh Rao (Self) and Lakshmi Devi (Mother) at Tapza Clinics.',
    today: 'Today',
    tomorrow: 'Tomorrow',
    back: 'Back',
    doctorNotFound: 'Doctor profile not found',
    prescriptionNotFound: 'Prescription not found',
    doseProgress: 'doses taken today',
  },
  hi: {
    appName: 'तपज़ा केयर',
    clinicLocation: 'जुबली हिल्स, हैदराबाद',
    searchPlaceholder: 'डॉक्टर, लैब टेस्ट, दवाइयाँ खोजें…',
    normalTheme: 'सामान्य दिन',
    festivalTheme: 'दिवाली विशेष',
    darkMode: 'डार्क',
    lightMode: 'लाइट',
    staleConfigBanner: 'सहेजा गया लेआउट दिख रहा है। लाइव कॉन्फ़िग लोड नहीं हो सका।',
    offlineBanner: 'आप ऑफ़लाइन हैं। बुकिंग कतार में सहेजी जाएंगी।',
    retry: 'पुनः प्रयास करें',
    configErrorTitle: 'क्लीनिक होम लोड नहीं हो सका',
    configErrorSubtitle: 'अपना नेटवर्क जांचें या दोबारा कोशिश करें।',
    loadFallbackConfig: 'ऑफ़लाइन लेआउट खोलें',
    bookNow: 'स्लॉट बुक करें',
    nextSlot: 'अगला समय',
    consultationFee: 'फ़ीस',
    speaks: 'भाषाएँ',
    experienceYears: 'वर्ष अनुभव',
    selectDate: 'तारीख़ चुनें',
    selectSlot: 'उपलब्ध समय',
    noSlotsTitle: 'इस तारीख़ को कोई स्लॉट खाली नहीं है',
    noSlotsSubtitle: 'कृपया कल या कोई अन्य दिन चुनें।',
    slotsErrorTitle: 'समय स्लॉट लोड नहीं हो सके',
    confirmBooking: 'अपॉइंटमेंट पक्का करें',
    confirming: 'पुष्टि हो रही है…',
    bookingConfirmedTitle: 'अपॉइंटमेंट पक्का हो गया!',
    bookingConfirmedSubtitle: 'आपका टोकन और व्हाट्सऐप विवरण तैयार है।',
    bookingQueuedTitle: 'ऑफ़लाइन कतार में सहेजा गया',
    bookingQueuedSubtitle: 'नेटवर्क आते ही यह बुकिंग अपने-आप पक्की हो जाएगी।',
    slotConflictMessage: 'यह स्लॉट अभी किसी और ने बुक कर लिया (409)। कृपया दूसरा समय चुनें।',
    bookingFailedMessage: 'बुकिंग पूरी नहीं हो सकी। कृपया फिर प्रयास करें।',
    viewBookings: 'मेरी बुकिंग देखें',
    done: 'हो गया',
    bookingsTitle: 'मेरी अपॉइंटमेंट्स',
    bookingsEmptyTitle: 'अभी कोई बुकिंग नहीं है',
    bookingsEmptySubtitle: 'होम टैब से डॉक्टर परामर्श या लैब टेस्ट बुक करें।',
    pendingSyncBadge: 'ऑफ़लाइन कतार',
    confirmedBadge: 'पक्का हो गया',
    syncNow: 'कतार सिंक करें',
    prescriptionsTitle: 'पर्चे और दवा समय',
    prescriptionsEmptyTitle: 'अभी कोई पर्चा नहीं है',
    prescriptionsEmptySubtitle: 'तपज़ा क्लीनिक से व्हाट्सऐप पर मिले पर्चे यहाँ दिखेंगे।',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    night: 'रात',
    markTaken: 'दवा ली',
    takenLabel: 'ली गई',
    daysLeft: 'दिन का कोर्स',
    medicinesCount: 'दवाइयाँ',
    scheduleReminders: 'दैनिक रिमाइंडर सेट करें',
    remindersScheduled: 'दैनिक दवा रिमाइंडर सक्रिय (8 AM, 2 PM, 9 PM)',
    profileTitle: 'मरीज़ सेटिंग्स और डेमो कंट्रोल',
    languageLabel: 'ऐप की भाषा',
    appearanceSection: 'रिमोट कॉन्फ़िग और थीम',
    resilienceSection: 'मॉक नेटवर्क और एरर स्विच',
    latencyLabel: 'नेटवर्क गति',
    latencyNormal: 'तेज़ (250ms)',
    latencySlow: 'धीमा (2.4s)',
    failureLabel: 'सिमुलेटेड त्रुटि',
    offlineQueueToggle: 'ऑफ़लाइन मोड (बुकिंग कतार)',
    openAdminEditor: 'लाइव कॉन्फ़िग एडिटर खोलें',
    adminTitle: 'लाइव रिमोट कॉन्फ़िग एडमिन',
    adminApply: 'कॉन्फ़िग लागू करें',
    adminReset: 'रीसेट करें',
    adminInvalidJson: 'अमान्य कॉन्फ़िग JSON',
    familyAlertTitle: 'परिवार देखभाल प्रोफ़ाइल',
    familyAlertBody: 'रमेश राव (स्वयं) और लक्ष्मी देवी (माताजी) की देखभाल सक्रिय है।',
    today: 'आज',
    tomorrow: 'कल',
    back: 'वापस',
    doctorNotFound: 'डॉक्टर प्रोफ़ाइल नहीं मिली',
    prescriptionNotFound: 'पर्चा नहीं मिला',
    doseProgress: 'खुराक आज ली गई',
  },
  te: {
    appName: 'తప్జా కేర్',
    clinicLocation: 'జూబ్లీ హిల్స్, హైదరాబాద్',
    searchPlaceholder: 'డాక్టర్లు, ల్యాబ్ పరీక్షలు, మందులు వెతకండి…',
    normalTheme: 'సాధారణ రోజు',
    festivalTheme: 'దీపావళి ప్రత్యేకం',
    darkMode: 'డార్క్',
    lightMode: 'లైట్',
    staleConfigBanner: 'సేవ్ చేసిన లేఅవుట్ చూపుతోంది. లైవ్ కాన్ఫిగ్ లోడ్ కాలేదు.',
    offlineBanner: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. బుకింగ్స్ క్యూలో సేవ్ అవుతాయి.',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    configErrorTitle: 'క్లినిక్ హోమ్ లోడ్ కాలేదు',
    configErrorSubtitle: 'నెట్‌వర్క్ తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.',
    loadFallbackConfig: 'ఆఫ్‌లైన్ లేఅవుట్ వాడండి',
    bookNow: 'స్లాట్ బుక్ చేయండి',
    nextSlot: 'తదుపరి సమయం',
    consultationFee: 'ఫీజు',
    speaks: 'భాషలు',
    experienceYears: 'సం. అనుభవం',
    selectDate: 'తేదీ ఎంచుకోండి',
    selectSlot: 'అందుబాటులో ఉన్న సమయాలు',
    noSlotsTitle: 'ఈ తేదీలో స్లాట్లు ఖాళీగా లేవు',
    noSlotsSubtitle: 'దయచేసి రేపు లేదా మరో రోజు ఎంచుకోండి.',
    slotsErrorTitle: 'స్లాట్లు లోడ్ కాలేదు',
    confirmBooking: 'అపాయింట్‌మెంట్ నిర్ధారించండి',
    confirming: 'నిర్ధారిస్తోంది…',
    bookingConfirmedTitle: 'అపాయింట్‌మెంట్ ఖరారైంది!',
    bookingConfirmedSubtitle: 'మీ టోకెన్ మరియు వాట్సాప్ వివరాలు సిద్ధంగా ఉన్నాయి.',
    bookingQueuedTitle: 'ఆఫ్‌లైన్ క్యూలో సేవ్ చేయబడింది',
    bookingQueuedSubtitle: 'నెట్‌వర్క్ రాగానే ఈ బుకింగ్ ఆటోమేటిక్‌గా ఖరారవుతుంది.',
    slotConflictMessage: 'ఈ స్లాట్ ఇప్పుడే మరొకరు బుక్ చేశారు (409). దయచేసి వేరే సమయం ఎంచుకోండి.',
    bookingFailedMessage: 'బుకింగ్ పూర్తి కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    viewBookings: 'నా బుకింగ్స్ చూడండి',
    done: 'పూర్తయింది',
    bookingsTitle: 'నా అపాయింట్‌మెంట్లు',
    bookingsEmptyTitle: 'ఇంకా బుకింగ్స్ లేవు',
    bookingsEmptySubtitle: 'హోమ్ ట్యాబ్ నుండి డాక్టర్ లేదా ల్యాబ్ పరీక్ష బుక్ చేయండి.',
    pendingSyncBadge: 'ఆఫ్‌లైన్ క్యూ',
    confirmedBadge: 'ఖరారైంది',
    syncNow: 'సింక్ చేయండి',
    prescriptionsTitle: 'ప్రిస్క్రిప్షన్లు & మందులు',
    prescriptionsEmptyTitle: 'ప్రిస్క్రిప్షన్లు లేవు',
    prescriptionsEmptySubtitle: 'తప్జా క్లినిక్ డాక్టర్ వాట్సాప్‌లో పంపిన ప్రిస్క్రిప్షన్లు ఇక్కడ కనిపిస్తాయి.',
    morning: 'ఉదయం',
    afternoon: 'మధ్యాహ్నం',
    night: 'రాత్రి',
    markTaken: 'వేసుకున్నాను',
    takenLabel: 'వేసుకున్నారు',
    daysLeft: 'రోజుల కోర్సు',
    medicinesCount: 'మందులు',
    scheduleReminders: 'రోజువారీ రిమైండర్లు సెట్ చేయండి',
    remindersScheduled: 'రోజువారీ మందుల రిమైండర్లు సక్రియం (8 AM, 2 PM, 9 PM)',
    profileTitle: 'రోగి సెట్టింగులు & డెమో కంట్రోల్స్',
    languageLabel: 'యాప్ భాష',
    appearanceSection: 'రిమోట్ కాన్ఫిగ్ & థీమ్',
    resilienceSection: 'మాక్ నెట్‌వర్క్ & ఎర్రర్ స్విచ్‌లు',
    latencyLabel: 'నెట్‌వర్క్ వేగం',
    latencyNormal: 'వేగంగా (250ms)',
    latencySlow: 'నెమ్మదిగా (2.4s)',
    failureLabel: 'లోపం పరీక్ష',
    offlineQueueToggle: 'ఆఫ్‌లైన్ మోడ్ (బుకింగ్ క్యూ)',
    openAdminEditor: 'లైవ్ కాన్ఫిగ్ ఎడిటర్ తెరవండి',
    adminTitle: 'లైవ్ రిమోట్ కాన్ఫిగ్ అడ్మిన్',
    adminApply: 'కాన్ఫిగ్ వర్తింపజేయండి',
    adminReset: 'రీసెట్ చేయండి',
    adminInvalidJson: 'చెల్లని కాన్ఫిగ్ JSON',
    familyAlertTitle: 'కుటుంబ ఆరోగ్య ప్రొఫైల్స్',
    familyAlertBody: 'రమేష్ రావు (స్వీయ) మరియు లక్ష్మీ దేవి (అమ్మ) సంరక్షణ సక్రియంగా ఉంది.',
    today: 'ఈరోజు',
    tomorrow: 'రేపు',
    back: 'వెనుకకు',
    doctorNotFound: 'డాక్టర్ వివరాలు దొరకలేదు',
    prescriptionNotFound: 'ప్రిస్క్రిప్షన్ దొరకలేదు',
    doseProgress: 'నేడు వేసుకున్న మోతాదులు',
  },
};
