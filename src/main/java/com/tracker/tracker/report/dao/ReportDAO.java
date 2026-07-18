package com.tracker.tracker.report.dao;

import com.tracker.tracker.dashboard.vo.CompletionTrendVO;
import com.tracker.tracker.dashboard.vo.GroupCountVO;
import com.tracker.tracker.report.vo.PriorityPerformanceVO;
import com.tracker.tracker.report.vo.ReportTaskVO;
import com.tracker.tracker.report.vo.TimeAnalysisTaskVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.tracker.tracker.report.vo.CategoryPerformanceVO;

import java.util.List;

@Mapper
public interface ReportDAO {
    int countTotalTasks(@Param("userId") String userId,
                        @Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("categoryId") Long categoryId);

    int countDoneTasks(@Param("userId") String userId,
                       @Param("startDate") String startDate,
                       @Param("endDate") String endDate,
                       @Param("categoryId") Long categoryId);


    int countOverdueTasks(@Param("userId") String userId,
                          @Param("startDate") String startDate,
                          @Param("endDate") String endDate,
                          @Param("categoryId") Long categoryId);



    List<GroupCountVO> countByPriority(@Param("userId") String userId,
                                       @Param("startDate") String startDate,
                                       @Param("endDate") String endDate,
                                       @Param("categoryId") Long categoryId);


    List<GroupCountVO> countByCategory(@Param("userId") String userId,
                                       @Param("startDate") String startDate,
                                       @Param("endDate") String endDate);



    List<CompletionTrendVO> countCompletionTrend(@Param("userId") String userId,
                                                 @Param("startDate") String startDate,
                                                 @Param("endDate") String endDate,
                                                 @Param("categoryId") Long categoryId,
                                                 @Param("groupBy") String groupBy);
    List<CategoryPerformanceVO> selectCategoryPerformance(
            @Param("userId") String userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("categoryId") Long categoryId
    );

    List<PriorityPerformanceVO> selectPriorityPerformance(
            @Param("userId") String userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("categoryId") Long categoryId
    );

    List<ReportTaskVO> selectReportTasks(
            @Param("userId") String userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("categoryId") Long categoryId
    );

    List<TimeAnalysisTaskVO> selectTimeAnalysisTasks(
            @Param("userId") String userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("categoryId") Long categoryId
    );


}
