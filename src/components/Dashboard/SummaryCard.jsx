export default function SummaryCard({ label, value, icon, type, sub }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="label">{label}</div>
        <div className="value">
          {type === 'expense' ? '-' : type === 'income' ? '+' : ''}
          ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {sub && <div className="sub">{sub}</div>}
      </div>
    </div>
  );
}
