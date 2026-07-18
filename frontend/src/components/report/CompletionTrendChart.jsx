import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./CompletionTrendChart.css";

function CompletionTrendChart({ data }) {
  return (
    <section className="completion-trend-chart">
      <div className="completion-trend-header">
        <h3 className="completion-trend-title">일일 완료 추이</h3>

        <div className="completion-trend-legend">
          <span className="completion-trend-dot" />
          완료 수
        </div>
      </div>

      {data.length === 0 ? (
        <p className="completion-empty-message">
          완료 추이 데이터가 없습니다.
        </p>
      ) : (
        <div className="completion-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="date"
                tickFormatter={(date) => date.slice(5)}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value) => [`${value}개`, "완료 수"]}
                labelFormatter={(label) => `날짜: ${label}`}
                cursor={{ fill: "rgba(15, 118, 110, 0.06)" }}
              />

              <Bar
                dataKey="count"
                name="완료 수"
                fill="#14b8a6"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default CompletionTrendChart;