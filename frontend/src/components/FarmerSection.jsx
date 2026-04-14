export default function FarmerSection({ farmerName, location, onFarmerNameChange, error }) {
  return (
    <section className="card subsection-card">
      <div className="section-title">Farmer Details</div>
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Farmer Name</span>
          <input
            className="text-input"
            type="text"
            name="farmerName"
            value={farmerName}
            onChange={onFarmerNameChange}
            placeholder="Enter farmer name"
            autoComplete="off"
          />
          {error && <span className="field-error">{error}</span>}
        </label>

        <div className="location-panel">
          <span className="field-label">Auto-detected Location</span>
          <div className="location-data">Latitude: {location.latitude}</div>
          <div className="location-data">Longitude: {location.longitude}</div>
          <div className="location-data">State: {location.state}</div>
        </div>
      </div>
    </section>
  );
}
