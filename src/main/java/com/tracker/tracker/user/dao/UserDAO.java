package com.tracker.tracker.user.dao;

import com.tracker.tracker.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDAO {
    UserVO findByUserId(String userId);
}
