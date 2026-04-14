export default function VarietySection({ form, onChange, errors }) {
  return (
    <section className="card subsection-card">
      <div className="section-title">Variety Details</div>
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Variety Type</span>
          <select className="select-input" name="varietyType" value={form.varietyType} onChange={onChange}>
            <option value="Hybrid">Hybrid</option>
            <option value="High Yielding Variety">High Yielding Variety</option>
            <option value="Local">Local</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="field-block">
          <span className="field-label">Variety Name</span>
          <input
            className="text-input"
            type="text"
            name="varietyName"
            value={form.varietyName}
            onChange={onChange}
            placeholder="Enter variety name"
            autoComplete="off"
          />
          {errors.varietyName && <span className="field-error">{errors.varietyName}</span>}
        </label>

        <label className="field-block full-width">
          <span className="field-label">Crop Duration</span>
          <select className="select-input" name="cropDuration" value={form.cropDuration} onChange={onChange}>
            <option value="Short Duration">Short Duration</option>
            <option value="Medium Duration">Medium Duration</option>
            <option value="Long Duration">Long Duration</option>
          </select>
        </label>
      </div>
    </section>
  );
}
