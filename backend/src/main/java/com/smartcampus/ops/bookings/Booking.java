package com.smartcampus.ops.bookings;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "bookings")
public class Booking {
  @Id
  public String id;
  public String resourceId;
  public String userId;
  public Instant startTime;
  public Instant endTime;
  public String status; // PENDING, CONFIRMED, CANCELLED
  public Instant createdAt;
  public Instant updatedAt;

  public Booking() {}
  public Booking(String resourceId, String userId, Instant startTime, Instant endTime) {
    this.resourceId = resourceId;
    this.userId = userId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = "PENDING";
    this.createdAt = Instant.now();
    this.updatedAt = Instant.now();
  }
}
