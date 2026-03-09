function toDate(dateISO) {
  // dateISO is expected as YYYY-MM-DD
  return new Date(dateISO + "T00:00:00");
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function sumAmount(list) {
  return list.reduce((s, t) => s + (Number(t.amount) || 0), 0);
}

export function getTotals(transactions) {
  const incomeTx = transactions.filter((t) => t.type === "income");
  const expenseTx = transactions.filter((t) => t.type === "expense");
  const income = sumAmount(incomeTx);
  const expenses = sumAmount(expenseTx);
  const savings = Math.max(0, income - expenses);
  const balance = income - expenses;
  return { income, expenses, savings, balance };
}

export function groupExpensesByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const key = t.category || "food";
    map.set(key, (map.get(key) || 0) + (Number(t.amount) || 0));
  }
  return [...map.entries()].map(([category, amount]) => ({ category, amount }));
}

export function getDailySpend(transactions, dateISO) {
  const d = toDate(dateISO);
  return transactions
    .filter((t) => t.type === "expense" && t.date && sameDay(toDate(t.date), d))
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);
}

export function isWeekend(dateISO) {
  const d = toDate(dateISO);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  return day === 0 || day === 6;
}

export function getWeeklyExpensesByDay(transactions, anchorDateISO = new Date().toISOString().slice(0, 10)) {
  const anchor = toDate(anchorDateISO);
  const day = anchor.getDay(); // 0 Sun ... 6 Sat
  const mondayOffset = (day + 6) % 7; // Monday = 0
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = new Array(7).fill(0);

  for (const t of transactions) {
    if (t.type !== "expense" || !t.date) continue;
    const td = toDate(t.date);
    const diffDays = Math.floor((startOfDay(td).getTime() - monday.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 6) continue;
    data[diffDays] += Number(t.amount) || 0;
  }

  return { labels, data };
}

export function getMonthlyTrend(transactions, year, monthIndex) {
  // monthIndex: 0-11
  const y = typeof year === "number" ? year : new Date().getFullYear();
  const m = typeof monthIndex === "number" ? monthIndex : new Date().getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  const data = new Array(daysInMonth).fill(0);

  for (const t of transactions) {
    if (t.type !== "expense" || !t.date) continue;
    const d = toDate(t.date);
    if (d.getFullYear() !== y || d.getMonth() !== m) continue;
    const idx = d.getDate() - 1;
    data[idx] += Number(t.amount) || 0;
  }

  // convert to cumulative trend (smoother for line chart)
  for (let i = 1; i < data.length; i++) data[i] += data[i - 1];

  return { labels, data, year: y, monthIndex: m };
}

export function getHighestSpendingDay(transactions) {
  const byDay = new Map();
  for (const t of transactions) {
    if (t.type !== "expense" || !t.date) continue;
    byDay.set(t.date, (byDay.get(t.date) || 0) + (Number(t.amount) || 0));
  }
  let best = null;
  for (const [date, amount] of byDay.entries()) {
    if (!best || amount > best.amount) best = { date, amount };
  }
  return best;
}

export function getMostExpensiveCategory(transactions) {
  const grouped = groupExpensesByCategory(transactions);
  if (grouped.length === 0) return null;
  grouped.sort((a, b) => b.amount - a.amount);
  return grouped[0];
}

