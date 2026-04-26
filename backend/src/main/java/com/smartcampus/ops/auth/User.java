package com.smartcampus.ops.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
public class User {

    @Id
    public String id;

    @Indexed(unique = true)
    public String username;

    public String password;

    public String fullName;

    public String role; // ROLE_USER, ROLE_ADMIN

    public User() {}

    public User(String username, String password, String fullName, String role) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }

    // Getters still needed by Spring Security
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public void setPassword(String password) { this.password = password; }
}