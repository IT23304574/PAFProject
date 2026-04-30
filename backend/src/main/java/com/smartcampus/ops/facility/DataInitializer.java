package com.smartcampus.ops.facility;

import com.smartcampus.ops.auth.User;
import com.smartcampus.ops.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
<<<<<<< HEAD

=======
>>>>>>> origin/main
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private FacilityRepository facilityRepository;
    @Autowired private UserRepository     userRepository;
    @Autowired private PasswordEncoder    passwordEncoder;

    @Override
    public void run(String... args) {
        seedFacilities();
        seedUsers();
    }

    private void seedFacilities() {
        if (facilityRepository.count() == 0) {
<<<<<<< HEAD
            // availableFrom/availableTo stored as "HH:mm" strings — matches updated Facility.java
            List<Facility> facilities = Arrays.asList(
                new Facility("Hall A",         "LECTURE_HALL",  100, "Building 1", "08:00", "18:00", "ACTIVE"),
                new Facility("Hall B",         "LECTURE_HALL",   80, "Building 1", "08:00", "18:00", "ACTIVE"),
                new Facility("Computer Lab 1", "LAB",            30, "Building 2", "09:00", "17:00", "ACTIVE"),
                new Facility("Computer Lab 2", "LAB",            25, "Building 2", "09:00", "17:00", "ACTIVE"),
                new Facility("Meeting Room A", "MEETING_ROOM",   10, "Building 1", "08:00", "20:00", "ACTIVE"),
                new Facility("Meeting Room B", "MEETING_ROOM",    8, "Building 3", "08:00", "20:00", "ACTIVE"),
                new Facility("Projector X1",   "EQUIPMENT",       1, "Store Room", "08:00", "17:00", "ACTIVE"),
                new Facility("Camera Kit",     "EQUIPMENT",       2, "Store Room", "08:00", "17:00", "OUT_OF_SERVICE")
            );
=======

            List<Facility> facilities = Arrays.asList(
                new Facility("Hall A", "LECTURE_HALL", 100, "Building 1", "08:00", "18:00", "ACTIVE"),
                new Facility("Hall B", "LECTURE_HALL", 80, "Building 1", "08:00", "18:00", "ACTIVE"),
                new Facility("Computer Lab 1", "LAB", 30, "Building 2", "09:00", "17:00", "ACTIVE"),
                new Facility("Computer Lab 2", "LAB", 25, "Building 2", "09:00", "17:00", "ACTIVE"),
                new Facility("Meeting Room A", "MEETING_ROOM", 10, "Building 1", "08:00", "20:00", "ACTIVE"),
                new Facility("Meeting Room B", "MEETING_ROOM", 8, "Building 3", "08:00", "20:00", "ACTIVE"),
                new Facility("Projector X1", "EQUIPMENT", 1, "Store Room", "08:00", "17:00", "ACTIVE"),
                new Facility("Camera Kit", "EQUIPMENT", 2, "Store Room", "08:00", "17:00", "OUT_OF_SERVICE")
            );

>>>>>>> origin/main
            facilityRepository.saveAll(facilities);
            System.out.println("✅ Facilities seeded.");
        }
    }

    private void seedUsers() {
        createIfAbsent("admin@campus.lk",   "admin123",   "System Admin",      "ROLE_ADMIN",      "APPROVED");
        createIfAbsent("tech@campus.lk",    "tech123",    "Sample Technician", "ROLE_TECHNICIAN", "APPROVED");
        createIfAbsent("student@campus.lk", "student123", "Sample Student",    "ROLE_USER",       "APPROVED");
    }

    private void createIfAbsent(String username, String rawPw, String name, String role, String status) {
        if (!userRepository.existsByUsername(username)) {
            User u = new User();
            u.username       = username;
            u.password       = passwordEncoder.encode(rawPw);
            u.fullName       = name;
            u.role           = role;
            u.approvalStatus = status;
            userRepository.save(u);
            System.out.println("✅ User seeded: " + username);
        }
    }
}
