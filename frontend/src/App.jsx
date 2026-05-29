import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskListPage from "./pages/TaskListPage";
import LoginPage from "./pages/LoginPage";

import AppLayout from "./components/layout/AppLayout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/login/session", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          setIsLoggedIn(false);
          return null;
        }

        return res.json();
      })
      .then((data) => {
        if (data?.isLoggedIn) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  // 세션 확인 중
  if (checking) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* 로그인 안된 상태 */}
        {!isLoggedIn ? (
          <>
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />

            {/* 무조건 로그인 페이지 */}
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </>
        ) : (
          <>
            {/* 로그인 성공 시 */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* 로그인 상태에서만 Layout */}
            {/* 로그인 상태에서만 Layout */}
            <Route
              element={
                <AppLayout
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            >
              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              <Route
                path="/tasks"
                element={<TaskListPage />}
              />

              <Route
                path="/tasks/new"
                element={<TaskCreatePage />}
              />
            </Route>

            {/* 로그인 상태면 login 접근 막기 */}
            <Route
              path="/login"
              element={
                <Navigate to="/dashboard" replace />
              }
            />

            {/* 잘못된 주소 */}
            <Route
              path="*"
              element={
                <Navigate to="/dashboard" replace />
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;