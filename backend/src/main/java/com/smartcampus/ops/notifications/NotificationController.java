package com.smartcampus.ops.notifications;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    @Autowired private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> all(@RequestParam("userId") String userId) {
        return notificationRepository.findByUserId(userId);
    }

    @GetMapping("/unread")
    public List<Notification> unread(@RequestParam("userId") String userId) {
        if (!isValidId(userId)) {
            log.warn("Invalid userId for notifications: '{}'", userId);
            return List.of();
        }
        return notificationRepository.findByUserIdAndRead(userId, false);
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllRead(@RequestParam("userId") String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndRead(userId, false);
        notifications.forEach(n -> n.read = true);
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id,
                                            @RequestParam("userId") String userId) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (userId.equals(n.userId)) {
                n.read = true;
                notificationRepository.save(n);
            }
        });
        return ResponseEntity.ok().build();
    }

    private boolean isValidId(String id) {
        return id != null
                && !id.trim().isEmpty()
                && !id.equalsIgnoreCase("undefined")
                && !id.contains("@")
                && id.matches("^[0-9a-fA-F]{24}$");
    }
}