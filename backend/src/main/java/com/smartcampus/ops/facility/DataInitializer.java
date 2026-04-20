package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FacilityRepository facilityRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if database is empty
        if (facilityRepository.count() == 0) {
            
            // Sample Facilities
            List<Facility> facilities = Arrays.asList(
                new Facility("Hall A", "LECTURE_HALL", 100, "Building 1", 
                            LocalTime.of(8, 0), LocalTime.of(18, 0), "ACTIVE"),
                new Facility("Hall B", "LECTURE_HALL", 80, "Building 1", 
                            LocalTime.of(8, 0), LocalTime.of(18, 0), "ACTIVE"),
                new Facility("Computer Lab 1", "LAB", 30, "Building 2", 
                            LocalTime.of(9, 0), LocalTime.of(17, 0), "ACTIVE"),
                new Facility("Computer Lab 2", "LAB", 25, "Building 2", 
                            LocalTime.of(9, 0), LocalTime.of(17, 0), "ACTIVE"),
                new Facility("Meeting Room A", "MEETING_ROOM", 10, "Building 1", 
                            LocalTime.of(8, 0), LocalTime.of(20, 0), "ACTIVE"),
                new Facility("Meeting Room B", "MEETING_ROOM", 8, "Building 3", 
                            LocalTime.of(8, 0), LocalTime.of(20, 0), "ACTIVE"),
                new Facility("Projector X1", "EQUIPMENT", 1, "Store Room", 
                            LocalTime.of(8, 0), LocalTime.of(17, 0), "ACTIVE"),
                new Facility("Camera Kit", "EQUIPMENT", 2, "Store Room", 
                            LocalTime.of(8, 0), LocalTime.of(17, 0), "OUT_OF_SERVICE")
            );
            
            facilityRepository.saveAll(facilities);
            System.out.println("✅ Sample facilities data initialized!");
        }
    }
}