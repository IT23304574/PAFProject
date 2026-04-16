package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public Facility createFacility(Facility facility) {
        if (facility.getStatus() == null) {
            facility.setStatus("ACTIVE");
        }
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility facilityDetails) {
        Facility existing = getFacilityById(id);
        existing.setName(facilityDetails.getName());
        existing.setType(facilityDetails.getType());
        existing.setCapacity(facilityDetails.getCapacity());
        existing.setLocation(facilityDetails.getLocation());
        existing.setAvailableFrom(facilityDetails.getAvailableFrom());
        existing.setAvailableTo(facilityDetails.getAvailableTo());
        existing.setStatus(facilityDetails.getStatus());
        return facilityRepository.save(existing);
    }

    public void deleteFacility(Long id) {
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