    package com.tracker.tracker.tasklog.controller;


    import com.tracker.tracker.common.util.SessionUtils;
    import com.tracker.tracker.task.service.TaskService;
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
        private final TaskService taskService;



        @GetMapping("/{taskId}/logs")
        public List<TaskLogVO> getTaskLogsByTaskId(@PathVariable Long taskId, HttpSession session) {
            String userId = SessionUtils.getLoginUserId(session);

            // 해당 task가 로그인한 사용자 소유인지 먼저 검증 (아니면 selectTaskById가 예외를 던짐)
            taskService.selectTaskById(taskId, userId);

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