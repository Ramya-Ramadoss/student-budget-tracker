import "../charts/chartSetup";
import { Line } from "react-chartjs-2";

export default function MonthlyLineChart({ labels = [], data = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Trend",
        data,
        fill: true,
        tension: 0.35,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.18)",
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      x: { ticks: { color: "#cbd5e1", maxTicksLimit: 8 }, grid: { color: "rgba(255,255,255,0.06)" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.06)" } },
    },
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
    },
  };

  return (
    <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
      <div className="font-extrabold text-white">Monthly Trend</div>
      <div className="text-xs text-slate-400">Cumulative expenses this month</div>
      <div className="mt-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

