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
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(String id, Facility facilityDetails) {
        Facility existing = getFacilityById(id);
        existing.setName(facilityDetails.getName());
        existing.setType(facilityDetails.getType());
        existing.setCapacity(facilityDetails.getCapacity());
        existing.setLocation(facilityDetails.getLocation());
        existing.setAvailableTo(facilityDetails.getAvailableTo());
        existing.setStatus(facilityDetails.getStatus());
        return facilityRepository.save(existing);
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

    public List<Facility> getActiveFacilities() {
        return facilityRepository.findByStatus("ACTIVE");
    }
}