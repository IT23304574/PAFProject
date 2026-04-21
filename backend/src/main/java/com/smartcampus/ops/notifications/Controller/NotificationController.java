package com.smartcampus.ops.notifications.controller;

import com.smartcampus.ops.notifications.model.Notification;
import com.smartcampus.ops.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    // GET ALL
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getAll(@PathVariable String userId) {
        return ResponseEntity.ok(service.getAll(userId));
    }

    // GET UNREAD
    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnread(@PathVariable String userId) {
        return ResponseEntity.ok(service.getUnread(userId));
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification req) {
        Notification n = service.create(
                req.getUserId(),
                req.getTitle(),
                req.getMessage(),
                req.getType()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(n);
    }

    // MARK ALL
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<Void> markAll(@PathVariable String userId) {
        service.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

  
}