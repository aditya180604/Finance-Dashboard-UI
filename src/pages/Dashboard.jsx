import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/Dashboard/SummaryCard';
import BalanceTrendChart from '../components/Dashboard/BalanceTrendChart';
import SpendingPieChart from '../components/Dashboard/SpendingPieChart';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const { state } = useApp();
  const { transactions } = state;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Monthly balance trend
  const trendData = useMemo(() => {
    const monthly = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthly[key]) monthly[key] = { year: d.getFullYear(), month: d.getMonth(), income: 0, expense: 0 };
      if (t.type === 'income') monthly[key].income += t.amount;
      else monthly[key].expense += t.amount;
    });
    return Object.values(monthly)
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map(m => ({
        month: MONTH_NAMES[m.month],
        balance: m.income - m.expense,
      }));
  }, [transactions]);

  // Spending by category
  const pieData = useMemo(() => {
    const cats = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const catEmoji = {
    'Food & Dining': '🍽️', 'Shopping': '🛍️', 'Transport': '🚗',
    'Healthcare': '💊', 'Entertainment': '🎬', 'Utilities': '⚡',
    'Salary': '💼', 'Freelance': '💻', 'Investment': '📈', 'Other': '📦',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-desc">Welcome back! Here's your financial summary.</p>
      </div>

      <div className="stats-grid">
        <SummaryCard label="Total Balance" value={balance} icon="💰" type="balance" sub={`${transactions.length} transactions`} />
        <SummaryCard label="Total Income" value={totalIncome} icon="📈" type="income" sub="All time" />
        <SummaryCard label="Total Expenses" value={totalExpense} icon="📉" type="expense" sub="All time" />
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Balance Trend</div>
              <div className="card-subtitle">Monthly net balance over time</div>
            </div>
          </div>
          {trendData.length > 0 ? <BalanceTrendChart data={trendData} /> : (
            <div className="empty-state"><span className="empty-icon">📊</span><p>No data yet</p></div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Spending Breakdown</div>
              <div className="card-subtitle">Expenses by category</div>
            </div>
          </div>
          {pieData.length > 0 ? <SpendingPieChart data={pieData} /> : (
            <div className="empty-state"><span className="empty-icon">🥧</span><p>No expenses yet</p></div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Transactions</div>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">💳</span><p>No transactions yet</p></div>
        ) : (
          <div className="recent-list">
            {recent.map(t => (
              <div key={t.id} className="recent-item">
                <div className={`recent-dot ${t.type}`}>{catEmoji[t.category] || '💲'}</div>
                <div className="recent-info">
                  <div className="recent-title">{t.title}</div>
                  <div className="recent-date">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div className={`recent-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
