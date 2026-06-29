import React, { useEffect, useState } from "react";
import { fetchTaskLogs } from "../api/taskApi";

function formatDateTime(v) {
  if (!v) return "";
  return String(v).replace("T", " ").slice(0, 19);
}

function getLogMessage(log) {
  if (log.actionType === "CREATE") {
    return "작업 생성";
  }

  if (log.actionType === "STATUS_CHANGE") {
    return `상태 변경: ${log.beforeStatus || "-"} → ${log.afterStatus || "-"}`;
  }

  if (log.actionType === "DELETE") {
    return "작업 삭제";
  }

  return log.actionType || "작업 이력";
}

export default function TaskHistory({ task, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!task?.taskId) return;

    async function loadLogs() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchTaskLogs(task.taskId);
        setLogs(Array.isArray(data) ? data : []);
      } catch (e) {
        setLogs([]);
        setError(e?.message || "작업 이력 조회 실패");
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, [task?.taskId]);

  if (!task) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 360,
        height: "100vh",
        background: "#fff",
        borderLeft: "1px solid #ddd",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
        padding: 20,
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>작업 이력</h3>
          <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
            {task.taskTitle}
          </div>
        </div>

        <button onClick={onClose}>닫기</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {loading && <div>불러오는 중...</div>}

        {error && (
          <div style={{ color: "crimson" }}>
            {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div style={{ color: "#666" }}>
            이력이 없습니다.
          </div>
        )}

        {!loading && !error && logs.map((log) => (
          <div
            key={log.logId}
            style={{
              borderLeft: "3px solid #2563eb",
              paddingLeft: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {getLogMessage(log)}
            </div>

            <div style={{ marginTop: 4, color: "#666", fontSize: 13 }}>
              {formatDateTime(log.createdDate)}
            </div>

            <div style={{ marginTop: 4, color: "#999", fontSize: 12 }}>
              {log.userId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}