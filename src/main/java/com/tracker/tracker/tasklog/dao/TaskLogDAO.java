package com.tracker.tracker.tasklog.dao;

import com.tracker.tracker.task.vo.TaskVO;
import org.apache.ibatis.annotations.Mapper;
import com.tracker.tracker.tasklog.vo.TaskLogVO;

import java.util.List;

@Mapper
public interface TaskLogDAO {

    void insertTaskLog(TaskLogVO taskLogVO);

    List<TaskLogVO> selectTaskLogsByTaskId(Long taskId);

}
