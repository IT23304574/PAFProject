package com.smartcampus.ops.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
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
  @Value("${google.client.id:725051219392-u8oac67c5dusdgb9ht9q3u683iss1lfl.apps.googleusercontent.com}")
  private String googleClientId;

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/register")
  public User register(@RequestBody User user) {
    if (user == null
        || user.username == null || user.username.trim().isEmpty()
        || user.password == null || user.password.trim().isEmpty()
        || user.fullName == null || user.fullName.trim().isEmpty()) {
      throw new BadRequestException("Email, password, and full name are required");
    }

    if (userRepository.existsByUsername(user.username)) {
      throw new BadRequestException("Username already taken");
    }

    if (user.role == null || user.role.trim().isEmpty()) {
      user.role = "ROLE_USER";
    }

    return userRepository.save(user);
  }

  @PostMapping("/login")
  public User login(@RequestBody LoginRequest request) {
    if (request == null
        || request.username == null || request.username.trim().isEmpty()
        || request.password == null || request.password.trim().isEmpty()) {
      throw new BadRequestException("Email and password are required");
    }

    User user = userRepository.findByUsername(request.username)
        .orElseThrow(() -> new BadRequestException("Invalid email or password"));

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
    @JsonAlias({"email"})
    public String username;
    public String password;
    public String idToken;
  }
}