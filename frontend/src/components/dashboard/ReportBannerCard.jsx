import { useNavigate } from "react-router-dom";
import "./ReportBannerCard.css";

export default function ReportBannerCard() {
  const navigate = useNavigate();

  return (
    <div className="report-banner-card">
      <div className="report-banner-card__icon">📊</div>

      <div className="report-banner-card__body">
        <h3 className="report-banner-card__title">
          더 자세한 분석이 필요하신가요?
        </h3>
        <p className="report-banner-card__desc">
          리포트에서 기간별 추이, 생성/완료 분석, 패턴 인사이트를
          확인해보세요.
        </p>
      </div>

      <button
        className="report-banner-card__button"
        onClick={() => navigate("/reports")}
      >
        리포트 보기 →
      </button>
    </div>
  );
}
