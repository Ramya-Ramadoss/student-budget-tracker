import "../charts/chartSetup";
import { Bar } from "react-chartjs-2";

export default function WeeklyBarChart({ labels = [], data = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Weekly Expenses",
        data,
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.06)" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.06)" } },
    },
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
    },
  };

  return (
    <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
      <div className="font-extrabold text-white">Weekly Spend</div>
      <div className="text-xs text-slate-400">This week's expenses by day</div>
      <div className="mt-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

