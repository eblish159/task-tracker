import { useNavigate } from "react-router-dom";
import "./TodayTaskListCard.css";

const PRIORITY_LABEL = {
  HIGH: "높음",
  NORMAL: "보통",
  LOW: "낮음",
};

const PRIORITY_CLASS = {
  HIGH: "today-task-card__priority-badge--high",
  NORMAL: "today-task-card__priority-badge--normal",
  LOW: "today-task-card__priority-badge--low",
};

export default function TodayTaskListCard({ tasks = [], maxItems = 5 }) {
  const navigate = useNavigate();
  const visibleTasks = tasks.slice(0, maxItems);

  return (
    <div className="today-task-card">
      <div className="today-task-card__header">
        <h3 className="today-task-card__title">오늘 마감 작업</h3>

        <span
          className="today-task-card__view-all"
          onClick={() => navigate("/tasks?due=today")}
        >
          전체 보기 &gt;
        </span>
      </div>

      {visibleTasks.length === 0 ? (
        <div className="today-task-card__empty">
          오늘 마감인 작업이 없습니다.
        </div>
      ) : (
        <ul className="today-task-card__list">
          {visibleTasks.map((task) => {
            const priorityClass =
              PRIORITY_CLASS[task.priority] ||
              "today-task-card__priority-badge--normal";

            return (
              <li
                key={task.taskId}
                className="today-task-card__item"
                onClick={() => navigate(`/tasks/${task.taskId}`)}
              >
                <span className="today-task-card__item-title">
                  {task.taskTitle}
                </span>

                <span
                  className={`today-task-card__priority-badge ${priorityClass}`}
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
