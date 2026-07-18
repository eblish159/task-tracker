import "./TimeAnalysisPanel.css";
import {
  Timer,
  Clock3,
  CircleCheckBig,
  Flag,
} from "lucide-react";

function TimeAnalysisPanel({ data }) {
  const analysis = data ?? {
    averageCompletionDays: 0,
    averageDelayDays: 0,
    onTimeRate: 0,
    longestTaskTitle: "-",
    longestCompletionDays: 0,
  };

  return (
    <section className="time-analysis-panel">
      <div className="time-analysis-header">
        <h3>시간 분석</h3>
        <p>선택한 기간의 완료 시간과 마감 준수 현황입니다.</p>
      </div>

      <div className="time-analysis-grid">
        <article className="time-analysis-card">
          <div className="time-analysis-card-header">
            <span className="time-analysis-label">
              평균 완료 소요일
            </span>

            <span className="time-analysis-icon icon-blue">
              <Timer size={18} />
            </span>
          </div>

          <strong className="time-analysis-value">
            {Number(
              analysis.averageCompletionDays ?? 0
            ).toFixed(1)}
            일
          </strong>

          <p className="time-analysis-description">
            생성일부터 완료일까지의 평균
          </p>
        </article>

        <article className="time-analysis-card">
          <div className="time-analysis-card-header">
            <span className="time-analysis-label">
              평균 지연 소요일
            </span>

            <span className="time-analysis-icon icon-teal">
              <Clock3 size={18} />
            </span>
          </div>

          <strong className="time-analysis-value">
            {Number(
              analysis.averageDelayDays ?? 0
            ).toFixed(1)}
            일
          </strong>

          <p className="time-analysis-description">
            지연된 완료 작업을 기준으로 계산
          </p>
        </article>

        <article className="time-analysis-card">
          <div className="time-analysis-card-header">
            <span className="time-analysis-label">
              마감 준수율
            </span>

            <span className="time-analysis-icon icon-green">
              <CircleCheckBig size={18} />
            </span>
          </div>

          <strong className="time-analysis-value">
            {Number(analysis.onTimeRate ?? 0).toFixed(1)}%
          </strong>

          <p className="time-analysis-description">
            마감일까지 완료한 작업 비율
          </p>
        </article>

        <article className="time-analysis-card">
          <div className="time-analysis-card-header">
            <span className="time-analysis-label">
              가장 오래 걸린 작업
            </span>

            <span className="time-analysis-icon icon-orange">
              <Flag size={18} />
            </span>
          </div>

          <strong
            className="time-analysis-task-title"
            title={analysis.longestTaskTitle ?? "-"}
          >
            {analysis.longestTaskTitle ?? "-"}
          </strong>

          <p className="time-analysis-description">
            완료까지 {analysis.longestCompletionDays ?? 0}일
          </p>
        </article>
      </div>
    </section>
  );
}

export default TimeAnalysisPanel;