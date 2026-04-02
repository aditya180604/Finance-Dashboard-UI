import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import TransactionModal from '../components/Transactions/TransactionModal';

const PAGE_SIZE = 10;

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role } = state;

  const [modal, setModal] = useState(null); // null | 'add' | transaction obj
  const [page, setPage] = useState(1);

  const { search, category, type, sortBy } = filters;

  const setFilter = payload => {
    dispatch({ type: 'SET_FILTER', payload });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.note.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'all') list = list.filter(t => t.category === category);
    if (type !== 'all') list = list.filter(t => t.type === type);
    switch (sortBy) {
      case 'date-desc': list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'date-asc':  list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount-asc':  list.sort((a, b) => a.amount - b.amount); break;
    }
    return list;
  }, [transactions, search, category, type, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = t => {
    if (modal === 'add') dispatch({ type: 'ADD_TRANSACTION', payload: t });
    else dispatch({ type: 'EDIT_TRANSACTION', payload: t });
    setModal(null);
  };

  const handleDelete = id => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const exportCSV = () => {
    const headers = ['Title', 'Amount', 'Type', 'Category', 'Date', 'Note'];
    const rows = filtered.map(t => [
      `"${t.title}"`,
      t.amount,
      t.type,
      t.category,
      t.date,
      `"${t.note || ''}"`
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-desc">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={exportCSV} title="Export current view as CSV">
            ⬇ Export CSV
          </button>
          {role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search transactions..."
              value={search}
              onChange={e => setFilter({ search: e.target.value })}
            />
          </div>
          <select className="filter-select" value={type} onChange={e => setFilter({ type: e.target.value })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={category} onChange={e => setFilter({ category: e.target.value })}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={e => setFilter({ sortBy: e.target.value })}>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High)</option>
            <option value="amount-asc">Amount (Low)</option>
          </select>
        </div>

        {paginated.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                    {role === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div className="td-title">{t.title}</div>
                        {t.note && <div className="td-note">{t.note}</div>}
                      </td>
                      <td><span className="cat-chip">{t.category}</span></td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === 'income' ? '▲' : '▼'} {t.type}
                        </span>
                      </td>
                      <td className="td-date">
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className={`td-amount ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {role === 'admin' && (
                        <td>
                          <div className="actions-td">
                            <button className="btn btn-edit" onClick={() => setModal(t)}>✎ Edit</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>🗑</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <span>Page {page} of {totalPages}</span>
                <div className="page-btns">
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
