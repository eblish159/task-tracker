import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function DonutChartBox({ title, items }) {
  const COLORS = [
    "#ff0000", // 빨강
    "#0000ff", // 파랑
    "#00cc00", // 초록
    "#ff9900", // 주황
    "#9900ff", // 보라
    "#00cccc", // 청록
    "#ff1493", // 핑크
    "#8b4513", // 갈색
    "#808000", // 올리브
    "#000000", // 검정
    "#ffd700", // 노랑
    "#696969", // 회색
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
              height={70}
              iconType="square"
              wrapperStyle={{
                fontSize: 14,
                color: "#111827",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
    );
  }