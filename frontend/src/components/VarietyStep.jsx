export default function VarietyStep({ form, onChange, errors }) {
  return (
    <div className="step-card">
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Variety Type</span>
          <select name="varietyType" value={form.varietyType} onChange={onChange} className="select-input">
            <option value="Hybrid">Hybrid</option>
            <option value="HYV">HYV</option>
            <option value="Local">Local</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="field-block">
          <span className="field-label">Variety Name</span>
          <input
            type="text"
            name="varietyName"
            value={form.varietyName}
            onChange={onChange}
            className="text-input"
            placeholder="Enter variety name"
            autoComplete="off"
          />
          {errors.varietyName && <span className="field-error">{errors.varietyName}</span>}
        </label>

        <label className="field-block">
          <span className="field-label">Crop Duration</span>
          <select name="cropDuration" value={form.cropDuration} onChange={onChange} className="select-input">
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
        </label>
      </div>
    </div>
  );
}
