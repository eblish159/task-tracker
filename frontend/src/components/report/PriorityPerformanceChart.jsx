import "./PriorityPerformanceChart.css";

function PriorityPerformanceChart({ data = [] }) {
  const totalTaskCount = data.reduce(
    (sum, item) => sum + (item.totalCount ?? 0),
    0
  );

  const priorityLabels = {
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW",
  };

  return (
    <section className="priority-performance-chart">
      <h3 className="priority-performance-title">우선순위별 성과</h3>

      {data.length === 0 ? (
        <p className="priority-empty-message">
          우선순위별 성과 데이터가 없습니다.
        </p>
      ) : (
        <div className="priority-performance-content">
          <div
            className="priority-donut"
            style={{
              background: createDonutBackground(data, totalTaskCount),
            }}
          >
            <div className="priority-donut-center">
              <strong>총 {totalTaskCount}개</strong>
            </div>
          </div>

          <div className="priority-performance-list">
            {data.map((item) => {
              const totalCount = item.totalCount ?? 0;
              const doneCount = item.doneCount ?? 0;
              const pendingCount = Math.max(totalCount - doneCount, 0);

              const shareRate =
                totalTaskCount > 0
                  ? (totalCount / totalTaskCount) * 100
                  : 0;

              return (
                <div
                  className="priority-performance-row"
                  key={item.priority}
                >
                  <span
                    className={`priority-color priority-${item.priority?.toLowerCase()}`}
                  />

                  <div className="priority-performance-info">
                    <strong>
                      {priorityLabels[item.priority] ?? item.priority}
                    </strong>

                    <span>
                      {totalCount}개 ({shareRate.toFixed(1)}%)
                    </span>

                    <small>
                      완료 {doneCount} · 미완료 {pendingCount}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function createDonutBackground(data, totalTaskCount) {
  if (totalTaskCount === 0) {
    return "#e2e8f0";
  }

  const colorMap = {
    HIGH: "#ef4444",
    MEDIUM: "#f59e0b",
    LOW: "#22c55e",
  };

  let currentRate = 0;

  const segments = data.map((item) => {
    const rate = ((item.totalCount ?? 0) / totalTaskCount) * 100;
    const start = currentRate;
    const end = currentRate + rate;

    currentRate = end;

    return `${colorMap[item.priority] ?? "#94a3b8"} ${start}% ${end}%`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

export default PriorityPerformanceChart;