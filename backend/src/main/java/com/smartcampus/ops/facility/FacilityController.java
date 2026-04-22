package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "http://localhost:4200")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable String id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PostMapping
    public ResponseEntity<Facility> createFacility(@RequestBody Facility facility) {
        Facility created = facilityService.createFacility(facility);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable String id, @RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.updateFacility(id, facility));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/type")
    public ResponseEntity<List<Facility>> searchByType(@RequestParam String type) {
        return ResponseEntity.ok(facilityService.searchByType(type));
    }

    @GetMapping("/search/location")
    public ResponseEntity<List<Facility>> searchByLocation(@RequestParam String location) {
        return ResponseEntity.ok(facilityService.searchByLocation(location));
    }

    @GetMapping("/search/capacity")
    public ResponseEntity<List<Facility>> searchByMinCapacity(@RequestParam Integer capacity) {
        return ResponseEntity.ok(facilityService.searchByMinCapacity(capacity));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Facility>> getActiveFacilities() {
        return ResponseEntity.ok(facilityService.getActiveFacilities());
    }
}