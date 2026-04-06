package com.smartcampus.ops.bookings;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
  List<Booking> findByUserId(String userId);
  List<Booking> findByResourceId(String resourceId);
  List<Booking> findByStatus(String status);
}
