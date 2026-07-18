package com.tracker.tracker.report.service;

import com.tracker.tracker.report.dao.ReportDAO;
import com.tracker.tracker.dashboard.vo.CompletionTrendVO;
import com.tracker.tracker.dashboard.vo.DashboardResponseVO;
import com.tracker.tracker.dashboard.vo.GroupCountVO;
import com.tracker.tracker.report.vo.PriorityPerformanceVO;
import jakarta.annotation.Priority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.tracker.tracker.report.vo.CategoryPerformanceVO;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import com.tracker.tracker.report.vo.ReportTaskVO;
import com.tracker.tracker.report.vo.TimeAnalysisTaskVO;
import com.tracker.tracker.report.vo.TimeAnalysisVO;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final ReportDAO reportDAO;

    public ReportServiceImpl(ReportDAO reportDAO) {
        this.reportDAO = reportDAO;
    }

    /**
     * 설계 1:
     * - total/done/byPriority 는 categoryId 필터 적용
     * - byCategory 는 전체 분포 유지(필터 미적용)
     */
    @Override
    public DashboardResponseVO getSummary(String userId, String startDate, String endDate, Long categoryId) {

        validateDates(startDate, endDate);

        // ✅ categoryId 필터 적용되는 집계들
        int total = reportDAO.countTotalTasks(userId, startDate, endDate, categoryId);
        int done = reportDAO.countDoneTasks(userId, startDate, endDate, categoryId);
        int overdue = reportDAO.countOverdueTasks(userId, startDate, endDate, categoryId);


        List<GroupCountVO> byPriority = reportDAO.countByPriority(userId, startDate, endDate, categoryId);

        // ✅ 설계 1: 카테고리별 분포는 전체 유지 (categoryId 미적용)
        List<GroupCountVO> byCategory = reportDAO.countByCategory(userId, startDate, endDate);

        double doneRate = calculateDoneRate(done, total);

        DashboardResponseVO response = new DashboardResponseVO();
        response.setTotalCount(total);
        response.setDoneCount(done);
        response.setOverdueCount(overdue);
        response.setDoneRate(doneRate);
        response.setByPriority(byPriority);
        response.setByCategory(byCategory);

        return response;
    }

    private void validateDates(String startDate, String endDate) {
        if (!StringUtils.hasText(startDate) || !StringUtils.hasText(endDate)) {
            throw new IllegalArgumentException("startDate 와 endDate는 필수입니다.");
        }

        LocalDate start;
        LocalDate end;
        try {
            start = LocalDate.parse(startDate);
            end = LocalDate.parse(endDate);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("날짜 형식이 올바르지 않습니다.", e);
        }

        if (start.isAfter(end)) {
            throw new IllegalArgumentException("startDate 는 endDate보다 클 수 없습니다.");
        }
    }

    private double calculateDoneRate(int done, int total) {
        if (total <= 0) return 0.0;
        double rate = ((double) done / (double) total) * 100.0;
        return Math.round(rate * 10.0) / 10.0;
    }

    private double calculateAverageCompletionDays(
            List<TimeAnalysisTaskVO> tasks
    ) {
        double totalDays = 0;
        int completedCount = 0;

        for (TimeAnalysisTaskVO task : tasks) {

            if (task.getCreatedDate() == null
                    || task.getCompletedDate() == null) {
                continue;
            }

            long days = ChronoUnit.DAYS.between(
                    task.getCreatedDate(),
                    task.getCompletedDate()
            );

            totalDays += days;

            completedCount++;
        }

        if (completedCount == 0) {
            return 0;
        }

        return totalDays / completedCount;
    }

    private double calculateAverageDelayDays(
            List<TimeAnalysisTaskVO> tasks
    ) {

        double totalDelayDays = 0;

        int delayCount = 0;

        for (TimeAnalysisTaskVO task : tasks) {

            if (task.getDueDate() == null
                    || task.getCompletedDate() == null) {
                continue;
            }

            long delayDays = ChronoUnit.DAYS.between(
                    task.getDueDate(),
                    task.getCompletedDate()
            );

            if (delayDays <= 0) {
                continue;
            }

            totalDelayDays += delayDays;

            delayCount++;
        }

        if (delayCount == 0) {
            return 0;
        }

        return totalDelayDays / delayCount;
    }

    private double calculateOnTimeRate(
            List<TimeAnalysisTaskVO> tasks
    ) {
        int measurableCount = 0;
        int onTimeCount = 0;

        for (TimeAnalysisTaskVO task : tasks) {

            if (task.getDueDate() == null
                    || task.getCompletedDate() == null) {
                continue;
            }

            measurableCount++;

            boolean completedOnTime =
                    !task.getCompletedDate()
                            .toLocalDate()
                            .isAfter(
                                    task.getDueDate().toLocalDate()
                            );

            if (completedOnTime) {
                onTimeCount++;
            }
        }

        if (measurableCount == 0) {
            return 0;
        }

        double rate =
                onTimeCount * 100.0 / measurableCount;

        return Math.round(rate * 10.0) / 10.0;
    }

    private TimeAnalysisTaskVO findLongestTask(
            List<TimeAnalysisTaskVO> tasks
    ) {
        TimeAnalysisTaskVO longestTask = null;
        long longestMinutes = -1;

        for (TimeAnalysisTaskVO task : tasks) {

            if (task.getCreatedDate() == null
                    || task.getCompletedDate() == null) {
                continue;
            }

            long completionMinutes = Duration.between(
                    task.getCreatedDate(),
                    task.getCompletedDate()
            ).toMinutes();

            if (completionMinutes < 0) {
                continue;
            }

            if (completionMinutes > longestMinutes) {
                longestMinutes = completionMinutes;
                longestTask = task;
            }
        }

        return longestTask;
    }

    @Override
    public List<CompletionTrendVO> getCompletionTrend(String userId, String startDate, String endDate, Long categoryId, String groupBy) {
        validateDates(startDate, endDate);

        return  reportDAO.countCompletionTrend(userId, startDate, endDate, categoryId, groupBy);
    }

    @Override
    public List<CategoryPerformanceVO> getCategoryPerformance(String userId, String startDate, String endDate, Long categoryId
    ) {
        return reportDAO.selectCategoryPerformance(userId, startDate, endDate, categoryId);
    }

    @Override
    public List<PriorityPerformanceVO> getPriorityPerformance(String userId, String startDate, String endDate, Long categoryId
    ) {
        return reportDAO.selectPriorityPerformance(userId, startDate, endDate, categoryId);
    }

    @Override
    public List<ReportTaskVO> getReportTasks(String userId, String startDate, String endDate, Long categoryId) {
        validateDates(startDate, endDate);

        return reportDAO.selectReportTasks(userId, startDate, endDate, categoryId);
    }

    @Override
    public TimeAnalysisVO getTimeAnalysis(String userId, String startDate, String endDate, Long categoryId) {
        List<TimeAnalysisTaskVO> tasks =
                reportDAO.selectTimeAnalysisTasks(userId, startDate, endDate, categoryId);

        TimeAnalysisVO response = new TimeAnalysisVO();

        System.out.println("===== Time Analysis =====");
        System.out.println("조회 건수 : " + tasks.size());

        for (TimeAnalysisTaskVO task : tasks) {

            System.out.println("작업명 : " + task.getTaskTitle());

            System.out.println("생성일 : " + task.getCreatedDate());

            System.out.println("완료일 : " + task.getCompletedDate());

            System.out.println("----------------");
        }

        if (tasks == null || tasks.isEmpty()) {
            response.setAverageCompletionDays(0);
            response.setAverageDelayDays(0);
            response.setOnTimeRate(0);
            response.setLongestTaskTitle("-");
            response.setLongestCompletionDays(0);

            return response;
        }
        response.setAverageCompletionDays(
                calculateAverageCompletionDays(tasks)
        );

        response.setAverageDelayDays(
                calculateAverageDelayDays(tasks)
        );

        response.setOnTimeRate(
                calculateOnTimeRate(tasks)
        );

        TimeAnalysisTaskVO longestTask =
                findLongestTask(tasks);

        if (longestTask == null) {

            response.setLongestTaskTitle("-");
            response.setLongestCompletionDays(0);

        } else {

            response.setLongestTaskTitle(
                    longestTask.getTaskTitle()
            );

            long completionDays =
                    ChronoUnit.DAYS.between(
                            longestTask.getCreatedDate(),
                            longestTask.getCompletedDate()
                    );

            response.setLongestCompletionDays(
                    (int) completionDays
            );
        }

        return response;

    }




}