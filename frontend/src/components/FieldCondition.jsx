export default function FieldCondition({ form, onChange, errors }) {
  return (
    <section className="card subsection-card">
      <div className="section-title">Field Condition</div>
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Crop Condition</span>
          <select className="select-input" name="cropStatus" value={form.cropStatus} onChange={onChange}>
            <option value="Healthy">Healthy</option>
            <option value="Unhealthy">Unhealthy</option>
          </select>
        </label>

        {form.cropStatus === 'Unhealthy' && (
          <>
            <label className="field-block">
              <span className="field-label">General Field Appearance</span>
              <select className="select-input" name="color" value={form.color} onChange={onChange}>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="White">White</option>
                <option value="Brown">Brown</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="field-block">
              <span className="field-label">Distribution</span>
              <select className="select-input" name="distribution" value={form.distribution} onChange={onChange}>
                <option value="Uniform">Uniform</option>
                <option value="Patches">Patches</option>
              </select>
            </label>
          </>
        )}
      </div>

      {form.cropStatus === 'Unhealthy' && form.distribution === 'Uniform' && (
        <div className="note-box">Possible Nutrient / Water Deficiency</div>
      )}

      {errors.cropStatus && <span className="field-error">{errors.cropStatus}</span>}
    </section>
  );
}
