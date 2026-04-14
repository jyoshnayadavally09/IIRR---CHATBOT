export default function InputSection({ variety, duration, onChange }) {
  return (
    <section className="card">
      <div className="section-title">Crop Details</div>
      <div className="input-grid">
        <label className="input-card">
          <span className="field-label">Variety Name</span>
          <input
            type="text"
            name="variety"
            value={variety}
            placeholder="Enter variety name"
            onChange={onChange}
          />
        </label>

        <div className="input-card">
          <span className="field-label">Duration</span>
          <div className="radio-row">
            {['Long', 'Medium', 'Short'].map((option) => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="duration"
                  value={option}
                  checked={duration === option}
                  onChange={onChange}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
