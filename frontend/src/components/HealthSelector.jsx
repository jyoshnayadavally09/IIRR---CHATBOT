export default function HealthSelector({ health, onSelectHealth }) {
  return (
    <section className="card">
      <div className="section-title">Crop Health</div>
      <div className="health-grid">
        <button
          type="button"
          className={health === 'Healthy' ? 'health-card healthy selected' : 'health-card healthy'}
          onClick={() => onSelectHealth('Healthy')}
        >
          <div className="health-icon">✅</div>
          Healthy
        </button>
        <button
          type="button"
          className={health === 'Unhealthy' ? 'health-card unhealthy selected' : 'health-card unhealthy'}
          onClick={() => onSelectHealth('Unhealthy')}
        >
          <div className="health-icon">⚠️</div>
          Unhealthy
        </button>
      </div>
    </section>
  );
}
