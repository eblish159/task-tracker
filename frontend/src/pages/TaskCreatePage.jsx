import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/categoryApi";
import { createTask } from "../api/taskApi";
import "./TaskCreatePage.css";

export default function TaskCreatePage() {
  const [categories, setCategories] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId] = useState("testuser");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await fetchCategories();
        setCategories(list);
      } catch (e) {
        console.error(e);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!taskTitle.trim()) {
      setError("제목은 필수입니다.");
      return;
    }

    if (!categoryId) {
      setError("카테고리를 선택하세요.");
      return;
    }

    if (!userId.trim()) {
      setError("userId는 필수입니다.");
      return;
    }

    const payload = {
      taskTitle: taskTitle.trim(),
      taskContent: taskContent.trim() ? taskContent.trim() : null,
      priority,
      dueDate: dueDate ? dueDate : null,
      userId: userId.trim(),
      categoryId: Number(categoryId),
    };

    try {
      setLoading(true);

      const saved = await createTask(payload);
      setSuccessMsg(`등록 완료! taskId = ${saved.taskId}`);

      setTaskTitle("");
      setTaskContent("");
      setPriority("NORMAL");
      setDueDate("");
      setCategoryId("");
    } catch (e) {
      setError(e?.message || "등록 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="task-create-page">
      <div className="task-create-card">
        <div className="task-create-header">
          <p className="task-create-label">Task Management</p>
          <h2>Task 등록</h2>
          <p className="task-create-description">
            작업 제목, 우선순위, 마감일, 카테고리를 입력하여 새로운 작업을 등록합니다.
          </p>
        </div>

        <form className="task-create-form" onSubmit={handleSubmit}>
          <div className="task-form-group">
            <label>제목 *</label>
            <input
              type="text"
              placeholder="작업 제목을 입력하세요"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>

          <div className="task-form-group">
            <label>내용</label>
            <textarea
              rows={4}
              placeholder="작업 내용을 입력하세요"
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
            />
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label>우선순위</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">LOW</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div className="task-form-group">
              <label>마감일</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="task-form-group">
            <label>카테고리 *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">선택하세요</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="task-message error">{error}</div>}
          {successMsg && <div className="task-message success">{successMsg}</div>}

          <button className="task-submit-btn" disabled={loading}>
            {loading ? "등록중..." : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}