import { useEffect, useState } from "react";
import "./ReportsPage.css";
import PageHeaderFilter from "../components/common/PageHeaderFilter";
import ReportSummaryPanel from "../components/report/ReportSummaryPanel";
import CompletionTrendChart from "../components/report/CompletionTrendChart";
import CategoryPerformanceChart from "../components/report/CategoryPerformanceChart";
import PriorityPerformanceChart from "../components/report/PriorityPerformanceChart";
import ReportTaskList from "../components/report/ReportTaskList";
import TimeAnalysisPanel from "../components/report/TimeAnalysisPanel";
import AnalysisComments from "../components/report/AnalysisComments";
import { getQuickRange } from "../utils/dateUtils";


function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [completionTrend, setCompletionTrend] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [priorityPerformance, setPriorityPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportTasks, setReportTasks] = useState([]);
  const [timeAnalysis, setTimeAnalysis] = useState(null);


 const [startDate, setStartDate] = useState(
   () => getQuickRange(7).startDate
 );
 const [endDate, setEndDate] = useState(
   () => getQuickRange(7).endDate
 );

  const fetchReports = () => {
    setLoading(true);

    Promise.all([
      fetch(
        `/api/reports/summary?startDate=${startDate}&endDate=${endDate}`,
        {
          credentials: "include",
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("기간 요약 조회에 실패했습니다.");
        }

        return res.json();
      }),

      fetch(
        `/api/reports/completion-trend?startDate=${startDate}&endDate=${endDate}&groupBy=daily`,
        {
          credentials: "include",
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("완료 추이 조회에 실패했습니다.");
        }

        return res.json();
      }),

      fetch(
        `/api/reports/category-performance?startDate=${startDate}&endDate=${endDate}`,
        {
          credentials: "include",
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("카테고리 성과 조회에 실패했습니다.");
        }

        return res.json();
      }),
  fetch(
    `/api/reports/priority-performance?startDate=${startDate}&endDate=${endDate}`,
    {
      credentials: "include",
    }
  ).then((res) => {
    if (!res.ok) {
      throw new Error("우선순위 성과 조회에 실패했습니다.");
    }

    return res.json();
  }),

fetch(
  `/api/reports/tasks?startDate=${startDate}&endDate=${endDate}`,
  {
    credentials: "include",
  }
).then((res) => {
  if (!res.ok) {
    throw new Error("작업 목록 조회에 실패했습니다.");
  }

  return res.json();
}),



fetch(
  `/api/reports/time-analysis?startDate=${startDate}&endDate=${endDate}`,
  {
    credentials: "include",
  }
).then((res) => {
  if (!res.ok) {
    throw new Error("시간 분석 조회에 실패했습니다.");
  }

  return res.json();
}),
    ])
      .then(
        ([
          summaryData,
          trendData,
          categoryData,
          priorityData,
          taskData,
          timeAnalysisData,
        ]) => {
          setSummary(summaryData);

          setCompletionTrend(
            Array.isArray(trendData) ? trendData : []
          );

          setCategoryPerformance(
            Array.isArray(categoryData) ? categoryData : []
          );

          setPriorityPerformance(
            Array.isArray(priorityData) ? priorityData : []
          );

          setReportTasks(
              Array.isArray(taskData) ? taskData : []
          );

           setTimeAnalysis(timeAnalysisData ?? null);
        }
      )
      .catch((error) => {
        console.error("Reports 데이터 조회 실패:", error);
        setTimeAnalysis(null);

        setSummary(null);
        setCompletionTrend([]);
        setCategoryPerformance([]);
        setPriorityPerformance([]);
        setReportTasks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="reports-container">
      <PageHeaderFilter
        title="Reports"
        description="작업 데이터를 기간별로 분석합니다."
        startDate={startDate}
        endDate={endDate}
        loading={loading}
        onChangeStartDate={setStartDate}
        onChangeEndDate={setEndDate}
        onApply={fetchReports}
        buttonText="조회"
      />

      {loading ? (
        <div className="reports-loading">
          리포트 데이터를 불러오는 중...
        </div>
      ) : (
          <>
        <div className="reports-first-row">
          <ReportSummaryPanel summary={summary} />

          <CompletionTrendChart data={completionTrend} />

          <CategoryPerformanceChart data={categoryPerformance} />

           <PriorityPerformanceChart data={priorityPerformance} />


        </div>

        <div className="reports-second-row">
          <ReportTaskList data={reportTasks} />

          <TimeAnalysisPanel data={timeAnalysis} />

          <AnalysisComments
            summary={summary}
            timeAnalysis={timeAnalysis}
            categoryPerformance={categoryPerformance}
            priorityPerformance={priorityPerformance}
          />
        </div>
          </>
      )}
    </div>
  );
}

export default ReportsPage;