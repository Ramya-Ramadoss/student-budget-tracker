import { useMemo, useState } from "react";
import { CATEGORIES } from "../data/categories";
import { groupExpensesByCategory } from "../utils/budgetUtils";

function ProgressBar({ pct, tone = "violet" }) {
  const tones = {
    violet: "bg-violet-400",
    orange: "bg-orange-400",
    emerald: "bg-emerald-400",
    rose: "bg-rose-400",
    cyan: "bg-cyan-400",
  };
  const value = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div className={`h-full ${tones[tone] || tones.violet}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function BudgetPlanner({ transactions, budgets, onSaveBudgets }) {
  const [draft, setDraft] = useState(budgets);
  const monthByCat = useMemo(() => {
    // keep it simple: use all expenses in storage as “this month”
    // (dashboard uses monthly trend; you can refine later)
    return groupExpensesByCategory(transactions);
  }, [transactions]);
  const spendMap = useMemo(() => new Map(monthByCat.map((x) => [x.category, x.amount])), [monthByCat]);

  const handleSave = () => {
    const cleaned = {
      monthlyLimit: Number(draft.monthlyLimit) || 0,
      weeklyLimit: Number(draft.weeklyLimit) || 0,
      categoryLimits: Object.fromEntries(
        CATEGORIES.map((c) => [c.id, Number(draft.categoryLimits?.[c.id]) || 0])
      ),
    };
    onSaveBudgets?.(cleaned);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="pt-6 pb-4">
        <div className="text-2xl font-extrabold">Budget Planner</div>
        <div className="text-sm text-slate-400">Set monthly/weekly limits and category caps</div>
      </div>

      <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Monthly budget limit</div>
            <input
              value={draft.monthlyLimit}
              onChange={(e) => setDraft((d) => ({ ...d, monthlyLimit: e.target.value }))}
              type="number"
              className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Weekly budget limit</div>
            <input
              value={draft.weeklyLimit}
              onChange={(e) => setDraft((d) => ({ ...d, weeklyLimit: e.target.value }))}
              type="number"
              className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={handleSave}
            className="rounded-2xl px-4 py-3 bg-violet-500 hover:bg-violet-400 text-slate-950 font-extrabold"
          >
            Save Budgets
          </button>
          <div className="text-xs text-slate-400 self-center">Budgets are stored in localStorage.</div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="font-extrabold text-white">Category-specific limits</div>
          <div className="text-xs text-slate-400">Track progress with visual bars</div>
        </div>
        <div className="p-5 space-y-4">
          {CATEGORIES.map((c, idx) => {
            const limit = Number(draft.categoryLimits?.[c.id]) || 0;
            const spent = Number(spendMap.get(c.id) || 0);
            const pct = limit > 0 ? (spent / limit) * 100 : 0;
            const tone = ["orange", "cyan", "rose", "violet", "emerald"][idx % 5];
            return (
              <div key={c.id} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="flex items-center gap-2">
                  <div className="text-lg">{c.emoji}</div>
                  <div className="font-extrabold text-white">{c.label} Budget</div>
                  <div className="ml-auto text-xs text-slate-300">
                    Spent: ₹{Math.round(spent)} / Limit: ₹{Math.round(limit)}
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar pct={pct} tone={tone} />
                  <div className="mt-2 text-xs text-slate-400">Progress: {Math.round(pct)}%</div>
                </div>
                <div className="mt-3">
                  <input
                    value={draft.categoryLimits?.[c.id] ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        categoryLimits: { ...(d.categoryLimits || {}), [c.id]: e.target.value },
                      }))
                    }
                    type="number"
                    className="w-full rounded-2xl bg-slate-950/60 ring-1 ring-white/10 px-4 py-3 outline-none"
                    placeholder={`Set ${c.label} limit`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

