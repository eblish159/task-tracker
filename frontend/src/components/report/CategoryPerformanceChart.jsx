import "./CategoryPerformanceChart.css";

function CategoryPerformanceChart({ data = [] }) {
  const maxTotalCount = Math.max(
    ...data.map((item) => item.totalCount ?? 0),
    1
  );

  return (
    <section className="category-performance-chart">
      <div className="category-performance-header">
        <h3 className="category-performance-title">카테고리별 성과</h3>

        <div className="category-performance-legends">
          <span className="category-legend">
            <span className="category-legend-color done" />
            완료
          </span>

          <span className="category-legend">
            <span className="category-legend-color pending" />
            미완료
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="category-empty-message">
          카테고리별 성과 데이터가 없습니다.
        </p>
      ) : (
        <div className="category-performance-list">
          {data.map((item) => {
            const totalCount = item.totalCount ?? 0;
            const doneCount = item.doneCount ?? 0;
            const pendingCount = Math.max(totalCount - doneCount, 0);

            /*
             * 가장 작업 수가 많은 카테고리를 100%로 보고
             * 다른 카테고리는 전체 작업 수에 비례해 막대 길이를 줄인다.
             */
            const totalWidth = (totalCount / maxTotalCount) * 100;

            const doneWidth =
              totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

            const pendingWidth =
              totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;

            return (
              <div
                className="category-performance-row"
                key={item.categoryName}
              >
                <span className="category-performance-name">
                  {item.categoryName}
                </span>

                <div className="category-performance-bar-area">
                  <div
                    className="category-performance-bar"
                    style={{ width: `${totalWidth}%` }}
                  >
                    {doneCount > 0 && (
                      <div
                        className="category-bar-segment category-bar-done"
                        style={{ width: `${doneWidth}%` }}
                        title={`완료 ${doneCount}개`}
                      >
                        <span>{doneCount}</span>
                      </div>
                    )}

                    {pendingCount > 0 && (
                      <div
                        className="category-bar-segment category-bar-pending"
                        style={{ width: `${pendingWidth}%` }}
                        title={`미완료 ${pendingCount}개`}
                      >
                        <span>{pendingCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CategoryPerformanceChart;