import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { useMemo, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import BudgetPlanner from "./pages/BudgetPlanner";
import Achievements from "./pages/Achievements";
import LegacyTracker from "./pages/LegacyTracker";
import { addTransaction, deleteTransaction, getBudgets, getTransactions, setBudgets } from "./utils/storage";
import { getTotals } from "./utils/budgetUtils";
import { calculateBadges, calculateHealthScore, calculateSavingStreak } from "./utils/gamificationUtils";

function Tab({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 rounded-2xl px-3 py-2.5 text-sm font-extrabold ring-1 transition ${
          isActive ? "bg-white/8 ring-white/20 text-white" : "bg-transparent ring-white/10 text-slate-300 hover:bg-white/5"
        }`
      }
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="hidden sm:inline">{label}</span>
      </div>
    </NavLink>
  );
}

export default function App() {
  const [transactions, setTransactionsState] = useState(() => getTransactions());
  const [budgetsState, setBudgetsState] = useState(() => getBudgets());

  const totals = useMemo(() => getTotals(transactions), [transactions]);
  const streakDays = useMemo(() => calculateSavingStreak(transactions, budgetsState, new Date()), [transactions, budgetsState]);
  const badges = useMemo(() => calculateBadges(transactions, budgetsState), [transactions, budgetsState]);
  const healthScore = useMemo(() => calculateHealthScore(totals.income, totals.savings), [totals.income, totals.savings]);

  const handleAdd = (payload) => {
    const next = addTransaction(payload);
    setTransactionsState((prev) => [next, ...prev]);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setTransactionsState((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveBudgets = (next) => {
    setBudgets(next);
    setBudgetsState(next);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-3xl bg-gradient-to-br from-violet-500/70 to-cyan-400/50 ring-1 ring-white/15 grid place-items-center shadow-soft">
              <span className="text-xl">💳</span>
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-white leading-tight">FinSense</div>
              <div className="text-xs text-slate-400">AI Powered Student Budget Assistant</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[11px] text-slate-400">Balance</div>
              <div className={`text-sm font-extrabold ${totals.balance >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                ₹{Math.round(totals.balance)}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-4">
            <div className="grid grid-cols-4 gap-2 rounded-3xl bg-slate-900/40 ring-1 ring-white/10 p-2">
              <Tab to="/" label="Dashboard" icon="📊" />
              <Tab to="/transactions" label="Transactions" icon="🧾" />
              <Tab to="/budget-planner" label="Planner" icon="🎛" />
              <Tab to="/achievements" label="Achievements" icon="🏅" />
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} budgets={budgetsState} />} />
          <Route
            path="/transactions"
            element={<Transactions transactions={transactions} onAdd={handleAdd} onDelete={handleDelete} />}
          />
          <Route
            path="/budget-planner"
            element={<BudgetPlanner transactions={transactions} budgets={budgetsState} onSaveBudgets={handleSaveBudgets} />}
          />
          <Route
            path="/achievements"
            element={<Achievements streakDays={streakDays} badges={badges} healthScore={healthScore} />}
          />
          <Route path="/classic" element={<LegacyTracker transactions={transactions} onAdd={handleAdd} onDelete={handleDelete} />} />
        </Routes>

        <div className="pb-10" />
        <div className="max-w-6xl mx-auto px-4 pb-10 text-center text-[11px] text-slate-500">
          Tip: visit <NavLink className="text-slate-300 hover:text-white" to="/classic">/classic</NavLink> for the original tracker flow.
        </div>
      </div>
    </BrowserRouter>
  );
}
