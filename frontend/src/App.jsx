import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Leaf, RotateCcw, Sprout } from "lucide-react";

const STATE_LANG_MAP = {
  "Andhra Pradesh": "Telugu",
  "Arunachal Pradesh": "English",
  Assam: "Assamese",
  Bihar: "Hindi",
  Chhattisgarh: "Hindi",
  Goa: "Konkani",
  Gujarat: "Gujarati",
  Haryana: "Hindi",
  "Himachal Pradesh": "Hindi",
  Jharkhand: "Hindi",
  Karnataka: "Kannada",
  Kerala: "Malayalam",
  "Madhya Pradesh": "Hindi",
  Maharashtra: "Marathi",
  Manipur: "Manipuri",
  Meghalaya: "Khasi",
  Mizoram: "Mizo",
  Nagaland: "English",
  Odisha: "Odia",
  Punjab: "Punjabi",
  Rajasthan: "Hindi",
  Sikkim: "Nepali",
  "Tamil Nadu": "Tamil",
  Telangana: "Telugu",
  Tripura: "Bengali",
  "Uttar Pradesh": "Hindi",
  Uttarakhand: "Hindi",
  "West Bengal": "Bengali",
};

const I18N = {
  English: {
    title: "Smart Crop Expert AI",
    online: "Online",
    welcome: "Welcome to Smart Crop Expert AI. Let us identify the likely rice pest.",
    typing: "Typing...",
    restart: "Restart",
    continue: "Continue",
    stateQuestion: "Select your state",
    languageQuestion: "Choose preferred language",
    stageQuestion: "Select crop stage",
    symptomQuestion: "Select symptom",
    insectsQuestion: "Insects present?",
    partQuestion: "Part damaged",
    healthQuestion: "Plant condition",
    colorQuestion: "Crop appearance",
    patternQuestion: "Damage pattern",
    result: (pest, solution) => `Likely pest: ${pest}. Solution: ${solution}`,
    options: {},
  },
  Hindi: {
    title: "स्मार्ट क्रॉप एक्सपर्ट एआई",
    online: "ऑनलाइन",
    welcome: "स्मार्ट क्रॉप एक्सपर्ट एआई में आपका स्वागत है। आइए संभावित धान कीट की पहचान करें।",
    typing: "टाइप कर रहा है...",
    restart: "फिर से शुरू करें",
    continue: "आगे बढ़ें",
    stateQuestion: "अपना राज्य चुनें",
    languageQuestion: "पसंदीदा भाषा चुनें",
    stageQuestion: "फसल की अवस्था चुनें",
    symptomQuestion: "लक्षण चुनें",
    insectsQuestion: "क्या कीट मौजूद हैं?",
    partQuestion: "कौन सा भाग प्रभावित है",
    healthQuestion: "पौधे की स्थिति",
    colorQuestion: "फसल का रंग",
    patternQuestion: "क्षति का पैटर्न",
    result: (pest, solution) => `संभावित कीट: ${pest}. समाधान: ${solution}`,
    options: {
      Nursery: "नर्सरी",
      "Planting-PI": "रोपाई-पीआई",
      "Flowering-Maturity": "फूल से पकने तक",
      "Tips of leaves with silvery streak": "पत्तियों की नोक पर चांदी जैसी धारियां",
      "Lesions begin as water soaked stripes": "घाव पानी भरी धारियों से शुरू होते हैं",
      "Other symptom": "अन्य लक्षण",
      Yes: "हाँ",
      No: "नहीं",
      Leaves: "पत्तियां",
      Tillers: "टिलर्स",
      Root: "जड़",
      Healthy: "स्वस्थ",
      Unhealthy: "अस्वस्थ",
      White: "सफेद",
      Yellow: "पीला",
      Green: "हरा",
      Brown: "भूरा",
      Other: "अन्य",
      Uniform: "एकसमान",
      Patches: "धब्बों में",
    },
  },
  Telugu: {
    title: "స్మార్ట్ క్రాప్ ఎక్స్‌పర్ట్ ఏఐ",
    online: "ఆన్‌లైన్",
    welcome: "స్మార్ట్ క్రాప్ ఎక్స్‌పర్ట్ ఏఐకి స్వాగతం. వరి పంటలో ఉండే సాధ్యమైన పురుగును గుర్తిద్దాం.",
    typing: "టైప్ చేస్తోంది...",
    restart: "మళ్లీ ప్రారంభించండి",
    continue: "కొనసాగించండి",
    stateQuestion: "మీ రాష్ట్రాన్ని ఎంచుకోండి",
    languageQuestion: "ఇష్టమైన భాషను ఎంచుకోండి",
    stageQuestion: "పంట దశను ఎంచుకోండి",
    symptomQuestion: "లక్షణాన్ని ఎంచుకోండి",
    insectsQuestion: "పురుగులు ఉన్నాయా?",
    partQuestion: "ఏ భాగం దెబ్బతింది",
    healthQuestion: "మొక్క స్థితి",
    colorQuestion: "పంట రంగు",
    patternQuestion: "నష్టం నమూనా",
    result: (pest, solution) => `సంభావ్య పురుగు: ${pest}. పరిష్కారం: ${solution}`,
    options: {
      Nursery: "నర్సరీ",
      "Planting-PI": "నాటడం-పీఐ",
      "Flowering-Maturity": "పుష్పించడం-పక్వం",
      "Tips of leaves with silvery streak": "ఆకుల చివరల్లో వెండి గీతలు",
      "Lesions begin as water soaked stripes": "గాయాలు నీటితో తడిసిన గీతలుగా మొదలవుతాయి",
      "Other symptom": "ఇతర లక్షణం",
      Yes: "అవును",
      No: "కాదు",
      Leaves: "ఆకులు",
      Tillers: "టిల్లర్లు",
      Root: "వేరు",
      Healthy: "ఆరోగ్యంగా ఉంది",
      Unhealthy: "అనారోగ్యంగా ఉంది",
      White: "తెలుపు",
      Yellow: "పసుపు",
      Green: "ఆకుపచ్చ",
      Brown: "గోధుమ",
      Other: "ఇతర",
      Uniform: "సమానంగా",
      Patches: "మచ్చలు",
    },
  },
  Tamil: {
    title: "ஸ்மார்ட் கிராப் எக்ஸ்பர்ட் ஏஐ",
    online: "ஆன்லைன்",
    welcome: "ஸ்மார்ட் கிராப் எக்ஸ்பர்ட் ஏஐக்கு வரவேற்கிறோம். சாத்தியமான நெல் பூச்சியை கண்டுபிடிப்போம்.",
    typing: "தட்டச்சு செய்கிறது...",
    restart: "மீண்டும் தொடங்கு",
    continue: "தொடரவும்",
    stateQuestion: "உங்கள் மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    languageQuestion: "விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்",
    stageQuestion: "பயிர் நிலையைத் தேர்ந்தெடுக்கவும்",
    symptomQuestion: "அறிகுறியைத் தேர்ந்தெடுக்கவும்",
    insectsQuestion: "பூச்சிகள் உள்ளனவா?",
    partQuestion: "எந்த பகுதி பாதிக்கப்பட்டது",
    healthQuestion: "தாவர நிலை",
    colorQuestion: "பயிரின் தோற்ற நிறம்",
    patternQuestion: "சேதத்தின் முறை",
    result: (pest, solution) => `சாத்தியமான பூச்சி: ${pest}. தீர்வு: ${solution}`,
    options: {
      Nursery: "நர்சரி",
      "Planting-PI": "நட்டு-பிஐ",
      "Flowering-Maturity": "மலர்ச்சி-முதிர்ச்சி",
      "Tips of leaves with silvery streak": "இலை நுனிகளில் வெள்ளி கோடுகள்",
      "Lesions begin as water soaked stripes": "காயங்கள் நீர் ஊறிய கோடுகளாக தொடங்கும்",
      "Other symptom": "வேறு அறிகுறி",
      Yes: "ஆம்",
      No: "இல்லை",
      Leaves: "இலைகள்",
      Tillers: "தண்டுகள்",
      Root: "வேர்",
      Healthy: "ஆரோக்கியம்",
      Unhealthy: "ஆரோக்கியமில்லை",
      White: "வெள்ளை",
      Yellow: "மஞ்சள்",
      Green: "பச்சை",
      Brown: "பழுப்பு",
      Other: "மற்றவை",
      Uniform: "ஒரே மாதிரி",
      Patches: "படிகட்டுகள்",
    },
  },
  Kannada: {
    title: "ಸ್ಮಾರ್ಟ್ ಕ್ರಾಪ್ ಎಕ್ಸ್‌ಪರ್ಟ್ ಎಐ",
    online: "ಆನ್‌ಲೈನ್",
    welcome: "ಸ್ಮಾರ್ಟ್ ಕ್ರಾಪ್ ಎಕ್ಸ್‌ಪರ್ಟ್ ಎಐಗೆ ಸ್ವಾಗತ. ಸಾಧ್ಯವಾದ ಅಕ್ಕಿ ಕೀಟವನ್ನು ಗುರುತಿಸೋಣ.",
    typing: "ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
    restart: "ಮತ್ತೆ ಆರಂಭಿಸಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    stateQuestion: "ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    languageQuestion: "ಇಷ್ಟದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    stageQuestion: "ಬೆಳೆ ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    symptomQuestion: "ಲಕ್ಷಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    insectsQuestion: "ಕೀಟಗಳು ಕಂಡು ಬರುತ್ತಿವೆಯೇ?",
    partQuestion: "ಯಾವ ಭಾಗ ಹಾನಿಯಾಗಿದೆ",
    healthQuestion: "ಸಸ್ಯದ ಸ್ಥಿತಿ",
    colorQuestion: "ಬೆಳೆಯ ಬಣ್ಣ",
    patternQuestion: "ಹಾನಿಯ ವಿನ್ಯಾಸ",
    result: (pest, solution) => `ಸಂಭಾವ್ಯ ಕೀಟ: ${pest}. ಪರಿಹಾರ: ${solution}`,
    options: {
      Nursery: "ನರ್ಸರಿ",
      "Planting-PI": "ನೆಡುವಿಕೆ-ಪಿಐ",
      "Flowering-Maturity": "ಹೂವು-ಪಕ್ವತೆ",
      "Tips of leaves with silvery streak": "ಎಲೆ ತುದಿಗಳಲ್ಲಿ ಬೆಳ್ಳಿಯ ಪಟ್ಟೆಗಳು",
      "Lesions begin as water soaked stripes": "ಗಾಯಗಳು ನೀರಿನ ರೇಖೆಗಳಾಗಿ ಆರಂಭವಾಗುತ್ತವೆ",
      "Other symptom": "ಇತರೆ ಲಕ್ಷಣ",
      Yes: "ಹೌದು",
      No: "ಇಲ್ಲ",
      Leaves: "ಎಲೆಗಳು",
      Tillers: "ಟಿಲ್ಲರ್‌ಗಳು",
      Root: "ಬೇರು",
      Healthy: "ಆರೋಗ್ಯಕರ",
      Unhealthy: "ಅನಾರೋಗ್ಯಕರ",
      White: "ಬಿಳಿ",
      Yellow: "ಹಳದಿ",
      Green: "ಹಸಿರು",
      Brown: "ಕಂದು",
      Other: "ಇತರೆ",
      Uniform: "ಏಕರೀತಿ",
      Patches: "ಚುಕ್ಕೆಗಳು",
    },
  },
  Malayalam: {
    title: "സ്മാർട്ട് ക്രോപ്പ് എക്സ്പേർട്ട് എഐ",
    online: "ഓൺലൈൻ",
    welcome: "സ്മാർട്ട് ക്രോപ്പ് എക്സ്പേർട്ട് എഐയിലേക്ക് സ്വാഗതം. സാധ്യതയുള്ള നെൽ കീടം കണ്ടെത്താം.",
    typing: "ടൈപ്പ് ചെയ്യുന്നു...",
    restart: "വീണ്ടും ആരംഭിക്കുക",
    continue: "തുടരുക",
    stateQuestion: "നിങ്ങളുടെ സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    languageQuestion: "ഇഷ്ടഭാഷ തിരഞ്ഞെടുക്കുക",
    stageQuestion: "വിളയുടെ ഘട്ടം തിരഞ്ഞെടുക്കുക",
    symptomQuestion: "ലക്ഷണം തിരഞ്ഞെടുക്കുക",
    insectsQuestion: "കീടങ്ങൾ കാണുന്നുണ്ടോ?",
    partQuestion: "ഏത് ഭാഗമാണ് കേടായത്",
    healthQuestion: "സസ്യത്തിന്റെ നില",
    colorQuestion: "വിളയുടെ നിറം",
    patternQuestion: "നാശത്തിന്റെ രൂപം",
    result: (pest, solution) => `സാധ്യതയുള്ള കീടം: ${pest}. പരിഹാരം: ${solution}`,
    options: {
      Nursery: "നഴ്സറി",
      "Planting-PI": "നട്ട്-പിഐ",
      "Flowering-Maturity": "പൂക്കൽ-പക്വത",
      "Tips of leaves with silvery streak": "ഇലയുടെ അറ്റങ്ങളിൽ വെള്ളിവരകൾ",
      "Lesions begin as water soaked stripes": "മുറിവുകൾ വെള്ളം കുതിർന്ന വരകളായി തുടങ്ങുന്നു",
      "Other symptom": "മറ്റ് ലക്ഷണം",
      Yes: "അതെ",
      No: "ഇല്ല",
      Leaves: "ഇലകൾ",
      Tillers: "ടില്ലറുകൾ",
      Root: "വേര്",
      Healthy: "ആരോഗ്യം നല്ലത്",
      Unhealthy: "ആരോഗ്യം മോശം",
      White: "വെള്ളി",
      Yellow: "മഞ്ഞ",
      Green: "പച്ച",
      Brown: "തവിട്ട്",
      Other: "മറ്റ്",
      Uniform: "ഏകരൂപം",
      Patches: "പാച്ചുകൾ",
    },
  },
};

const FLOW = [
  { key: "state", questionKey: "stateQuestion", options: Object.keys(STATE_LANG_MAP) },
  {
    key: "language",
    questionKey: "languageQuestion",
    options: (answers) => ["English", STATE_LANG_MAP[answers.state]],
  },
  { key: "stage", questionKey: "stageQuestion", options: ["Nursery", "Planting-PI", "Flowering-Maturity"] },
  {
    key: "symptom",
    questionKey: "symptomQuestion",
    type: "multi",
    options: [
      "Tips of leaves with silvery streak",
      "Lesions begin as water soaked stripes",
      "Other symptom",
    ],
  },
  { key: "insects", questionKey: "insectsQuestion", options: ["Yes", "No"] },
  {
    key: "part",
    questionKey: "partQuestion",
    options: ["Leaves", "Tillers", "Root"],
    cond: (answers) => answers.insects === "Yes",
  },
  { key: "health", questionKey: "healthQuestion", options: ["Healthy", "Unhealthy"] },
  {
    key: "color",
    questionKey: "colorQuestion",
    options: ["White", "Yellow", "Green", "Brown", "Other"],
    cond: (answers) => answers.health === "Unhealthy",
  },
  { key: "pattern", questionKey: "patternQuestion", options: ["Uniform", "Patches"] },
];

const RULES = [
  {
    pest: "Rice Thrips",
    solution: "Use neem oil spray or a locally recommended thrips treatment.",
    stage: ["Nursery", "Planting-PI"],
    symptom: "Tips of leaves with silvery streak",
  },
  {
    pest: "Rice Hispa",
    solution: "Use a recommended chlorpyrifos-based control as per local advisory.",
    stage: ["Planting-PI", "Flowering-Maturity"],
    symptom: "Lesions begin as water soaked stripes",
    part: ["Leaves"],
    pattern: ["Patches"],
  },
  {
    pest: "Leaf Folder",
    solution: "Apply a recommended leaf folder control spray and monitor folded leaves.",
    stage: ["Planting-PI", "Flowering-Maturity"],
    symptom: "Other symptom",
    part: ["Leaves"],
    insects: "Yes",
  },
  {
    pest: "Stem Borer",
    solution: "Apply cartap hydrochloride or another approved stem borer treatment.",
    stage: ["Planting-PI", "Flowering-Maturity"],
    part: ["Tillers"],
    color: ["Yellow", "White"],
  },
  {
    pest: "Brown Planthopper",
    solution: "Use buprofezin or another approved recommendation and avoid excess nitrogen.",
    stage: ["Planting-PI", "Flowering-Maturity"],
    color: ["Brown"],
    pattern: ["Patches"],
  },
];

function getDiagnosis(answers) {
  const symptomList = answers.symptom || [];

  for (const rule of RULES) {
    const matches =
      (!rule.stage || rule.stage.includes(answers.stage)) &&
      (!rule.symptom || symptomList.includes(rule.symptom)) &&
      (!rule.part || rule.part.includes(answers.part)) &&
      (!rule.color || rule.color.includes(answers.color)) &&
      (!rule.pattern || rule.pattern.includes(answers.pattern)) &&
      (!rule.insects || rule.insects === answers.insects);

    if (matches) {
      return { pest: rule.pest, solution: rule.solution };
    }
  }

  if (symptomList.includes("Tips of leaves with silvery streak")) {
    return {
      pest: "Rice Thrips",
      solution: "Use neem oil spray or a locally recommended thrips treatment.",
    };
  }

  return {
    pest: "Stem Borer",
    solution: "Use a locally approved stem borer recommendation and confirm with an extension expert.",
  };
}

function getLanguage(answers) {
  return I18N[answers.language] ? answers.language : "English";
}

function t(language, key) {
  return I18N[language]?.[key] ?? I18N.English[key];
}

function optionLabel(language, value) {
  return I18N[language]?.options?.[value] ?? value;
}

function PlantIllustration() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center opacity-90">
      <svg viewBox="0 0 320 140" className="h-28 w-full max-w-md text-emerald-200/80">
        <path d="M160 130 C150 110 145 88 146 65" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M146 78 C115 74 99 52 102 27 C127 33 145 49 146 78Z" fill="currentColor" />
        <path d="M148 60 C180 56 205 34 211 10 C183 11 155 28 148 60Z" fill="currentColor" opacity="0.8" />
        <path d="M160 130 C171 108 177 86 176 62" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M176 76 C205 72 226 54 231 28 C205 31 182 48 176 76Z" fill="currentColor" opacity="0.7" />
        <circle cx="160" cy="132" r="9" fill="#d1fae5" />
      </svg>
    </div>
  );
}

function Message({ message }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} animate-[messageIn_0.25s_ease-out]`}>
      <div
        className={
          isBot
            ? "max-w-[85%] rounded-[20px] rounded-bl-md border border-emerald-100 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm"
            : "max-w-[85%] rounded-[20px] rounded-br-md bg-gradient-to-r from-emerald-500 to-violet-500 px-4 py-3 text-sm text-white shadow-lg shadow-emerald-500/20"
        }
      >
        {message.text}
      </div>
    </div>
  );
}

function Options({ options, onSelect, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option)}
          className="rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ options, onSubmit, disabled, buttonLabel }) {
  const [selected, setSelected] = useState([]);

  function toggleOption(option) {
    setSelected((current) =>
      current.some((item) => item.value === option.value)
        ? current.filter((item) => item.value !== option.value)
        : [...current, option]
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {options.map((option) => {
          const active = selected.some((item) => item.value === option.value);

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => toggleOption(option)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-violet-200"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`ml-3 h-5 w-5 rounded-full border ${
                  active ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={disabled || selected.length === 0}
        onClick={() => onSubmit(selected)}
        className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function App() {
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([{ sender: "bot", text: I18N.English.welcome }]);
  const [asked, setAsked] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [resultShown, setResultShown] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const language = getLanguage(answers);
  const activeFlow = useMemo(() => FLOW.filter((step) => !step.cond || step.cond(answers)), [answers]);
  const currentStep = activeFlow.find((step) => answers[step.key] === undefined);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTyping) return;

    if (currentStep && !asked.includes(currentStep.key)) {
      setIsTyping(true);
      timerRef.current = setTimeout(() => {
        const promptLanguage = answers.language ? language : "English";
        setMessages((current) => [
          ...current,
          { sender: "bot", text: t(promptLanguage, currentStep.questionKey) },
        ]);
        setAsked((current) => [...current, currentStep.key]);
        setIsTyping(false);
      }, 450);
      return;
    }

    if (!currentStep && !resultShown) {
      const result = getDiagnosis(answers);
      setIsTyping(true);
      timerRef.current = setTimeout(() => {
        setMessages((current) => [
          ...current,
          { sender: "bot", text: t(language, "result")(result.pest, result.solution) },
        ]);
        setResultShown(true);
        setIsTyping(false);
      }, 650);
    }
  }, [answers, asked, currentStep, isTyping, language, resultShown]);

  function handleAnswer(key, value, label) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setMessages((current) => [...current, { sender: "user", text: label }]);
  }

  function restartChat() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnswers({});
    setAsked([]);
    setIsTyping(false);
    setResultShown(false);
    setMessages([{ sender: "bot", text: I18N.English.welcome }]);
  }

  function renderInput() {
    if (!currentStep) {
      return (
        <button
          type="button"
          onClick={restartChat}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <RotateCcw className="h-4 w-4" />
          {t(language, "restart")}
        </button>
      );
    }

    const promptLanguage = answers.language ? language : "English";
    const rawOptions =
      typeof currentStep.options === "function" ? currentStep.options(answers) : currentStep.options;
    const options = rawOptions.map((value) => ({ value, label: optionLabel(promptLanguage, value) }));

    if (currentStep.type === "multi") {
      return (
        <MultiSelect
          options={options}
          disabled={isTyping}
          buttonLabel={t(promptLanguage, "continue")}
          onSubmit={(selected) =>
            handleAnswer(
              currentStep.key,
              selected.map((item) => item.value),
              selected.map((item) => item.label).join(", ")
            )
          }
        />
      );
    }

    return (
      <Options
        options={options}
        disabled={isTyping}
        onSelect={(option) => handleAnswer(currentStep.key, option.value, option.label)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_28%),linear-gradient(180deg,_#f5fff8,_#f8fafc)] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
        <div className="relative flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/85 shadow-2xl shadow-emerald-950/10 backdrop-blur">
          <PlantIllustration />

          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-violet-500 px-5 py-5 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_42%)]" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{t(language, "title")}</h1>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/90">
                    <span className="h-2 w-2 rounded-full bg-emerald-200" />
                    {t(language, "online")}
                  </div>
                </div>
              </div>
              <div className="hidden rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium sm:flex sm:items-center sm:gap-2">
                <Sprout className="h-3.5 w-3.5" />
                Rice Support
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="custom-scroll relative flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,_rgba(236,253,245,0.55),_rgba(255,255,255,0.9))] px-4 py-5">
            <div className="absolute left-3 top-6 hidden rounded-full bg-emerald-100/70 p-2 text-emerald-600 sm:block">
              <Leaf className="h-4 w-4" />
            </div>

            {messages.map((message, index) => (
              <Message key={`${message.sender}-${index}`} message={message} />
            ))}

            {isTyping && (
              <div className="flex justify-start animate-[messageIn_0.25s_ease-out]">
                <div className="rounded-[20px] rounded-bl-md border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  {t(language, "typing")}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-emerald-100 bg-white/95 px-4 py-4 backdrop-blur">
            {renderInput()}
          </div>
        </div>
      </div>
    </div>
  );
}
