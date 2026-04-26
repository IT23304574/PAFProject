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
public class AuthController {

    private static final String CLIENT_ID = "35089460198-e37rkbis6ehek9pm5t133td5afd1sji0.apps.googleusercontent.com";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return authService.login(user.getUsername(), user.getPassword());
    }

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

            // Extract user info
            String email = payloadInfo.getEmail();
            String name = (String) payloadInfo.get("name");
            String pictureUrl = (String) payloadInfo.get("picture");

            // Assign role
            String role = "USER";
            if (email.endsWith("@admin.smartcampus.edu")) {
                role = "ADMIN";
            } else if (email.endsWith("@tech.smartcampus.edu")) {
                role = "TECHNICIAN";
            }

            // ✅ GENERATE JWT TOKEN (IMPORTANT)
            String jwtToken = authService.generateGoogleUserToken(email, role);

            // Return response
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);   // 🔥 REQUIRED
            response.put("email", email);
            response.put("name", name);
            response.put("picture", pictureUrl);
            response.put("role", role);

            return ResponseEntity.ok(response);

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid ID token.");
        }

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Token verification failed.");
    }
}
}