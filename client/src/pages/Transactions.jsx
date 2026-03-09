import { useMemo, useState } from "react";
import ExpenseModal from "../components/ExpenseModal";
import TransactionItem from "../components/TransactionItem";
import { CATEGORIES } from "../data/categories";

function groupByDate(transactions) {
  const map = new Map();
  for (const t of transactions) {
    const key = t.date || "Unknown";
    map.set(key, map.get(key) || []);
    map.get(key).push(t);
  }
  const entries = [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  return entries.map(([date, items]) => ({ date, items }));
}

export default function Transactions({ transactions, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category !== "all" && t.category !== category) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      return true;
    });
  }, [transactions, category, type, from, to]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="pt-6 pb-4 flex items-end gap-3">
        <div>
          <div className="text-2xl font-extrabold">Transactions</div>
          <div className="text-sm text-slate-400">Timeline, filters, and quick add</div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="ml-auto rounded-2xl px-4 py-3 bg-violet-500 hover:bg-violet-400 text-slate-950 font-extrabold shadow-soft"
        >
          + Add Expense
        </button>
      </div>

      <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-4">
        <div className="grid sm:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-slate-400 mb-1">Type</div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
            >
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1">Category</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
            >
              <option value="all">All</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
              <option value="income">💸 Income</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1">From</div>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1">To</div>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {groups.length === 0 ? (
          <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 p-8 text-center text-slate-300">
            No transactions match these filters.
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.date} className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
                <div className="font-extrabold text-white">
                  {new Date(g.date + "T00:00:00").toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                  })}
                </div>
                <div className="ml-auto text-xs text-slate-400">{g.items.length} items</div>
              </div>
              <div className="px-5 divide-y divide-white/10">
                {g.items.map((t) => (
                  <TransactionItem key={t.id} tx={t} onDelete={onDelete} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(payload) => onAdd?.(payload)}
        defaultType="expense"
      />
    </div>
  );
}

