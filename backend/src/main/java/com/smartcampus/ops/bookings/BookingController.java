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
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @GetMapping
    public List<Booking> all() {
        return bookingRepository.findAll();
    }

    @GetMapping("/me")
    public List<Booking> mine(@RequestParam("userId") String userId) {
        if (userId == null || userId.trim().isEmpty()
                || userId.equalsIgnoreCase("undefined")
                || userId.contains("@")
                || !userId.matches("^[0-9a-fA-F]{24}$")) {
            log.warn("Invalid userId for bookings: '{}'", userId);
            return List.of();
        }
        List<Booking> list = bookingRepository.findByUserId(userId);
        log.info("Bookings for userId {}: {}", userId, list.size());
        return list;
    }

    @GetMapping("/{id}")
    public Booking get(@PathVariable String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Booking not found"));
    }

    @GetMapping("/occupancy")
    public Map<String, Long> getOccupancy(@RequestParam Instant start, @RequestParam Instant end) {
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
        if (booking.resourceId == null || booking.startTime == null
                || booking.endTime == null || booking.userId == null) {
            throw new com.smartcampus.ops.common.BadRequestException(
                    "resourceId, startTime, endTime, and userId are required");
        }
        if (!booking.endTime.isAfter(booking.startTime)) {
            throw new com.smartcampus.ops.common.BadRequestException(
                    "End time must be after start time");
        }
        var facility = facilityRepository.findById(booking.resourceId)
                .orElseThrow(() -> new com.smartcampus.ops.common.BadRequestException(
                        "Facility does not exist"));
        long count = bookingRepository.countOverlappingBookings(
                booking.resourceId, booking.startTime, booking.endTime);
        if (count >= facility.getCapacity()) {
            throw new com.smartcampus.ops.common.BadRequestException(
                    "Facility is full for the selected time slot");
        }
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