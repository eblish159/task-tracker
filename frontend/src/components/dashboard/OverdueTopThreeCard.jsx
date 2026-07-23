import { useNavigate } from "react-router-dom";
import "./OverdueTopThreeCard.css";

const PRIORITY_LABEL = {
  HIGH: "높음",
  NORMAL: "보통",
  LOW: "낮음",
};

const PRIORITY_CLASS = {
  HIGH: "overdue-top3-card__priority-badge--high",
  NORMAL: "overdue-top3-card__priority-badge--normal",
  LOW: "overdue-top3-card__priority-badge--low",
};

// 우선순위 정렬 순서: HIGH -> NORMAL -> LOW -> 그 외
const PRIORITY_RANK = {
  HIGH: 0,
  NORMAL: 1,
  LOW: 2,
};

function getOverdueDays(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

function sortByPriorityThenOverdue(tasks) {
  return [...tasks].sort((a, b) => {
    const rankA = PRIORITY_RANK[a.priority] ?? 99;
    const rankB = PRIORITY_RANK[b.priority] ?? 99;

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // 우선순위가 같으면 지연일수가 많은(마감일이 더 오래된) 순
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
}

export default function OverdueTopThreeCard({ tasks = [] }) {
  const navigate = useNavigate();
  const topTasks = sortByPriorityThenOverdue(tasks).slice(0, 3);

  return (
    <div className="overdue-top3-card">
      <div className="overdue-top3-card__header">
        <h3 className="overdue-top3-card__title">지연 작업 TOP3</h3>

        <span
          className="overdue-top3-card__view-all"
          onClick={() => navigate("/tasks?due=overdue")}
        >
          전체 보기 &gt;
        </span>
      </div>

      {topTasks.length === 0 ? (
        <div className="overdue-top3-card__empty">
          지연된 작업이 없습니다.
        </div>
      ) : (
        <ul className="overdue-top3-card__list">
          {topTasks.map((task) => {
            const priorityClass =
              PRIORITY_CLASS[task.priority] ||
              "overdue-top3-card__priority-badge--normal";
            const overdueDays = getOverdueDays(task.dueDate);

            return (
              <li
                key={task.taskId}
                className="overdue-top3-card__item"
                onClick={() => navigate(`/tasks/${task.taskId}`)}
              >
                <div className="overdue-top3-card__item-left">
                  <span className="overdue-top3-card__item-title">
                    {task.taskTitle}
                  </span>
                  <span className="overdue-top3-card__item-days">
                    {overdueDays}일 지남
                  </span>
                </div>

                <span
                  className={`overdue-top3-card__priority-badge ${priorityClass}`}
                >
                  {PRIORITY_LABEL[task.priority] || task.priority}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
