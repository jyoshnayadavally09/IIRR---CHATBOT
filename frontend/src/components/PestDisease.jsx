export default function PestDisease({ selectedOption, onSelectOption }) {
  const options = [
    { key: 'Pest Infestation', label: 'Pest Infestation', image: '🐛' },
    { key: 'Disease Symptoms', label: 'Disease Symptoms', image: '🦠' },
  ];

  return (
    <section className="card">
      <div className="section-title">Pest / Disease</div>
      <div className="appearance-grid">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={selectedOption === option.key ? 'appearance-card selected' : 'appearance-card'}
            onClick={() => onSelectOption(option.key)}
          >
            <div className="appearance-image">{option.image}</div>
            <div>{option.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
