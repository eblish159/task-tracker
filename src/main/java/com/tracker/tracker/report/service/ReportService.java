package com.tracker.tracker.report.service;

import com.tracker.tracker.dashboard.vo.CompletionTrendVO;
import com.tracker.tracker.dashboard.vo.DashboardResponseVO;
import com.tracker.tracker.report.vo.CategoryPerformanceVO;
import com.tracker.tracker.report.vo.PriorityPerformanceVO;
import jakarta.annotation.Priority;
import com.tracker.tracker.report.vo.ReportTaskVO;
import com.tracker.tracker.report.vo.TimeAnalysisVO;

import java.util.List;


public interface ReportService {
    DashboardResponseVO getSummary(String userId, String startDate, String endDate, Long categoryId);
    List<CompletionTrendVO> getCompletionTrend(String userId, String startDate, String endDate, Long categoryId, String groupBy);
    List<CategoryPerformanceVO> getCategoryPerformance(String userId, String startDate, String endDate, Long categoryId);
    List<PriorityPerformanceVO> getPriorityPerformance(String userId, String startDate, String endDate, Long categoryId);
    List<ReportTaskVO> getReportTasks(String userId, String startDate, String endDate, Long categoryId);
    TimeAnalysisVO getTimeAnalysis(String userId, String startDate, String endDate, Long categoryId);
}
