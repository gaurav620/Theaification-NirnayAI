"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

interface TranslationCache {
  [key: string]: string;
}

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string) => Promise<string>;
  isReady: boolean;
}

// Static translations for UI elements
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.title": "NirnayAI",
    "header.subtitle": "Central Reserve Police Force • MHA",
    "nav.platform": "Platform",
    "nav.process": "Process",
    "nav.faq": "FAQ",
    "nav.hackathon": "Hackathon",
    "nav.signin": "Sign In",
    "nav.dashboard": "Dashboard",
    "nav.menu": "Menu",
    
    // Notice
    "notice.label": "Notice",
    
    // Hero
    "hero.title1": "Next-Gen",
    "hero.title2": "AI-Powered",
    "hero.title3": "Tender Intelligence",
    "hero.subtitle": "For Government Procurement",
    "hero.description": "NirnayAI transforms how CRPF and government agencies evaluate vendor bids — extracting criteria, scoring compliance, and delivering audit-ready decisions in minutes.",
    "hero.cta.primary": "Get Started",
    "hero.cta.secondary": "View Documentation",
    "hero.scroll": "Scroll to explore",
    
    // Demo
    "demo.title": "Watch Demo",
    
    // Why Section
    "why.title": "Why NirnayAI?",
    "why.subtitle": "Purpose-Built for Government Procurement",
    "why.description": "From GFR 2024 compliance to CRPF procurement workflows, every feature is designed for transparency, speed, and audit readiness.",
    "why.card1.title": "Criteria Extraction",
    "why.card1.desc": "Auto-extract eligibility criteria from tender documents using advanced ML models.",
    "why.card2.title": "Compliance Scoring",
    "why.card2.desc": "Score vendor submissions against extracted criteria with AI-powered analysis.",
    "why.card3.title": "Audit Trail",
    "why.card3.desc": "Complete audit trail for every decision with explainable AI reasoning.",
    "why.card4.title": "GFR 2024 Ready",
    "why.card4.desc": "Fully compliant with Government Financial Rules 2024 and procurement guidelines.",
    
    // Process Section
    "process.title": "How It Works",
    "process.step1": "Upload Tender",
    "process.step1.desc": "Upload tender documents in PDF, DOCX, or image formats.",
    "process.step2": "Extract Criteria",
    "process.step2.desc": "AI automatically extracts eligibility criteria and requirements.",
    "process.step3": "Evaluate Bids",
    "process.step3.desc": "Upload vendor bids and get AI-powered compliance scores.",
    "process.step4": "Generate Report",
    "process.step4.desc": "Download comprehensive evaluation reports with rankings.",
    
    // FAQ Section
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "What is NirnayAI?",
    "faq.a1": "NirnayAI is an AI-powered tender evaluation platform designed specifically for government procurement, helping agencies like CRPF evaluate vendor bids efficiently and transparently.",
    "faq.q2": "Is my data secure?",
    "faq.a2": "Yes, NirnayAI is ISO 27001 certified and uses government-grade security measures. All data is encrypted at rest and in transit.",
    "faq.q3": "How accurate is the AI extraction?",
    "faq.a3": "Our AI models achieve 99.4% accuracy on technical specification extraction and are continuously improved with government document training.",
    "faq.q4": "Can I export evaluation reports?",
    "faq.a4": "Yes, you can export comprehensive evaluation reports in PDF, Excel, and CSV formats with complete audit trails.",
    
    // Hackathon Section
    "hackathon.title": "AI for Bharat Hackathon 2.0",
    "hackathon.subtitle": "Proud Participant",
    "hackathon.description": "NirnayAI was developed as part of the AI for Bharat Hackathon 2.0, organized by PanIIT and Government of Karnataka in collaboration with HackerEarth.",
    "hackathon.cta": "View Hackathon Details",
    
    // Stats
    "stats.accuracy": "AI Accuracy",
    "stats.time": "Time Saved",
    "stats.compliance": "GFR Compliance",
    "stats.processed": "Documents Processed",
    
    // Security
    "security.iso": "ISO 27001 Certified",
    "security.cloud": "Government Cloud Native • On-Premise Available",
    
    // Team
    "team.title": "The Minds Behind NirnayAI",
    
    // Footer
    "footer.product": "Product",
    "footer.platform": "Platform",
    "footer.process": "Process",
    "footer.faq": "FAQ",
    "footer.resources": "Resources",
    "footer.documentation": "Documentation",
    "footer.api": "API Reference",
    "footer.guide": "User Guide",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.disclaimer": "Disclaimer",
    "footer.madeby": "Made by",
    "footer.language": "Language",
    "footer.english": "English",
    "footer.hindi": "हिंदी",
    
    // Dashboard
    "dashboard.title": "Tender Dashboard",
    "dashboard.newTender": "New Tender",
    "dashboard.upload": "Upload Tender Documents",
    "dashboard.extracting": "Extracting criteria...",
    "dashboard.eligibility": "Eligibility Criteria",
    "dashboard.bidders": "Bidders",
    "dashboard.results": "Results",
    "dashboard.noFile": "No tender file selected",
    "dashboard.dragDrop": "Drag and drop PDF, DOCX, or images here",
    "dashboard.or": "or",
    "dashboard.browse": "Browse Files",
    "dashboard.supported": "Supported: PDF, DOCX, JPG, PNG (Max 50MB)",
    "dashboard.viewMode": "View Mode",
    "dashboard.editMode": "Edit Mode",
    "dashboard.addCriterion": "Add Criterion",
    "dashboard.save": "Save Changes",
    "dashboard.cancel": "Cancel",
    "dashboard.mandatory": "Mandatory",
    "dashboard.optional": "Optional",
    "dashboard.financial": "Financial",
    "dashboard.technical": "Technical",
    "dashboard.compliance": "Compliance",
    "dashboard.documentation": "Documentation",
    "dashboard.threshold": "Threshold",
    "dashboard.description": "Description",
    "dashboard.id": "ID",
    "dashboard.label": "Label",
    "dashboard.type": "Type",
    "dashboard.required": "Required",
    "dashboard.status": "Status",
    "dashboard.actions": "Actions",
    "dashboard.evaluate": "Evaluate",
    "dashboard.delete": "Delete",
    "dashboard.download": "Download Report",
    "dashboard.score": "Score",
    "dashboard.pass": "Pass",
    "dashboard.fail": "Fail",
    "dashboard.na": "N/A",
    "dashboard.loading": "Loading...",
    "dashboard.error": "Error",
    "dashboard.retry": "Retry",
    "dashboard.success": "Success",
    "dashboard.processing": "Processing...",
    "dashboard.completed": "Completed",
    "dashboard.failed": "Failed",
    "dashboard.ocrWarning": "OCR Warning: Could not extract text from document",
    "dashboard.reExtract": "Re-Extract Criteria",
    "dashboard.tenderOverview": "Tender Overview",
    "dashboard.summary": "Summary",
    "dashboard.keyRequirements": "Key Requirements",
    "dashboard.criteriaCount": "Criteria Count",
    "dashboard.tenderType": "Tender Type",
    "dashboard.estimatedBidders": "Estimated Bidders",
    "dashboard.tenderNumber": "Tender Number",
    "dashboard.lastDate": "Last Date",
    "dashboard.emd": "EMD Amount",
    
    // Criteria Page
    "criteria.title": "Eligibility Criteria Setup",
    "criteria.subtitle": "Define and manage eligibility criteria for tender evaluation",
    "criteria.addNew": "Add New Criterion",
    "criteria.preview": "Preview",
    "criteria.saveAll": "Save All Criteria",
    "criteria.back": "Back to Dashboard",
    "criteria.noCriteria": "No criteria defined yet",
    "criteria.addFirst": "Add your first criterion to get started",
    "criteria.duplicate": "Duplicate",
    "criteria.remove": "Remove",
    "criteria.dragDrop": "Drag and drop to reorder",
    "criteria.autoExtract": "Auto-Extract from Document",
    "criteria.manualAdd": "Manually Add Criteria",
    "criteria.aiExtract": "AI will extract criteria from your uploaded tender documents",
    
    // Common
    "common.close": "Close",
    "common.open": "Open",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.continue": "Continue",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.confirm": "Confirm",
    "common.warning": "Warning",
    "common.info": "Info",
    "common.error": "Error",
    "common.success": "Success",
    "common.loading": "Loading...",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.none": "None",
    "common.select": "Select",
    "common.selected": "Selected",
    "common.clear": "Clear",
    "common.reset": "Reset",
    "common.apply": "Apply",
    "common.show": "Show",
    "common.hide": "Hide",
    "common.more": "More",
    "common.less": "Less",
    "common.expand": "Expand",
    "common.collapse": "Collapse",
  },
  hi: {
    // Header
    "header.title": "निर्णयAI",
    "header.subtitle": "केन्द्रीय रिजर्व पुलिस बल • गृह मंत्रालय",
    "nav.platform": "प्लेटफ़ॉर्म",
    "nav.process": "प्रक्रिया",
    "nav.faq": "सामान्य प्रश्न",
    "nav.hackathon": "हैकथॉन",
    "nav.signin": "साइन इन",
    "nav.dashboard": "डैशबोर्ड",
    "nav.menu": "मेनू",
    
    // Notice
    "notice.label": "सूचना",
    
    // Hero
    "hero.title1": "नई पीढ़ी का",
    "hero.title2": "AI-संचालित",
    "hero.title3": "टेंडर इंटेलिजेंस",
    "hero.subtitle": "सरकारी खरीद के लिए",
    "hero.description": "निर्णयAI CRPF और सरकारी एजेंसियों के विक्रेता बोलियों के मूल्यांकन के तरीके को बदलता है — मानदंड निकालना, अनुपालन स्कोरिंग, और मिनटों में ऑडिट-तैयार निर्णय देना।",
    "hero.cta.primary": "शुरू करें",
    "hero.cta.secondary": "दस्तावेज़ीकरण देखें",
    "hero.scroll": "अन्वेषण के लिए स्क्रॉल करें",
    
    // Demo
    "demo.title": "डेमो देखें",
    
    // Why Section
    "why.title": "निर्णयAI क्यों?",
    "why.subtitle": "सरकारी खरीद के लिए विशेष रूप से बनाया गया",
    "why.description": "GFR 2024 अनुपालन से लेकर CRPF खरीद वर्कफ़्लो तक, हर सुविधा पारदर्शिता, गति और ऑडिट तत्परता के लिए डिज़ाइन की गई है।",
    "why.card1.title": "मानदंड निष्कर्षण",
    "why.card1.desc": "उन्नत ML मॉडल का उपयोग करके टेंडर दस्तावेजों से पात्रता मानदंड स्वचालित रूप से निकालें।",
    "why.card2.title": "अनुपालन स्कोरिंग",
    "why.card2.desc": "AI-संचालित विश्लेषण के साथ निकाले गए मानदंडों के विरुद्ध विक्रेता प्रस्तुतियों का स्कोर करें।",
    "why.card3.title": "ऑडिट ट्रेल",
    "why.card3.desc": "व्याख्या योग्य AI तर्क के साथ हर निर्णय के लिए पूर्ण ऑडिट ट्रेल।",
    "why.card4.title": "GFR 2024 तैयार",
    "why.card4.desc": "पूरी तरह से सरकारी वित्तीय नियम 2024 और खरीद दिशानिर्देशों के अनुपालन में।",
    
    // Process Section
    "process.title": "यह कैसे काम करता है",
    "process.step1": "टेंडर अपलोड करें",
    "process.step1.desc": "PDF, DOCX, या छवि प्रारूप में टेंडर दस्तावेज़ अपलोड करें।",
    "process.step2": "मानदंड निकालें",
    "process.step2.desc": "AI स्वचालित रूप से पात्रता मानदंड और आवश्यकताएँ निकालता है।",
    "process.step3": "बोलियों का मूल्यांकन करें",
    "process.step3.desc": "विक्रेता बोलियाँ अपलोड करें और AI-संचालित अनुपालन स्कोर प्राप्त करें।",
    "process.step4": "रिपोर्ट जनरेट करें",
    "process.step4.desc": "रैंकिंग के साथ व्यापक मूल्यांकन रिपोर्ट डाउनलोड करें।",
    
    // FAQ Section
    "faq.title": "अक्सर पूछे जाने वाले प्रश्न",
    "faq.q1": "निर्णयAI क्या है?",
    "faq.a1": "निर्णयAI विशेष रूप से सरकारी खरीद के लिए डिज़ाइन किया गया एक AI-संचालित टेंडर मूल्यांकन प्लेटफ़ॉर्म है, जो CRPF जैसी एजेंसियों को विक्रेता बोलियों का कुशलता और पारदर्शिता से मूल्यांकन करने में मदद करता है।",
    "faq.q2": "क्या मेरा डेटा सुरक्षित है?",
    "faq.a2": "हां, निर्णयAI ISO 27001 प्रमाणित है और सरकारी-ग्रेड सुरक्षा उपायों का उपयोग करता है। सभी डेटा को स्थिर और पारगमन में एन्कोडेड किया जाता है।",
    "faq.q3": "AI निष्कर्षण कितना सटीक है?",
    "faq.a3": "हमारे AI मॉडल तकनीकी विनिर्देश निष्कर्षण पर 99.4% सटीकता हासिल करते हैं और सरकारी दस्तावेज़ प्रशिक्षण के साथ लगातार सुधार कर रहे हैं।",
    "faq.q4": "क्या मैं मूल्यांकन रिपोर्ट निर्यात कर सकता हूँ?",
    "faq.a4": "हां, आप PDF, Excel और CSV प्रारूपों में पूर्ण ऑडिट ट्रेल के साथ व्यापक मूल्यांकन रिपोर्ट निर्यात कर सकते हैं।",
    
    // Hackathon Section
    "hackathon.title": "AI for Bharat हैकथॉन 2.0",
    "hackathon.subtitle": "गर्वित प्रतिभागी",
    "hackathon.description": "निर्णयAI को AI for Bharat हैकथॉन 2.0 के हिस्से के रूप में विकसित किया गया था, जिसका आयोजन HackerEarth के सहयोग से PanIIT और कर्नाटक सरकार द्वारा किया गया था।",
    "hackathon.cta": "हैकथॉन विवरण देखें",
    
    // Stats
    "stats.accuracy": "AI सटीकता",
    "stats.time": "समय बचत",
    "stats.compliance": "GFR अनुपालन",
    "stats.processed": "संसाधित दस्तावेज़",
    
    // Security
    "security.iso": "ISO 27001 प्रमाणित",
    "security.cloud": "सरकारी क्लाउड नेटिव • ऑन-प्रिमाइस उपलब्ध",
    
    // Team
    "team.title": "निर्णयAI के पीछे के दिमाग",
    
    // Footer
    "footer.product": "उत्पाद",
    "footer.platform": "प्लेटफ़ॉर्म",
    "footer.process": "प्रक्रिया",
    "footer.faq": "सामान्य प्रश्न",
    "footer.resources": "संसाधन",
    "footer.documentation": "दस्तावेज़ीकरण",
    "footer.api": "API संदर्भ",
    "footer.guide": "उपयोगकर्ता गाइड",
    "footer.legal": "कानूनी",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "सेवा की शर्तें",
    "footer.disclaimer": "अस्वीकरण",
    "footer.madeby": "द्वारा निर्मित",
    "footer.language": "भाषा",
    "footer.english": "English",
    "footer.hindi": "हिंदी",
    
    // Dashboard
    "dashboard.title": "टेंडर डैशबोर्ड",
    "dashboard.newTender": "नया टेंडर",
    "dashboard.upload": "टेंडर दस्तावेज़ अपलोड करें",
    "dashboard.extracting": "मानदंड निकाले जा रहे हैं...",
    "dashboard.eligibility": "पात्रता मानदंड",
    "dashboard.bidders": "बिडर",
    "dashboard.results": "परिणाम",
    "dashboard.noFile": "कोई टेंडर फ़ाइल चयनित नहीं",
    "dashboard.dragDrop": "यहाँ PDF, DOCX, या छवियाँ खींचें और छोड़ें",
    "dashboard.or": "या",
    "dashboard.browse": "फ़ाइलें ब्राउज़ करें",
    "dashboard.supported": "समर्थित: PDF, DOCX, JPG, PNG (अधिकतम 50MB)",
    "dashboard.viewMode": "देखें मोड",
    "dashboard.editMode": "संपादन मोड",
    "dashboard.addCriterion": "मानदंड जोड़ें",
    "dashboard.save": "परिवर्तन सहेजें",
    "dashboard.cancel": "रद्द करें",
    "dashboard.mandatory": "अनिवार्य",
    "dashboard.optional": "वैकल्पिक",
    "dashboard.financial": "वित्तीय",
    "dashboard.technical": "तकनीकी",
    "dashboard.compliance": "अनुपालन",
    "dashboard.documentation": "दस्तावेज़ीकरण",
    "dashboard.threshold": "थ्रेसहोल्ड",
    "dashboard.description": "विवरण",
    "dashboard.id": "आईडी",
    "dashboard.label": "लेबल",
    "dashboard.type": "प्रकार",
    "dashboard.required": "आवश्यक",
    "dashboard.status": "स्थिति",
    "dashboard.actions": "कार्रवाइयाँ",
    "dashboard.evaluate": "मूल्यांकन करें",
    "dashboard.delete": "हटाएँ",
    "dashboard.download": "रिपोर्ट डाउनलोड करें",
    "dashboard.score": "स्कोर",
    "dashboard.pass": "उत्तीर्ण",
    "dashboard.fail": "अनुत्तीर्ण",
    "dashboard.na": "लागू नहीं",
    "dashboard.loading": "लोड हो रहा है...",
    "dashboard.error": "त्रुटि",
    "dashboard.retry": "पुनः प्रयास करें",
    "dashboard.success": "सफल",
    "dashboard.processing": "प्रसंस्करण...",
    "dashboard.completed": "पूर्ण",
    "dashboard.failed": "विफल",
    "dashboard.ocrWarning": "OCR चेतावनी: दस्तावेज़ से टेक्स्ट निकाला नहीं जा सका",
    "dashboard.reExtract": "मानदंड फिर से निकालें",
    "dashboard.tenderOverview": "टेंडर अवलोकन",
    "dashboard.summary": "सारांश",
    "dashboard.keyRequirements": "प्रमुख आवश्यकताएँ",
    "dashboard.criteriaCount": "मानदंड संख्या",
    "dashboard.tenderType": "टेंडर प्रकार",
    "dashboard.estimatedBidders": "अनुमानित बिडर",
    "dashboard.tenderNumber": "टेंडर संख्या",
    "dashboard.lastDate": "अंतिम तिथि",
    "dashboard.emd": "EMD राशि",
    
    // Criteria Page
    "criteria.title": "पात्रता मानदंड सेटअप",
    "criteria.subtitle": "टेंडर मूल्यांकन के लिए पात्रता मानदंड परिभाषित और प्रबंधित करें",
    "criteria.addNew": "नया मानदंड जोड़ें",
    "criteria.preview": "पूर्वावलोकन",
    "criteria.saveAll": "सभी मानदंड सहेजें",
    "criteria.back": "डैशबोर्ड पर वापस जाएँ",
    "criteria.noCriteria": "अभी तक कोई मानदंड परिभाषित नहीं",
    "criteria.addFirst": "प्रारंभ करने के लिए अपना पहला मानदंड जोड़ें",
    "criteria.duplicate": "डुप्लिकेट",
    "criteria.remove": "हटाएँ",
    "criteria.dragDrop": "पुनः क्रमबद्ध करने के लिए खींचें और छोड़ें",
    "criteria.autoExtract": "दस्तावेज़ से स्वचालित निष्कर्षण",
    "criteria.manualAdd": "मैन्युअल रूप से मानदंड जोड़ें",
    "criteria.aiExtract": "AI आपके अपलोड किए गए टेंडर दस्तावेजों से मानदंड निकालेगा",
    
    // Common
    "common.close": "बंद करें",
    "common.open": "खोलें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएँ",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.back": "वापस",
    "common.next": "अगला",
    "common.submit": "जमा करें",
    "common.continue": "जारी रखें",
    "common.yes": "हाँ",
    "common.no": "नहीं",
    "common.ok": "ठीक है",
    "common.confirm": "पुष्टि करें",
    "common.warning": "चेतावनी",
    "common.info": "जानकारी",
    "common.error": "त्रुटि",
    "common.success": "सफल",
    "common.loading": "लोड हो रहा है...",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.sort": "क्रमबद्ध करें",
    "common.all": "सभी",
    "common.none": "कोई नहीं",
    "common.select": "चुनें",
    "common.selected": "चयनित",
    "common.clear": "साफ़ करें",
    "common.reset": "रीसेट",
    "common.apply": "लागू करें",
    "common.show": "दिखाएँ",
    "common.hide": "छुपाएँ",
    "common.more": "अधिक",
    "common.less": "कम",
    "common.expand": "विस्तार",
    "common.collapse": "संक्षिप्त",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);
  const [cache, setCache] = useState<TranslationCache>({});

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("nirnayai-language") as Language;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguage(saved);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    // Save language preference
    localStorage.setItem("nirnayai-language", language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language][key];
    if (translation) return translation;
    
    // If no translation found, return fallback or the key itself
    if (fallback) return fallback;
    
    // Try English as fallback
    const englishTranslation = translations.en[key];
    if (englishTranslation) return englishTranslation;
    
    return key;
  };

  // Google Translate API function for body text
  const translateText = async (text: string): Promise<string> => {
    if (!text || text.trim() === "" || language === "en") return text;

    const cacheKey = `${language}:${text}`;
    
    // Check cache first
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLang: language === "hi" ? "hi" : "en",
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Update cache
      setCache((prev) => ({
        ...prev,
        [cacheKey]: translatedText,
      }));

      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, translateText, isReady }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

export type { Language };
