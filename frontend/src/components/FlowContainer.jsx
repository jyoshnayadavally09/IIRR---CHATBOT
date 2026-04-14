import { useEffect, useState } from 'react';
import FarmerSection from './FarmerSection';
import WeatherSection from './WeatherSection';
import VarietySection from './VarietySection';
import CropStage from './CropStage';
import FieldCondition from './FieldCondition';
import SymptomSection from './SymptomSection';
import InsectDamageSection from './InsectDamageSection';

const initialForm = {
  farmerName: '',
  weatherType: 'Normal',
  rainfall: 'Low',
  temperature: '10-20',
  humidity: '<50',
  abnormalWeather: 'Cyclones',
  varietyType: 'Hybrid',
  varietyName: '',
  cropDuration: 'Short Duration',
  stage: 'nursery',
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

export default function FlowContainer() {
  const [location, setLocation] = useState({ latitude: 'Detecting...', longitude: 'Detecting...', state: 'Unknown' });
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submittedPayload, setSubmittedPayload] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ latitude: 'n/a', longitude: 'n/a', state: 'Unavailable' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude.toFixed(4),
          longitude: pos.coords.longitude.toFixed(4),
          state: 'Unknown',
        });
      },
      () => {
        setLocation({ latitude: 'n/a', longitude: 'n/a', state: 'Permission denied' });
      },
      { timeout: 8000 },
    );
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'weatherType' && value === 'Abnormal') {
        next.rainfall = 'Low';
        next.temperature = '10-20';
        next.humidity = '<50';
      }

      if (name === 'weatherType' && value === 'Normal') {
        next.abnormalWeather = 'Cyclones';
      }

      if (name === 'cropStatus' && value === 'Healthy') {
        next.color = 'Green';
        next.distribution = 'Uniform';
      }

      if (name === 'distribution' && value === 'Uniform') {
        next.primarySymptom = 'Silvery streak';
        next.customSymptom = '';
        next.additionalSymptoms = [];
        next.customAdditionalSymptom = '';
      }

      if (name === 'primarySymptom' && value !== 'Other') {
        next.customSymptom = '';
      }

      if (name === 'additionalSymptoms' && !Array.isArray(value)) {
        next.additionalSymptoms = [];
      }

      if (name === 'insectsPresent' && value === 'No') {
        next.partDamaged = 'Leaf';
        next.insectLocation = 'Inside';
      }

      return next;
    });
  };

  const handleMultiSelect = (event) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setForm((prev) => ({ ...prev, additionalSymptoms: selected }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.farmerName.trim()) nextErrors.farmerName = 'Farmer Name is required.';
    if (!form.varietyName.trim()) nextErrors.varietyName = 'Variety Name is required.';

    if (form.weatherType === 'Normal') {
      if (!form.rainfall) nextErrors.weatherType = 'Rainfall is required for normal weather.';
      if (!form.temperature) nextErrors.weatherType = 'Temperature is required for normal weather.';
      if (!form.humidity) nextErrors.weatherType = 'Humidity is required for normal weather.';
    } else if (!form.abnormalWeather) {
      nextErrors.weatherType = 'Select an abnormal weather event.';
    }

    if (form.cropStatus === 'Unhealthy') {
      if (!form.color) nextErrors.color = 'Select the field color.';
      if (!form.distribution) nextErrors.distribution = 'Select distribution type.';
      if (form.distribution === 'Patches') {
        if (!form.primarySymptom) nextErrors.primarySymptom = 'Choose a primary symptom.';
        if (form.primarySymptom === 'Other' && !form.customSymptom.trim()) {
          nextErrors.customSymptom = 'Describe the custom primary symptom.';
        }
        if (form.additionalSymptoms.includes('Other') && !form.customAdditionalSymptom.trim()) {
          nextErrors.customAdditionalSymptom = 'Describe the additional symptom.';
        }
      }
    }

    if (form.insectsPresent === 'Yes') {
      if (!form.partDamaged) nextErrors.partDamaged = 'Select damaged part.';
      if (!form.insectLocation) nextErrors.insectLocation = 'Select insect location.';
    }

    if (!form.damageLevel) nextErrors.damageLevel = 'Damage level is required.';

    return nextErrors;
  };

  const buildPayload = () => {
    const symptom1 = form.primarySymptom === 'Other' ? form.customSymptom.trim() || 'Other' : form.primarySymptom;
    const extraSymptomValues = form.additionalSymptoms.reduce((list, item) => {
      if (item === 'Other') {
        if (form.customAdditionalSymptom.trim()) list.push(form.customAdditionalSymptom.trim());
      } else {
        list.push(item);
      }
      return list;
    }, []);

    const [symptom2 = '', symptom3 = ''] = extraSymptomValues;

    return {
      farmer_name: form.farmerName.trim(),
      state: location.state,
      weather_type: form.weatherType.toLowerCase(),
      rainfall: form.weatherType === 'Normal' ? form.rainfall.toLowerCase() : '',
      temperature: form.weatherType === 'Normal' ? form.temperature : '',
      humidity: form.weatherType === 'Normal' ? form.humidity : '',
      abnormal_weather: form.weatherType === 'Abnormal' ? form.abnormalWeather : '',
      variety_type: form.varietyType === 'High Yielding Variety' ? 'HYV' : form.varietyType.toLowerCase(),
      variety_name: form.varietyName.trim(),
      crop_duration: form.cropDuration.includes('Short') ? 'short' : form.cropDuration.includes('Medium') ? 'medium' : 'long',
      stage: form.stage,
      crop_status: form.cropStatus.toLowerCase(),
      color: form.cropStatus === 'Unhealthy' ? form.color.toLowerCase() : '',
      distribution: form.cropStatus === 'Unhealthy' ? form.distribution.toLowerCase() : '',
      symptom_1: symptom1,
      symptom_2: symptom2,
      symptom_3: symptom3,
      insects_present: form.insectsPresent.toLowerCase(),
      part_damaged: form.insectsPresent === 'Yes' ? form.partDamaged.toLowerCase() : '',
      insect_location: form.insectsPresent === 'Yes' ? form.insectLocation.toLowerCase() : '',
      damage_level: form.damageLevel,
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmittedPayload(buildPayload());
    } else {
      setSubmittedPayload(null);
    }
  };

  return (
    <div className="app-shell">
      <form className="content-wrapper" onSubmit={handleSubmit}>
        <FarmerSection
          farmerName={form.farmerName}
          location={location}
          onFarmerNameChange={handleChange}
          error={errors.farmerName}
        />

        <div className="flow-arrow">↓</div>

        <WeatherSection weatherType={form.weatherType} form={form} onChange={handleChange} errors={errors} />

        <div className="flow-arrow">↓</div>

        <VarietySection form={form} onChange={handleChange} errors={errors} />

        <div className="flow-arrow">↓</div>

        <CropStage stage={form.stage} onSelectStage={(value) => setForm((prev) => ({ ...prev, stage: value }))} />

        <div className="flow-arrow">↓</div>

        <FieldCondition form={form} onChange={handleChange} errors={errors} />

        {form.cropStatus === 'Unhealthy' && form.distribution === 'Patches' && (
          <>
            <div className="flow-arrow small">↓</div>
            <SymptomSection form={form} onChange={handleChange} onAdditionalChange={handleMultiSelect} errors={errors} />
          </>
        )}

        <div className="flow-arrow">↓</div>

        <InsectDamageSection form={form} onChange={handleChange} errors={errors} />

        <section className="card summary-card">
          <div className="section-title">Final ML Input Preview</div>
          <div className="summary-row">
            <div className="summary-box">
              <div className="summary-label">Quick notes</div>
              <ul>
                <li>Text fields only used for names and custom symptoms.</li>
                <li>Dropdowns capture all fixed dataset values.</li>
                <li>Conditional inputs appear only when needed.</li>
              </ul>
            </div>
            <div className="summary-box">
              <div className="summary-label">Current state</div>
              <ul>
                <li>Weather: {form.weatherType}</li>
                <li>Crop: {form.varietyType} / {form.varietyName || '—'}</li>
                <li>Stage: {form.stage}</li>
                <li>Status: {form.cropStatus}</li>
              </ul>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="error-panel">
              Please fix the highlighted fields before generating the payload.
            </div>
          )}

          <button type="submit" className="submit-button">
            Generate structured payload
          </button>

          {submittedPayload && (
            <pre className="payload-box">{JSON.stringify(submittedPayload, null, 2)}</pre>
          )}
        </section>
      </form>
    </div>
  );
}
