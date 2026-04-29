package com.smartcampus.ops.notifications;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "notifications")
public class Notification {
  @Id
  public String id;
  public String userId;
  public String title;
  public String message;
  public String type; // e.g., booking, ticket, alert
  public boolean read;
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
  public Instant createdAt;

  public Notification() {}
  public Notification(String userId, String title, String message, String type) {
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.type = type;
    this.read = false;
    this.createdAt = Instant.now();
  }
}
