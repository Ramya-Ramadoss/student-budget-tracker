import { getTotals, getDailySpend } from "./budgetUtils";

export function calculateHealthScore(income, savings) {
  const inc = Math.max(0, Number(income) || 0);
  const sav = Math.max(0, Number(savings) || 0);
  if (inc <= 0) return 0;
  return (sav / inc) * 100;
}

export function calculateSavingStreak(transactions, budgets, anchorDate = new Date()) {
  const dailyBudget = budgets?.weeklyLimit ? budgets.weeklyLimit / 7 : budgets?.monthlyLimit ? budgets.monthlyLimit / 30 : 0;
  if (dailyBudget <= 0) return 0;

  let streak = 0;
  const cursor = new Date(anchorDate);
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const dateISO = cursor.toISOString().slice(0, 10);
    const spend = getDailySpend(transactions, dateISO);
    if (spend <= dailyBudget) {
      streak += 1;
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateBadges(transactions, budgets) {
  const badges = [];
  const { income, expenses, savings } = getTotals(transactions);

  if (transactions.filter((t) => t.type === "expense").length >= 10) badges.push("📊 Expense Tracker");
  if (income > 0 && savings / income >= 0.2) badges.push("💰 Smart Saver");
  if (budgets?.monthlyLimit > 0 && expenses <= budgets.monthlyLimit) badges.push("🏆 Budget Master");

  if (badges.length === 0) badges.push("🏁 Getting Started");
  return badges;
}

