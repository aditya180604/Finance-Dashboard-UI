import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  // Top spending category
  const catTotals = useMemo(() => {
    const m = {};
    expenses.forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [expenses]);
  const topCat = catTotals[0];
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);

  // Monthly comparison data
  const monthlyData = useMemo(() => {
    const monthly = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}`;
      if (!monthly[key]) monthly[key] = { label: MONTH_NAMES[d.getMonth()], income: 0, expense: 0 };
      if (t.type === 'income') monthly[key].income += t.amount;
      else monthly[key].expense += t.amount;
    });
    return Object.values(monthly).slice(-6);
  }, [transactions]);

  // Biggest transaction
  const biggest = [...transactions].sort((a, b) => b.amount - a.amount)[0];

  // Income vs expense ratio
  const ratio = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0;

  const savingsRate = totalIncome > 0
    ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
    : 0;

  const catEmoji = {
    'Food & Dining': '🍽️', 'Shopping': '🛍️', 'Transport': '🚗',
    'Healthcare': '💊', 'Entertainment': '🎬', 'Utilities': '⚡',
    'Salary': '💼', 'Freelance': '💻', 'Investment': '📈', 'Other': '📦',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
        <p className="page-desc">Understand your spending patterns and financial health.</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(234,84,85,0.12)' }}>
            {topCat ? (catEmoji[topCat[0]] || '💸') : '💸'}
          </div>
          <div>
            <div className="insight-label">Top Spending Category</div>
            <div className="insight-value" style={{ color: 'var(--expense-color)', fontSize: 16 }}>
              {topCat ? topCat[0] : '—'}
            </div>
            <div className="insight-sub">
              {topCat ? `₹${topCat[1].toLocaleString('en-IN')} total spent` : 'No expenses yet'}
            </div>
          </div>
          {topCat && (
            <div>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{
                  width: `${totalExpense > 0 ? (topCat[1] / totalExpense * 100).toFixed(0) : 0}%`,
                  background: 'var(--expense-color)',
                }} />
              </div>
              <div className="insight-sub" style={{ marginTop: 4 }}>
                {totalExpense > 0 ? (topCat[1] / totalExpense * 100).toFixed(1) : 0}% of total expenses
              </div>
            </div>
          )}
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(40,199,111,0.12)' }}>💹</div>
          <div>
            <div className="insight-label">Savings Rate</div>
            <div className="insight-value" style={{ color: parseFloat(savingsRate) > 0 ? 'var(--success)' : 'var(--danger)' }}>
              {savingsRate}%
            </div>
            <div className="insight-sub">Of income saved</div>
          </div>
          <div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{
                width: `${Math.max(0, Math.min(100, savingsRate))}%`,
                background: parseFloat(savingsRate) > 20 ? 'var(--success)' : 'var(--warning)',
              }} />
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(115,103,240,0.15)' }}>📊</div>
          <div>
            <div className="insight-label">Expense Ratio</div>
            <div className="insight-value" style={{ color: 'var(--accent)' }}>{ratio}%</div>
            <div className="insight-sub">Expenses vs Income</div>
          </div>
          <div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{
                width: `${Math.min(100, ratio)}%`,
                background: parseFloat(ratio) < 70 ? 'var(--accent)' : 'var(--danger)',
              }} />
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(255,159,67,0.12)' }}>🏆</div>
          <div>
            <div className="insight-label">Biggest Transaction</div>
            <div className="insight-value" style={{ fontSize: 16, color: 'var(--warning)' }}>
              {biggest ? biggest.title : '—'}
            </div>
            <div className="insight-sub">
              {biggest
                ? `₹${biggest.amount.toLocaleString('en-IN')} · ${biggest.type} · ${biggest.category}`
                : 'No transactions'}
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Category Breakdown</div>
            <div className="card-subtitle">Expenses ranked by amount</div>
          </div>
        </div>
        {catTotals.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📦</span><p>No expenses recorded</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {catTotals.map(([cat, amt]) => (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span><span style={{ marginRight: 6 }}>{catEmoji[cat] || '💲'}</span>{cat}</span>
                  <span style={{ fontWeight: 700 }}>₹{amt.toLocaleString('en-IN')}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{
                    width: `${totalExpense > 0 ? (amt / totalExpense * 100).toFixed(0) : 0}%`,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly income vs expense */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Monthly Comparison</div>
            <div className="card-subtitle">Income vs Expenses over time</div>
          </div>
        </div>
        {monthlyData.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📅</span><p>No data available</p></div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
              />
              <Legend formatter={v => <span style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{v}</span>} />
              <Bar dataKey="income" fill="#28c76f" radius={[4,4,0,0]} />
              <Bar dataKey="expense" fill="#ea5455" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
