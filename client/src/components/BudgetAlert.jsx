export default function BudgetAlert({ alerts = [] }) {
  return (
    <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-rose-500/15 ring-1 ring-rose-400/20 grid place-items-center">
          <span className="text-lg">⚠</span>
        </div>
        <div>
          <div className="font-extrabold text-white">Budget Alerts</div>
          <div className="text-xs text-slate-400">Smart warnings when limits are hit</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {alerts.length === 0 ? (
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm text-slate-200">
            No alerts right now. You're on track.
          </div>
        ) : (
          alerts.map((a, idx) => (
            <div key={idx} className="rounded-2xl bg-rose-500/10 ring-1 ring-rose-400/20 px-4 py-3">
              <div className="text-sm font-bold text-rose-200">{a.title}</div>
              <div className="mt-1 text-xs text-slate-200/80">{a.message}</div>
              {a.meta ? <div className="mt-2 text-[11px] text-slate-300/80">{a.meta}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

