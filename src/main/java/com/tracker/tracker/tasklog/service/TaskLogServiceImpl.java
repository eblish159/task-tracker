package com.tracker.tracker.tasklog.service;

import com.tracker.tracker.tasklog.dao.TaskLogDAO;
import com.tracker.tracker.tasklog.vo.TaskLogVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskLogServiceImpl implements TaskLogService {

    private final TaskLogDAO taskLogDAO;

    @Override
    public void saveLog(TaskLogVO taskLogVO) {

        taskLogDAO.insertTaskLog(taskLogVO);
    }

}
