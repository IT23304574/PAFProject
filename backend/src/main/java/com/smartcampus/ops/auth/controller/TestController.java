package com.smartcampus.ops.auth.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/user")
    public String user() {
        return "User access";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String admin() {
        return "Admin access only";
    }
}