package com.smartcampus.ops.notifications;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin
public class NotificationController {
  private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

  @Autowired
  private NotificationRepository notificationRepository;

  @GetMapping("/unread")
  public List<Notification> unread(@RequestParam("userId") String userId) {
    try {
      // Basic validation for MongoDB ObjectId format (24 hex characters)
      // Also handles null, empty, "undefined", email strings, or non-ObjectId formats
      if (userId == null || userId.trim().isEmpty() || userId.equalsIgnoreCase("undefined") || userId.contains("@") || !userId.matches("^[0-9a-fA-F]{24}$")) {
        log.warn("Invalid or malformed userId received for notifications: '{}'. Returning empty list.", userId);
        // Frontend should handle this gracefully, e.g., redirect to login or show a message
        return List.of();
      }
      return notificationRepository.findByUserIdAndRead(userId, false);
    } catch (Exception e) {
      log.error("DATABASE ERROR: Failed to fetch notifications for user {}. Reason: {}", userId, e.getMessage());
      e.printStackTrace(); // Check your IDE terminal for the full stack trace!
      throw e;
    }
  }

  @PostMapping("/mark-all-read")
  public void markAllRead(@RequestParam("userId") String userId) {
    List<Notification> notifications = notificationRepository.findByUserIdAndRead(userId, false);
    notifications.forEach(n -> n.read = true);
    notificationRepository.saveAll(notifications);
  }

  @PostMapping("/{id}/mark-read")
  public void markAsRead(@PathVariable String id, @RequestParam("userId") String userId) {
    Notification notification = notificationRepository.findById(id).orElse(null);
    if (notification != null && userId.equals(notification.userId)) {
      notification.read = true;
      notificationRepository.save(notification);
    }
  }
}
