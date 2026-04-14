export default function Header({ farmerName, location, weather, onSelectWeather }) {
  return (
    <section className="card top-card">
      <div>
        <div className="section-title">Field Decision Guide</div>
        <div className="info-line">{farmerName}</div>
        <div className="info-line location-text">Location: {location}</div>
      </div>

      <div className="weather-group">
        <div className="mini-label">Weather</div>
        <div className="toggle-row">
          {['Normal', 'Abnormal'].map((option) => (
            <button
              key={option}
              type="button"
              className={weather === option ? 'weather-button selected' : 'weather-button'}
              onClick={() => onSelectWeather(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
