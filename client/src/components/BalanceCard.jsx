export default function BalanceCard({ title, value, subtitle, tone = "slate" }) {
  const tones = {
    slate: "from-slate-800/60 to-slate-900/40 ring-slate-700/50",
    green: "from-emerald-700/40 to-slate-900/40 ring-emerald-500/30",
    red: "from-rose-700/40 to-slate-900/40 ring-rose-500/30",
    violet: "from-violet-700/40 to-slate-900/40 ring-violet-500/30",
    cyan: "from-cyan-700/40 to-slate-900/40 ring-cyan-500/30",
    orange: "from-orange-700/40 to-slate-900/40 ring-orange-500/30",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone] || tones.slate} ring-1 shadow-soft p-4`}>
      <div className="text-xs uppercase tracking-wider text-slate-300/80 font-semibold">{title}</div>
      <div className="mt-2 text-2xl font-extrabold text-white leading-tight">{value}</div>
      {subtitle ? <div className="mt-1 text-xs text-slate-300/70">{subtitle}</div> : null}
    </div>
  );
}

