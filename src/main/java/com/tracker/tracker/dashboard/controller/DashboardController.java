package com.tracker.tracker.dashboard.controller;

import com.tracker.tracker.dashboard.service.DashboardService;
import com.tracker.tracker.dashboard.vo.CompletionTrendVO;
import com.tracker.tracker.dashboard.vo.DashboardResponseVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tracker.tracker.common.util.SessionUtils;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }




    @GetMapping
    public ResponseEntity<DashboardResponseVO> getDashboard(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            HttpSession session
    ) {

        String userId = SessionUtils.getLoginUserId(session);

        DashboardResponseVO response =
                dashboardService.getDashboard(
                        userId,
                        startDate,
                        endDate,
                        categoryId
                );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/trend")
    public ResponseEntity<List<CompletionTrendVO>> getCompletionTrend(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "daily") String groupBy,
            HttpSession session
    ) {

        String userId = SessionUtils.getLoginUserId(session);

        List<CompletionTrendVO> response =
                dashboardService.getCompletionTrend(
                        userId,
                        startDate,
                        endDate,
                        categoryId,
                        groupBy
                );

        return ResponseEntity.ok(response);
    }
}