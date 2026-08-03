import React, { useEffect, useState } from "react";
import {
  fetchTaskById,
  fetchTaskLogs,
  deleteTask,
  updateTask,
} from "../api/taskApi";
import { fetchCategories } from "../api/categoryApi";
import "./TaskDetailPage.css";

function formatDate(v) {
  if (!v) return "";
  return String(v).slice(0, 10);
}

function toApiDate(v) {
  if (!v) return null;
  return `${v}T00:00:00`;
}

function formatDateTime(v) {
  if (!v) return "";
  return String(v).replace("T", " ").slice(0, 19);
}

function getLogMessage(log) {
  if (log.actionType === "CREATE") return "작업 생성";
  if (log.actionType === "STATUS_CHANGE") {
    return `상태 변경: ${log.beforeStatus || "-"} → ${log.afterStatus || "-"}`;
  }
  if (log.actionType === "DELETE") return "작업 삭제";
  return log.actionType || "작업 이력";
}

export default function TaskDetailPage({ taskId, onClose, onChanged }) {
  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  async function load() {
    setError("");
    setLoading(true);

    try {
      const [taskData, logData] = await Promise.all([
        fetchTaskById(taskId),
        fetchTaskLogs(taskId),
      ]);

      setTask(taskData);
      setLogs(Array.isArray(logData) ? logData : []);
    } catch (e) {
      setError(e?.message || "작업을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("detail taskId:", taskId);
    if (!taskId) return;
    load();
  }, [taskId]);

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

  function startEdit() {
    setEditForm({
      taskTitle: task.taskTitle || "",
      taskContent: task.taskContent || "",
      priority: task.priority || "NORMAL",
      dueDate: formatDate(task.dueDate),
      categoryId: task.categoryId != null ? String(task.categoryId) : "",
      taskStatus: (task.taskStatus || "TODO").toUpperCase(),
    });
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditForm(null);
  }

  function onChangeEditForm(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function saveEdit() {
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
      await updateTask(taskId, payload);
      setIsEditing(false);
      setEditForm(null);
      await load();
      onChanged?.();
    } catch (e) {
      alert(e?.message || "수정 실패");
    }
  }

  async function handleDelete() {
    if (!task) return;
    if (!window.confirm(`"${task.taskTitle}" 작업을 삭제할까요?`)) return;

    try {
      await deleteTask(taskId);
      onChanged?.();
      onClose();
    } catch (e) {
      alert(e?.message || "삭제 실패");
    }
  }

  return (
    <div className="task-detail-overlay" onClick={onClose}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        {loading && <div>불러오는 중...</div>}

        {error && <div className="task-detail-error">{error}</div>}

        {!loading && !error && task && (
          <>
            <div className="task-detail-topbar">
              <h3 className="task-detail-topbar__title">작업 상세</h3>

              <div className="task-detail-topbar__actions">
                {!isEditing && (
                  <>
                    <button onClick={startEdit}>수정</button>
                    <button
                      className="task-detail-topbar__delete"
                      onClick={handleDelete}
                    >
                      삭제
                    </button>
                  </>
                )}
                <button onClick={onClose}>닫기</button>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="task-detail-header">
                  <h2 className="task-detail-header__title">
                    {task.taskTitle}
                  </h2>
                  <span className="task-detail-status">
                    {(task.taskStatus || "TODO").toUpperCase()}
                  </span>
                </div>

                {task.taskContent && (
                  <p className="task-detail-content">{task.taskContent}</p>
                )}

                <div className="task-detail-info-grid">
                  <div className="task-detail-info-box">
                    <p className="task-detail-info-label">우선순위</p>
                    <p className="task-detail-info-value">
                      {task.priority || "NORMAL"}
                    </p>
                  </div>
                  <div className="task-detail-info-box">
                    <p className="task-detail-info-label">마감일</p>
                    <p className="task-detail-info-value">
                      {formatDate(task.dueDate) || "-"}
                    </p>
                  </div>
                  <div className="task-detail-info-box">
                    <p className="task-detail-info-label">카테고리</p>
                    <p className="task-detail-info-value">
                      {task.categoryName || task.categoryId || "-"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="task-detail-edit-form">
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

                <div className="task-detail-edit-row">
                  <label>
                    우선순위
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={onChangeEditForm}
                    >
                      <option value="LOW">LOW</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </label>

                  <label>
                    마감일
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={onChangeEditForm}
                    />
                  </label>

                  <label>
                    카테고리
                    <select
                      name="categoryId"
                      value={editForm.categoryId}
                      onChange={onChangeEditForm}
                    >
                      <option value="">선택</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    상태
                    <select
                      name="taskStatus"
                      value={editForm.taskStatus}
                      onChange={onChangeEditForm}
                    >
                      <option value="TODO">TODO</option>
                      <option value="DOING">DOING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </label>
                </div>

                <div className="task-detail-edit-actions">
                  <button onClick={saveEdit}>수정완료</button>
                  <button onClick={cancelEdit}>취소</button>
                </div>
              </div>
            )}

            <div className="task-detail-history">
              <h3>이력</h3>

              {logs.length === 0 && (
                <p className="task-detail-history__empty">이력이 없습니다.</p>
              )}

              {logs.map((log) => (
                <div key={log.logId} className="task-detail-history__item">
                  <div className="task-detail-history__text">
                    {getLogMessage(log)}
                  </div>
                  <div className="task-detail-history__time">
                    {formatDateTime(log.createdDate)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}