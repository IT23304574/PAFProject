package com.smartcampus.ops.notifications;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findByUserIdAndRead(String userId, boolean read);
  List<Notification> findByUserId(String userId);
}
