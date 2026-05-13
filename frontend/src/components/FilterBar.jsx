export default function FilterBar({ current, onChange, counts }) {
  const filters = [
    { key: 'all',       label: 'All',     count: counts.all       },
    { key: 'pending',   label: 'Pending', count: counts.pending   },
    { key: 'completed', label: 'Done',    count: counts.completed },
  ];

  return (
    <div className="filter-bar" role="tablist" aria-label="Filter tasks">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          className={`filter-btn ${current === key ? 'filter-btn--active' : ''}`}
          onClick={() => onChange(key)}
          role="tab"
          aria-selected={current === key}
        >
          {label}
          <span className="filter-count">{count}</span>
        </button>
      ))}
    </div>
  );
}