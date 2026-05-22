import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskListPage from "./pages/TaskListPage";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 들어오면 대시보드로 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 레이아웃 적용되는 페이지들 */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<TaskCreatePage />} />
        </Route>

        {/* 와일드카드 */}
        <Route
          path="*"
          element={<div style={{ padding: 20 }}>대시보드로 이동하세요</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;