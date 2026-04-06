package com.smartcampus.ops.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.smartcampus.ops.common.BadRequestException;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthController {

  private final NetHttpTransport transport = new NetHttpTransport();
  private final GsonFactory jsonFactory = GsonFactory.getDefaultInstance();
  @Value("${google.client.id:407408718192.apps.googleusercontent.com}")
  private String googleClientId;

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/register")
  public User register(@RequestBody User user) {
    if (userRepository.existsByUsername(user.username)) {
      throw new BadRequestException("Username already taken");
    }
    // Simple role assignment
    if (user.role == null) user.role = "ROLE_USER";
    return userRepository.save(user);
  }

  @PostMapping("/login")
  public User login(@RequestBody LoginRequest request) {
    User user = userRepository.findByUsername(request.username)
        .orElseThrow(() -> new BadRequestException("Invalid email or password"));

    // In production, use BCrypt.checkPassword
    if (user.password == null || !user.password.equals(request.password)) {
      throw new BadRequestException("Invalid email or password");
    }
    return user;
  }

  @PostMapping("/google")
  public User googleLogin(@RequestBody LoginRequest request) {
    if (request.idToken == null || request.idToken.isEmpty()) {
      throw new BadRequestException("ID Token is required");
    }

    try {
      GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
          .setAudience(Collections.singletonList(googleClientId))
          .build();

      GoogleIdToken idToken = verifier.verify(request.idToken);
      if (idToken == null) {
        throw new BadRequestException("Invalid ID Token");
      }

      Payload payload = idToken.getPayload();
      String email = payload.getEmail();
      String name = (String) payload.get("name");

      return userRepository.findByUsername(email)
          .orElseGet(() -> {
            User newUser = new User();
            newUser.username = email;
            newUser.fullName = name != null ? name : "Google User";
            newUser.role = "ROLE_USER";
            return userRepository.save(newUser);
          });
    } catch (Exception e) {
      throw new BadRequestException("Authentication failed: " + e.getMessage());
    }
  }

  public static class LoginRequest {
    public String username; // used as email
    public String password;
    public String idToken;
  }
}