import { getDailySpend, groupExpensesByCategory, sumAmount } from "./budgetUtils";

function toDate(dateISO) {
  return new Date(dateISO + "T00:00:00");
}

function sameMonth(dateISO, anchor) {
  const d = toDate(dateISO);
  return d.getFullYear() === anchor.getFullYear() && d.getMonth() === anchor.getMonth();
}

function inSameWeek(dateISO, anchorDateISO) {
  const anchor = toDate(anchorDateISO);
  const day = anchor.getDay(); // 0 Sun ... 6 Sat
  const mondayOffset = (day + 6) % 7;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const end = new Date(monday);
  end.setDate(monday.getDate() + 7);

  const d = toDate(dateISO);
  return d >= monday && d < end;
}

export function buildBudgetAlerts(transactions, budgets, anchorDateISO = new Date().toISOString().slice(0, 10)) {
  const alerts = [];
  const anchor = toDate(anchorDateISO);

  const monthExpenses = transactions.filter((t) => t.type === "expense" && t.date && sameMonth(t.date, anchor));
  const weekExpenses = transactions.filter((t) => t.type === "expense" && t.date && inSameWeek(t.date, anchorDateISO));

  const dailyBudget = budgets?.weeklyLimit ? budgets.weeklyLimit / 7 : budgets?.monthlyLimit ? budgets.monthlyLimit / 30 : 0;
  const todaySpend = getDailySpend(transactions, anchorDateISO);
  if (dailyBudget > 0 && todaySpend > dailyBudget) {
    alerts.push({
      title: "Daily budget exceeded",
      message: `You spent ₹${Math.round(todaySpend)} today. Daily budget exceeded.`,
      meta: `Daily limit: ₹${Math.round(dailyBudget)}`,
    });
  }

  const weekSpend = sumAmount(weekExpenses);
  if (budgets?.weeklyLimit > 0 && weekSpend >= budgets.weeklyLimit * 0.85) {
    alerts.push({
      title: "Weekly budget warning",
      message: `You've used ${Math.round((weekSpend / budgets.weeklyLimit) * 100)}% of your weekly budget.`,
      meta: `Limit: ₹${Math.round(budgets.weeklyLimit)} • Spent: ₹${Math.round(weekSpend)}`,
    });
  }

  // Category monthly limit (90%)
  const byCat = groupExpensesByCategory(monthExpenses);
  for (const x of byCat) {
    const limit = budgets?.categoryLimits?.[x.category];
    if (!limit) continue;
    if (x.amount >= limit * 0.9) {
      alerts.push({
        title: "Budget warning",
        message: `⚠ ${x.category} is close to its monthly limit.`,
        meta: `Limit: ₹${Math.round(limit)} • Spent: ₹${Math.round(x.amount)}`,
      });
    }
  }

  return alerts.slice(0, 6);
}

