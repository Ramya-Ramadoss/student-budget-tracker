import { useMemo, useState } from "react";
import BalanceCard from "../components/BalanceCard";
import ExpenseModal from "../components/ExpenseModal";
import TransactionItem from "../components/TransactionItem";
import { getTotals } from "../utils/budgetUtils";

export default function LegacyTracker({ transactions, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const { income, expenses, balance } = useMemo(() => getTotals(transactions), [transactions]);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="pt-6 pb-4 flex items-end gap-3">
        <div>
          <div className="text-2xl font-extrabold">Classic Tracker</div>
          <div className="text-sm text-slate-400">Keeps the original add/delete workflow</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto rounded-2xl px-4 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold shadow-soft"
        >
          + Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <BalanceCard title="Balance" value={`₹${Math.round(balance)}`} tone={balance >= 0 ? "green" : "red"} />
        <BalanceCard title="Income" value={`₹${Math.round(income)}`} tone="green" />
        <BalanceCard title="Spent" value={`₹${Math.round(expenses)}`} tone="orange" />
      </div>

      <div className="mt-4 rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center">
          <div className="font-extrabold text-white">Entries</div>
          <div className="ml-auto text-xs text-slate-400">{transactions.length} total</div>
        </div>
        <div className="px-5 divide-y divide-white/10">
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-slate-300">No entries yet. Add one above.</div>
          ) : (
            transactions.map((t) => <TransactionItem key={t.id} tx={t} onDelete={onDelete} />)
          )}
        </div>
      </div>

      <ExpenseModal open={open} onClose={() => setOpen(false)} onSave={onAdd} defaultType="expense" />
    </div>
  );
}

