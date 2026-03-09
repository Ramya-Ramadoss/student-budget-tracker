import { getMostExpensiveCategory, getHighestSpendingDay, getTotals, isWeekend, sumAmount } from "./budgetUtils";

export function buildInsights(transactions) {
  const insights = [];
  const { income, expenses } = getTotals(transactions);
  if (expenses <= 0) return ["Add a few expenses to unlock AI insights."];

  const most = getMostExpensiveCategory(transactions);
  if (most) {
    insights.push(`You spend most money on ${most.category} this month.`);
  }

  // Food/any category over 40% of total spend
  const grouped = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    grouped.set(t.category, (grouped.get(t.category) || 0) + (Number(t.amount) || 0));
  }
  for (const [cat, amt] of grouped.entries()) {
    if (amt / expenses > 0.4) {
      insights.push(`AI Insight: ${cat} is over 40% of your spending.`);
      break;
    }
  }

  // Weekend vs weekday
  const weekend = sumAmount(transactions.filter((t) => t.type === "expense" && t.date && isWeekend(t.date)));
  const weekday = sumAmount(transactions.filter((t) => t.type === "expense" && t.date && !isWeekend(t.date)));
  if (weekend > weekday) insights.push("Your weekend spending is higher than weekdays.");

  // Highest spending day
  const highDay = getHighestSpendingDay(transactions);
  if (highDay) insights.push(`Highest spending day: ${highDay.date} (₹${Math.round(highDay.amount)}).`);

  // Savings hint
  if (income > 0 && expenses > income * 0.9) insights.push("You're spending close to your income — consider tightening one category.");

  return insights.slice(0, 6);
}

