# FinTrack — Finance Dashboard

A clean, interactive Finance Dashboard built as a Frontend Internship Assessment.

## Tech Stack

- **Frontend**: React 19 + Vite
- **State Management**: React Context API + `useReducer`
- **Charts**: Recharts (AreaChart, PieChart, BarChart)
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS with CSS Custom Properties (dark/light mode)
- **Data**: Static mock data (35 transactions across 6 months)

## Project Structure

```
zorvyn/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/    # SummaryCard, BalanceTrendChart, SpendingPieChart
│   │   │   ├── Transactions/ # TransactionModal
│   │   │   └── Layout/       # Sidebar, Topbar
│   │   ├── context/
│   │   │   └── AppContext.jsx  # Global state via Context + useReducer
│   │   ├── data/
│   │   │   └── mockData.js     # 35 mock transactions
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Insights.jsx
│   │   └── index.css           # Full design system
│   └── package.json
└── backend/           # (Minimal placeholder — not required for this assessment)
```


## Features

### 1. Dashboard Overview
- **Summary cards**: Total Balance, Income, and Expenses
- **Area chart**: Monthly balance trend (6 months)
- **Donut pie chart**: Spending breakdown by category
- **Recent transactions** list

### 2. Transactions
- Full table of all 35 transactions
- **Search** by title, category, or note
- **Filter** by type (Income / Expense) and category
- **Sort** by date (asc/desc) and amount (asc/desc)
- **Pagination** (10 per page)
- **Admin only**: Add new, Edit, and Delete transactions

### 3. Role-Based UI
Switch roles via the dropdown in the top bar:
| Role   | Capabilities                          |
|--------|---------------------------------------|
| Viewer | Read-only: see all data and charts    |
| Admin  | Full CRUD: add, edit, delete entries  |

Role and dark mode preference are persisted to `localStorage`.

### 4. Insights
- Top spending category with progress bar
- Savings rate indicator
- Expense-to-income ratio
- Biggest single transaction
- Category breakdown ranked bars
- Monthly income vs expense bar chart

### 5. Dark / Light Mode
Toggle using the 🌙/☀️ button in the top bar. Preference is saved in localStorage.

### 6. Responsive Design
- Collapses sidebar to a hamburger menu on mobile
- Cards and charts reflow for all screen sizes

## Assumptions

- No backend integration is required; all data is static mock data.
- Role switching is purely frontend for demo purposes.
- Transactions added during a session are not persisted (no backend or localStorage for transaction data intentionally, per simple-scope requirement).
