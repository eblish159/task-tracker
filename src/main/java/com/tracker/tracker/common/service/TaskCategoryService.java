package com.tracker.tracker.common.service;

import com.tracker.tracker.common.vo.TaskCategoryVO;

import java.util.List;

public interface TaskCategoryService {
    // 로그인한 사용자 소유의 카테고리만 조회
    List<TaskCategoryVO> getCategoriesByUserId(String userId);

    // 해당 카테고리가 이 사용자 소유인지 확인 (task 생성/수정 시 검증용)
    boolean isOwnedByUser(Long categoryId, String userId);
}
