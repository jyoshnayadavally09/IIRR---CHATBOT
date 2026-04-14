const normalOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];
const temperatureOptions = [
  { value: '10-20', label: '10–20' },
  { value: '20-30', label: '20–30' },
  { value: '>30', label: '>30' },
];
const humidityOptions = [
  { value: '<50', label: '<50' },
  { value: '50-90', label: '50–90' },
  { value: '>90', label: '>90' },
];
const abnormalOptions = [
  'Cyclones',
  'Delayed Rains',
  'Early Drought',
  'Flood',
  'Continuous Rainy Days',
  'Dry Spell',
  'Others',
];

export default function WeatherSection({ weatherType, form, onChange, errors }) {
  return (
    <section className="card subsection-card">
      <div className="section-title">Weather Condition</div>
      <div className="field-grid">
        <label className="field-block">
          <span className="field-label">Weather Type</span>
          <select className="select-input" name="weatherType" value={weatherType} onChange={onChange}>
            <option value="Normal">Normal</option>
            <option value="Abnormal">Abnormal</option>
          </select>
        </label>

        {weatherType === 'Normal' ? (
          <>
            <label className="field-block">
              <span className="field-label">Rainfall</span>
              <select className="select-input" name="rainfall" value={form.rainfall} onChange={onChange}>
                {normalOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="field-block">
              <span className="field-label">Temperature</span>
              <select className="select-input" name="temperature" value={form.temperature} onChange={onChange}>
                {temperatureOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="field-block">
              <span className="field-label">Humidity</span>
              <select className="select-input" name="humidity" value={form.humidity} onChange={onChange}>
                {humidityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className="field-block full-width">
            <span className="field-label">Abnormal Weather</span>
            <select className="select-input" name="abnormalWeather" value={form.abnormalWeather} onChange={onChange}>
              {abnormalOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {errors.weatherType && <span className="field-error">{errors.weatherType}</span>}
    </section>
  );
}
