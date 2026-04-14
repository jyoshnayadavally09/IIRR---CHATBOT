export default function InsectStep({ form, onChange, errors }) {
  return (
    <div className="step-card">
      <label className="field-block full-width">
        <span className="field-label">Presence of Insects</span>
        <select name="insectsPresent" value={form.insectsPresent} onChange={onChange} className="select-input">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </label>

      {form.insectsPresent === 'Yes' && (
        <div className="field-grid">
          <label className="field-block">
            <span className="field-label">Part Damaged</span>
            <select name="partDamaged" value={form.partDamaged} onChange={onChange} className="select-input">
              <option value="Leaf">Leaf</option>
              <option value="Stem">Stem</option>
              <option value="Root">Root</option>
            </select>
          </label>

          <label className="field-block">
            <span className="field-label">Insect Location</span>
            <select name="insectLocation" value={form.insectLocation} onChange={onChange} className="select-input">
              <option value="Inside">Inside</option>
              <option value="Outside">Outside</option>
            </select>
          </label>
        </div>
      )}

      {errors.insectsPresent && <span className="field-error">{errors.insectsPresent}</span>}
    </div>
  );
}
