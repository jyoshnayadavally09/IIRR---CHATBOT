export default function InsectDamageSection({ form, onChange, errors }) {
  return (
    <section className="card subsection-card">
      <div className="section-title">Insect & Damage Level</div>
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Presence of Insects</span>
          <select className="select-input" name="insectsPresent" value={form.insectsPresent} onChange={onChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>

        {form.insectsPresent === 'Yes' && (
          <>
            <label className="field-block">
              <span className="field-label">Part Damaged</span>
              <select className="select-input" name="partDamaged" value={form.partDamaged} onChange={onChange}>
                <option value="Leaf">Leaf</option>
                <option value="Stem">Stem</option>
                <option value="Root">Root</option>
              </select>
            </label>
            <label className="field-block">
              <span className="field-label">Insect Location</span>
              <select className="select-input" name="insectLocation" value={form.insectLocation} onChange={onChange}>
                <option value="Inside">Inside</option>
                <option value="Outside">Outside</option>
              </select>
            </label>
          </>
        )}

        <label className="field-block full-width">
          <span className="field-label">Damage Level</span>
          <select className="select-input" name="damageLevel" value={form.damageLevel} onChange={onChange}>
            <option value="More than ETL">More than ETL</option>
            <option value="Less than ETL">Less than ETL</option>
          </select>
        </label>
      </div>
      {errors.insectsPresent && <span className="field-error">{errors.insectsPresent}</span>}
    </section>
  );
}
