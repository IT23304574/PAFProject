package com.smartcampus.ops.auth.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.smartcampus.ops.auth.model.User;
import com.smartcampus.ops.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final String CLIENT_ID = "35089460198-e37rkbis6ehek9pm5t133td5afd1sji0.apps.googleusercontent.com";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String result = authService.register(user);
        return ResponseEntity.ok(Collections.singletonMap("message", result));
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        String token = authService.login(user.getUsername(), user.getPassword());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    // ✅ GOOGLE LOGIN
    @PostMapping("/google")
    public ResponseEntity<?> verifyGoogleToken(@RequestBody Map<String, String> payload) {

        String tokenString = payload.get("token");

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payloadInfo = idToken.getPayload();

                String email = payloadInfo.getEmail();
                String name = (String) payloadInfo.get("name");
                String pictureUrl = (String) payloadInfo.get("picture");

                // ✅ ROLE LOGIC (fixed)
                String role = "USER";
                if (email != null && email.endsWith("@admin.smartcampus.edu")) {
                    role = "ADMIN";
                } else if (email != null && email.endsWith("@tech.smartcampus.edu")) {
                    role = "TECHNICIAN";
                }

                // ✅ JWT
                String jwtToken = authService.generateGoogleUserToken(email, role);

                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtToken);
                response.put("email", email);
                response.put("name", name);
                response.put("picture", pictureUrl);
                response.put("role", role);

                return ResponseEntity.ok(response);

            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Invalid ID token."));
            }

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Token verification failed: " + e.getMessage()));
        }
    }
}