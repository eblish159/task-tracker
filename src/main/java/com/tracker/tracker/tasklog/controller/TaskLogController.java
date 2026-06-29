package com.tracker.tracker.tasklog.controller;


import com.tracker.tracker.tasklog.service.TaskLogService;
import com.tracker.tracker.tasklog.vo.TaskLogVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
