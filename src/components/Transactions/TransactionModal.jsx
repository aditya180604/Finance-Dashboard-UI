import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/mockData';

const emptyForm = { title: '', amount: '', type: 'expense', category: 'Food & Dining', date: '', note: '' };

export default function TransactionModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (transaction) {
      setForm({ ...transaction, amount: String(transaction.amount) });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setForm({ ...emptyForm, date: today });
    }
  }, [transaction]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount), id: transaction?.id || String(Date.now()) });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Grocery Shopping" required
              />
            </div>
            <div className="form-group">
              <label>Amount ($) *</label>
              <input
                name="amount" type="number" min="0.01" step="0.01"
                value={form.amount} onChange={handleChange}
                placeholder="0.00" required
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Note</label>
              <textarea name="note" value={form.note} onChange={handleChange} placeholder="Optional note..." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {transaction ? '✓ Save Changes' : '+ Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
