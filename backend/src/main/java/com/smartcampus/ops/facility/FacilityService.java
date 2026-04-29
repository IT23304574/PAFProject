package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(String id) {
        Optional<Facility> facility = facilityRepository.findById(id);
        return facility.orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
    }

    public Facility createFacility(Facility facility) {
        if (facility.getStatus() == null || facility.getStatus().isEmpty()) {
            facility.setStatus("ACTIVE");
        }
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(String id, Facility facilityDetails) {
        Facility existingFacility = getFacilityById(id);
        
        existingFacility.setName(facilityDetails.getName());
        existingFacility.setType(facilityDetails.getType());
        existingFacility.setCapacity(facilityDetails.getCapacity());
        existingFacility.setLocation(facilityDetails.getLocation());
        existingFacility.setAvailableFrom(facilityDetails.getAvailableFrom());
        existingFacility.setAvailableTo(facilityDetails.getAvailableTo());
        existingFacility.setStatus(facilityDetails.getStatus());
        
        return facilityRepository.save(existingFacility);
    }

    public void deleteFacility(String id) {
        facilityRepository.deleteById(id);
    }

    public List<Facility> searchByType(String type) {
        return facilityRepository.findByType(type);
    }

    public List<Facility> searchByLocation(String location) {
        return facilityRepository.findByLocation(location);
    }

    public List<Facility> searchByMinCapacity(Integer capacity) {
        return facilityRepository.findByCapacityGreaterThanEqual(capacity);
    }

    public List<Facility> getActiveFacilities() {
        return facilityRepository.findByStatus("ACTIVE");
    }
}