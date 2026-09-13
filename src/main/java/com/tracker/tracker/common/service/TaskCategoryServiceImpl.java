package com.tracker.tracker.common.service;

import com.tracker.tracker.common.dao.TaskCategoryDAO;
import com.tracker.tracker.common.vo.TaskCategoryVO;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TaskCategoryServiceImpl implements  TaskCategoryService{

    private final TaskCategoryDAO taskCategoryDAO;

    public TaskCategoryServiceImpl(TaskCategoryDAO taskCategoryDAO) {
        this.taskCategoryDAO = taskCategoryDAO;
    }

    @Override
    public List<TaskCategoryVO> getCategoriesByUserId(String userId) {
        return taskCategoryDAO.selectAllByUserId(userId);
    }

    @Override
    public boolean isOwnedByUser(Long categoryId, String userId) {
        if (categoryId == null || userId == null || userId.isBlank()) {
            return false;
        }
        return taskCategoryDAO.countByCategoryIdAndUserId(categoryId, userId) > 0;
    }
}
