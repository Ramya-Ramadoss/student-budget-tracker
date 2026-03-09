import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, INCOME_CATEGORY } from "../data/categories";

export default function ExpenseModal({ open, onClose, onSave, defaultType = "expense" }) {
  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]?.id || "food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const categories = useMemo(() => {
    if (type === "income") return [INCOME_CATEGORY];
    return CATEGORIES;
  }, [type]);

  useEffect(() => {
    if (!open) return;
    setType(defaultType);
    setAmount("");
    setCategory((defaultType === "income" ? INCOME_CATEGORY.id : (CATEGORIES[0]?.id || "food")));
    setDate(new Date().toISOString().slice(0, 10));
    setNote("");
    setErr("");
  }, [open, defaultType]);

  if (!open) return null;

  const handleSave = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setErr("Enter a valid amount.");
    setErr("");
    onSave?.({ type, amount: Number(amount), category, date, note });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:grid sm:place-items-center p-3">
        <div className="w-full sm:max-w-lg rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center gap-2">
            <div className="text-lg font-extrabold">Add Transaction</div>
            <button onClick={onClose} className="ml-auto h-9 w-9 rounded-xl hover:bg-white/5 text-slate-300">
              ×
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-2xl px-4 py-3 ring-1 text-sm font-bold ${
                  type === "expense" ? "bg-white/5 ring-white/15 text-white" : "bg-transparent ring-white/10 text-slate-300"
                }`}
                onClick={() => setType("expense")}
              >
                Expense
              </button>
              <button
                className={`flex-1 rounded-2xl px-4 py-3 ring-1 text-sm font-bold ${
                  type === "income" ? "bg-white/5 ring-white/15 text-white" : "bg-transparent ring-white/10 text-slate-300"
                }`}
                onClick={() => setType("income")}
              >
                Income
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Amount</div>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="₹ 450"
                  className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-violet-400/40"
                />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Date</div>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-violet-400/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Category</div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-violet-400/40"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Note</div>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Dominos"
                  className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-violet-400/40"
                />
              </div>
            </div>

            {err ? <div className="text-sm text-rose-300">{err}</div> : null}
          </div>

          <div className="p-5 border-t border-white/10 flex gap-2">
            <button onClick={onClose} className="flex-1 rounded-2xl px-4 py-3 ring-1 ring-white/10 text-slate-200 font-bold">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-2xl px-4 py-3 bg-violet-500 hover:bg-violet-400 text-slate-950 font-extrabold"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

