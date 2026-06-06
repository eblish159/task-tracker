package com.tracker.tracker.user.controller;

import com.tracker.tracker.user.service.UserService;
import com.tracker.tracker.user.vo.UserVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private UserService userService;

    //로그인 요청처리
    @PostMapping
    public ResponseEntity<Map<String, String>> login(@RequestBody UserVO loginRequest, HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (loginRequest.getUserId() == null || loginRequest.getUserId().trim().isEmpty()
                || loginRequest.getUserPassword() == null || loginRequest.getUserPassword().trim().isEmpty()) {

            response.put("error", "유저 아이디와 비밀번호는 필수입니다.");
            return ResponseEntity.badRequest().body(response);
        }

      boolean isAuthenticated = userService.authenticate(loginRequest.getUserId(), loginRequest.getUserPassword());

      if(isAuthenticated){
          session.setAttribute("userId", loginRequest.getUserId());
          response.put("message", "로그인 성공");
          return ResponseEntity.ok(response);
      } else {
          response.put("error" , "로그인 정보가 없습니다.");
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
      }
    }

    //로그아웃 처리
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session){
        session.invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("message" , "로그아웃 되었습니다.");
        return  ResponseEntity.ok(response);
    }


    //로그인 세션 여부 확인 로직
    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getSession(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        String userId = (String) session.getAttribute("userId");

        if(userId==null) {
            response.put("isLoggedIn",false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        }

        response.put("isLoggedIn", true);
        response.put("userId", userId);

        return ResponseEntity.ok(response);
    }


}
