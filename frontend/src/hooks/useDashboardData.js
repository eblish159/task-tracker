import { useEffect, useState } from "react";
import {
    fetchDashboard,
    fetchTodayTasks,
    fetchOverdueTasks,
    } from "../api/dashboardApi";

export default function useDashboardData(startDate, endDate, categoryId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);

  async function load() {
    setError("");}

    if (!startDate || !endDate) {
          setError("시작일/종료일을 입력하세요.");
          return;
        }

    try {
          setLoading(true);

          const [dashboardResult, todayResult, overdueResult] = await Promise.all([
            fetchDashboard(startDate, endDate, categoryId),
            fetchTodayTasks(),
            fetchOverdueTasks(),
          ]);

          setData(dashboardResult);
          setTodayTasks(Array.isArray(todayResult) ? todayResult : []);
          setOverdueTasks(Array.isArray(overdueResult) ? overdueResult : []);
        } catch (e) {
          setData(null);
          setTodayTasks([]);
          setOverdueTasks([]);
          setError(e?.message || "조회 실패");
        } finally {
          setLoading(false);
        }
      }

      async function loadCategories() {
        setCategoryError("");



            try {
              setCategoryLoading(true);
              const list = await fetchCategories();
              setCategories(Array.isArray(list) ? list : []);
            } catch (e) {
              setCategories([]);
              setCategoryError(e?.message || "카테고리 조회 실패");
            } finally {
              setCategoryLoading(false);
            }
          }
            useEffect(() => {
              loadCategories();
            }, []);

            useEffect(() => {load();
            }, [startDate, endDate, categoryId]);

            return {
                loading,
                error,
                data,
                categories,
                categoryError,
                todayTasks,
                overdueTasks,
                load,
                };
  }