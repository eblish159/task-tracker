package com.tracker.tracker.common.util;

import jakarta.servlet.http.HttpSession;

public class SessionUtils {

    private SessionUtils() {
        // 인스턴스화 방지
    }

    public static String getLoginUserId(HttpSession session) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return userId;
    }
}