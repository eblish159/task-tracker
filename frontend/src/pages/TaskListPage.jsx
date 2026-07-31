import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TaskHistory from "../components/TaskHistory";
import {
  deleteTask,
  fetchTasks,
  updateTask,
  updateTaskStatus,
} from "../api/taskApi";
import { fetchCategories } from "../api/categoryApi";
import "./TaskListPage.css";

function formatDate(v) {
  if (!v) return "";
  return String(v).slice(0, 10);
}

function toApiDate(v) {
  if (!v) return null;
  return `${v}T00:00:00`;
}

const INITIAL_EDIT_FORM = {
  taskTitle: "",
  taskContent: "",
  priority: "NORMAL",
  dueDate: "",
  categoryId: "",
  taskStatus: "TODO",
};

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__cancel" onClick={onCancel}>
            취소
          </button>
          <button className="confirm-modal__confirm" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaskListPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);

  const [taskStatusFilter, setTaskStatusFilter] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);

  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const due = searchParams.get("due");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTask, setHistoryTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await fetchCategories();
        setCategories(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
      }
    }

    loadCategories();
  }, []);

  async function load(page = currentPage) {
    setError("");

    try {
      setLoading(true);

      const params = {
        page,
        size,
      };

      if (taskStatusFilter) {
        params.taskStatus = taskStatusFilter;
      }

      if (categoryId) {
        params.categoryId = categoryId;
      }

      if (due) {
        params.due = due;
      }

      const data = await fetchTasks(params);

      setTasks(Array.isArray(data.content) ? data.content : []);
      setCurrentPage(data.currentPage ?? page);
      setTotalPages(data.totalPages ?? 0);
      setTotalCount(data.totalCount ?? 0);
    } catch (e) {
      setTasks([]);
      setTotalPages(0);
      setTotalCount(0);
      setError(e?.message || "조회 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, [taskStatusFilter, categoryId, due]);

  useEffect(() => {
    load(currentPage);
  }, [currentPage]);

  function startEdit(task) {
    setEditingTaskId(task.taskId);

    setEditForm({
      taskTitle: task.taskTitle || "",
      taskContent: task.taskContent || "",
      priority: task.priority || "NORMAL",
      dueDate: formatDate(task.dueDate),
      categoryId: task.categoryId != null ? String(task.categoryId) : "",
      taskStatus: (task.taskStatus || "TODO").toUpperCase(),
    });
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditForm(INITIAL_EDIT_FORM);
  }

  function onChangeEditForm(e) {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function saveEdit() {
    if (editingTaskId == null) return;

    if (!editForm.taskTitle.trim()) {
      alert("제목은 필수입니다.");
      return;
    }

    if (!editForm.categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const payload = {
      taskTitle: editForm.taskTitle.trim(),
      taskContent: editForm.taskContent.trim(),
      priority: editForm.priority || "NORMAL",
      dueDate: editForm.dueDate ? toApiDate(editForm.dueDate) : null,
      categoryId: Number(editForm.categoryId),
      taskStatus: editForm.taskStatus || "TODO",
    };

    try {
      await updateTask(editingTaskId, payload);

      // 방금 수정한 작업의 이력 모달이 열려있다면, 최신 데이터로 다시 보도록 닫아준다.
      if (historyOpen && historyTask?.taskId === editingTaskId) {
        setHistoryOpen(false);
        setHistoryTask(null);
      }

      cancelEdit();
      await load(currentPage);
    } catch (e) {
      alert(e?.message || "수정 실패");
    }
  }

  function requestDelete(task) {
    if (task.taskId == null) {
      alert("taskId가 없습니다.");
      return;
    }

    setDeleteTarget(task);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const id = deleteTarget.taskId;

    try {
      await deleteTask(id);

      if (editingTaskId === id) {
        cancelEdit();
      }

      await load(currentPage);
    } catch (e) {
      alert(e?.message || "삭제 실패");
    } finally {
      setDeleteTarget(null);
    }
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  async function onChangeTaskStatus(task, nextTaskStatus) {
    const id = task.taskId;

    if (id == null) {
      alert("taskId가 없습니다.");
      return;
    }

    try {
      await updateTaskStatus(id, nextTaskStatus);

      if (historyOpen && historyTask?.taskId === id) {
        setHistoryOpen(false);
        setHistoryTask(null);
      }

      await load(currentPage);
    } catch (e) {
      alert(e?.message || "상태 변경 실패");
    }
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="task-list-page">
      <h2 className="task-list-title">Tasks</h2>

      <div className="task-list-toolbar">
        <button onClick={() => load(currentPage)} disabled={loading}>
          {loading ? "로딩..." : "새로고침"}
        </button>

        <label>
          카테고리:&nbsp;
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">전체</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </label>

        <label>
          작업 상태 필터:&nbsp;
          <select
            value={taskStatusFilter}
            onChange={(e) => setTaskStatusFilter(e.target.value)}
          >
            <option value="">전체</option>
            <option value="TODO">TODO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
        </label>

        <span className="task-list-toolbar__count">
          전체 {totalCount}개
        </span>
      </div>

      {error && <div className="task-list-error">{error}</div>}

      <div className="task-table">
        <div className="task-table__header">
          <div>제목/내용</div>
          <div>우선순위</div>
          <div>마감일</div>
          <div>상태</div>
          <div>관리</div>
        </div>

        {tasks.length === 0 && (
          <div className="task-table__empty">해당 작업이 없습니다.</div>
        )}

        {tasks.map((task) => {
          const id = task.taskId;
          const title = task.taskTitle || "";
          const content = task.taskContent || "";
          const priority = task.priority || "NORMAL";
          const dueDate = formatDate(task.dueDate);
          const taskStatus = (task.taskStatus || "TODO").toUpperCase();

          const isEditing = editingTaskId === id;

          return (
            <div key={id} className="task-table__row">
              <div>
                {!isEditing ? (
                  <div className="task-title-cell">
                    <div className="task-title-cell__title">{title}</div>
                    {content && (
                      <div className="task-title-cell__content">
                        {content}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="task-edit-form">
                    <input
                      name="taskTitle"
                      value={editForm.taskTitle}
                      onChange={onChangeEditForm}
                      placeholder="제목"
                    />
                    <textarea
                      name="taskContent"
                      value={editForm.taskContent}
                      onChange={onChangeEditForm}
                      placeholder="내용"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div>
                {!isEditing ? (
                  priority
                ) : (
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={onChangeEditForm}
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                )}
              </div>

              <div>
                {!isEditing ? (
                  dueDate || "-"
                ) : (
                  <input
                    type="date"
                    name="dueDate"
                    value={editForm.dueDate}
                    onChange={onChangeEditForm}
                  />
                )}
              </div>

              <div>
                {!isEditing ? (
                  <select
                    value={taskStatus}
                    onChange={(e) => onChangeTaskStatus(task, e.target.value)}
                  >
                    <option value="TODO">TODO</option>
                    <option value="DOING">DOING</option>
                    <option value="DONE">DONE</option>
                  </select>
                ) : (
                  <select
                    name="taskStatus"
                    value={editForm.taskStatus}
                    onChange={onChangeEditForm}
                  >
                    <option value="TODO">TODO</option>
                    <option value="DOING">DOING</option>
                    <option value="DONE">DONE</option>
                  </select>
                )}
              </div>

              <div className="task-actions">
                {!isEditing ? (
                  <>
                    <button
                      className="task-actions__edit"
                      onClick={() => startEdit(task)}
                    >
                      수정
                    </button>

                    <button
                      className="task-actions__delete"
                      onClick={() => requestDelete(task)}
                    >
                      삭제
                    </button>

                    <button
                      className="task-actions__history"
                      onClick={() => {
                        setHistoryTask(task);
                        setHistoryOpen(true);
                      }}
                    >
                      이력
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="task-actions__save"
                      onClick={saveEdit}
                    >
                      수정완료
                    </button>

                    <button
                      className="task-actions__cancel"
                      onClick={cancelEdit}
                    >
                      취소
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="task-pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            disabled={pageNum === currentPage}
            className={
              pageNum === currentPage
                ? "task-pagination__page task-pagination__page--active"
                : "task-pagination__page"
            }
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          다음
        </button>
      </div>

      {historyOpen && (
        <TaskHistory
          task={historyTask}
          onClose={() => {
            setHistoryOpen(false);
            setHistoryTask(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`"${deleteTarget.taskTitle}" 작업을 삭제할까요?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
