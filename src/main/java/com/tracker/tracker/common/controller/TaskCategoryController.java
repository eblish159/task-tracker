package com.tracker.tracker.common.controller;


import com.tracker.tracker.common.service.TaskCategoryService;
import com.tracker.tracker.common.util.SessionUtils;
import com.tracker.tracker.common.vo.TaskCategoryVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TaskCategoryController {

    private final TaskCategoryService taskCategoryService;

    public TaskCategoryController(TaskCategoryService taskCategoryService){
        this.taskCategoryService = taskCategoryService;
    }

    @GetMapping("/api/categories")
    public List<TaskCategoryVO> categories(HttpSession session) {
        String userId = SessionUtils.getLoginUserId(session);
        return taskCategoryService.getCategoriesByUserId(userId);
    }


}
