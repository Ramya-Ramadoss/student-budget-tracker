export default function AIInsights({ insights = [] }) {
  return (
    <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20 grid place-items-center">
          <span className="text-lg">🧠</span>
        </div>
        <div>
          <div className="font-extrabold text-white">AI Insights</div>
          <div className="text-xs text-slate-400">Behavioral patterns & nudges</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {(insights.length ? insights : ["Add transactions to generate insights."]).map((msg, idx) => (
          <div key={idx} className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm text-slate-100">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

