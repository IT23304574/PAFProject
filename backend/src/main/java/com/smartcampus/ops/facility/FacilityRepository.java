package com.smartcampus.ops.facility;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    
    List<Facility> findByType(String type);
    
    List<Facility> findByLocation(String location);
    
    List<Facility> findByCapacityGreaterThanEqual(Integer capacity);
    
    List<Facility> findByStatus(String status);
    
    @Query("{ 'type': ?0, 'status': 'ACTIVE' }")
    List<Facility> findActiveByType(String type);
}