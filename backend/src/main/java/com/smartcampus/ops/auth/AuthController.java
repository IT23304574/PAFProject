package com.smartcampus.ops.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.smartcampus.ops.common.BadRequestException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final NetHttpTransport transport = new NetHttpTransport();
    private final GsonFactory jsonFactory  = GsonFactory.getDefaultInstance();

    @Value("${google.client.id:}")
    private String googleClientId;

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // ── Register ──────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.username)) {
            throw new BadRequestException("Username already taken");
        }
        if (req.role == null || req.role.isBlank()) req.role = "ROLE_USER";

        // Only allow valid roles
        if (!req.role.equals("ROLE_USER") &&
            !req.role.equals("ROLE_ADMIN") &&
            !req.role.equals("ROLE_TECHNICIAN")) {
            req.role = "ROLE_USER";
        }

        User user = new User();
        user.username       = req.username;
        user.fullName       = req.fullName;
        user.role           = req.role;
        user.phone          = req.phone;
        user.department     = req.department;
        user.password       = passwordEncoder.encode(req.password);
        user.approvalStatus = "ROLE_TECHNICIAN".equals(req.role) ? "PENDING_APPROVAL" : "APPROVED";
        user.authProvider   = "LOCAL";
        user.emailVerified  = false;

        User saved = userRepository.save(user);

        if ("ROLE_TECHNICIAN".equals(saved.role)) {
            // Return info so frontend can show "awaiting approval" message
            return ResponseEntity.accepted().body(saved);
        }
        return ResponseEntity.ok(saved);
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByUsername(req.username)
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password, user.password)) {
            throw new BadRequestException("Invalid credentials");
        }

        // Block technicians that haven't been approved yet
        if ("ROLE_TECHNICIAN".equals(user.role) && !"APPROVED".equals(user.approvalStatus)) {
            throw new BadRequestException(
                "PENDING_APPROVAL: Your account is awaiting admin approval. Please check back later.");
        }

        return ResponseEntity.ok(user);
    }

    // ── Google OAuth ──────────────────────────────────────────────────────────
    @PostMapping("/google")
    public ResponseEntity<User> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        String requestedRole = body.get("role");
        if (idToken == null || idToken.isEmpty()) {
            throw new BadRequestException("ID Token is required");
        }
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new BadRequestException("Google OAuth client ID is not configured");
        }
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) throw new BadRequestException("Invalid ID Token");

            Payload payload = token.getPayload();
            String email = payload.getEmail();
            String name  = (String) payload.get("name");
            String sub   = payload.getSubject();
            boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());
            String role = normalizeRole(requestedRole);

            User user = userRepository.findByUsername(email).orElseGet(() -> {
                User nu = new User(email, null, name != null ? name : "Google User", "ROLE_USER");
                nu.role = role;
                nu.authProvider = "GOOGLE";
                nu.googleSub = sub;
                nu.emailVerified = emailVerified;
                nu.approvalStatus = "ROLE_TECHNICIAN".equals(role) ? "PENDING_APPROVAL" : "APPROVED";
                return userRepository.save(nu);
            });

            if (user.googleSub == null || user.googleSub.isBlank()) {
                user.googleSub = sub;
            }
            if (name != null && !name.isBlank()) {
                user.fullName = name;
            }
            user.authProvider = "GOOGLE";
            user.emailVerified = emailVerified;
            userRepository.save(user);

            if ("ROLE_TECHNICIAN".equals(user.role) && !"APPROVED".equals(user.approvalStatus)) {
                throw new BadRequestException(
                        "PENDING_APPROVAL: Your account is awaiting admin approval. Please check back later.");
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            throw new BadRequestException("Authentication failed: " + e.getMessage());
        }
    }

    private String normalizeRole(String role) {
        Set<String> allowed = Set.of("ROLE_USER", "ROLE_TECHNICIAN", "ROLE_ADMIN");
        if (role == null || role.isBlank()) {
            return "ROLE_USER";
        }
        return allowed.contains(role) ? role : "ROLE_USER";
    }

    // ── Request / Response POJOs ──────────────────────────────────────────────
    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class RegisterRequest {
        public String username;
        public String password;
        public String fullName;
        public String role;
        public String phone;
        public String department;
    }
}