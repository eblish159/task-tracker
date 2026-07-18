import { useEffect, useState } from "react";
import "./ReportTaskList.css";

function ReportTaskList({ data = [] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;
  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentTasks = data.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const formatStatus = (status) => {
    switch (status) {
      case "DONE":
        return "완료";
      case "DOING":
        return "진행중";
      case "TODO":
        return "할 일";
      default:
        return status ?? "-";
    }
  };

  const formatPriority = (priority) => {
    switch (priority) {
      case "HIGH":
        return "높음";
      case "MEDIUM":
        return "보통";
      case "NORMAL":
        return "보통";
      case "LOW":
        return "낮음";
      default:
        return priority ?? "-";
    }
  };

  return (
    <section className="report-task-list">
      <div className="report-task-list-header">
        <div>
          <h3>작업 목록</h3>
          <p>선택한 기간의 작업 상세 내역입니다.</p>
        </div>

        <span className="report-task-count">
          총 {data.length}개
        </span>
      </div>

      {data.length === 0 ? (
        <div className="report-task-empty">
          조회된 작업이 없습니다.
        </div>
      ) : (
        <>
          <div className="report-task-table-wrap">
            <table className="report-task-table">
              <thead>
                <tr>
                  <th>작업명</th>
                  <th>카테고리</th>
                  <th>우선순위</th>
                  <th>상태</th>
                  <th>생성일</th>
                  <th>마감일</th>
                  <th>완료일</th>
                </tr>
              </thead>

              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task.taskId}>
                    <td className="report-task-title">
                      {task.taskTitle ?? "-"}
                    </td>

                    <td>{task.categoryName ?? "미분류"}</td>

                    <td>
                      <span
                        className={`report-priority-badge priority-${task.priority?.toLowerCase()}`}
                      >
                        {formatPriority(task.priority)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`report-status-badge status-${task.taskStatus?.toLowerCase()}`}
                      >
                        {formatStatus(task.taskStatus)}
                      </span>
                    </td>

                    <td>{task.createdDate ?? "-"}</td>
                    <td>{task.dueDate ?? "-"}</td>
                    <td>{task.completedDate ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="report-task-pagination">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
              >
                이전
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    className={
                      currentPage === pageNumber ? "active" : ""
                    }
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ReportTaskList;