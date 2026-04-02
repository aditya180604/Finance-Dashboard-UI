import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const titles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Insights',
};

export default function Topbar({ onMenuClick }) {
  const { state, dispatch } = useApp();
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onMenuClick}>☰</button>
        <h1 className="topbar-title">{titles[pathname] || 'FinTrack'}</h1>
      </div>
      <div className="topbar-right">
        <span className={`role-badge ${state.role}`}>
          {state.role === 'admin' ? '🛡️' : '👁️'} {state.role}
        </span>
        <select
          className="role-select"
          value={state.role}
          onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
          title="Switch Role"
        >
          <option value="viewer">👁️ Viewer</option>
          <option value="admin">🛡️ Admin</option>
        </select>
        <button
          className="icon-btn"
          onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
          title={state.darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {state.darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
