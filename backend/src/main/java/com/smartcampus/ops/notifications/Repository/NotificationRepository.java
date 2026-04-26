package com.smartcampus.ops.notifications.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smartcampus.ops.notifications.model.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

  //add custom query method
  
    List<Notification> findByUserIdAndRead(String userId, boolean read);

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}