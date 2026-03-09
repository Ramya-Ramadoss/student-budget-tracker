const KEYS = {
  transactions: "finsense.transactions.v1",
  budgets: "finsense.budgets.v1",
};

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function readLS(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  return safeParse(raw, fallback);
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function seedIfEmpty() {
  const existing = readLS(KEYS.transactions, null);
  if (Array.isArray(existing) && existing.length > 0) return;

  const seed = [
    { id: createId(), type: "expense", amount: 450, category: "food", date: "2026-03-01", note: "Dominos" },
    { id: createId(), type: "expense", amount: 120, category: "food", date: "2026-03-01", note: "Coffee" },
    { id: createId(), type: "income", amount: 3000, category: "income", date: "2026-03-02", note: "Part-time stipend" },
    { id: createId(), type: "expense", amount: 180, category: "study", date: "2026-03-03", note: "Notebook" },
    { id: createId(), type: "expense", amount: 90, category: "transport", date: "2026-03-04", note: "Bus pass" },
    { id: createId(), type: "expense", amount: 520, category: "shopping", date: "2026-03-06", note: "T-shirt" },
    { id: createId(), type: "expense", amount: 260, category: "entertainment", date: "2026-03-08", note: "Movie night" },
  ];

  writeLS(KEYS.transactions, seed);
}

export function getTransactions() {
  seedIfEmpty();
  const tx = readLS(KEYS.transactions, []);
  return Array.isArray(tx) ? tx : [];
}

export function addTransaction(partial) {
  const tx = getTransactions();
  const next = {
    id: createId(),
    type: partial.type === "income" ? "income" : "expense",
    amount: Number(partial.amount) || 0,
    category: String(partial.category || "food"),
    date: partial.date || todayISO(),
    note: String(partial.note || ""),
  };
  const updated = [next, ...tx];
  writeLS(KEYS.transactions, updated);
  return next;
}

export function deleteTransaction(id) {
  const tx = getTransactions();
  const updated = tx.filter((t) => t.id !== id);
  writeLS(KEYS.transactions, updated);
}

export function getBudgets() {
  const fallback = {
    monthlyLimit: 8000,
    weeklyLimit: 2000,
    categoryLimits: {
      food: 2000,
      transport: 800,
      shopping: 1500,
      entertainment: 1200,
      study: 1000,
    },
  };
  const budgets = readLS(KEYS.budgets, fallback);
  return budgets && typeof budgets === "object" ? { ...fallback, ...budgets } : fallback;
}

export function setBudgets(nextBudgets) {
  writeLS(KEYS.budgets, nextBudgets);
}

