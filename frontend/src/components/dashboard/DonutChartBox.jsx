import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DonutChartBox({ title, items }) {
  const COLORS = [
    "#2f80ed", // 파랑
    "#27ae60", // 초록
    "#f2994a", // 주황
    "#eb5757", // 빨강
    "#9b51e0", // 보라
    "#00a99d", // 청록
    "#f06292", // 핑크
    "#8d6e63", // 갈색
    "#9ca3af", // 회색
    "#f2c94c", // 노랑
    "#56ccf2", // 하늘
    "#6b7280", // 진회색
  ];

  const chartData = Array.isArray(items)
    ? items
        .map((item) => ({
          name: item.groupKey,
          value: Number(item.count ?? 0),
        }))
        .filter((item) => item.value > 0)
    : [];

  const totalCount = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section
      style={{
        minWidth: 0,
        minHeight: 265,
        padding: "16px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        boxSizing: "border-box",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 제목 */}
      <h3
        style={{
          margin: 0,
          color: "#111827",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {title}
      </h3>

      {chartData.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 210,
            color: "#667085",
            fontSize: 14,
          }}
        >
          데이터 없음
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 0,
            paddingBottom: 8,
            overflow: "hidden",
          }}
        >
          {/* 도넛 차트 */}
          <div
            style={{
              position: "relative",
              flex: "0 0 180px",
              width: 180,
              height: 180,
              minWidth: 180,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={1}
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive={true}
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={`${item.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => {
                    const percentage =
                      totalCount > 0
                        ? ((Number(value) / totalCount) * 100).toFixed(1)
                        : "0.0";

                    return [
                      `${value}개 (${percentage}%)`,
                      name,
                    ];
                  }}
                  contentStyle={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow:
                      "0 4px 12px rgba(15, 23, 42, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* 도넛 중앙 전체 개수 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#111827",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              총 {totalCount}개
            </div>
          </div>

          {/* 오른쪽 범례 */}
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              gap: 9,
              minWidth: 0,
              maxWidth: 150,
              maxHeight: 180,
              paddingRight: 3,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {chartData.map((item, index) => {
              const percentage =
                totalCount > 0
                  ? ((item.value / totalCount) * 100).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={`${item.name}-legend-${index}`}
                  title={`${item.name} ${item.value}개 (${percentage}%)`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "8px minmax(30px, 1fr) auto",
                    alignItems: "center",
                    columnGap: 6,
                    color: "#374151",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* 색상 표시 */}
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  {/* 항목 이름 */}
                  <span
                    style={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </span>

                  {/* 개수와 비율 */}
                  <span
                    style={{
                      color: "#4b5563",
                      textAlign: "right",
                    }}
                  >
                    {item.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}