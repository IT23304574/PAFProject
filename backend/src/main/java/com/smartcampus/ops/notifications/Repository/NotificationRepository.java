package com.smartcampus.ops.notifications.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.ops.notifications.Model.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findByUserIdAndRead(String userId, boolean read);
  List<Notification> findByUserId(String userId);
}
