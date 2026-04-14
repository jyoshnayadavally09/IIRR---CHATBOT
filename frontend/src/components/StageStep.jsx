export default function StageStep({ stage, onChange }) {
  return (
    <div className="step-card">
      <label className="field-block full-width">
        <span className="field-label">Crop Stage</span>
        <select name="stage" value={stage} onChange={onChange} className="select-input">
          <option value="Nursery">Nursery</option>
          <option value="Planting (PI)">Planting (PI)</option>
          <option value="Flowering–Maturity">Flowering–Maturity</option>
        </select>
      </label>
    </div>
  );
}
