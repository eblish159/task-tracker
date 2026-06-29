package com.tracker.tracker.tasklog.service;

import com.tracker.tracker.task.vo.TaskVO;
import com.tracker.tracker.tasklog.vo.TaskLogVO;

import java.util.List;

public interface TaskLogService {

    void saveLog(TaskLogVO taskVO);

    List<TaskLogVO> getTaskLogsByTaskId(Long taskId);

}
