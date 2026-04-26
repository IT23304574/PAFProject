package com.smartcampus.ops.facility;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/facilities/analytics")
@CrossOrigin(origins = "http://localhost:4200")
public class FacilityAnalyticsController {

    private final FacilityAnalyticsService facilityAnalyticsService;

    public FacilityAnalyticsController(FacilityAnalyticsService facilityAnalyticsService) {
        this.facilityAnalyticsService = facilityAnalyticsService;
    }

    @GetMapping("/most-booked")
    public ResponseEntity<Map<String, Object>> getMostBookedFacilities() {
        return ResponseEntity.ok(facilityAnalyticsService.getMostBookedFacilities());
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<Map<String, Object>> getPeakHours() {
        return ResponseEntity.ok(facilityAnalyticsService.getPeakHours());
    }

    @GetMapping("/utilization-rates")
    public ResponseEntity<Map<String, Object>> getUtilizationRates() {
        return ResponseEntity.ok(facilityAnalyticsService.getUtilizationRates());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTotalStats() {
        return ResponseEntity.ok(facilityAnalyticsService.getTotalStats());
    }
}
