export default function SymptomsStep({ form, onChange, onMultiSelect, errors }) {
  const additionalOptions = [
    'Pointed leaf tips',
    'Blue beetles present',
    'Excreta in leaf folds',
    'Sclerotia',
    'Black lesions',
    'Grubs inside leaf',
    'Leaf rolling',
    'Dry spell',
    'Other',
  ];

  return (
    <div className="step-card">
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Primary Symptom</span>
          <select name="primarySymptom" value={form.primarySymptom} onChange={onChange} className="select-input">
            <option value="Silvery streak">Silvery streak</option>
            <option value="White streak scraping">White streak scraping</option>
            <option value="Leaf sheath blight">Leaf sheath blight</option>
            <option value="Wilting">Wilting</option>
            <option value="Other">Other</option>
          </select>
          {errors.primarySymptom && <span className="field-error">{errors.primarySymptom}</span>}
        </label>

        {form.primarySymptom === 'Other' && (
          <label className="field-block full-width">
            <span className="field-label">Custom Symptom</span>
            <input
              type="text"
              name="customSymptom"
              value={form.customSymptom}
              onChange={onChange}
              className="text-input"
              placeholder="Describe the symptom"
              autoComplete="off"
            />
            {errors.customSymptom && <span className="field-error">{errors.customSymptom}</span>}
          </label>
        )}
      </div>

      <label className="field-block full-width">
        <span className="field-label">Additional Symptoms</span>
        <select
          name="additionalSymptoms"
          value={form.additionalSymptoms}
          onChange={onMultiSelect}
          className="select-input multi-select"
          multiple
          size={5}
        >
          {additionalOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.additionalSymptoms && <span className="field-error">{errors.additionalSymptoms}</span>}
      </label>

      {form.additionalSymptoms.includes('Other') && (
        <label className="field-block full-width">
          <span className="field-label">Additional Symptom</span>
          <input
            type="text"
            name="customAdditionalSymptom"
            value={form.customAdditionalSymptom}
            onChange={onChange}
            className="text-input"
            placeholder="Describe the additional symptom"
            autoComplete="off"
          />
          {errors.customAdditionalSymptom && <span className="field-error">{errors.customAdditionalSymptom}</span>}
        </label>
      )}
    </div>
  );
}
