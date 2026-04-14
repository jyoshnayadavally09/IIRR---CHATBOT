export default function StageSelector({ selectedStage, onSelectStage }) {
  const stages = ['Nursery', 'Planting to PI', 'Flowering', 'Maturity'];

  return (
    <section className="card">
      <div className="section-title">Growth Stage Flow</div>
      <div className="stage-strip">
        {stages.map((stage, index) => (
          <div key={stage} className="stage-segment">
            <button
              type="button"
              className={selectedStage === stage ? 'stage-button active' : 'stage-button'}
              onClick={() => onSelectStage(stage)}
            >
              {stage}
            </button>
            {index < stages.length - 1 && <span className="stage-arrow">→</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
