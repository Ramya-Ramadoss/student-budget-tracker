import "../charts/chartSetup";
import { Pie } from "react-chartjs-2";
import { CATEGORIES, getCategoryById } from "../data/categories";

export default function PieChartComponent({ categoryTotals = [] }) {
  const dataMap = new Map(categoryTotals.map((x) => [x.category, x.amount]));
  const labels = CATEGORIES.map((c) => `${c.emoji} ${c.label}`);
  const values = CATEGORIES.map((c) => Number(dataMap.get(c.id) || 0));
  const colors = CATEGORIES.map((c) => c.color);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.map((c) => c + "cc"),
        borderColor: colors.map((c) => c + "ff"),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: { color: "#cbd5e1" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const raw = ctx.raw || 0;
            const idx = ctx.dataIndex;
            const cat = getCategoryById(CATEGORIES[idx]?.id);
            return `${cat.label}: ₹${Math.round(raw)}`;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-soft p-5">
      <div className="font-extrabold text-white">Category Spending</div>
      <div className="text-xs text-slate-400">Distribution of expenses</div>
      <div className="mt-4">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

