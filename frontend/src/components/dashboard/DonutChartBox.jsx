import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function DonutChartBox({ title, items }) {
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

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
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
    );
  }