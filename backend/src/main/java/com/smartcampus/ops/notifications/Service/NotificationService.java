package com.smartcampus.ops.notifications.service;

import com.smartcampus.ops.notifications.model.Notification;
import com.smartcampus.ops.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public Notification create(String userId, String title, String message, String type) {
        Notification notification = new Notification(userId, title, message, type);
        return repository.save(notification);
    }

    public List<Notification> getAll(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnread(String userId) {
        return repository.findByUserIdAndRead(userId, false);
    }

    public void markAllAsRead(String userId) {
        List<Notification> list = repository.findByUserIdAndRead(userId, false);
        list.forEach(n -> n.setRead(true));
        repository.saveAll(list);
    }

    public void markAsRead(String id, String userId) {
        Notification n = repository.findById(id).orElseThrow();
        if (n.getUserId().equals(userId)) {
            n.setRead(true);
            repository.save(n);
        }
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}