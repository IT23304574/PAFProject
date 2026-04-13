package com.smartcampus.ops.bookings;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    // Logic: Find existing bookings for the same resource that are NOT cancelled
    // and where (ExistingStart < RequestedEnd) AND (ExistingEnd > RequestedStart)
    @Query("{ 'resourceId': ?0, 'status': { $ne: 'CANCELLED' }, " +
           " 'startTime': { '$lt': ?2 }, 'endTime': { '$gt': ?1 } }")
    List<Booking> findOverlappingBookings(String resourceId, Instant requestedStart, Instant requestedEnd);
}