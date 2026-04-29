package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FacilityRepository facilityRepository;

    @Override
    public void run(String... args) throws Exception {
        if (facilityRepository.count() == 0) {
            
            List<Facility> facilities = Arrays.asList(
                new Facility("Main Lecture Hall", "LECTURE_HALL", 200, "Academic Building - Floor 1", 
                            "07:00", "22:00", "ACTIVE"),
                new Facility("Hall A", "LECTURE_HALL", 120, "Science Building - Floor 2", 
                            "08:00", "20:00", "ACTIVE"),
                new Facility("Hall B", "LECTURE_HALL", 100, "Engineering Building - Floor 1", 
                            "08:00", "20:00", "ACTIVE"),
                new Facility("Computer Lab 1", "LAB", 35, "IT Building - Floor 2", 
                            "08:00", "20:00", "ACTIVE"),
                new Facility("Computer Lab 2", "LAB", 30, "IT Building - Floor 3", 
                            "08:00", "20:00", "ACTIVE"),
                new Facility("Science Lab", "LAB", 40, "Science Building - Floor 1", 
                            "09:00", "17:00", "ACTIVE"),
                new Facility("Conference Room A", "MEETING_ROOM", 20, "Administration Building - Floor 2", 
                            "08:00", "18:00", "ACTIVE"),
                new Facility("Conference Room B", "MEETING_ROOM", 15, "Administration Building - Floor 3", 
                            "08:00", "18:00", "ACTIVE"),
                new Facility("HD Projector", "EQUIPMENT", 1, "AV Store Room", 
                            "08:00", "17:00", "ACTIVE"),
                new Facility("Wireless Mic Set", "EQUIPMENT", 2, "AV Store Room", 
                            "08:00", "17:00", "ACTIVE")
            );
            
            facilityRepository.saveAll(facilities);
            System.out.println("✅ Sample facilities data initialized!");
        }
    }
}