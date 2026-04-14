export default function FarmerStep({ farmerName, location, onChange, error }) {
  return (
    <div className="step-card">
      <div className="step-group">
        <label className="field-block full-width">
          <span className="field-label">Farmer Name</span>
          <input
            type="text"
            name="farmerName"
            value={farmerName}
            onChange={onChange}
            className="text-input"
            placeholder="Enter farmer name"
            autoComplete="off"
          />
          {error && <span className="field-error">{error}</span>}
        </label>
      </div>

      <div className="location-panel">
        <div className="field-label">Auto-detected Location</div>
        <div className="location-data">Latitude: {location.latitude}</div>
        <div className="location-data">Longitude: {location.longitude}</div>
      </div>
    </div>
  );
}
