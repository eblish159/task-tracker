package com.tracker.tracker.tasklog.dao;

import com.tracker.tracker.task.vo.TaskVO;
import org.apache.ibatis.annotations.Mapper;
import com.tracker.tracker.tasklog.vo.TaskLogVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TaskLogDAO {

    void insertTaskLog(TaskLogVO taskLogVO);

    List<TaskLogVO> selectTaskLogsByTaskId(Long taskId);

    // 더미데이터 자동삭제 메서드
    int deleteTaskLogsByTaskIds(@Param("taskIds") List<Long> taskIds);
}
