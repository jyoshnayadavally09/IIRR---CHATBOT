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

const completionMessage = 'For more queries, contact Kisan 1059.';

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
      text: 'Hello! I am your agricultural assistant. I will help you assess your crop condition and provide accurate recommendations for your farm.',
    },
    {
      type: 'bot',
      text: questionSequence[0].question,
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [locationStatus, setLocationStatus] = useState('Detecting');
  const [apiResponse, setApiResponse] = useState(null);
  const messagesEndRef = useRef(null);

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
      setForm((prev) => ({
        ...prev,
        location: {
          latitude: lat.toFixed(4),
          longitude: lon.toFixed(4),
          state,
        },
      }));
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
        setMessages((prev) => [...prev, { type: 'bot', text: nextQuestion.question }]);
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

    setMessages((prev) => [...prev, { type: 'bot', text: 'Thank you. Processing your farm data...' }]);

    try {
      const response = await predictData(payload);
      const prediction = response.data.prediction || 'Processing...';

      setApiResponse(response.data);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: `Analysis complete.\n\nPrediction: ${prediction}`,
        },
      ]);

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Sorry, there was an error processing your data. Please try again.',
        },
      ]);
    }
  };

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const isFormComplete = currentQuestionIndex >= availableQuestions.length;
  const progressText = `${Math.min(currentQuestionIndex + 1, availableQuestions.length)}/${availableQuestions.length}`;
  const completedCount = Math.min(currentQuestionIndex, availableQuestions.length);
  const locationDisplay =
    locationStatus === 'Ready'
      ? `${form.location.state}, ${form.location.latitude}, ${form.location.longitude}`
      : locationStatus === 'Detecting'
        ? 'Detecting location...'
        : locationStatus === 'Unsupported'
          ? 'Location unsupported'
          : locationStatus === 'Permission denied'
            ? 'Location access denied'
            : 'Unable to retrieve location';

  return (
    <div className="chatbot-container">
      <div className="chatbot-shell">
        <div className="chatbot-header">
          <div className="chatbot-header-main">
            <div className="chatbot-title-bar">
              <div className="chatbot-avatar">AI</div>
              <div className="chatbot-title-text">
                <h1>Crop Health Assistant</h1>
                <p><span className="status-dot online" /> We're online</p>
              </div>
            </div>
            <p>Share your crop details and get instant AI farm guidance in one focused space.</p>
          </div>
          <div className="chatbot-meta">
            <span className="chatbot-progress">Question {progressText}</span>
            <div className="location-banner">
              <span className={`location-dot ${locationStatus === 'Ready' ? 'ready' : locationStatus === 'Detecting' ? 'detecting' : 'error'}`} />
              <div>
                <strong>{locationDisplay}</strong>
                <div className="location-caption">Auto-location status</div>
              </div>
            </div>
          </div>
        </div>

        <div className="chatbot-content-box">
          <div className="chatbot-content-topbar">
            <div>
              <div className="chatbot-content-label">Conversation</div>
              <strong>{isFormComplete ? 'Assessment complete' : currentQuestion?.question || 'Preparing next step'}</strong>
            </div>
            <div className="chatbot-mini-stat">
              <span>{completedCount}</span>
              <small>answered</small>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-group message-${msg.type}`}>
                {msg.type === 'bot' && <div className="message-avatar">AI</div>}
                <div className={`message-bubble message-${msg.type}`}>{msg.text}</div>
                {msg.type === 'user' && <div className="message-avatar">You</div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {isFormComplete && (
            <div className="completion-card">
              <div className="completion-card-label">Thank You</div>
              <strong>{completionMessage}</strong>
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
                  placeholder={currentQuestion.placeholder}
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
                  <option value="">Select an option...</option>
                  {currentQuestion.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
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
                        {opt}
                      </option>
                    ))}
                  </select>
                  <p className="multiselect-hint">Hold Ctrl (Cmd) to select multiple</p>
                </div>
              )}

              <button type="submit" className="chatbot-send-button" disabled={!inputValue.trim()}>
                Send
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

