package com.example.backend.facility;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByType(String type);
    List<Facility> findByLocation(String location);
    List<Facility> findByCapacityGreaterThanEqual(Integer capacity);
    List<Facility> findByStatus(String status);
}