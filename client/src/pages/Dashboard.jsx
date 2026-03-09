import { useMemo } from "react";
import BalanceCard from "../components/BalanceCard";
import AIInsights from "../components/AIInsights";
import BudgetAlert from "../components/BudgetAlert";
import GamificationPanel from "../components/GamificationPanel";
import PieChartComponent from "../charts/PieChart";
import WeeklyBarChart from "../charts/WeeklyBarChart";
import MonthlyLineChart from "../charts/MonthlyLineChart";
import { getTotals, groupExpensesByCategory, getMonthlyTrend, getWeeklyExpensesByDay, sumAmount } from "../utils/budgetUtils";
import { buildInsights } from "../utils/insightsUtils";
import { buildBudgetAlerts } from "../utils/alertUtils";
import { getDaysPassedInMonth, predictMonthlyExpense } from "../utils/predictionUtils";
import { calculateBadges, calculateHealthScore, calculateSavingStreak } from "../utils/gamificationUtils";

export default function Dashboard({ transactions, budgets }) {
  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);

  const { income, expenses, savings, balance } = useMemo(() => getTotals(transactions), [transactions]);
  const categoryTotals = useMemo(() => groupExpensesByCategory(transactions), [transactions]);
  const insights = useMemo(() => buildInsights(transactions), [transactions]);
  const alerts = useMemo(() => buildBudgetAlerts(transactions, budgets, todayISO), [transactions, budgets, todayISO]);
  const weekly = useMemo(() => getWeeklyExpensesByDay(transactions, todayISO), [transactions, todayISO]);
  const monthly = useMemo(() => getMonthlyTrend(transactions, now.getFullYear(), now.getMonth()), [transactions, now]);

  const monthExpenseTotal = useMemo(() => sumAmount(transactions.filter((t) => t.type === "expense")), [transactions]);
  const daysPassed = getDaysPassedInMonth(now);
  const predictedExpense = predictMonthlyExpense(monthExpenseTotal, daysPassed);
  const willExceedMonthly = budgets?.monthlyLimit ? predictedExpense > budgets.monthlyLimit : false;

  const streakDays = useMemo(() => calculateSavingStreak(transactions, budgets, now), [transactions, budgets, now]);
  const badges = useMemo(() => calculateBadges(transactions, budgets), [transactions, budgets]);
  const healthScore = useMemo(() => calculateHealthScore(income, savings), [income, savings]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="pt-6 pb-4">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">FinSense</div>
        <div className="text-slate-400 text-sm">AI Powered Student Budget Assistant</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BalanceCard title="Total Balance" value={`₹${Math.round(balance)}`} tone={balance >= 0 ? "green" : "red"} />
        <BalanceCard title="Total Income" value={`₹${Math.round(income)}`} tone="green" />
        <BalanceCard title="Total Expenses" value={`₹${Math.round(expenses)}`} tone="orange" />
        <BalanceCard title="Savings" value={`₹${Math.round(savings)}`} tone="violet" subtitle="Income − Expenses" />
      </div>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-500/15 via-slate-900/30 to-cyan-500/10 ring-1 ring-white/10 shadow-soft p-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-cyan-400/15 ring-1 ring-cyan-300/20 grid place-items-center">
            <span className="text-lg">🔮</span>
          </div>
          <div>
            <div className="font-extrabold text-white">Predictive Budgeting</div>
            <div className="text-xs text-slate-300/80">Simple projection based on your current pace</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-slate-100">
          Predicted monthly expense: <span className="font-extrabold">₹{Math.round(predictedExpense)}</span>
        </div>
        {budgets?.monthlyLimit ? (
          <div className={`mt-2 text-sm ${willExceedMonthly ? "text-rose-200" : "text-emerald-200"}`}>
            {willExceedMonthly
              ? "At this spending rate you may exceed your monthly budget."
              : "At this spending rate you look on track for your monthly budget."}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid lg:grid-cols-3 gap-4">
        <PieChartComponent categoryTotals={categoryTotals} />
        <WeeklyBarChart labels={weekly.labels} data={weekly.data} />
        <MonthlyLineChart labels={monthly.labels} data={monthly.data} />
      </div>

      <div className="mt-5 grid lg:grid-cols-3 gap-4">
        <AIInsights insights={insights} />
        <BudgetAlert alerts={alerts} />
        <GamificationPanel streakDays={streakDays} badges={badges} healthScore={healthScore} />
      </div>
    </div>
  );
}

