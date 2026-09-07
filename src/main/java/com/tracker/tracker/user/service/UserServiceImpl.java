package com.tracker.tracker.user.service;

import com.tracker.tracker.user.dao.UserDAO;
import com.tracker.tracker.user.vo.UserVO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserDAO userDAO, PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean authenticate(String userId, String password) {

        if (userId == null || userId.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            return false;
        }

        UserVO user = userDAO.findByUserId(userId);

        System.out.println("=== DEBUG: userId=[" + userId + "] len=" + userId.length());
        System.out.println("=== DEBUG: user found? " + (user != null));

        if (user == null) {
            return false;
        }

        System.out.println("=== DEBUG: input password=[" + password + "] len=" + password.length());
        System.out.println("=== DEBUG: stored hash=[" + user.getUserPassword() + "] len=" + user.getUserPassword().length());

        boolean isValidPassword = passwordEncoder.matches(password, user.getUserPassword());

        System.out.println("=== DEBUG: matches result=" + isValidPassword);

        return isValidPassword;
    }
}