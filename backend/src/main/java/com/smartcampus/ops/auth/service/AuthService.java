package com.smartcampus.ops.auth.service;

import com.smartcampus.ops.auth.model.User;
import com.smartcampus.ops.auth.repository.UserRepository;
import com.smartcampus.ops.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER USER
    public String register(User user) {
        user.setRole("USER");
        userRepository.save(user);
        return "User registered successfully";
    }

    // ✅ LOGIN WITH USERNAME + PASSWORD
    public String login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        // ✅ RETURN JWT TOKEN
        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    // ✅ 🔥 ADD THIS METHOD (FOR GOOGLE LOGIN)
    public String generateGoogleUserToken(String email, String role) {
        return jwtUtil.generateToken(email, role);
    }
}