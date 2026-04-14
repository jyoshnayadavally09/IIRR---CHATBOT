import { useEffect, useMemo, useState } from 'react';
import FarmerStep from './FarmerStep';
import WeatherStep from './WeatherStep';
import VarietyStep from './VarietyStep';
import StageStep from './StageStep';
import ConditionStep from './ConditionStep';
import SymptomsStep from './SymptomsStep';
import InsectStep from './InsectStep';
import DamageStep from './DamageStep';
import { predictData } from '../services/api';

const stepLabels = {
  farmer: 'Farmer Details',
  weather: 'Weather Condition',
  variety: 'Variety Details',
  stage: 'Crop Stage',
  condition: 'Crop Condition',
  symptoms: 'Symptoms',
  insect: 'Insects',
  damage: 'Damage Level',
};

const initialForm = {
  farmerName: '',
  location: { latitude: 'Detecting...', longitude: 'Detecting...' },
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

export default function StepForm() {
  const [form, setForm] = useState(initialForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const steps = useMemo(() => {
    const list = ['farmer', 'weather', 'variety', 'stage', 'condition'];
    if (form.cropStatus === 'Unhealthy') {
      if (form.distribution === 'Patches') list.push('symptoms');
      list.push('insect');
    }
    list.push('damage');
    return list;
  }, [form.cropStatus, form.distribution]);

  useEffect(() => {
    if (currentStep >= steps.length) {
      setCurrentStep(steps.length - 1);
    }
  }, [currentStep, steps.length]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setForm((prev) => ({
        ...prev,
        location: { latitude: 'Unavailable', longitude: 'Unavailable' },
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          location: {
            latitude: position.coords.latitude.toFixed(4),
            longitude: position.coords.longitude.toFixed(4),
          },
        }));
      },
      () => {
        setForm((prev) => ({
          ...prev,
          location: { latitude: 'Denied', longitude: 'Denied' },
        }));
      },
      { timeout: 8000 },
    );
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'weatherType' && value === 'Normal') {
        updated.abnormalWeather = 'Cyclones';
      }
      if (name === 'weatherType' && value === 'Abnormal') {
        updated.rainfall = 'Low';
        updated.temperature = '10-20';
        updated.humidity = '<50';
      }
      if (name === 'cropStatus' && value === 'Healthy') {
        updated.color = 'Green';
        updated.distribution = 'Uniform';
      }
      if (name === 'distribution' && value === 'Uniform') {
        updated.primarySymptom = 'Silvery streak';
        updated.customSymptom = '';
        updated.additionalSymptoms = [];
        updated.customAdditionalSymptom = '';
      }
      if (name === 'primarySymptom' && value !== 'Other') {
        updated.customSymptom = '';
      }
      if (name === 'insectsPresent' && value === 'No') {
        updated.partDamaged = 'Leaf';
        updated.insectLocation = 'Inside';
      }
      return updated;
    });
  };

  const handleMultiSelect = (event) => {
    const values = Array.from(event.target.selectedOptions, (option) => option.value);
    setForm((prev) => ({ ...prev, additionalSymptoms: values }));
  };

  const validateStep = () => {
    const stepKey = steps[currentStep];
    const nextErrors = {};

    if (stepKey === 'farmer') {
      if (!form.farmerName.trim()) {
        nextErrors.farmerName = 'Farmer Name is required.';
      }
    }

    if (stepKey === 'weather') {
      if (form.weatherType === 'Normal') {
        if (!form.rainfall) nextErrors.weatherType = 'Rainfall is required.';
        if (!form.temperature) nextErrors.weatherType = 'Temperature is required.';
        if (!form.humidity) nextErrors.weatherType = 'Humidity is required.';
      } else if (!form.abnormalWeather) {
        nextErrors.weatherType = 'Select an abnormal weather event.';
      }
    }

    if (stepKey === 'variety') {
      if (!form.varietyName.trim()) {
        nextErrors.varietyName = 'Variety Name is required.';
      }
    }

    if (stepKey === 'condition') {
      if (!form.cropStatus) {
        nextErrors.cropStatus = 'Choose crop condition.';
      }
      if (form.cropStatus === 'Unhealthy') {
        if (!form.color) nextErrors.cropStatus = 'Select field color.';
        if (!form.distribution) nextErrors.cropStatus = 'Select distribution.';
      }
    }

    if (stepKey === 'symptoms') {
      if (!form.primarySymptom) nextErrors.primarySymptom = 'Select a primary symptom.';
      if (form.primarySymptom === 'Other' && !form.customSymptom.trim()) {
        nextErrors.customSymptom = 'Describe the custom symptom.';
      }
      if (form.additionalSymptoms.includes('Other') && !form.customAdditionalSymptom.trim()) {
        nextErrors.customAdditionalSymptom = 'Describe the additional symptom.';
      }
    }

    if (stepKey === 'insect') {
      if (form.insectsPresent === 'Yes') {
        if (!form.partDamaged) nextErrors.insectsPresent = 'Select damaged part.';
        if (!form.insectLocation) nextErrors.insectsPresent = 'Select insect location.';
      }
    }

    if (stepKey === 'damage') {
      if (!form.damageLevel) nextErrors.damageLevel = 'Damage level is required.';
    }

    return nextErrors;
  };

  const buildPayload = () => {
    const symptom1 = form.primarySymptom === 'Other' ? form.customSymptom.trim() || 'Other' : form.primarySymptom;
    const additionalSymptomValues = form.additionalSymptoms.reduce((acc, value) => {
      if (value === 'Other') {
        if (form.customAdditionalSymptom.trim()) acc.push(form.customAdditionalSymptom.trim());
      } else {
        acc.push(value);
      }
      return acc;
    }, []);

    return {
      farmer_name: form.farmerName.trim(),
      location: {
        latitude: form.location.latitude,
        longitude: form.location.longitude,
      },
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
      symptom_1: form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' ? symptom1 : '',
      symptom_2: form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' ? additionalSymptomValues[0] || '' : '',
      insects_present: form.cropStatus === 'Unhealthy' ? form.insectsPresent.toLowerCase() : 'no',
      part_damaged: form.cropStatus === 'Unhealthy' && form.insectsPresent === 'Yes' ? form.partDamaged.toLowerCase() : '',
      insect_location: form.cropStatus === 'Unhealthy' && form.insectsPresent === 'Yes' ? form.insectLocation.toLowerCase() : '',
      damage_level: form.damageLevel,
    };
  };

  const handleNext = () => {
    const validationErrors = validateStep();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateStep();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const finalPayload = buildPayload();
      setPayload(finalPayload);
      try {
        const response = await predictData(finalPayload);
        setApiResponse(response.data);
      } catch (error) {
        setApiResponse({ error: 'Prediction request failed. Please try again.' });
      }
    }
  };

  const currentStepKey = steps[currentStep];
  const stepLabel = stepLabels[currentStepKey];

  const renderStep = () => {
    switch (currentStepKey) {
      case 'farmer':
        return <FarmerStep farmerName={form.farmerName} location={form.location} onChange={handleChange} error={errors.farmerName} />;
      case 'weather':
        return <WeatherStep form={form} onChange={handleChange} error={errors.weatherType} />;
      case 'variety':
        return <VarietyStep form={form} onChange={handleChange} errors={errors} />;
      case 'stage':
        return <StageStep stage={form.stage} onChange={handleChange} />;
      case 'condition':
        return <ConditionStep form={form} onChange={handleChange} error={errors.cropStatus} />;
      case 'symptoms':
        return <SymptomsStep form={form} onChange={handleChange} onMultiSelect={handleMultiSelect} errors={errors} />;
      case 'insect':
        return <InsectStep form={form} onChange={handleChange} errors={errors} />;
      case 'damage':
        return <DamageStep damageLevel={form.damageLevel} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="wizard-shell">
      <form className="wizard-card" onSubmit={handleSubmit}>
        <div className="wizard-header">
          <div className="progress-pill">Step {currentStep + 1} of {steps.length}</div>
          <h2 className="wizard-title">{stepLabel}</h2>
          <p className="wizard-note">Complete the fields below and press Next to continue.</p>
        </div>

        {renderStep()}

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button type="button" className="secondary-button" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" className="primary-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="submit" className="primary-button">
              Submit
            </button>
          )}
        </div>

        {payload && (
          <section className="result-card">
            <div className="section-title">Structured Payload</div>
            <pre className="payload-box">{JSON.stringify(payload, null, 2)}</pre>
            {apiResponse && (
              <div className="response-box">
                <div className="section-title">Backend Response</div>
                <pre className="payload-box">{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            )}
          </section>
        )}
      </form>
    </div>
  );
}
