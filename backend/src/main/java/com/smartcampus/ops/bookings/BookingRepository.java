package com.smartcampus.ops.bookings;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    // Count existing bookings for the same resource that are NOT cancelled in the requested slot
    @Query(value = "{ 'resourceId': ?0, 'status': { $ne: 'CANCELLED' }, " +
           " 'startTime': { '$lt': ?2 }, 'endTime': { '$gt': ?1 } }", count = true)
    long countOverlappingBookings(
        @Param("resourceId") String resourceId, 
        @Param("requestedStart") Instant requestedStart, 
        @Param("requestedEnd") Instant requestedEnd);
}