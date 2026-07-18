import "./ReportSummaryPanel.css";

function ReportSummaryPanel({ summary }) {
  return (
    <section className="report-summary-panel">
      <h3 className="report-summary-title">기간 요약</h3>

      <div className="summary-row">
        <span>전체 작업 수</span>
        <strong>{summary?.totalCount ?? 0}</strong>
      </div>

      <div className="summary-row">
        <span>완료 작업 수</span>
        <strong>{summary?.doneCount ?? 0}</strong>
      </div>

      <div className="summary-row">
        <span>완료율</span>
        <strong>{summary?.doneRate?.toFixed(1) ?? 0}%</strong>
      </div>

      <div className="summary-row">
        <span>지연 작업 수</span>
        <strong>{summary?.overdueCount ?? 0}</strong>
      </div>


    </section>
  );
}

export default ReportSummaryPanel;