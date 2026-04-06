package com.example.backend.facility;

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

    // GET - All facilities
    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityService.getAllFacilities();
    }

    // GET - By ID
    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    // POST - Create new facility
    @PostMapping
    public ResponseEntity<Facility> createFacility(@RequestBody Facility facility) {
        Facility created = facilityService.createFacility(facility);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT - Update facility
    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Long id, @RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.updateFacility(id, facility));
    }

    // DELETE - Delete facility
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Search by type
    @GetMapping("/search/type")
    public List<Facility> searchByType(@RequestParam String type) {
        return facilityService.searchByType(type);
    }

    // GET - Search by location
    @GetMapping("/search/location")
    public List<Facility> searchByLocation(@RequestParam String location) {
        return facilityService.searchByLocation(location);
    }
}