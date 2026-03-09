import GamificationPanel from "../components/GamificationPanel";

export default function Achievements({ streakDays, badges, healthScore }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="pt-6 pb-4">
        <div className="text-2xl font-extrabold">Achievements</div>
        <div className="text-sm text-slate-400">Gamification to keep you motivated</div>
      </div>

      <GamificationPanel streakDays={streakDays} badges={badges} healthScore={healthScore} />

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
          <div className="text-xs text-slate-400">🏆 Budget Master</div>
          <div className="mt-2 text-sm text-slate-100">Stay under your monthly budget.</div>
        </div>
        <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
          <div className="text-xs text-slate-400">💰 Smart Saver</div>
          <div className="mt-2 text-sm text-slate-100">Maintain a 20%+ savings rate.</div>
        </div>
        <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
          <div className="text-xs text-slate-400">📊 Expense Tracker</div>
          <div className="mt-2 text-sm text-slate-100">Log 10+ expenses to unlock analytics.</div>
        </div>
      </div>
    </div>
  );
}

