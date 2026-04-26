package com.smartcampus.ops.common;

import java.util.HashMap;
import java.util.Map;

public class ValidationHelper {
    
    public static Map<String, String> validateFacility(String name, String type, Integer capacity, 
                                                        String location, String availableFrom, 
                                                        String availableTo, String status) {
        Map<String, String> errors = new HashMap<>();
        
        // Name validation
        if (name == null || name.trim().isEmpty()) {
            errors.put("name", "Facility name is required");
        } else if (name.length() < 3) {
            errors.put("name", "Facility name must be at least 3 characters");
        } else if (name.length() > 100) {
            errors.put("name", "Facility name must be less than 100 characters");
        }
        
        // Type validation
        if (type == null || type.trim().isEmpty()) {
            errors.put("type", "Facility type is required");
        }
        
        // Capacity validation (optional - can be null)
        if (capacity != null) {
            if (capacity < 0) {
                errors.put("capacity", "Capacity cannot be negative");
            } else if (capacity > 9999) {
                errors.put("capacity", "Capacity must be less than 10000");
            }
        }
        
        // Location validation
        if (location == null || location.trim().isEmpty()) {
            errors.put("location", "Location is required");
        }
        
        // NO TIME VALIDATION AT ALL - Any value is accepted
        // availableFrom and availableTo can be ANYTHING - no checks
        
        // Status validation (optional)
        if (status != null && !status.isEmpty()) {
            // No validation - any status is accepted
        }
        
        return errors;
    }
}