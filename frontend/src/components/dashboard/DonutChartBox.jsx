import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function DonutChartBox({ title, items }) {
  const COLORS = [
    "#2563eb", // blue
    "#dc2626", // red
    "#16a34a", // green
    "#9333ea", // purple
    "#ea580c", // orange
    "#0891b2", // cyan
    "#ca8a04", // yellow-brown
    "#db2777", // pink
    "#4f46e5", // indigo
    "#65a30d", // lime
    "#7f1d1d", // dark red
    "#0f766e", // teal
  ];

  const chartData = Array.isArray(items)
    ? items.map((it) => ({
        name: it.groupKey,
        value: it.count,
      }))
    : [];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        minHeight: 300,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", fontSize: 17 }}>{title}</h3>

      {chartData.length === 0 ? (
        <div style={{ color: "#667085", textAlign: "center", marginTop: 90 }}>
          데이터 없음
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={50}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
    );
  }