// frontend/src/pages/DashboardPage.jsx

import React, {  useState } from "react";
import DailyTrendChart from "../components/DailyTrendChart";
import AnalysisBox from "../components/dashboard/AnalysisBox";
import SummaryCard from "../components/dashboard/SummaryCard";
import DonutChartBox from "../components/dashboard/DonutChartBox";
import DashboardFilter from "../components/dashboard/DashboardFilter";
import useDashboardData from "../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import {
  getQuickRange,
  getThisMonthRange,
} from "../utils/dateUtils";
import {
  getPeriodSummaryLines,
  getDashboardCommentLines,
} from "../utils/dashboardAnalysis";
import { fetchCategories } from "../api/categoryApi";


export default function DashboardPage() {
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-02-22");
  const [categoryId, setCategoryId] = useState("");

  const navigate = useNavigate();

  const {
    loading,
    error,
    data,
    categories,
    categoryLoading,
    categoryError,
    todayTasks,
    overdueTasks,
    load,
  } = useDashboardData(startDate, endDate, categoryId);

  const setQuickRange = (days) => {
      const range = getQuickRange(days);

      setStartDate(range.startDate);
      setEndDate(range.endDate);
      };

  const setThisMonth = () => {
      const range = getThisMonthRange();


      setStartDate(range.startDate);
      setEndDate(range.endDate);
      };






  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f6fb",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 30 }}>Dashboard</h2>
          {/*<p style={{ margin: "6px 0 0", color: "#667085" }}>*/}
          {/*  작업은 목록에서 관리하고, 대시보드에서는 통계와 흐름을 확인합니다.*/}
          {/*</p>*/}
        </div>

        {/* 필터 영역 */}
    <DashboardFilter
      startDate={startDate}
      endDate={endDate}
      categoryId={categoryId}
      categories={categories}
      loading={loading}
      categoryLoading={categoryLoading}
      categoryError={categoryError}
      onChangeStartDate={setStartDate}
      onChangeEndDate={setEndDate}
      onChangeCategoryId={setCategoryId}
      onSearch={load}
      onQuickRange={setQuickRange}
      onThisMonth={setThisMonth}
    />

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: 12,
              border: "1px solid #f2b8b5",
              background: "#fff5f5",
              borderRadius: 10,
              color: "#b42318",
            }}
          >
            {error}
          </div>
        )}

        {data && (
          <>
            {/* 요약 카드 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(150px, 1fr))",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <SummaryCard title="총 작업" value={data.totalCount} subtitle="선택 기간" icon="📋" />
              <SummaryCard title="완료된 작업" value={data.doneCount} subtitle="선택 기간" icon="✅" />
              <SummaryCard title="완료율" value={`${data.doneRate}%`} subtitle="선택 기간" icon="📊" />
              <SummaryCard
                title="오늘 마감"
                value={`${todayTasks.length}건`}
                subtitle="작업 목록에서 확인 →"
                icon="📅"
                onClick={() => navigate("/tasks?due=today")}
              />
              <SummaryCard
                title="지연 작업"
                value={`${overdueTasks.length}건`}
                subtitle="작업 목록에서 확인 →"
                icon="⚠️"
                onClick={() => navigate("/tasks?due=overdue")}
              />
            </div>

            {/* 차트 영역 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.35fr 1fr 1fr",
                gap: 12,
                marginBottom: 14,
                alignItems: "stretch",
              }}
            >
              <DailyTrendChart
                startDate={startDate}
                endDate={endDate}
                categoryId={categoryId}
              />

              <DonutChartBox title="카테고리별 작업 분포" items={data.byCategory} />
              <DonutChartBox title="우선순위별 분포" items={data.byPriority} />
            </div>

            {/* 하단 분석 박스 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <AnalysisBox
                title="이번 기간 요약"
                icon="📌"
                lines={getPeriodSummaryLines(data)}
              />
              <AnalysisBox
                title="분석 코멘트"
                icon="💡"
                lines={getDashboardCommentLines(todayTasks, overdueTasks)}
              />
            </div>


          </>
        )}
      </div>
    </div>
  );
}



