import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/transactions', icon: '💳', label: 'Transactions' },
  { to: '/insights', icon: '💡', label: 'Insights' },
];

export default function Sidebar({ open, onClose }) {
  const { state } = useApp();
  return (
    <>
      <div className={`overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">💰</div>
          <div>
            <div className="logo-text">FinTrack</div>
            <div className="logo-sub">Finance Dashboard</div>
          </div>
          <button className="close-sidebar" onClick={onClose} style={{ marginLeft: 'auto' }}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Main Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            Logged in as{' '}
            <strong style={{ color: state.role === 'admin' ? 'var(--success)' : 'var(--accent-2)', textTransform: 'capitalize' }}>
              {state.role}
            </strong>
          </div>
        </div>
      </aside>
    </>
  );
}
