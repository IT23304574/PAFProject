package com.smartcampus.ops.tickets;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "tickets")
public class Ticket {
  @Id
  public String id;
  public String userId; // Added userId field
  public String resourceId;
  public String category;
  public String priority; // LOW, MEDIUM, HIGH
  public String description;
  public String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  public String evidenceUrl;
  public Instant createdAt;
  public Instant updatedAt;

  public Ticket() {}
  public Ticket(String resourceId, String category, String priority, String description) {
    this.resourceId = resourceId;
    this.category = category;
    this.priority = priority;
    this.description = description;
    this.status = "OPEN";
    this.createdAt = Instant.now();
    this.updatedAt = Instant.now();
  }
}
