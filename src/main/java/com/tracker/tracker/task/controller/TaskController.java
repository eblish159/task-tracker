package com.tracker.tracker.task.controller;

import com.tracker.tracker.common.util.SessionUtils;
import com.tracker.tracker.task.service.TaskService;
import com.tracker.tracker.task.vo.TaskListResponseVO;
import com.tracker.tracker.task.vo.TaskVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestBody TaskVO taskVO,
            HttpSession session
    ) {
        String userId = SessionUtils.getLoginUserId(session);

        taskVO.setUserId(userId);
        TaskVO createdTask = taskService.createTask(taskVO);

        return ResponseEntity.ok(createdTask);
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayTasks(HttpSession session) {
        String userId = SessionUtils.getLoginUserId(session);

        return ResponseEntity.ok(taskService.getTodayTasks(userId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<?> getOverdueTasks(HttpSession session) {
        String userId = SessionUtils.getLoginUserId(session);

        return ResponseEntity.ok(taskService.getOverdueTasks(userId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<?> getTask(@PathVariable Long taskId) {
        TaskVO task = taskService.selectTaskById(taskId);

        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("작업을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<?> getTaskPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String taskStatus,
            @RequestParam(required = false) String due,
            HttpSession session
    ) {
        String userId = SessionUtils.getLoginUserId(session);

        TaskListResponseVO response =
                taskService.getTaskPage(userId, page, size, categoryId, taskStatus, due);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskVO taskVO,
            HttpSession session
    ) {
        String userId = SessionUtils.getLoginUserId(session);

        taskVO.setTaskId(taskId);
        taskVO.setUserId(userId);

        TaskVO updatedTask = taskService.updateTask(taskVO);

        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> request,
            HttpSession session
    ) {
        SessionUtils.getLoginUserId(session);

        String taskStatus = request.get("taskStatus");

        if (taskStatus == null || taskStatus.isBlank()) {
            return ResponseEntity.badRequest().body("작업 상태 값이 필요합니다.");
        }

        TaskVO updatedTask = taskService.updateTaskStatus(taskId, taskStatus);

        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long taskId,
            HttpSession session
    ) {
        SessionUtils.getLoginUserId(session);

        taskService.deleteTask(taskId);

        return ResponseEntity.ok("작업이 삭제되었습니다.");
    }
}