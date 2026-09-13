package com.tracker.tracker.common.dao;

import com.tracker.tracker.common.vo.TaskCategoryVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TaskCategoryDAO {
    List<TaskCategoryVO> selectAllByUserId(@Param("userId") String userId);

    int countByCategoryIdAndUserId(@Param("categoryId") Long categoryId, @Param("userId") String userId);
}
