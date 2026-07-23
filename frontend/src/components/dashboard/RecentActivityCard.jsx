import "./RecentActivityCard.css";

function getActionText(activity) {
  const { actionType, afterStatus } = activity;

  if (actionType === "CREATE") {
    return "작업을 생성했습니다";
  }

  if (actionType === "DELETE") {
    return "작업을 삭제했습니다";
  }

  if (actionType === "STATUS_CHANGE") {
    if (afterStatus === "DONE") return "작업을 완료했습니다";
    if (afterStatus === "DOING") return "작업을 진행 시작했습니다";
    if (afterStatus === "TODO") return "작업을 할 일로 변경했습니다";
  }

  return "작업 내용이 변경되었습니다";
}

function getRelativeTime(dateString) {
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${diffDays}일 전`;
}

export default function RecentActivityCard({ activities = [] }) {
  return (
    <div className="recent-activity-card">
      <div className="recent-activity-card__header">
        <h3 className="recent-activity-card__title">최근 활동</h3>
      </div>

      {activities.length === 0 ? (
        <div className="recent-activity-card__empty">
          최근 활동 내역이 없습니다.
        </div>
      ) : (
        <ul className="recent-activity-card__list">
          {activities.map((activity) => (
            <li key={activity.logId} className="recent-activity-card__item">
              <span className="recent-activity-card__item-text">
                <strong>{activity.taskTitle}</strong> {getActionText(activity)}
              </span>

              <span className="recent-activity-card__item-time">
                {getRelativeTime(activity.createdDate)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}