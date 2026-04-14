export default function ConditionStep({ form, onChange, error }) {
  return (
    <div className="step-card">
      <label className="field-block full-width">
        <span className="field-label">Crop Condition</span>
        <select name="cropStatus" value={form.cropStatus} onChange={onChange} className="select-input">
          <option value="Healthy">Healthy</option>
          <option value="Unhealthy">Unhealthy</option>
        </select>
      </label>

      {form.cropStatus === 'Unhealthy' && (
        <div className="field-grid">
          <label className="field-block">
            <span className="field-label">Color</span>
            <select name="color" value={form.color} onChange={onChange} className="select-input">
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="White">White</option>
              <option value="Brown">Brown</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="field-block">
            <span className="field-label">Distribution</span>
            <select
              name="distribution"
              value={form.distribution}
              onChange={onChange}
              className="select-input"
            >
              <option value="Uniform">Uniform</option>
              <option value="Patches">Patches</option>
            </select>
          </label>
        </div>
      )}

      {form.cropStatus === 'Unhealthy' && form.distribution === 'Uniform' && (
        <div className="note-box">Possible Nutrient / Water Deficiency</div>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
