package com.tracker.tracker.report.controller;

import com.tracker.tracker.dashboard.vo.CompletionTrendVO;
import com.tracker.tracker.dashboard.vo.DashboardResponseVO;
import com.tracker.tracker.report.service.ReportService;
import com.tracker.tracker.report.vo.PriorityPerformanceVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tracker.tracker.report.vo.CategoryPerformanceVO;
import com.tracker.tracker.report.vo.ReportTaskVO;
import com.tracker.tracker.report.vo.TimeAnalysisVO;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    private String getLoginUserId(HttpSession session) {

        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return userId;
    }


    @GetMapping("/summary")
    public ResponseEntity<DashboardResponseVO> getSummary(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            HttpSession session
    ) {

        String userId = getLoginUserId(session);

        DashboardResponseVO response =
                reportService.getSummary(
                        userId,
                        startDate,
                        endDate,
                        categoryId
                );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/completion-trend")
    public ResponseEntity<List<CompletionTrendVO>> getCompletionTrend(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "daily") String groupBy,
            HttpSession session
    ) {

        String userId = getLoginUserId(session);

        List<CompletionTrendVO> response =
                reportService.getCompletionTrend(
                        userId,
                        startDate,
                        endDate,
                        categoryId,
                        groupBy
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/category-performance")
    public ResponseEntity<List<CategoryPerformanceVO>> getCategoryPerformance(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            HttpSession session
    ) {
        String userId = getLoginUserId(session);

        List<CategoryPerformanceVO> response =
                reportService.getCategoryPerformance(
                        userId,
                        startDate,
                        endDate,
                        categoryId
                );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/priority-performance")
    public ResponseEntity<List<PriorityPerformanceVO>> getPriorityPerformance(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            HttpSession session
    ) {
        String userId = getLoginUserId(session);

        List<PriorityPerformanceVO> response =
                reportService.getPriorityPerformance(
                        userId,
                        startDate,
                        endDate,
                        categoryId
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<ReportTaskVO>> getReportTasks(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            HttpSession session
    ) {
        String userId = getLoginUserId(session);

        List<ReportTaskVO> response =
                reportService.getReportTasks(
                        userId,
                        startDate,
                        endDate,
                        categoryId
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/time-analysis")
    public ResponseEntity<TimeAnalysisVO> getTimeAnalysis(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            HttpSession session
    ) {
        String userId = getLoginUserId(session);

        TimeAnalysisVO response =
                reportService.getTimeAnalysis(
                        userId,
                        startDate,
                        endDate,
                        categoryId
                );

        return ResponseEntity.ok(response);
    }


}
