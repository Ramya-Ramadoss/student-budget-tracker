export function getDaysPassedInMonth(date = new Date()) {
  return Math.max(1, date.getDate());
}

export function predictMonthlyExpense(currentExpense, daysPassed) {
  const d = Math.max(1, Number(daysPassed) || 1);
  const cur = Math.max(0, Number(currentExpense) || 0);
  return (cur * 30) / d;
}

