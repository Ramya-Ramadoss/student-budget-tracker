export default function GamificationPanel({ streakDays = 0, badges = [], healthScore = 0 }) {
  const score = Math.max(0, Math.min(100, Math.round(healthScore)));
  return (
    <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/20 grid place-items-center">
          <span className="text-lg">🎯</span>
        </div>
        <div>
          <div className="font-extrabold text-white">Gamification</div>
          <div className="text-xs text-slate-400">Streaks, badges, and a health score</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
          <div className="text-xs text-slate-400">🔥 Saving Streak</div>
          <div className="mt-1 text-xl font-extrabold text-white">{streakDays} Days</div>
        </div>
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
          <div className="text-xs text-slate-400">📈 Health Score</div>
          <div className="mt-1 text-xl font-extrabold text-white">{score}%</div>
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Badges</div>
        <div className="flex flex-wrap gap-2">
          {(badges.length ? badges : ["🏁 Getting Started"]).map((b) => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-sm text-slate-100">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

