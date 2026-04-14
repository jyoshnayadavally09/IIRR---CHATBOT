import { useEffect, useMemo, useRef, useState } from 'react';
import { predictData } from '../services/api';

const initialForm = {
  farmerName: '',
  location: { latitude: 'Detecting...', longitude: 'Detecting...', state: 'Detecting...' },
  weatherType: 'Normal',
  rainfall: 'Low',
  temperature: '10-20',
  humidity: '<50',
  abnormalWeather: 'Cyclones',
  varietyType: 'Hybrid',
  varietyName: '',
  cropDuration: 'Short',
  stage: 'Nursery',
  cropStatus: 'Healthy',
  color: 'Green',
  distribution: 'Uniform',
  primarySymptom: 'Silvery streak',
  customSymptom: '',
  additionalSymptoms: [],
  customAdditionalSymptom: '',
  insectsPresent: 'No',
  partDamaged: 'Leaf',
  insectLocation: 'Inside',
  damageLevel: 'More than ETL',
};

const questionSequence = [
  { key: 'farmerName', type: 'text', question: 'What is your name?', placeholder: 'Enter farmer name' },
  { key: 'weatherType', type: 'select', question: 'What is the weather condition?', options: ['Normal', 'Abnormal'] },
  { key: 'rainfall', type: 'select', question: 'What is the rainfall level?', options: ['Low', 'Medium', 'High'], condition: (form) => form.weatherType === 'Normal' },
  { key: 'temperature', type: 'select', question: 'What is the temperature range?', options: ['10-20', '20-30', '>30'], condition: (form) => form.weatherType === 'Normal' },
  { key: 'humidity', type: 'select', question: 'What is the humidity level?', options: ['<50', '50-90', '>90'], condition: (form) => form.weatherType === 'Normal' },
  { key: 'abnormalWeather', type: 'select', question: 'What type of abnormal weather?', options: ['Cyclones', 'Delayed Rains', 'Early Drought', 'Flood', 'Continuous Rainy Days', 'Dry Spell', 'Others'], condition: (form) => form.weatherType === 'Abnormal' },
  { key: 'varietyType', type: 'select', question: 'What is the variety type?', options: ['Hybrid', 'HYV', 'Local', 'Other'] },
  { key: 'varietyName', type: 'text', question: 'What is the variety name?', placeholder: 'Enter variety name' },
  { key: 'cropDuration', type: 'select', question: 'What is the crop duration?', options: ['Short', 'Medium', 'Long'] },
  { key: 'stage', type: 'select', question: 'What is the crop stage?', options: ['Nursery', 'Planting (PI)', 'Flowering-Maturity'] },
  { key: 'cropStatus', type: 'select', question: 'How is the crop health?', options: ['Healthy', 'Unhealthy'] },
  { key: 'color', type: 'select', question: 'What is the field color?', options: ['Green', 'Yellow', 'White', 'Brown', 'Other'], condition: (form) => form.cropStatus === 'Unhealthy' },
  { key: 'distribution', type: 'select', question: 'How is the issue distributed?', options: ['Uniform', 'Patches'], condition: (form) => form.cropStatus === 'Unhealthy' },
  { key: 'primarySymptom', type: 'select', question: 'What is the primary symptom?', options: ['Silvery streak', 'White streak scraping', 'Leaf sheath blight', 'Wilting', 'Other'], condition: (form) => form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' },
  { key: 'customSymptom', type: 'text', question: 'Please describe the symptom:', placeholder: 'Describe the symptom', condition: (form) => form.primarySymptom === 'Other' && form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' },
  { key: 'additionalSymptoms', type: 'multiselect', question: 'Any additional symptoms?', options: ['Pointed leaf tips', 'Blue beetles present', 'Excreta in leaf folds', 'Sclerotia', 'Black lesions', 'Grubs inside leaf', 'Leaf rolling', 'Dry spell', 'Other'], condition: (form) => form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' },
  { key: 'customAdditionalSymptom', type: 'text', question: 'Describe the additional symptom:', placeholder: 'Describe the symptom', condition: (form) => form.additionalSymptoms.includes('Other') && form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' },
  { key: 'insectsPresent', type: 'select', question: 'Are insects present?', options: ['No', 'Yes'], condition: (form) => form.cropStatus === 'Unhealthy' },
  { key: 'partDamaged', type: 'select', question: 'Which part is damaged?', options: ['Leaf', 'Stem', 'Root'], condition: (form) => form.cropStatus === 'Unhealthy' && form.insectsPresent === 'Yes' },
  { key: 'insectLocation', type: 'select', question: 'Where are the insects?', options: ['Inside', 'Outside'], condition: (form) => form.cropStatus === 'Unhealthy' && form.insectsPresent === 'Yes' },
  { key: 'damageLevel', type: 'select', question: 'What is the damage level?', options: ['More than ETL', 'Less than ETL'] },
];

const stateCodeMap = {
  'IN-AP': 'Andhra Pradesh',
  'IN-TS': 'Telangana',
};

const stateLanguageMap = {
  'Andhra Pradesh': 'Telugu',
  Telangana: 'Telugu',
  Karnataka: 'Kannada',
  'Tamil Nadu': 'Tamil',
  Kerala: 'Malayalam',
  Maharashtra: 'Marathi',
  Gujarat: 'Gujarati',
  Odisha: 'Odia',
  'West Bengal': 'Bengali',
  Punjab: 'Punjabi',
  Haryana: 'Hindi',
  Rajasthan: 'Hindi',
  'Uttar Pradesh': 'Hindi',
  Bihar: 'Hindi',
  'Madhya Pradesh': 'Hindi',
  Chhattisgarh: 'Hindi',
  Jharkhand: 'Hindi',
  'Himachal Pradesh': 'Hindi',
  Uttarakhand: 'Hindi',
  Delhi: 'Hindi',
  Assam: 'Assamese',
};

const stateLanguageCodeMap = {
  Telugu: 'te',
  English: 'en',
};

const questionMap = Object.fromEntries(questionSequence.map((question) => [question.key, question]));

const translations = {
  en: {
    ui: {
      title: 'Crop Health Assistant',
      online: "We're online",
      tagline: 'Share your crop details and get instant AI farm guidance in one focused space.',
      question: 'Question',
      conversation: 'Conversation',
      answered: 'answered',
      assessmentComplete: 'Assessment complete',
      preparingNextStep: 'Preparing next step',
      autoLocationStatus: 'Auto-location status',
      languages: 'Languages',
      language: 'Language',
      english: 'English',
      telugu: 'Telugu',
      thankYou: 'Thank You',
      send: 'Send',
      selectOption: 'Select an option...',
      multiselectHint: 'Hold Ctrl (Cmd) to select multiple',
      detectingLocation: 'Detecting location...',
      locationUnsupported: 'Location unsupported',
      locationDenied: 'Location access denied',
      locationError: 'Unable to retrieve location',
      localLanguage: 'Local language',
    },
    messages: {
      welcome: 'Hello! I am your agricultural assistant. I will help you assess your crop condition and provide accurate recommendations for your farm.',
      processing: 'Thank you. Processing your farm data...',
      analysisComplete: (prediction) => `Analysis complete.\n\nPrediction: ${prediction}`,
      error: 'Sorry, there was an error processing your data. Please try again.',
      completion: 'For more queries, contact Kisan 1059.',
    },
    placeholders: {
      farmerName: 'Enter farmer name',
      varietyName: 'Enter variety name',
      customSymptom: 'Describe the symptom',
      customAdditionalSymptom: 'Describe the symptom',
    },
    questions: {
      farmerName: 'What is your name?',
      weatherType: 'What is the weather condition?',
      rainfall: 'What is the rainfall level?',
      temperature: 'What is the temperature range?',
      humidity: 'What is the humidity level?',
      abnormalWeather: 'What type of abnormal weather?',
      varietyType: 'What is the variety type?',
      varietyName: 'What is the variety name?',
      cropDuration: 'What is the crop duration?',
      stage: 'What is the crop stage?',
      cropStatus: 'How is the crop health?',
      color: 'What is the field color?',
      distribution: 'How is the issue distributed?',
      primarySymptom: 'What is the primary symptom?',
      customSymptom: 'Please describe the symptom:',
      additionalSymptoms: 'Any additional symptoms?',
      customAdditionalSymptom: 'Describe the additional symptom:',
      insectsPresent: 'Are insects present?',
      partDamaged: 'Which part is damaged?',
      insectLocation: 'Where are the insects?',
      damageLevel: 'What is the damage level?',
    },
    options: {
      weatherType: { Normal: 'Normal', Abnormal: 'Abnormal' },
      rainfall: { Low: 'Low', Medium: 'Medium', High: 'High' },
      temperature: { '10-20': '10-20', '20-30': '20-30', '>30': '>30' },
      humidity: { '<50': '<50', '50-90': '50-90', '>90': '>90' },
      abnormalWeather: {
        Cyclones: 'Cyclones',
        'Delayed Rains': 'Delayed Rains',
        'Early Drought': 'Early Drought',
        Flood: 'Flood',
        'Continuous Rainy Days': 'Continuous Rainy Days',
        'Dry Spell': 'Dry Spell',
        Others: 'Others',
      },
      varietyType: { Hybrid: 'Hybrid', HYV: 'HYV', Local: 'Local', Other: 'Other' },
      cropDuration: { Short: 'Short', Medium: 'Medium', Long: 'Long' },
      stage: {
        Nursery: 'Nursery',
        'Planting (PI)': 'Planting (PI)',
        'Flowering-Maturity': 'Flowering-Maturity',
      },
      cropStatus: { Healthy: 'Healthy', Unhealthy: 'Unhealthy' },
      color: { Green: 'Green', Yellow: 'Yellow', White: 'White', Brown: 'Brown', Other: 'Other' },
      distribution: { Uniform: 'Uniform', Patches: 'Patches' },
      primarySymptom: {
        'Silvery streak': 'Silvery streak',
        'White streak scraping': 'White streak scraping',
        'Leaf sheath blight': 'Leaf sheath blight',
        Wilting: 'Wilting',
        Other: 'Other',
      },
      additionalSymptoms: {
        'Pointed leaf tips': 'Pointed leaf tips',
        'Blue beetles present': 'Blue beetles present',
        'Excreta in leaf folds': 'Excreta in leaf folds',
        Sclerotia: 'Sclerotia',
        'Black lesions': 'Black lesions',
        'Grubs inside leaf': 'Grubs inside leaf',
        'Leaf rolling': 'Leaf rolling',
        'Dry spell': 'Dry spell',
        Other: 'Other',
      },
      insectsPresent: { No: 'No', Yes: 'Yes' },
      partDamaged: { Leaf: 'Leaf', Stem: 'Stem', Root: 'Root' },
      insectLocation: { Inside: 'Inside', Outside: 'Outside' },
      damageLevel: { 'More than ETL': 'More than ETL', 'Less than ETL': 'Less than ETL' },
    },
  },
  te: {
    ui: {
      title: 'పంట ఆరోగ్య సహాయకుడు',
      online: 'మేము ఆన్‌లైన్‌లో ఉన్నాము',
      tagline: 'మీ పంట వివరాలను పంచుకోండి మరియు ఒకే చోట తక్షణ AI వ్యవసాయ మార్గదర్శకత పొందండి.',
      question: 'ప్రశ్న',
      conversation: 'సంభాషణ',
      answered: 'సమాధానాలు',
      assessmentComplete: 'విశ్లేషణ పూర్తైంది',
      preparingNextStep: 'తదుపరి దశ సిద్ధం చేస్తోంది',
      autoLocationStatus: 'ఆటో-లొకేషన్ స్థితి',
      languages: 'భాషలు',
      language: 'భాష',
      english: 'ఆంగ్లం',
      telugu: 'తెలుగు',
      thankYou: 'ధన్యవాదాలు',
      send: 'పంపండి',
      selectOption: 'ఒక ఎంపికను ఎంచుకోండి...',
      multiselectHint: 'అనేక ఎంపికలకు Ctrl (Cmd) నొక్కి ఉంచండి',
      detectingLocation: 'లొకేషన్‌ను గుర్తిస్తోంది...',
      locationUnsupported: 'లొకేషన్ మద్దతు లేదు',
      locationDenied: 'లొకేషన్ అనుమతి నిరాకరించబడింది',
      locationError: 'లొకేషన్‌ను పొందలేకపోయాము',
      localLanguage: 'స్థానిక భాష',
    },
    messages: {
      welcome: 'హలో! నేను మీ వ్యవసాయ సహాయకుడిని. మీ పంట పరిస్థితిని అంచనా వేసి, మీ పొలానికి సరైన సూచనలు అందిస్తాను.',
      processing: 'ధన్యవాదాలు. మీ పంట డేటాను ప్రాసెస్ చేస్తున్నాము...',
      analysisComplete: (prediction) => `విశ్లేషణ పూర్తైంది.\n\nఅంచనా: ${prediction}`,
      error: 'క్షమించండి, మీ డేటాను ప్రాసెస్ చేయడంలో లోపం జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
      completion: 'ఇంకా ప్రశ్నల కోసం కిసాన్ 1059 ను సంప్రదించండి.',
    },
    placeholders: {
      farmerName: 'రైతు పేరు నమోదు చేయండి',
      varietyName: 'రకం పేరు నమోదు చేయండి',
      customSymptom: 'లక్షణాన్ని వివరించండి',
      customAdditionalSymptom: 'లక్షణాన్ని వివరించండి',
    },
    questions: {
      farmerName: 'మీ పేరు ఏమిటి?',
      weatherType: 'వాతావరణ పరిస్థితి ఏమిటి?',
      rainfall: 'వర్షపాతం స్థాయి ఎంత?',
      temperature: 'ఉష్ణోగ్రత పరిధి ఎంత?',
      humidity: 'ఆర్ద్రత స్థాయి ఎంత?',
      abnormalWeather: 'అసాధారణ వాతావరణం ఏ రకం?',
      varietyType: 'విత్తన రకం ఏమిటి?',
      varietyName: 'రకం పేరు ఏమిటి?',
      cropDuration: 'పంట కాలవ్యవధి ఎంత?',
      stage: 'పంట దశ ఏమిటి?',
      cropStatus: 'పంట ఆరోగ్యం ఎలా ఉంది?',
      color: 'పొలపు రంగు ఏమిటి?',
      distribution: 'సమస్య ఎలా విస్తరించింది?',
      primarySymptom: 'ప్రధాన లక్షణం ఏమిటి?',
      customSymptom: 'లక్షణాన్ని వివరించండి:',
      additionalSymptoms: 'ఇంకా ఇతర లక్షణాలున్నాయా?',
      customAdditionalSymptom: 'అదనపు లక్షణాన్ని వివరించండి:',
      insectsPresent: 'కీటకాలు ఉన్నాయా?',
      partDamaged: 'ఏ భాగం దెబ్బతింది?',
      insectLocation: 'కీటకాలు ఎక్కడ ఉన్నాయి?',
      damageLevel: 'నష్టం స్థాయి ఎంత?',
    },
    options: {
      weatherType: { Normal: 'సాధారణం', Abnormal: 'అసాధారణం' },
      rainfall: { Low: 'తక్కువ', Medium: 'మధ్యస్థ', High: 'ఎక్కువ' },
      temperature: { '10-20': '10-20', '20-30': '20-30', '>30': '>30' },
      humidity: { '<50': '<50', '50-90': '50-90', '>90': '>90' },
      abnormalWeather: {
        Cyclones: 'తుఫానులు',
        'Delayed Rains': 'ఆలస్యమైన వర్షాలు',
        'Early Drought': 'ముందస్తు ఎండబారుట',
        Flood: 'వెళ్లువ',
        'Continuous Rainy Days': 'నిరంతర వర్షపు రోజులు',
        'Dry Spell': 'విరామ ఎండలు',
        Others: 'ఇతరులు',
      },
      varietyType: { Hybrid: 'హైబ్రిడ్', HYV: 'HYV', Local: 'స్థానిక', Other: 'ఇతర' },
      cropDuration: { Short: 'చిన్న', Medium: 'మధ్యస్థ', Long: 'పొడవైన' },
      stage: {
        Nursery: 'నర్సరీ',
        'Planting (PI)': 'నాటే దశ (PI)',
        'Flowering-Maturity': 'పుష్పించడం-పక్వత',
      },
      cropStatus: { Healthy: 'ఆరోగ్యంగా ఉంది', Unhealthy: 'ఆరోగ్యంగా లేదు' },
      color: { Green: 'ఆకుపచ్చ', Yellow: 'పసుపు', White: 'తెలుపు', Brown: 'గోధుమ', Other: 'ఇతర' },
      distribution: { Uniform: 'ఒకేలా', Patches: 'చోటుచోటుగా' },
      primarySymptom: {
        'Silvery streak': 'వెండి గీతలు',
        'White streak scraping': 'తెల్ల గీతలు రాయడం',
        'Leaf sheath blight': 'ఆకుపొర చెడు',
        Wilting: 'వాడిపోవడం',
        Other: 'ఇతర',
      },
      additionalSymptoms: {
        'Pointed leaf tips': 'కొనల ఆకుల చివరలు',
        'Blue beetles present': 'నీలి బీటిల్స్ కనిపిస్తున్నాయి',
        'Excreta in leaf folds': 'ఆకుల మడతల్లో విసర్జన',
        Sclerotia: 'స్క్లెరోషియా',
        'Black lesions': 'నల్ల మచ్చలు',
        'Grubs inside leaf': 'ఆకులో పురుగుల లార్వా',
        'Leaf rolling': 'ఆకులు ముడుచుకోవడం',
        'Dry spell': 'ఎండ విరామం',
        Other: 'ఇతర',
      },
      insectsPresent: { No: 'లేవు', Yes: 'ఉన్నాయి' },
      partDamaged: { Leaf: 'ఆకు', Stem: 'తాడు', Root: 'వేరు' },
      insectLocation: { Inside: 'లోపల', Outside: 'బయట' },
      damageLevel: { 'More than ETL': 'ETL కంటే ఎక్కువ', 'Less than ETL': 'ETL కంటే తక్కువ' },
    },
  },
};

const resolveStateName = (address = {}) => {
  const stateCode = address['ISO3166-2-lvl4'] || address.state_code || '';
  if (stateCodeMap[stateCode]) {
    return stateCodeMap[stateCode];
  }

  const rawState = address.state || address.region || address.county || '';
  const normalizedState = rawState.trim().toLowerCase();

  if (normalizedState.includes('andhra')) return 'Andhra Pradesh';
  if (normalizedState.includes('telangana')) return 'Telangana';

  return rawState || 'Unknown';
};

export default function ChatbotForm() {
  const [form, setForm] = useState(initialForm);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      messageKey: 'welcome',
    },
    {
      type: 'bot',
      messageKey: 'question',
      questionKey: questionSequence[0].key,
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [locationStatus, setLocationStatus] = useState('Detecting');
  const [locationLanguage, setLocationLanguage] = useState('English');
  const [apiResponse, setApiResponse] = useState(null);
  const messagesEndRef = useRef(null);
  const copy = translations[selectedLanguage] || translations.en;

  const getLanguageLabel = (languageName) => {
    if (languageName === 'Telugu') return copy.ui.telugu;
    if (languageName === 'English') return copy.ui.english;
    return languageName;
  };

  const languageOptions = useMemo(() => {
    const options = [{ value: 'en', label: copy.ui.english }];
    const languageCode = stateLanguageCodeMap[locationLanguage];
    if (languageCode && translations[languageCode]) {
      options.push({ value: languageCode, label: getLanguageLabel(locationLanguage) });
    }
    return options;
  }, [locationLanguage, copy.ui.english]);

  useEffect(() => {
    const languageCode = stateLanguageCodeMap[locationLanguage];
    if (!languageCode || !translations[languageCode]) {
      if (selectedLanguage !== 'en') {
        setSelectedLanguage('en');
      }
    }
  }, [locationLanguage, selectedLanguage]);

  const availableQuestions = useMemo(
    () => questionSequence.filter((q) => !q.condition || q.condition(form)),
    [form],
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchLocationState = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=8&addressdetails=1`);
      const data = await res.json();
      const state = resolveStateName(data.address);
      const localLanguage = stateLanguageMap[state] || 'English';

      setForm((prev) => ({
        ...prev,
        location: {
          latitude: lat.toFixed(4),
          longitude: lon.toFixed(4),
          state,
        },
      }));
      setLocationLanguage(localLanguage);
      setLocationStatus('Ready');
    } catch {
      setLocationStatus('Error');
      setForm((prev) => ({
        ...prev,
        location: {
          latitude: lat.toFixed(4),
          longitude: lon.toFixed(4),
          state: 'Unknown',
        },
      }));
      setLocationLanguage('English');
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Unsupported');
      setForm((prev) => ({ ...prev, location: { latitude: 'n/a', longitude: 'n/a', state: 'Unavailable' } }));
      return;
    }

    setLocationStatus('Detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationState(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationStatus(error.code === 1 ? 'Permission denied' : 'Error');
        setForm((prev) => ({ ...prev, location: { latitude: 'Denied', longitude: 'Denied', state: 'Permission denied' } }));
      },
      { timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    if (currentQuestionIndex < availableQuestions.length) {
      scrollToBottom();
    }
  }, [currentQuestionIndex, availableQuestions.length]);

  const getQuestionText = (questionKey) => copy.questions[questionKey] || questionMap[questionKey]?.question || '';
  const getPlaceholderText = (questionKey) => copy.placeholders[questionKey] || questionMap[questionKey]?.placeholder || '';
  const getOptionLabel = (questionKey, option) => copy.options[questionKey]?.[option] || option;
  const getMessageText = (message) => {
    if (message.type === 'user') return message.text;

    switch (message.messageKey) {
      case 'welcome':
        return copy.messages.welcome;
      case 'question':
        return getQuestionText(message.questionKey);
      case 'processing':
        return copy.messages.processing;
      case 'analysisComplete':
        return copy.messages.analysisComplete(message.prediction);
      case 'error':
        return copy.messages.error;
      default:
        return message.text || '';
    }
  };

  const handleSubmitResponse = (event) => {
    event.preventDefault();

    if (!inputValue.trim() && currentQuestionIndex < availableQuestions.length) return;

    const currentQuestion = availableQuestions[currentQuestionIndex];
    const userResponse = inputValue.trim();

    setMessages((prev) => [...prev, { type: 'user', text: userResponse }]);

    const nextForm = currentQuestion
      ? {
          ...form,
          [currentQuestion.key]:
            currentQuestion.type === 'multiselect' ? userResponse.split(',').filter(Boolean) : userResponse,
        }
      : form;

    setForm(nextForm);
    setInputValue('');

    const updatedQuestions = questionSequence.filter((q) => !q.condition || q.condition(nextForm));
    const currentIndexInUpdated = updatedQuestions.findIndex((q) => q.key === currentQuestion?.key);
    const nextIndex = currentIndexInUpdated + 1;

    if (nextIndex < updatedQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        const nextQuestion = updatedQuestions[nextIndex];
        setMessages((prev) => [...prev, { type: 'bot', messageKey: 'question', questionKey: nextQuestion.key }]);
      }, 400);
    } else {
      setCurrentQuestionIndex(updatedQuestions.length);
      setTimeout(() => {
        handleSubmitForm();
      }, 400);
    }
  };

  const buildPayload = () => {
    const additionalSymptomValues = form.additionalSymptoms.reduce((acc, value) => {
      if (value === 'Other') {
        if (form.customAdditionalSymptom.trim()) acc.push(form.customAdditionalSymptom.trim());
      } else {
        acc.push(value);
      }
      return acc;
    }, []);

    const latitude = parseFloat(form.location.latitude);
    const longitude = parseFloat(form.location.longitude);
    const locationPayload = Number.isFinite(latitude) && Number.isFinite(longitude)
      ? {
          latitude,
          longitude,
          state: form.location.state || null,
        }
      : { latitude: null, longitude: null, state: null };

    return {
      farmer_name: form.farmerName.trim(),
      location: locationPayload,
      weather_type: form.weatherType.toLowerCase(),
      rainfall: form.weatherType === 'Normal' ? form.rainfall.toLowerCase() : '',
      temperature: form.weatherType === 'Normal' ? form.temperature : '',
      humidity: form.weatherType === 'Normal' ? form.humidity : '',
      abnormal_weather: form.weatherType === 'Abnormal' ? form.abnormalWeather : '',
      variety_type: form.varietyType,
      variety_name: form.varietyName.trim(),
      crop_duration: form.cropDuration.toLowerCase(),
      stage: form.stage,
      crop_status: form.cropStatus.toLowerCase(),
      color: form.cropStatus === 'Unhealthy' ? form.color.toLowerCase() : '',
      distribution: form.cropStatus === 'Unhealthy' ? form.distribution.toLowerCase() : '',
      symptom_1:
        form.cropStatus === 'Unhealthy' && form.distribution === 'Patches'
          ? form.primarySymptom === 'Other'
            ? form.customSymptom.trim()
            : form.primarySymptom
          : '',
      symptom_2:
        form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' ? additionalSymptomValues[0] || '' : '',
      insects_present: form.cropStatus === 'Unhealthy' ? form.insectsPresent.toLowerCase() : 'no',
      part_damaged: form.cropStatus === 'Unhealthy' && form.insectsPresent === 'Yes' ? form.partDamaged.toLowerCase() : '',
      insect_location:
        form.cropStatus === 'Unhealthy' && form.insectsPresent === 'Yes' ? form.insectLocation.toLowerCase() : '',
      damage_level: form.damageLevel,
    };
  };

  const handleSubmitForm = async () => {
    const payload = buildPayload();

    setMessages((prev) => [...prev, { type: 'bot', messageKey: 'processing' }]);

    try {
      const response = await predictData(payload);
      const prediction = response.data.prediction || 'Processing...';

      setApiResponse(response.data);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageKey: 'analysisComplete',
          prediction,
        },
      ]);

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageKey: 'error',
        },
      ]);
    }
  };

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const isFormComplete = currentQuestionIndex >= availableQuestions.length;
  const progressText = `${Math.min(currentQuestionIndex + 1, availableQuestions.length)}/${availableQuestions.length}`;
  const completedCount = Math.min(currentQuestionIndex, availableQuestions.length);
  const languageDisplay =
    locationStatus === 'Ready'
      ? `${copy.ui.english}, ${getLanguageLabel(locationLanguage)}`
      : copy.ui.english;
  const locationDisplay =
    locationStatus === 'Ready'
      ? `${form.location.state}, ${form.location.latitude}, ${form.location.longitude}`
      : locationStatus === 'Detecting'
        ? copy.ui.detectingLocation
        : locationStatus === 'Unsupported'
          ? copy.ui.locationUnsupported
          : locationStatus === 'Permission denied'
            ? copy.ui.locationDenied
            : copy.ui.locationError;

  return (
    <div className="chatbot-container">
      <div className="chatbot-shell">
        <div className="chatbot-header">
          <div className="chatbot-header-main">
            <div className="chatbot-title-bar">
              <div className="chatbot-avatar">AI</div>
              <div className="chatbot-title-text">
                <h1>{copy.ui.title}</h1>
                <p><span className="status-dot online" /> {copy.ui.online}</p>
              </div>
            </div>
            <p>{copy.ui.tagline}</p>
          </div>
          <div className="chatbot-meta">
            <div className="language-picker">
              <label htmlFor="language-select">{copy.ui.language}</label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                className="language-select"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="chatbot-progress">{copy.ui.question} {progressText}</span>
            <div className="location-banner">
              <span className={`location-dot ${locationStatus === 'Ready' ? 'ready' : locationStatus === 'Detecting' ? 'detecting' : 'error'}`} />
              <div>
                <strong>{locationDisplay}</strong>
                <div className="location-caption">{copy.ui.autoLocationStatus}</div>
                <div className="location-language">{copy.ui.languages}: {languageDisplay}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="chatbot-content-box">
          <div className="chatbot-content-topbar">
            <div>
              <div className="chatbot-content-label">{copy.ui.conversation}</div>
              <strong>{isFormComplete ? copy.ui.assessmentComplete : currentQuestion ? getQuestionText(currentQuestion.key) : copy.ui.preparingNextStep}</strong>
            </div>
            <div className="chatbot-mini-stat">
              <span>{completedCount}</span>
              <small>{copy.ui.answered}</small>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-group message-${msg.type}`}>
                {msg.type === 'bot' && <div className="message-avatar">AI</div>}
                <div className={`message-bubble message-${msg.type}`}>{getMessageText(msg)}</div>
                {msg.type === 'user' && <div className="message-avatar">You</div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {isFormComplete && (
            <div className="completion-card">
              <div className="completion-card-label">{copy.ui.thankYou}</div>
              <strong>{copy.messages.completion}</strong>
            </div>
          )}

          {!isFormComplete && currentQuestion && (
            <form className="chatbot-input-form" onSubmit={handleSubmitResponse}>
              {currentQuestion.type === 'text' && (
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={getPlaceholderText(currentQuestion.key)}
                  className="chatbot-text-input"
                />
              )}

              {currentQuestion.type === 'select' && (
                <select
                  autoFocus
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="chatbot-select-input"
                >
                  <option value="">{copy.ui.selectOption}</option>
                  {currentQuestion.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {getOptionLabel(currentQuestion.key, opt)}
                    </option>
                  ))}
                </select>
              )}

              {currentQuestion.type === 'multiselect' && (
                <div className="multiselect-wrapper">
                  <select
                    multiple
                    value={inputValue ? inputValue.split(',') : []}
                    onChange={(event) => setInputValue(Array.from(event.target.selectedOptions, (opt) => opt.value).join(','))}
                    className="chatbot-multiselect-input"
                  >
                    {currentQuestion.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {getOptionLabel(currentQuestion.key, opt)}
                      </option>
                    ))}
                  </select>
                  <p className="multiselect-hint">{copy.ui.multiselectHint}</p>
                </div>
              )}

              <button type="submit" className="chatbot-send-button" disabled={!inputValue.trim()}>
                {copy.ui.send}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

