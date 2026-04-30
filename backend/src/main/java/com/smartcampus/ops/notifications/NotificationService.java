package com.smartcampus.ops.notifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void send(String userId, String title, String message, String type) {
        if (userId == null || userId.isBlank()) return;
        Notification n = new Notification(userId, title, message, type);
        notificationRepository.save(n);
    }
}