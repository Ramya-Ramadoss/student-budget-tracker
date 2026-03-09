export const CATEGORIES = [
  { id: "food", label: "Food", emoji: "🍕", color: "#f97316" },
  { id: "transport", label: "Transport", emoji: "🚌", color: "#06b6d4" },
  { id: "shopping", label: "Shopping", emoji: "🛍", color: "#ec4899" },
  { id: "entertainment", label: "Entertainment", emoji: "🎮", color: "#8b5cf6" },
  { id: "study", label: "Study", emoji: "📚", color: "#22c55e" },
];

export const INCOME_CATEGORY = { id: "income", label: "Income", emoji: "💸", color: "#22c55e" };

export function getCategoryById(id) {
  if (id === INCOME_CATEGORY.id) return INCOME_CATEGORY;
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

