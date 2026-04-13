package com.smartcampus.ops.bookings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin
public class BookingController {
  private static final Logger log = LoggerFactory.getLogger(BookingController.class);

  @Autowired
  private BookingRepository bookingRepository;

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
      log.error("Error fetching bookings for user {}: {}", userId, e.getMessage());
      e.printStackTrace(); // This will show the real error in your terminal
      throw e;
    }
  }

  @GetMapping("/{id}")
  public Booking get(@PathVariable String id) {
    return bookingRepository.findById(id)
      .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Booking not found"));
  }

  @PostMapping
  public Booking create(@RequestBody Booking booking) {
    log.info("Creating booking: User={}, Resource={}, Start={}", 
        booking.userId, booking.resourceId, booking.startTime);

    // If your frontend sends 'startDate' instead of 'startTime', 
    // Jackson won't map it, and booking.startTime will be null.
    if (booking.resourceId == null || booking.startTime == null || booking.endTime == null || booking.userId == null) {
      log.error("Missing required fields. Received: Resource={}, Start={}, End={}", 
          booking.resourceId, booking.startTime, booking.endTime);
      throw new com.smartcampus.ops.common.BadRequestException("resourceId, startTime, endTime, and userId are required");
    }

    // 1. Basic Time Validation
    if (booking.startTime.isAfter(booking.endTime)) {
      throw new com.smartcampus.ops.common.BadRequestException("Start time must be before end time");
    }

    // 2. Conflict Checking Logic
    List<Booking> conflicts = bookingRepository.findOverlappingBookings(
        booking.resourceId, 
        booking.startTime, 
        booking.endTime
    );

    if (!conflicts.isEmpty()) {
      throw new com.smartcampus.ops.common.BadRequestException("Conflict detected: This resource is already booked for the selected time slot.");
    }

    // Set default values if not provided
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
