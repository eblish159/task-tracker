package com.tracker.tracker.tasklog.dao;

import org.apache.ibatis.annotations.Mapper;
import com.tracker.tracker.tasklog.vo.TaskLogVO;

@Mapper
public interface TaskLogDAO {

    void insertTaskLog(TaskLogVO taskLogVO);

}
