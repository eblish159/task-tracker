package com.tracker.tracker.report.service;

import com.tracker.tracker.dashboard.vo.CompletionTrendVO;
import com.tracker.tracker.dashboard.vo.DashboardResponseVO;

import java.util.List;

public interface ReportService {
    DashboardResponseVO getSummary(String userId, String startDate, String endDate, Long categoryId);
    List<CompletionTrendVO> getCompletionTrend(String userId, String startDate, String endDate, Long categoryId, String groupBy);
}
