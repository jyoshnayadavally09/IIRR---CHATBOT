const normalWeatherOptions = ['Low', 'Medium', 'High'];
const temperatureOptions = ['10-20', '20-30', '>30'];
const humidityOptions = ['<50', '50-90', '>90'];
const abnormalOptions = [
  'Cyclones',
  'Delayed Rains',
  'Early Drought',
  'Flood',
  'Continuous Rainy Days',
  'Dry Spell',
  'Others',
];

export default function WeatherStep({ form, onChange, error }) {
  return (
    <div className="step-card">
      <div className="field-block full-width">
        <span className="field-label">Weather Type</span>
        <select name="weatherType" value={form.weatherType} onChange={onChange} className="select-input">
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
        </select>
      </div>

      {form.weatherType === 'Normal' ? (
        <div className="field-grid">
          <label className="field-block">
            <span className="field-label">Rainfall</span>
            <select name="rainfall" value={form.rainfall} onChange={onChange} className="select-input">
              {normalWeatherOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="field-block">
            <span className="field-label">Temperature</span>
            <select name="temperature" value={form.temperature} onChange={onChange} className="select-input">
              {temperatureOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="field-block">
            <span className="field-label">Humidity</span>
            <select name="humidity" value={form.humidity} onChange={onChange} className="select-input">
              {humidityOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <label className="field-block full-width">
          <span className="field-label">Abnormal Weather</span>
          <select name="abnormalWeather" value={form.abnormalWeather} onChange={onChange} className="select-input">
            {abnormalOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
