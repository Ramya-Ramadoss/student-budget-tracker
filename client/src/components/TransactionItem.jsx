import { getCategoryById } from "../data/categories";

export default function TransactionItem({ tx, onDelete }) {
  const cat = getCategoryById(tx.category);
  const isIncome = tx.type === "income";

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="h-10 w-10 rounded-2xl grid place-items-center ring-1"
        style={{
          background: `${cat.color}22`,
          borderColor: `${cat.color}55`,
        }}
      >
        <span className="text-lg">{cat.emoji}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate font-semibold text-slate-100">
            {tx.note?.trim() ? tx.note : cat.label}
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full ring-1"
            style={{ background: `${cat.color}1a`, borderColor: `${cat.color}44`, color: cat.color }}
          >
            {cat.label}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-slate-400">
          {new Date(tx.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </div>
      </div>

      <div className={`text-sm font-extrabold tabular-nums ${isIncome ? "text-emerald-400" : "text-slate-100"}`}>
        {isIncome ? "+" : "−"}₹{Number(tx.amount).toFixed(0)}
      </div>

      <button
        onClick={() => onDelete?.(tx.id)}
        className="ml-1 h-9 w-9 rounded-xl grid place-items-center text-slate-400 hover:text-rose-300 hover:bg-white/5"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

