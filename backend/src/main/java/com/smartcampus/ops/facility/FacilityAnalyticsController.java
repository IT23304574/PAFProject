package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities/analytics")
@CrossOrigin(origins = "http://localhost:4200")
public class FacilityAnalyticsController {

    @Autowired
    private FacilityAnalyticsService analyticsService;

    @GetMapping("/most-booked")
    public ResponseEntity<Map<String, Object>> getMostBookedFacilities() {
        return ResponseEntity.ok(analyticsService.getMostBookedFacilities());
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<Map<String, Object>> getPeakHours() {
        return ResponseEntity.ok(analyticsService.getPeakHours());
    }

    @GetMapping("/utilization")
    public ResponseEntity<Map<String, Object>> getUtilizationRates() {
        return ResponseEntity.ok(analyticsService.getUtilizationRates());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTotalStats() {
        return ResponseEntity.ok(analyticsService.getTotalStats());
    }
}