export default function DamageStep({ damageLevel, onChange }) {
  return (
    <div className="step-card">
      <label className="field-block full-width">
        <span className="field-label">Damage Level</span>
        <select name="damageLevel" value={damageLevel} onChange={onChange} className="select-input">
          <option value="More than ETL">More than ETL</option>
          <option value="Less than ETL">Less than ETL</option>
        </select>
      </label>
    </div>
  );
}
