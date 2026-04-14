const stages = [
  { label: 'Nursery', value: 'nursery' },
  { label: 'Planting (PI)', value: 'planting' },
  { label: 'Flowering–Maturity', value: 'flowering' },
];

export default function CropStage({ stage, onSelectStage }) {
  return (
    <section className="card subsection-card">
      <div className="section-title">Crop Stage</div>
      <div className="stage-strip">
        {stages.map((option, index) => (
          <div key={option.value} className="stage-segment">
            <button
              type="button"
              className={stage === option.value ? 'stage-button active' : 'stage-button'}
              onClick={() => onSelectStage(option.value)}
            >
              {option.label}
            </button>
            {index < stages.length - 1 && <span className="stage-arrow">→</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
