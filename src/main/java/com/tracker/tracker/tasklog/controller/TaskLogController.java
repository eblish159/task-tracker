    package com.tracker.tracker.tasklog.controller;


    import com.tracker.tracker.common.util.SessionUtils;
    import com.tracker.tracker.tasklog.service.TaskLogService;
    import com.tracker.tracker.tasklog.vo.TaskLogVO;
    import jakarta.servlet.http.HttpSession;
    import lombok.RequiredArgsConstructor;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/tasks")
    @RequiredArgsConstructor
    public class TaskLogController {

        private final TaskLogService taskLogService;



        @GetMapping("/{taskId}/logs")
        public List<TaskLogVO> getTaskLogsByTaskId(@PathVariable Long taskId) {
            return taskLogService.getTaskLogsByTaskId(taskId);
        }

        @GetMapping("/recent-activities")
        public List<TaskLogVO> getRecentActivities(
                @RequestParam(defaultValue = "5") int limit,
                HttpSession session
        ) {
            String userId = SessionUtils.getLoginUserId(session);

            return taskLogService.getRecentActivities(userId, limit);
        }
    }