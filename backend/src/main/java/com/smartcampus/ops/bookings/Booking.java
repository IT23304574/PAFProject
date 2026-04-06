package com.smartcampus.ops.bookings;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;

@Document(collection = "bookings")
public class Booking {
  @Id
  public String id;
  public String resourceId;
  @Field("userId")
  public String userId;
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
  public Instant startTime;
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
  public Instant endTime;
  public String status; // PENDING, CONFIRMED, CANCELLED
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
  public Instant createdAt;
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
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
