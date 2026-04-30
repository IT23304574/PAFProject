package com.smartcampus.ops.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
public class User {

    @Id
    public String id;

    @Indexed(unique = true)
<<<<<<< HEAD
    public String username; // email

    @JsonIgnore
    public String password;
    public String fullName;

    /**
     * Roles: ROLE_USER, ROLE_ADMIN, ROLE_TECHNICIAN
     */
    public String role;

    /**
     * For technicians: PENDING_APPROVAL | APPROVED | REJECTED
     * For other roles: APPROVED (always active)
     */
    public String approvalStatus;

    public String phone;
    public String department;
    public String authProvider; // LOCAL | GOOGLE
    public String googleSub;
    public Boolean emailVerified;
=======
    public String username;

    public String password;

    public String fullName;

    public String role; // ROLE_USER, ROLE_ADMIN
>>>>>>> origin/main

    public User() {}

    public User(String username, String password, String fullName, String role) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
<<<<<<< HEAD
        this.approvalStatus = "ROLE_TECHNICIAN".equals(role) ? "PENDING_APPROVAL" : "APPROVED";
        this.authProvider = "LOCAL";
        this.emailVerified = false;
    }

    public String getUsername()       { return username; }
    public String getPassword()       { return password; }
    public String getFullName()       { return fullName; }
    public String getRole()           { return role; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setPassword(String p) { this.password = p; }
    public void setApprovalStatus(String s) { this.approvalStatus = s; }
=======
    }

    // Getters still needed by Spring Security
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public void setPassword(String password) { this.password = password; }
>>>>>>> origin/main
}