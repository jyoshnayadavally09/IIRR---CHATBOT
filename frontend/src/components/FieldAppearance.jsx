export default function FieldAppearance({ selectedAppearance, onSelectAppearance }) {
  const options = [
    { key: 'Localized', label: 'Localized', image: '🌱' },
    { key: 'Widespread', label: 'Widespread', image: '🌾' },
  ];

  return (
    <section className="card">
      <div className="section-title">Field Appearance</div>
      <div className="appearance-grid">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={
              selectedAppearance === option.key ? 'appearance-card selected' : 'appearance-card'
            }
            onClick={() => onSelectAppearance(option.key)}
          >
            <div className="appearance-image">{option.image}</div>
            <div>{option.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
