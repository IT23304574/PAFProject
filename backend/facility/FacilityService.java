package com.example.backend.facility;

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
        return facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Facility not found"));
    }

    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility facilityDetails) {
        Facility facility = getFacilityById(id);
        facility.setName(facilityDetails.getName());
        facility.setType(facilityDetails.getType());
        facility.setCapacity(facilityDetails.getCapacity());
        facility.setLocation(facilityDetails.getLocation());
        facility.setAvailableFrom(facilityDetails.getAvailableFrom());
        facility.setAvailableTo(facilityDetails.getAvailableTo());
        facility.setStatus(facilityDetails.getStatus());
        return facilityRepository.save(facility);
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
}