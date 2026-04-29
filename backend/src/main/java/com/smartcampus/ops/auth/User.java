package com.smartcampus.ops.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
  @Id
  public String id;
  public String username;
  public String password; // In production, this must be BCrypt encoded
  public String fullName;
  public String role; // ROLE_USER, ROLE_ADMIN

  public User() {}
}