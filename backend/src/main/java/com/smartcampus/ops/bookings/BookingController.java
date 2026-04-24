package com.smartcampus.ops.bookings;

import com.smartcampus.ops.facility.Facility;
import com.smartcampus.ops.facility.FacilityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin
public class BookingController {
  private static final Logger log = LoggerFactory.getLogger(BookingController.class);

  @Autowired
  private BookingRepository bookingRepository;

  @Autowired
  private FacilityRepository facilityRepository;

  @GetMapping
  public List<Booking> all() {
    List<Booking> list = bookingRepository.findAll();
    log.info("Total bookings in database: {}", list.size());
    return list;
  }

  @GetMapping("/me")
  public List<Booking> mine(@RequestParam("userId") String userId) {
    try {
      // Basic validation for MongoDB ObjectId format (24 hex characters)
      // Also handles null, empty, "undefined", or email strings
      if (userId == null || userId.trim().isEmpty() || userId.equalsIgnoreCase("undefined") || userId.contains("@") || !userId.matches("^[0-9a-fA-F]{24}$")) {
        log.warn("Invalid or malformed userId received for bookings: '{}'. Returning empty list.", userId);
        // Frontend should handle this gracefully, e.g., redirect to login or show a message
        return List.of();
      }
      List<Booking> list = bookingRepository.findByUserId(userId);
      log.info("DATABASE READ: userId={} | Count={} | TotalInDB={}", userId, list.size(), bookingRepository.count());
      return list;
    } catch (Exception e) {
      log.error("Error fetching bookings for user {}: {}", userId, e.getMessage(), e);
      throw e;
    }
  }

  @GetMapping("/{id}")
  public Booking get(@PathVariable String id) {
    return bookingRepository.findById(id)
      .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Booking not found"));
  }

  @GetMapping("/occupancy")
  public Map<String, Long> getOccupancy(@RequestParam Instant start, @RequestParam Instant end) {
    // This helper endpoint allows the frontend to see how many people are in each facility
    // for a specific time range to calculate "Remaining Capacity"
    List<Facility> facilities = facilityRepository.findAll();
    Map<String, Long> occupancyMap = new HashMap<>();
    for (Facility f : facilities) {
      long count = bookingRepository.countOverlappingBookings(f.getId(), start, end);
      occupancyMap.put(f.getId(), count);
    }
    return occupancyMap;
  }

  @PostMapping
  public Booking create(@RequestBody Booking booking) {
    if (booking.resourceId == null || booking.startTime == null || booking.endTime == null || booking.userId == null) {
      throw new com.smartcampus.ops.common.BadRequestException("Error: All fields (resourceId, startTime, endTime, userId) are required.");
    }

    // 1. Time Validation: Ensure end time is actually after start time
    if (booking.endTime == null || !booking.endTime.isAfter(booking.startTime)) {
      log.warn("Time validation failed: End time {} is before or equal to Start time {}", booking.endTime, booking.startTime);
      throw new com.smartcampus.ops.common.BadRequestException("Error: Booking end time must be after the start time.");
    }

    // 2. Capacity Check: Fetch the facility to get its capacity
    var facility = facilityRepository.findById(booking.resourceId)
        .orElseThrow(() -> new com.smartcampus.ops.common.BadRequestException("Error: The selected facility does not exist."));

    long currentBookingsCount = bookingRepository.countOverlappingBookings(
        booking.resourceId, 
        booking.startTime, 
        booking.endTime
    );

    if (currentBookingsCount >= facility.getCapacity()) {
      log.warn("Booking rejected: Facility {} is full ({}/{})", booking.resourceId, currentBookingsCount, facility.getCapacity());
      throw new com.smartcampus.ops.common.BadRequestException("Error: This facility is already full for the selected time slot.");
    }

    // 3. Defaults and Save
    if (booking.status == null) booking.status = "PENDING";
    booking.createdAt = Instant.now();
    booking.updatedAt = Instant.now();
    
    return bookingRepository.save(booking);
  }

  @PutMapping("/{id}")
  public Booking update(@PathVariable String id, @RequestBody Booking booking) {
    Booking existing = bookingRepository.findById(id)
      .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Booking not found"));
    if (booking.status != null) existing.status = booking.status;
    existing.updatedAt = Instant.now();
    return bookingRepository.save(existing);
  }

  @DeleteMapping("/{id}")
  public void cancel(@PathVariable String id) {
    Booking booking = bookingRepository.findById(id)
      .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Booking not found"));
    booking.status = "CANCELLED";
    booking.updatedAt = Instant.now();
    bookingRepository.save(booking);
  }
}
