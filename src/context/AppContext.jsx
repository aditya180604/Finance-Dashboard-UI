import { createContext, useContext, useEffect, useReducer } from 'react';
import { mockTransactions } from '../data/mockData';

const STORAGE_KEY = 'fintrack_transactions';

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockTransactions;
  } catch {
    return mockTransactions;
  }
}

const AppContext = createContext(null);

const initialState = {
  transactions: loadTransactions(),
  role: localStorage.getItem('role') || 'viewer',
  darkMode: localStorage.getItem('darkMode') === 'true',
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date-desc',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      localStorage.setItem('role', action.payload);
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK':
      localStorage.setItem('darkMode', !state.darkMode);
      return { ...state, darkMode: !state.darkMode };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  }, [state.transactions]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
