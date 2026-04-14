export default function SymptomSection({ form, onChange, onAdditionalChange, errors }) {
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
    <section className="card subsection-card">
      <div className="section-title">Symptoms</div>
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Primary Symptom</span>
          <select className="select-input" name="primarySymptom" value={form.primarySymptom} onChange={onChange}>
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
              className="text-input"
              type="text"
              name="customSymptom"
              value={form.customSymptom}
              onChange={onChange}
              placeholder="Describe the symptom"
            />
            {errors.customSymptom && <span className="field-error">{errors.customSymptom}</span>}
          </label>
        )}

        <label className="field-block full-width">
          <span className="field-label">Additional Symptoms</span>
          <select
            className="select-input multi-select"
            name="additionalSymptoms"
            value={form.additionalSymptoms}
            onChange={onAdditionalChange}
            multiple
            size={5}
          >
            {additionalOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.additionalSymptom && <span className="field-error">{errors.additionalSymptom}</span>}
        </label>

        {form.additionalSymptoms.includes('Other') && (
          <label className="field-block full-width">
            <span className="field-label">Additional Symptom</span>
            <input
              className="text-input"
              type="text"
              name="customAdditionalSymptom"
              value={form.customAdditionalSymptom}
              onChange={onChange}
              placeholder="Add your own symptom"
            />
            {errors.customAdditionalSymptom && <span className="field-error">{errors.customAdditionalSymptom}</span>}
          </label>
        )}
      </div>
    </section>
  );
}
