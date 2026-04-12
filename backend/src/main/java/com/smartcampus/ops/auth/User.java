package com.smartcampus.ops.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
  @Id
  public String id;

  @JsonAlias({"email"})
  public String username;

  public String password; // In production, this must be BCrypt encoded
  @JsonAlias({"name"})
  public String fullName;
  public String role; // ROLE_USER, ROLE_ADMIN

  public User() {}
}